import { environmentSchema } from "./schemas.js";

export interface Config {
  sentry: {
    url: string;
    token: string;
  };
  readOnly: boolean;
  timezone: string;
  httpTimeoutMs: number;
}

let cachedConfig: Config | null = null;

export function loadConfig(force = false): Config {
  if (!force && cachedConfig) {
    return cachedConfig;
  }

  const rawUrl = process.env.SENTRY_URL;
  const rawToken = process.env.SENTRY_TOKEN;
  const rawTimezone = process.env.SENTRY_TIMEZONE;
  const rawTimeout = process.env.SENTRY_HTTP_TIMEOUT_MS;
  const parsed = environmentSchema.safeParse({ url: rawUrl, token: rawToken, timezone: rawTimezone, httpTimeoutMs: rawTimeout ? Number(rawTimeout) : undefined });

  if (!parsed.success) {
    const message = `Invalid Sentry environment configuration. Ensure SENTRY_URL and SENTRY_TOKEN are set correctly: ${parsed.error.message}`;

    throw new Error(message);
  }

  const readOnly = process.env.SENTRY_READ_ONLY !== undefined ? process.env.SENTRY_READ_ONLY !== "false" : true;

  cachedConfig = {
    sentry: { url: parsed.data.url, token: parsed.data.token },
    readOnly,
    timezone: parsed.data.timezone ?? "Europe/Moscow",
    httpTimeoutMs: parsed.data.httpTimeoutMs ?? 10_000,
  } satisfies Config;

  return cachedConfig;
}

export function clearConfigCache(): void {
  cachedConfig = null;
}
