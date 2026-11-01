/**
 * Pure domain logic for cryptographically secure passwords and passphrases.
 * Uses Web Crypto API (crypto.getRandomValues) for unbiased uniform randomness.
 */
import { WORDLIST } from './wordlist';

export interface PasswordOptions {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeAmbiguous: boolean;
}

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  capitalize: 'none' | 'all' | 'title';
  includeNumber: boolean;
}

export interface StrengthRating {
  label: string;
  score: number;
  entropy: number;
  color: string;
  bgClass: string;
  crackTime: string;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = new Set(['0', 'O', 'o', '1', 'l', 'I', '|']);

function getCrypto(): Crypto {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto;
  }
  throw new Error('Web Crypto API is not available.');
}

export function getRandomInt(max: number): number {
  if (max <= 1) return 0;
  const cryptoObj = getCrypto();
  const range = 0xffffffff;
  const limit = range - (range % max);
  const buffer = new Uint32Array(1);
  do {
    cryptoObj.getRandomValues(buffer);
  } while (buffer[0] >= limit);
  return buffer[0] % max;
}

function filterChars(chars: string, exclude: boolean): string {
  if (!exclude) return chars;
  return chars
    .split('')
    .filter((c) => !AMBIGUOUS.has(c))
    .join('');
}

function getCharPools(options: PasswordOptions): string[] {
  const sets: string[] = [];
  if (options.useUpper) sets.push(filterChars(UPPERCASE, options.excludeAmbiguous));
  if (options.useLower) sets.push(filterChars(LOWERCASE, options.excludeAmbiguous));
  if (options.useNumbers) sets.push(filterChars(NUMBERS, options.excludeAmbiguous));
  if (options.useSymbols) sets.push(filterChars(SYMBOLS, options.excludeAmbiguous));
  if (sets.length === 0) sets.push(filterChars(LOWERCASE, options.excludeAmbiguous));
  return sets;
}

function shuffle(chars: string[]): string {
  const arr = [...chars];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(i + 1);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr.join('');
}

export function generatePassword(options: PasswordOptions): string {
  const pools = getCharPools(options);
  const fullPool = pools.join('');
  const safeLength = Math.max(pools.length, Math.min(options.length, 128));
  const result: string[] = [];

  for (const pool of pools) {
    result.push(pool[getRandomInt(pool.length)]);
  }
  while (result.length < safeLength) {
    result.push(fullPool[getRandomInt(fullPool.length)]);
  }
  return shuffle(result);
}

function formatWord(word: string, cap: 'none' | 'all' | 'title'): string {
  if (cap === 'all') return word.toUpperCase();
  if (cap === 'title') return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  return word.toLowerCase();
}

export function generatePassphrase(options: PassphraseOptions): string {
  const count = Math.max(3, Math.min(options.wordCount, 16));
  const words: string[] = [];

  for (let i = 0; i < count; i += 1) {
    const rawWord = WORDLIST[getRandomInt(WORDLIST.length)];
    words.push(formatWord(rawWord, options.capitalize));
  }
  if (options.includeNumber) {
    const num = getRandomInt(90) + 10;
    const targetIdx = getRandomInt(words.length);
    words[targetIdx] = `${words[targetIdx]}${num}`;
  }
  return words.join(options.separator);
}

export function calculatePasswordEntropy(options: PasswordOptions): number {
  const pools = getCharPools(options);
  const poolSize = pools.reduce((acc, p) => acc + p.length, 0);
  if (poolSize <= 1) return 0;
  return Math.round(options.length * Math.log2(poolSize));
}

export function calculatePassphraseEntropy(options: PassphraseOptions): number {
  const bitsPerWord = Math.log2(WORDLIST.length); // 10 bits
  let entropy = options.wordCount * bitsPerWord;
  if (options.includeNumber) entropy += Math.log2(90);
  if (options.capitalize === 'title') entropy += options.wordCount;
  return Math.round(entropy);
}

export function getCrackTimeEstimate(entropy: number): string {
  if (entropy < 28) return 'Instant';
  if (entropy < 36) return 'A few seconds';
  if (entropy < 45) return 'A few minutes';
  if (entropy < 55) return 'Several hours';
  if (entropy < 65) return 'Several days';
  if (entropy < 80) return 'Several years';
  if (entropy < 100) return 'Centuries';
  return 'Billions of years';
}

export function getStrengthRating(entropy: number): StrengthRating {
  const crackTime = getCrackTimeEstimate(entropy);
  if (entropy < 40) {
    return {
      label: 'Very Weak',
      score: 1,
      entropy,
      color: 'text-error',
      bgClass: 'bg-error',
      crackTime,
    };
  }
  if (entropy < 60) {
    return {
      label: 'Weak',
      score: 2,
      entropy,
      color: 'text-amber-500',
      bgClass: 'bg-amber-500',
      crackTime,
    };
  }
  if (entropy < 80) {
    return {
      label: 'Good',
      score: 3,
      entropy,
      color: 'text-yellow-500',
      bgClass: 'bg-yellow-500',
      crackTime,
    };
  }
  if (entropy < 100) {
    return {
      label: 'Strong',
      score: 4,
      entropy,
      color: 'text-emerald-500',
      bgClass: 'bg-emerald-500',
      crackTime,
    };
  }
  return {
    label: 'Very Strong',
    score: 5,
    entropy,
    color: 'text-emerald-400',
    bgClass: 'bg-emerald-400',
    crackTime,
  };
}
