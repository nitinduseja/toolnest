import { describe, it, expect } from 'vitest';
import { parseTimestamp, parseIsoDate } from './timestampLogic';

describe('Unix Timestamp Converter Domain Logic', () => {
  it('converts epoch seconds into ISO and UTC strings', () => {
    // 0 is 1970-01-01T00:00:00.000Z
    const res = parseTimestamp(0, 'seconds');
    expect(res.isValid).toBe(true);
    expect(res.iso).toBe('1970-01-01T00:00:00.000Z');
    expect(res.utc).toBe('Thu, 01 Jan 1970 00:00:00 GMT');
  });

  it('converts epoch milliseconds correctly', () => {
    const res = parseTimestamp(1700000000000, 'milliseconds');
    expect(res.isValid).toBe(true);
    expect(res.seconds).toBe(1700000000);
    expect(res.milliseconds).toBe(1700000000000);
  });

  it('converts ISO date strings back into epoch numbers', () => {
    const res = parseIsoDate('2026-10-25T12:00:00Z');
    expect(res.isValid).toBe(true);
    expect(res.iso).toBe('2026-10-25T12:00:00.000Z');
  });

  it('detects invalid date inputs gracefully', () => {
    expect(parseTimestamp('invalid', 'seconds').isValid).toBe(false);
    expect(parseIsoDate('not a date').isValid).toBe(false);
  });
});
