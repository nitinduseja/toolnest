import { describe, it, expect } from 'vitest';
import {
  parseStructuredData,
  computeStructuralDiff,
  calculateDiffSummary,
  generateJsonPatch,
} from './diffLogic';

describe('json-yaml-diff logic', () => {
  it('parses valid JSON and YAML strings correctly', () => {
    const jsonRes = parseStructuredData('{"name": "Toolnest", "version": 2}', 'json');
    expect(jsonRes.data).toEqual({ name: 'Toolnest', version: 2 });
    expect(jsonRes.error).toBeUndefined();

    const yamlRes = parseStructuredData('name: Toolnest\nversion: 2', 'yaml');
    expect(yamlRes.data).toEqual({ name: 'Toolnest', version: 2 });
    expect(yamlRes.error).toBeUndefined();
  });

  it('handles syntax errors gracefully', () => {
    const jsonRes = parseStructuredData('{ broken json }', 'json');
    expect(jsonRes.data).toBeNull();
    expect(jsonRes.error).toBeDefined();
  });

  it('computes key addition, removal, and replacement', () => {
    const left = { id: 1, title: 'Old Title', toRemove: true };
    const right = { id: 1, title: 'New Title', toAdd: 'fresh' };

    const diffs = computeStructuralDiff(left, right);
    expect(diffs).toEqual([
      { path: '/title', op: 'replace', oldValue: 'Old Title', newValue: 'New Title' },
      { path: '/toRemove', op: 'remove', oldValue: true },
      { path: '/toAdd', op: 'add', newValue: 'fresh' },
    ]);

    const summary = calculateDiffSummary(diffs);
    expect(summary.added).toBe(1);
    expect(summary.removed).toBe(1);
    expect(summary.replaced).toBe(1);
    expect(summary.total).toBe(3);
  });

  it('computes nested array element changes', () => {
    const left = { tags: ['dev', 'tools'] };
    const right = { tags: ['dev', 'utilities', 'studio'] };

    const diffs = computeStructuralDiff(left, right);
    expect(diffs).toEqual([
      { path: '/tags/1', op: 'replace', oldValue: 'tools', newValue: 'utilities' },
      { path: '/tags/2', op: 'add', newValue: 'studio' },
    ]);
  });

  it('generates standard RFC 6902 JSON patch operations', () => {
    const left = { title: 'v1', flag: false };
    const right = { title: 'v2', extra: 42 };

    const diffs = computeStructuralDiff(left, right);
    const patch = generateJsonPatch(diffs);

    expect(patch).toEqual([
      { op: 'replace', path: '/title', value: 'v2' },
      { op: 'remove', path: '/flag' },
      { op: 'add', path: '/extra', value: 42 },
    ]);
  });
});
