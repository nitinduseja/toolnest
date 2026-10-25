import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64 } from './base64Logic';

describe('Base64 Encoder/Decoder Domain Logic', () => {
  it('encodes and decodes standard ASCII strings', () => {
    const original = 'Hello, Toolnest!';
    const encoded = encodeBase64(original);
    expect(encoded).toBe('SGVsbG8sIFRvb2xuZXN0IQ==');
    expect(decodeBase64(encoded)).toBe(original);
  });

  it('handles multi-byte UTF-8 characters and emojis safely', () => {
    const unicodeString = 'Toolnest 🛠️ 🚀 — 日本語 & Español ñ';
    const encoded = encodeBase64(unicodeString);
    const decoded = decodeBase64(encoded);
    expect(decoded).toBe(unicodeString);
  });

  it('handles empty input gracefully', () => {
    expect(encodeBase64('')).toBe('');
    expect(decodeBase64('')).toBe('');
    expect(decodeBase64('   ')).toBe('');
  });

  it('throws descriptive error on malformed base64', () => {
    expect(() => decodeBase64('ThisIsNotValidBase64!!!')).toThrow(
      'Malformed Base64 string or invalid byte sequence.'
    );
  });
});
