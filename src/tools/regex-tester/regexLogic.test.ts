import { describe, it, expect } from 'vitest';
import { testRegex, replaceRegex, getHighlightedSegments } from './regexLogic';

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

  it('replaces matches with substitution string', () => {
    const res = replaceRegex('\\bworld\\b', 'g', 'Hello world, welcome to the world', 'Toolnest');
    expect(res.output).toBe('Hello Toolnest, welcome to the Toolnest');
  });

  it('generates highlighted segments accurately', () => {
    const testText = 'abc 123 xyz';
    const matches = [{ match: '123', index: 4, length: 3 }];
    const segs = getHighlightedSegments(testText, matches);
    expect(segs.length).toBe(3);
    expect(segs[0]).toEqual({ text: 'abc ', isMatch: false });
    expect(segs[1]).toEqual({ text: '123', isMatch: true, matchIndex: 1 });
    expect(segs[2]).toEqual({ text: ' xyz', isMatch: false });
  });
});
