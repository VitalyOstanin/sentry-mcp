import { describe, expect, it } from 'vitest';
import { formatDatetime, getTimezone, initializeTimezone } from '../../src/utils/date.js';

describe('formatDatetime', () => {
  it('returns undefined for nullish input', () => {
    expect(formatDatetime(undefined)).toBeUndefined();
    expect(formatDatetime(null)).toBeUndefined();
    expect(formatDatetime('')).toBeUndefined();
  });

  it('formats ISO timestamps and appends current timezone', () => {
    initializeTimezone('UTC');

    const formatted = formatDatetime('2026-05-07T12:34:56Z');

    expect(formatted).toBe('2026-05-07 12:34:56 (UTC)');
  });

  it('updates output when timezone is reinitialized', () => {
    initializeTimezone('Europe/Moscow');

    const formatted = formatDatetime('2026-05-07T12:00:00Z');

    expect(formatted).toContain('(Europe/Moscow)');
    expect(getTimezone()).toBe('Europe/Moscow');
  });
});

describe('getTimezone', () => {
  it('reflects the value passed to initializeTimezone', () => {
    initializeTimezone('America/New_York');
    expect(getTimezone()).toBe('America/New_York');
  });
});
