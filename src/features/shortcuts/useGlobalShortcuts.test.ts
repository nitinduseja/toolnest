import { describe, it, expect } from 'vitest';
import { isInputField } from './useGlobalShortcuts';

describe('useGlobalShortcuts', () => {
  it('identifies input elements correctly', () => {
    const input = document.createElement('input');
    const textarea = document.createElement('textarea');
    const select = document.createElement('select');
    const div = document.createElement('div');

    expect(isInputField(input)).toBe(true);
    expect(isInputField(textarea)).toBe(true);
    expect(isInputField(select)).toBe(true);
    expect(isInputField(div)).toBe(false);
    expect(isInputField(null)).toBe(false);
  });
});
