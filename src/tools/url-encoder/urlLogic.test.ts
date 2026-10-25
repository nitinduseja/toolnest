import { describe, it, expect } from 'vitest';
import { encodeUrl, decodeUrl } from './urlLogic';

describe('URL Encoder/Decoder Domain Logic', () => {
  it('encodes URI component special characters (&, =, ?, /)', () => {
    const raw = 'name=John Doe&city=New York/USA?key=val';
    const encoded = encodeUrl(raw, 'component');
    expect(encoded).toBe('name%3DJohn%20Doe%26city%3DNew%20York%2FUSA%3Fkey%3Dval');
    expect(decodeUrl(encoded, 'component')).toBe(raw);
  });

  it('encodes full URI preserving protocol and structure', () => {
    const full = 'https://example.com/search?query=hello world&filter=all';
    const encoded = encodeUrl(full, 'full');
    expect(encoded).toBe('https://example.com/search?query=hello%20world&filter=all');
    expect(decodeUrl(encoded, 'full')).toBe(full);
  });

  it('handles empty input cleanly', () => {
    expect(encodeUrl('')).toBe('');
    expect(decodeUrl('')).toBe('');
  });

  it('throws descriptive error on malformed percent sequences', () => {
    expect(() => decodeUrl('%E0%A4%A', 'component')).toThrow(
      'Malformed percent-encoded URI string.'
    );
  });
});
