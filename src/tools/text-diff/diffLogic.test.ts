import { describe, it, expect } from 'vitest';
import { computeDiff } from './diffLogic';

describe('Text Diff Checker Domain Logic', () => {
  it('detects added and removed lines correctly', () => {
    const original = 'alpha\nbeta\ngamma';
    const modified = 'alpha\nbeta 2.0\ngamma\ndelta';

    const diff = computeDiff(original, modified, 'lines');
    expect(diff.some((p) => p.removed && p.value.includes('beta'))).toBe(true);
    expect(diff.some((p) => p.added && p.value.includes('beta 2.0'))).toBe(true);
    expect(diff.some((p) => p.added && p.value.includes('delta'))).toBe(true);
  });

  it('handles empty inputs cleanly without errors', () => {
    expect(computeDiff('', '', 'lines')).toEqual([]);
  });

  it('computes word-level diffs correctly', () => {
    const diff = computeDiff('hello world', 'hello brave world', 'words');
    expect(diff.some((p) => p.added && p.value.trim() === 'brave')).toBe(true);
  });
});
