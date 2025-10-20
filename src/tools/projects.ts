import { z } from "zod";
import type { SentryClient } from "../sentry/index.js";
import { toolError, toolSuccess } from "../utils/tool-response.js";
import { mapProject } from "../mappers/sentry.js";

export const sentryProjectsArgs = {
  org: z.string().describe("Organization slug"),
  cursor: z.string().optional().describe("Pagination cursor"),
  perPage: z.number().int().min(1).max(100).optional().describe("Items per page (1..100)"),
  query: z.string().optional().describe("Search query for projects"),
  briefOutput: z.boolean().optional().describe("If true, returns only key fields (default: true)"),
} as const;

const sentryProjectsSchema = z.object(sentryProjectsArgs);

export async function sentryProjectsHandler(client: SentryClient, rawInput?: unknown) {
  try {
    const args = sentryProjectsSchema.parse(rawInput ?? {});
    const res = await client.listProjects(args.org, { cursor: args.cursor, perPage: args.perPage, query: args.query });
    const brief = args.briefOutput !== false;
    const items = (res.data).map((p) => mapProject(p as never, { brief }));

    return toolSuccess({ items, nextCursor: res.nextCursor, count: items.length });
  } catch (error) {
    return toolError(error);
  }
}
