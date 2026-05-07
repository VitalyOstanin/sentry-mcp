import { z } from 'zod';

// Zod 4 dropped the `required_error`/`invalid_type_error` constructor options
// available in v3. We rely on `min(...)` lengths plus runtime-friendly messages
// so the validator surfaces actionable errors without v3-only constructor args.
export const environmentSchema = z.object({
  url: z.string().min(1, 'SENTRY_URL is required'),
  token: z.string().min(10, 'SENTRY_TOKEN is required and must be at least 10 characters'),
  timezone: z.string().min(1).optional(),
  httpTimeoutMs: z.number().int().positive().max(60000).optional(),
});
