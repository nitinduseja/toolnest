import { describe, it, expect } from 'vitest';
import { explainRegexPattern } from './regexVisualizerLogic';

describe('regexVisualizerLogic', () => {
  it('returns empty array when given empty pattern', () => {
    expect(explainRegexPattern('')).toEqual([]);
  });

  it('parses anchors correctly', () => {
    const tokens = explainRegexPattern('^start$');
    expect(tokens[0].type).toBe('anchor');
    expect(tokens[0].raw).toBe('^');
    expect(tokens[1].type).toBe('literal');
    expect(tokens[1].raw).toBe('start');
    expect(tokens[2].type).toBe('anchor');
    expect(tokens[2].raw).toBe('$');
  });

  it('parses character sets and escaped classes', () => {
    const tokens = explainRegexPattern('\\d+[a-z]');
    expect(tokens[0].type).toBe('character-class');
    expect(tokens[0].raw).toBe('\\d');
    expect(tokens[1].type).toBe('quantifier');
    expect(tokens[1].raw).toBe('+');
    expect(tokens[2].type).toBe('character-class');
    expect(tokens[2].raw).toBe('[a-z]');
  });

  it('parses capturing and non-capturing groups', () => {
    const tokens = explainRegexPattern('(?:https?)://(\\w+)');
    expect(tokens[0].type).toBe('group');
    expect(tokens[0].label).toContain('Non-Capturing');
    expect(tokens[tokens.length - 1].raw).toBe(')');
  });

  it('parses range quantifiers like {2,4}', () => {
    const tokens = explainRegexPattern('[0-9]{2,4}');
    expect(tokens[1].type).toBe('quantifier');
    expect(tokens[1].label).toContain('{2,4}');
  });

  it('parses alternations', () => {
    const tokens = explainRegexPattern('cat|dog');
    const alt = tokens.find((t) => t.type === 'alternation');
    expect(alt).toBeDefined();
    expect(alt?.raw).toBe('|');
  });

  it('parses email regex pattern successfully into meaningful tokens', () => {
    const emailPattern = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b';
    const tokens = explainRegexPattern(emailPattern);
    expect(tokens.length).toBeGreaterThan(5);
    expect(tokens[0].type).toBe('anchor'); // \b
    expect(tokens[1].type).toBe('character-class'); // [A-Za-z0-9._%+-]
    expect(tokens[2].type).toBe('quantifier'); // +
  });
});
