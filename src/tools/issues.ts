import { z } from "zod";
import type { SentryClient } from "../sentry/index.js";
import { toolError, toolSuccess } from "../utils/tool-response.js";
import { mapIssue } from "../mappers/sentry.js";

export const sentryIssuesArgs = {
  org: z.string().describe("Organization slug"),
  cursor: z.string().optional().describe("Pagination cursor"),
  perPage: z.number().int().min(1).max(100).optional().describe("Items per page (1..100)"),
  query: z
    .string()
    .optional()
    .describe(
      "Sentry search query. Note: prefer 'environments' param for environment filter; query fallback 'environment:stage' also works.",
    ),
  environments: z
    .array(z.string())
    .optional()
    .describe("Filter by multiple environments (recommended). Example: ['stage']"),
  statsPeriod: z.string().optional().describe("Relative period, e.g., '14d' or '24h'"),
  since: z.string().optional().describe("ISO start datetime when not using statsPeriod"),
  until: z.string().optional().describe("ISO end datetime when not using statsPeriod"),
  project: z
    .union([z.number(), z.array(z.number()), z.string(), z.array(z.string())])
    .optional()
    .describe("Project id/ids or slug/slugs. Sentry often requires this."),
  briefOutput: z.boolean().optional().describe("If true, returns only key fields (default: true)"),
} as const;

const sentryIssuesSchema = z
  .object(sentryIssuesArgs)
  .refine((v) => !(v.statsPeriod && (v.since != null || v.until != null)), {
    message: "Use either statsPeriod or since/until",
    path: ["statsPeriod"],
  });

export async function sentryIssuesHandler(client: SentryClient, rawInput?: unknown) {
  try {
    const args = sentryIssuesSchema.parse(rawInput ?? {});
    const { cursor, perPage, query, environments, statsPeriod, since, until, project } = args;
    const res = await client.listIssues(args.org, { cursor, perPage, query, environments, statsPeriod, since, until, project });
    const brief = args.briefOutput !== false;
    const items = (res.data).map((i) => mapIssue(i as never, { brief }));

    return toolSuccess({ items, nextCursor: res.nextCursor, count: items.length });
  } catch (error) {
    // add hint for common Sentry validation errors
    const maybe = error as { response?: { status: number } | undefined; isAxiosError?: boolean; message?: string };

    if (maybe.isAxiosError && maybe.response) {
      const { status } = maybe.response;

      if (status && (status === 400 || status === 403)) {
        const hint =
          "Hint: Sentry often requires 'project'. Provide project id or slug. " +
          "Discover projects via 'sentry_projects' and pass e.g. project: 'client-api'.";

        try {
          return toolError(new Error(`${maybe.message ?? 'Request failed'} (${status}). ${hint}`));
        } catch {
          // ignore
        }
      }
    }

    return toolError(error);
  }
}
