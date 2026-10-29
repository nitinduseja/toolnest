import { describe, it, expect } from 'vitest';
import { parseField, parseCron, humanizeCron, getNextRuns, getCronPresets } from './cronLogic';

describe('cronLogic', () => {
  describe('parseField', () => {
    it('parses wildcards correctly', () => {
      const field = parseField('*', 0, 5);
      expect(Array.from(field)).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it('parses step expressions', () => {
      const field = parseField('*/15', 0, 59);
      expect(Array.from(field)).toEqual([0, 15, 30, 45]);
    });

    it('parses ranges and comma-separated lists', () => {
      const field = parseField('1-3,5', 0, 10);
      expect(Array.from(field).sort((a, b) => a - b)).toEqual([1, 2, 3, 5]);
    });
  });

  describe('humanizeCron standard conventions', () => {
    it('formats every minute', () => {
      expect(humanizeCron(['*', '*', '*', '*', '*'])).toBe('At every minute.');
    });

    it('formats step intervals with ordinal numbers', () => {
      expect(humanizeCron(['*/5', '*', '*', '*', '*'])).toBe('At every 5th minute.');
      expect(humanizeCron(['*/15', '*', '*', '*', '*'])).toBe('At every 15th minute.');
    });

    it('formats hourly and exact times', () => {
      expect(humanizeCron(['0', '*', '*', '*', '*'])).toBe('At minute 0.');
      expect(humanizeCron(['0', '0', '*', '*', '*'])).toBe('At 00:00.');
      expect(humanizeCron(['15', '14', '*', '*', '*'])).toBe('At 14:15.');
    });

    it('formats day-of-month and month names', () => {
      expect(humanizeCron(['15', '14', '1', '*', '*'])).toBe('At 14:15 on day-of-month 1.');
      expect(humanizeCron(['0', '0', '1', '1', '*'])).toBe(
        'At 00:00 on day-of-month 1 in January.'
      );
    });

    it('formats day-of-week ranges and single days', () => {
      expect(humanizeCron(['0', '9', '*', '*', '1-5'])).toBe(
        'At 09:00 on every day-of-week from Monday through Friday.'
      );
      expect(humanizeCron(['0', '0', '*', '*', '0'])).toBe('At 00:00 on Sunday.');
    });
  });

  describe('parseCron and Macro expansion', () => {
    it('expands standard cron macros', () => {
      expect(parseCron('@daily').humanDescription).toBe('At 00:00.');
      expect(parseCron('@hourly').humanDescription).toBe('At minute 0.');
      expect(parseCron('@weekly').humanDescription).toBe('At 00:00 on Sunday.');
      expect(parseCron('@monthly').humanDescription).toBe('At 00:00 on day-of-month 1.');
      expect(parseCron('@yearly').humanDescription).toBe('At 00:00 on day-of-month 1 in January.');
    });

    it('handles day names and month names in uppercase and lowercase', () => {
      const parsed = parseCron('0 0 1 JAN MON');
      expect(parsed.valid).toBe(true);
      expect(parsed.months.has(1)).toBe(true);
      expect(parsed.daysOfWeek.has(1)).toBe(true);
    });

    it('rejects invalid or incomplete expressions', () => {
      expect(parseCron('* * *').valid).toBe(false);
      expect(parseCron('75 * * * *').valid).toBe(false);
      expect(parseCron('').valid).toBe(false);
    });
  });

  describe('getNextRuns', () => {
    it('predicts the next execution dates in order', () => {
      const parsed = parseCron('0 12 * * *');
      const start = new Date(2026, 0, 1, 10, 0, 0); // Jan 1, 2026 at 10:00
      const runs = getNextRuns(parsed, 3, start);

      expect(runs.length).toBe(3);
      expect(runs[0].getHours()).toBe(12);
      expect(runs[0].getMinutes()).toBe(0);
      expect(runs[0].getDate()).toBe(1); // Jan 1 at 12:00
      expect(runs[1].getDate()).toBe(2); // Jan 2 at 12:00
      expect(runs[2].getDate()).toBe(3); // Jan 3 at 12:00
    });
  });

  describe('getCronPresets', () => {
    it('returns valid presets that all parse successfully', () => {
      const presets = getCronPresets();
      expect(presets.length).toBeGreaterThan(5);
      for (const preset of presets) {
        const parsed = parseCron(preset.expression);
        expect(parsed.valid).toBe(true);
      }
    });
  });
});
