import { describe, it, expect } from 'vitest';
import {
  computeDiff,
  computeSideBySideDiff,
  computeInlineWordDiff,
  generateUnifiedPatch,
  collapseUnchangedRows,
} from './diffLogic';

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
    expect(computeSideBySideDiff('', '')).toEqual([]);
  });

  it('computes word-level diffs correctly', () => {
    const diff = computeDiff('hello world', 'hello brave world', 'words');
    expect(diff.some((p) => p.added && p.value.trim() === 'brave')).toBe(true);
  });

  it('computes side-by-side diffs with line numbers', () => {
    const orig = 'line 1\nline 2\nline 3';
    const mod = 'line 1\nline two\nline 3';
    const sbs = computeSideBySideDiff(orig, mod);

    expect(sbs.length).toBe(3);
    expect(sbs[0].left?.lineNum).toBe(1);
    expect(sbs[0].right?.lineNum).toBe(1);
    expect(sbs[0].left?.type).toBe('same');

    expect(sbs[1].left?.type).toBe('removed');
    expect(sbs[1].left?.text).toBe('line 2');
    expect(sbs[1].right?.type).toBe('added');
    expect(sbs[1].right?.text).toBe('line two');

    expect(sbs[2].left?.lineNum).toBe(3);
    expect(sbs[2].right?.lineNum).toBe(3);
  });

  it('computes inline word-level diff between two replaced strings', () => {
    const { leftWords, rightWords } = computeInlineWordDiff('const count = 1;', 'const count = 5;');
    expect(leftWords.some((w) => w.text === '1' && w.changed)).toBe(true);
    expect(rightWords.some((w) => w.text === '5' && w.changed)).toBe(true);
  });

  it('generates standard git-compatible unified patch', () => {
    const patch = generateUnifiedPatch('hello\nworld', 'hello\nToolnest');
    expect(patch).toContain('Index: file.txt');
    expect(patch).toContain('-world');
    expect(patch).toContain('+Toolnest');
  });

  it('collapses identical lines leaving context rows', () => {
    const lines = Array.from({ length: 20 }, (_, i) => `identical line ${i}`).join('\n');
    const sbs = computeSideBySideDiff(lines, lines);
    const collapsed = collapseUnchangedRows(sbs, 2);

    expect(collapsed.some((r) => r.isFoldMarker)).toBe(true);
    const marker = collapsed.find((r) => r.isFoldMarker);
    expect(marker?.foldedCount).toBeGreaterThan(10);
  });
});
