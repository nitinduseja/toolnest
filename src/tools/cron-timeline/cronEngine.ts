import { parseCron, ParsedCron } from '@/tools/cron-parser/cronLogic';

interface MatchContext {
  parsed: ParsedCron;
  dom: number;
  dow: number;
}

export interface RangeOptions {
  start: Date;
  end: Date;
  maxLimit?: number;
}

function isDayMatch(ctx: MatchContext): boolean {
  const isDomWild = ctx.parsed.rawParts[2] === '*';
  const isDowWild = ctx.parsed.rawParts[4] === '*';
  if (isDomWild && isDowWild) return true;
  if (!isDomWild && !isDowWild) {
    return ctx.parsed.daysOfMonth.has(ctx.dom) || ctx.parsed.daysOfWeek.has(ctx.dow);
  }
  return isDomWild ? ctx.parsed.daysOfWeek.has(ctx.dow) : ctx.parsed.daysOfMonth.has(ctx.dom);
}

function advanceCursor(cursor: Date, parsed: ParsedCron): boolean {
  const mon = cursor.getUTCMonth() + 1;
  if (!parsed.months.has(mon)) {
    cursor.setUTCMonth(cursor.getUTCMonth() + 1, 1);
    cursor.setUTCHours(0, 0, 0, 0);
    return true;
  }
  const dom = cursor.getUTCDate();
  const dow = cursor.getUTCDay();
  if (!isDayMatch({ parsed, dom, dow })) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    cursor.setUTCHours(0, 0, 0, 0);
    return true;
  }
  const hr = cursor.getUTCHours();
  if (!parsed.hours.has(hr)) {
    cursor.setUTCHours(cursor.getUTCHours() + 1, 0, 0, 0);
    return true;
  }
  return false;
}

export function getRunsBetween(parsed: ParsedCron, options: RangeOptions): Date[] {
  if (!parsed.valid) return [];
  const maxLimit = options.maxLimit ?? 300;
  const runs: Date[] = [];
  const cursor = new Date(options.start.getTime());
  cursor.setUTCSeconds(0, 0);
  if (cursor.getTime() <= options.start.getTime()) {
    cursor.setUTCMinutes(cursor.getUTCMinutes() + 1);
  }

  let iter = 0;
  const endLimit = options.end.getTime();
  while (cursor.getTime() <= endLimit && runs.length < maxLimit && iter < 10000) {
    iter += 1;
    if (advanceCursor(cursor, parsed)) continue;

    const min = cursor.getUTCMinutes();
    if (parsed.minutes.has(min)) {
      runs.push(new Date(cursor.getTime()));
    }
    cursor.setUTCMinutes(cursor.getUTCMinutes() + 1);
  }
  return runs;
}

export function formatTimeInZone(date: Date, timezone: string): string {
  const tz = timezone === 'local' ? undefined : timezone;
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return date.toISOString().slice(11, 16);
  }
}

export function formatDateInZone(date: Date, timezone: string): string {
  const tz = timezone === 'local' ? undefined : timezone;
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function formatRelativeTime(from: Date, target: Date): string {
  const diffMs = target.getTime() - from.getTime();
  if (diffMs <= 0) return 'now';
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'in < 1m';
  if (diffMin < 60) return `in ${diffMin}m`;
  if (diffHour < 24) {
    const remMin = diffMin % 60;
    return remMin > 0 ? `in ${diffHour}h ${remMin}m` : `in ${diffHour}h`;
  }
  const remHour = diffHour % 24;
  return remHour > 0 ? `in ${diffDay}d ${remHour}h` : `in ${diffDay}d`;
}

export { parseCron };
