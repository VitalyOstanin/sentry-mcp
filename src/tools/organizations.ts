import { z } from "zod";
import type { SentryClient } from "../sentry/index.js";
import { toolError, toolSuccess } from "../utils/tool-response.js";
import { mapOrganization } from "../mappers/sentry.js";

export const organizationsArgs = {
  cursor: z.string().optional().describe("Pagination cursor"),
  perPage: z.number().int().min(1).max(100).optional().describe("Items per page (1..100)"),
  briefOutput: z.boolean().optional().describe("If true, returns only key fields (default: true)"),
} as const;

const organizationsSchema = z.object(organizationsArgs).optional();

export async function organizationsHandler(client: SentryClient, rawInput?: unknown) {
  try {
    const args = organizationsSchema.parse(rawInput ?? {}) ?? {};
    const res = await client.listOrganizations({ cursor: args.cursor, perPage: args.perPage });
    const brief = args.briefOutput !== false; // default true
    const items = (res.data).map((o) => mapOrganization(o as never, { brief }));

    return toolSuccess({ items, nextCursor: res.nextCursor, count: items.length });
  } catch (error) {
    return toolError(error);
  }
}
