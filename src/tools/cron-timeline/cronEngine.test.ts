import { describe, it, expect } from 'vitest';
import {
  parseCron,
  getRunsBetween,
  formatTimeInZone,
  formatDateInZone,
  formatRelativeTime,
} from './cronEngine';

describe('cronEngine', () => {
  it('parses valid 5-part cron expressions', () => {
    const parsed = parseCron('0 2 * * *');
    expect(parsed.valid).toBe(true);
    expect(parsed.minutes.has(0)).toBe(true);
    expect(parsed.hours.has(2)).toBe(true);
  });

  it('rejects invalid cron expressions cleanly', () => {
    const parsed = parseCron('invalid cron text');
    expect(parsed.valid).toBe(false);
    const runs = getRunsBetween(parsed, {
      start: new Date('2026-11-15T00:00:00Z'),
      end: new Date('2026-11-16T00:00:00Z'),
    });
    expect(runs).toEqual([]);
  });

  it('calculates runs in 24 hour range for hourly job', () => {
    const parsed = parseCron('0 * * * *');
    const start = new Date('2026-11-15T00:00:00Z');
    const end = new Date('2026-11-15T23:59:59Z');
    const runs = getRunsBetween(parsed, { start, end });
    expect(runs.length).toBe(23); // hours 1..23
  });

  it('calculates runs for interval cron (every 15 min)', () => {
    const parsed = parseCron('*/15 * * * *');
    const start = new Date('2026-11-15T10:00:00Z');
    const end = new Date('2026-11-15T12:00:00Z');
    const runs = getRunsBetween(parsed, { start, end });
    expect(runs.length).toBe(8); // 10:15, 10:30, 10:45, 11:00, 11:15, 11:30, 11:45, 12:00
  });

  it('formats time and date with timezone', () => {
    const date = new Date('2026-11-15T14:30:00Z');
    const utcTime = formatTimeInZone(date, 'UTC');
    expect(utcTime).toBe('14:30');

    const formattedDate = formatDateInZone(date, 'UTC');
    expect(formattedDate).toContain('Nov');
  });

  it('formats relative time strings accurately', () => {
    const from = new Date('2026-11-15T12:00:00Z');
    const in30m = new Date('2026-11-15T12:30:00Z');
    expect(formatRelativeTime(from, in30m)).toBe('in 30m');

    const in2h = new Date('2026-11-15T14:15:00Z');
    expect(formatRelativeTime(from, in2h)).toBe('in 2h 15m');

    const in2d = new Date('2026-11-17T12:00:00Z');
    expect(formatRelativeTime(from, in2d)).toBe('in 2d');
  });
});
