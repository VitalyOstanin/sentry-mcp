import { z } from "zod";

export const environmentSchema = z.object({
  url: z
    .string({ required_error: "SENTRY_URL is required" })
    .url("SENTRY_URL must be a valid URL"),
  token: z
    .string({ required_error: "SENTRY_TOKEN is required" })
    .min(10, "SENTRY_TOKEN looks too short"),
  timezone: z.string().optional(),
  httpTimeoutMs: z.number().int().positive().max(60000).optional(),
});
