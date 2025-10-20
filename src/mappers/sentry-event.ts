interface SentryExceptionValue {
  type?: string;
  value?: string;
  mechanism?: { type?: string };
  stacktrace?: { frames?: unknown[] };
}

interface SentryEventEntry {
  type?: string;
  data?: { values?: SentryExceptionValue[] };
}

export interface SentryEvent {
  id?: string;
  title?: string;
  message?: string;
  level?: string;
  culprit?: string;
  environment?: string;
  dateCreated?: string;
  timestamp?: string;
  permalink?: string;
  entries?: SentryEventEntry[];
}

export function formatFrame(frame: unknown): string {
  const f = (frame ?? {}) as Record<string, unknown>;
  const fn = typeof (f as { function?: unknown }).function === "string" ? (f as { function: string }).function
    : typeof (f as { fn?: unknown }).fn === "string" ? (f as { fn: string }).fn
    : "<anonymous>";
  const file = typeof (f as { filename?: unknown }).filename === "string" ? (f as { filename: string }).filename
    : typeof (f as { absPath?: unknown }).absPath === "string" ? (f as { absPath: string }).absPath
    : typeof (f as { module?: unknown }).module === "string" ? (f as { module: string }).module
    : "<unknown>";
  const line = typeof (f as { lineno?: unknown }).lineno === "number" ? `:${(f as { lineno: number }).lineno}` : "";
  const col = typeof (f as { colno?: unknown }).colno === "number" ? `:${(f as { colno: number }).colno}` : "";

  return `${fn} (${file}${line}${col})`;
}

export function mapEvent(data: unknown, brief: boolean) {
  const d: SentryEvent = (data ?? {}) as SentryEvent;
  const base = {
    id: String(d.id ?? ""),
    title: String(d.title ?? d.message ?? ""),
    level: d.level,
    culprit: d.culprit,
    environment: d.environment,
    timestamp: d.dateCreated ?? d.timestamp,
    url: d.permalink,
  };

  if (brief) {
    const entries: SentryEventEntry[] = Array.isArray(d.entries) ? d.entries : [];
    const exceptions = entries
      .filter((e): e is SentryEventEntry => Boolean(e) && e.type === "exception")
      .flatMap((e) => (e.data?.values ?? []).map((v: SentryExceptionValue) => ({
        type: v.type,
        value: v.value,
        mechanism: v.mechanism?.type,
        frames: (Array.isArray(v.stacktrace?.frames) ? v.stacktrace.frames : []).map(formatFrame),
      })));

    return { ...base, exceptions };
  }

  return { ...base, raw: data };
}

