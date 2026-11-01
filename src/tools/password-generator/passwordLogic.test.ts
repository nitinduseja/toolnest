import { describe, it, expect } from 'vitest';
import {
  getRandomInt,
  generatePassword,
  generatePassphrase,
  calculatePasswordEntropy,
  calculatePassphraseEntropy,
  getStrengthRating,
  getCrackTimeEstimate,
  PasswordOptions,
  PassphraseOptions,
} from './passwordLogic';

describe('passwordLogic', () => {
  describe('getRandomInt', () => {
    it('returns integers within [0, max)', () => {
      for (let i = 0; i < 50; i += 1) {
        const val = getRandomInt(10);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(10);
      }
      expect(getRandomInt(0)).toBe(0);
      expect(getRandomInt(1)).toBe(0);
    });
  });

  describe('generatePassword', () => {
    const defaultOpts: PasswordOptions = {
      length: 16,
      useUpper: true,
      useLower: true,
      useNumbers: true,
      useSymbols: true,
      excludeAmbiguous: false,
    };

    it('generates a password of the requested length', () => {
      const pwd = generatePassword(defaultOpts);
      expect(pwd.length).toBe(16);
    });

    it('contains characters from all selected pools', () => {
      const pwd = generatePassword(defaultOpts);
      expect(/[A-Z]/.test(pwd)).toBe(true);
      expect(/[a-z]/.test(pwd)).toBe(true);
      expect(/[0-9]/.test(pwd)).toBe(true);
      expect(/[^A-Za-z0-9]/.test(pwd)).toBe(true);
    });

    it('excludes ambiguous characters when configured', () => {
      const opts: PasswordOptions = {
        ...defaultOpts,
        length: 50,
        excludeAmbiguous: true,
      };
      const pwd = generatePassword(opts);
      expect(/[0Oo1lI|]/.test(pwd)).toBe(false);
    });

    it('falls back to lowercase when all pools are false', () => {
      const opts: PasswordOptions = {
        length: 12,
        useUpper: false,
        useLower: false,
        useNumbers: false,
        useSymbols: false,
        excludeAmbiguous: false,
      };
      const pwd = generatePassword(opts);
      expect(pwd.length).toBe(12);
      expect(/^[a-z]+$/.test(pwd)).toBe(true);
    });
  });

  describe('generatePassphrase', () => {
    const defaultPassOpts: PassphraseOptions = {
      wordCount: 4,
      separator: '-',
      capitalize: 'title',
      includeNumber: false,
    };

    it('generates passphrase with exact word count and separator', () => {
      const phrase = generatePassphrase(defaultPassOpts);
      const parts = phrase.split('-');
      expect(parts.length).toBe(4);
      for (const part of parts) {
        expect(part.length).toBeGreaterThan(1);
        expect(part[0]).toBe(part[0].toUpperCase());
      }
    });

    it('supports custom separators and uppercase', () => {
      const phrase = generatePassphrase({
        wordCount: 3,
        separator: '_',
        capitalize: 'all',
        includeNumber: false,
      });
      const parts = phrase.split('_');
      expect(parts.length).toBe(3);
      expect(parts[0]).toBe(parts[0].toUpperCase());
    });

    it('appends a number when includeNumber is true', () => {
      const phrase = generatePassphrase({
        wordCount: 4,
        separator: '.',
        capitalize: 'none',
        includeNumber: true,
      });
      expect(/[0-9]/.test(phrase)).toBe(true);
    });
  });

  describe('entropy and strength ratings', () => {
    it('calculates higher entropy for longer passwords and diverse pools', () => {
      const short = calculatePasswordEntropy({
        length: 8,
        useUpper: false,
        useLower: true,
        useNumbers: false,
        useSymbols: false,
        excludeAmbiguous: false,
      });
      const longDiverse = calculatePasswordEntropy({
        length: 20,
        useUpper: true,
        useLower: true,
        useNumbers: true,
        useSymbols: true,
        excludeAmbiguous: false,
      });
      expect(longDiverse).toBeGreaterThan(short);
      expect(short).toBeLessThan(40);
      expect(longDiverse).toBeGreaterThan(100);
    });

    it('calculates passphrase entropy accurately', () => {
      const entropy = calculatePassphraseEntropy({
        wordCount: 5,
        separator: '-',
        capitalize: 'none',
        includeNumber: true,
      });
      expect(entropy).toBeGreaterThan(50);
    });

    it('assigns correct strength rating categories and crack times', () => {
      const weak = getStrengthRating(30);
      expect(weak.label).toBe('Very Weak');
      expect(weak.score).toBe(1);

      const strong = getStrengthRating(110);
      expect(strong.label).toBe('Very Strong');
      expect(strong.score).toBe(5);

      expect(getCrackTimeEstimate(20)).toBe('Instant');
      expect(getCrackTimeEstimate(120)).toBe('Billions of years');
    });
  });
});
