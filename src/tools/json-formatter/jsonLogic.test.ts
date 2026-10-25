import { describe, it, expect } from 'vitest';
import { validateJson, formatJson, minifyJson } from './jsonLogic';

describe('JSON Formatter & Validator Domain Logic', () => {
  it('validates valid json successfully', () => {
    const raw = '{"name":"Toolnest","active":true,"count":42}';
    const res = validateJson(raw);
    expect(res.isValid).toBe(true);
    expect(res.data).toEqual({ name: 'Toolnest', active: true, count: 42 });
  });

  it('detects syntax errors in invalid JSON with error details', () => {
    const raw = '{"name": "Toolnest", invalid}';
    const res = validateJson(raw);
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('handles empty input cleanly', () => {
    expect(validateJson('').isValid).toBe(true);
    expect(formatJson('')).toBe('');
    expect(minifyJson('')).toBe('');
  });

  it('formats json with custom indent options (2 spaces, 4 spaces, tabs)', () => {
    const raw = '{"a":1}';
    expect(formatJson(raw, { indent: 2 })).toBe('{\n  "a": 1\n}');
    expect(formatJson(raw, { indent: 4 })).toBe('{\n    "a": 1\n}');
    expect(formatJson(raw, { indent: 'tab' })).toBe('{\n\t"a": 1\n}');
  });

  it('minifies valid json without whitespace', () => {
    const raw = '{\n  "key": "value",\n  "nums": [1, 2, 3]\n}';
    expect(minifyJson(raw)).toBe('{"key":"value","nums":[1,2,3]}');
  });

  it('throws descriptive error on invalid json formatting attempt', () => {
    expect(() => formatJson('{not json}')).toThrow();
    expect(() => minifyJson('{not json}')).toThrow();
  });
});
