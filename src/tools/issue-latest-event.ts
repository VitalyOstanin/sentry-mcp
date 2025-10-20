import { z } from "zod";
import type { SentryClient } from "../sentry/index.js";
import { toolError, toolSuccess } from "../utils/tool-response.js";
import { mapEvent } from "../mappers/sentry-event.js";

export const sentryIssueLatestEventArgs = {
  issueId: z.string().describe("Sentry issue id"),
  briefOutput: z.boolean().optional().describe("If true, returns compact payload (default: true)"),
} as const;

const schema = z.object(sentryIssueLatestEventArgs);

// mapping moved to src/mappers/sentry-event.ts

export async function sentryIssueLatestEventHandler(client: SentryClient, rawInput?: unknown) {
  try {
    const args = schema.parse(rawInput ?? {});
    const data = await client.getIssueLatestEvent(args.issueId);
    const brief = args.briefOutput ?? true;
    const payload = mapEvent(data, brief);
    const result = toolSuccess(payload);

    return result;
  } catch (error) {
    const result = toolError(error);

    return result;
  }
}
