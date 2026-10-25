import { describe, it, expect } from 'vitest';
import { testRegex } from './regexLogic';

describe('Regex Tester Domain Logic', () => {
  it('finds global matches with match details', () => {
    const res = testRegex('\\b\\w{4}\\b', 'g', 'The fast blue bird flew away');
    expect(res.isValid).toBe(true);
    expect(res.matchCount).toBe(5); // fast, blue, bird, flew, away
    expect(res.matches[0].match).toBe('fast');
  });

  it('captures named groups properly', () => {
    const res = testRegex('(?<year>\\d{4})-(?<month>\\d{2})', '', 'Release 2026-10 ready');
    expect(res.isValid).toBe(true);
    expect(res.matches[0].groups).toEqual({ year: '2026', month: '10' });
  });

  it('gracefully reports invalid regex patterns', () => {
    const res = testRegex('[a-z', '', 'sample');
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('prevents infinite loops on zero-width match patterns', () => {
    const res = testRegex('^|a', 'g', 'aaa');
    expect(res.isValid).toBe(true);
    expect(res.matchCount).toBeGreaterThan(0);
  });
});
