import { describe, it, expect } from 'vitest';
import {
  getLocationName,
  getKeyDisplay,
  parseKeyboardEvent,
  generateKeySnippet,
} from './keycodeLogic';

describe('keycodeLogic', () => {
  describe('getLocationName & getKeyDisplay', () => {
    it('returns readable descriptions for locations', () => {
      expect(getLocationName(0)).toContain('Standard');
      expect(getLocationName(1)).toBe('Left side');
      expect(getLocationName(2)).toBe('Right side');
      expect(getLocationName(3)).toBe('Numpad');
    });

    it('formats special key symbols', () => {
      expect(getKeyDisplay(' ')).toBe('Space');
      expect(getKeyDisplay('ArrowUp')).toBe('↑ Up');
      expect(getKeyDisplay('Enter')).toBe('↵ Enter');
      expect(getKeyDisplay('k')).toBe('k');
    });
  });

  describe('parseKeyboardEvent', () => {
    it('parses native keyboard event properties correctly', () => {
      const mockEvent = {
        key: 'k',
        code: 'KeyK',
        keyCode: 75,
        which: 75,
        location: 0,
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        metaKey: true,
        repeat: false,
      };

      const record = parseKeyboardEvent(mockEvent);
      expect(record.key).toBe('k');
      expect(record.code).toBe('KeyK');
      expect(record.keyCode).toBe(75);
      expect(record.ctrlKey).toBe(true);
      expect(record.metaKey).toBe(true);
      expect(record.shiftKey).toBe(false);
    });
  });

  describe('generateKeySnippet', () => {
    const record = parseKeyboardEvent({
      key: 'k',
      code: 'KeyK',
      keyCode: 75,
      which: 75,
      location: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: true,
      repeat: false,
    });

    it('generates React TypeScript handler', () => {
      const snippet = generateKeySnippet(record, 'react-ts');
      expect(snippet).toContain('React.KeyboardEvent');
      expect(snippet).toContain("e.metaKey && e.key === 'k'");
    });

    it('generates Vanilla JS listener', () => {
      const snippet = generateKeySnippet(record, 'vanilla-js');
      expect(snippet).toContain("window.addEventListener('keydown'");
    });

    it('generates shortcut guard condition', () => {
      const snippet = generateKeySnippet(record, 'shortcut-guard');
      expect(snippet).toContain("if (e.metaKey && e.key === 'k')");
    });
  });
});
