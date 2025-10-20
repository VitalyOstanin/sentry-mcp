import { z } from "zod";
import type { SentryClient } from "../sentry/index.js";
import { toolError, toolSuccess } from "../utils/tool-response.js";
import { mapIssue } from "../mappers/sentry.js";
import type { SentryIssue } from "../sentry/types.js";
import { MutexPool } from "@vitalyostanin/mutex-pool";
import { normalizeAxiosError } from "../utils/http-error.js";

export const sentryIssuesDetailsBatchArgs = {
  issueIds: z.array(z.string()).min(1).max(50).describe("List of issue IDs (max 50)"),
  concurrency: z.number().int().min(1).max(10).optional().describe("Max concurrent requests (default 5)"),
  briefOutput: z.boolean().optional().describe("If true, returns only key fields (default: true)"),
} as const;

const schema = z.object(sentryIssuesDetailsBatchArgs);

export async function sentryIssuesDetailsBatchHandler(client: SentryClient, rawInput?: unknown) {
  try {
    const args = schema.parse(rawInput ?? {});
    const limit = typeof args.concurrency === "number" ? args.concurrency : 5;
    const results: unknown[] = new Array(args.issueIds.length);
    const errors: Array<{ id: string; status?: number; message: string }> = [];
    const pool = new MutexPool(Math.min(limit, args.issueIds.length));

    args.issueIds.forEach((id, i) => {
      pool.start(async () => {
        try {
          const data = (await client.getIssueById(id)) as SentryIssue;
          const brief = args.briefOutput !== false;

          results[i] = mapIssue(data, { brief });
        } catch (e) {
          errors.push(normalizeAxiosError(e, id));
        }
      });
    });

    await pool.allJobsFinished();

    const items = results.filter((x): x is NonNullable<typeof x> => x != null);
    const result = toolSuccess({ items, failed: errors, count: items.length });

    return result;
  } catch (error) {
    const result = toolError(error);

    return result;
  }
}
