import { DateTime, Settings } from "luxon";

let currentTimezone = "Europe/Moscow";

export function initializeTimezone(timezone: string): void {
  currentTimezone = timezone;
  Settings.defaultZone = timezone;
}

export function getTimezone(): string {
  return currentTimezone;
}

export function formatDatetime(isoString: string | undefined | null): string | undefined {
  if (!isoString) return undefined;

  const formatted = DateTime.fromISO(isoString).toFormat("yyyy-MM-dd HH:mm:ss");

  return `${formatted} (${currentTimezone})`;
}
