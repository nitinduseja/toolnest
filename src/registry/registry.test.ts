import { describe, it, expect } from 'vitest';
import { ALL_TOOLS, validateRegistry } from './tool-registry';
import { CATEGORIES } from './categories';

describe('Tool Registry Validation', () => {
  it('validates without any errors', () => {
    const result = validateRegistry();
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it('contains exactly 12 initial functional tools', () => {
    expect(ALL_TOOLS.length).toBe(12);
  });

  it('contains 12 canonical categories', () => {
    expect(CATEGORIES.length).toBe(12);
  });

  it('each tool has unique slug and id', () => {
    const ids = ALL_TOOLS.map((t) => t.id);
    const slugs = ALL_TOOLS.map((t) => t.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
