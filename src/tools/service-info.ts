// No args schema needed here; keep handler only
import type { SentryClient } from "../sentry/index.js";
import { toolError, toolSuccess } from "../utils/tool-response.js";

export const serviceInfoArgs = {} as const;

export async function serviceInfoHandler(client: SentryClient) {
  try {
    const config = client.getConfig();

    return toolSuccess({
      name: "Sentry MCP",
      sentryUrl: config.sentry.url,
      tokenPresent: Boolean(config.sentry.token),
      timezone: config.timezone,
      readOnly: config.readOnly,
      useStructuredContent: config.useStructuredContent,
    });
  } catch (error) {
    return toolError(error);
  }
}
