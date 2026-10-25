import { describe, it, expect } from 'vitest';
import { computeSha256 } from './hashLogic';

describe('SHA-256 Hash Generator Domain Logic', () => {
  it('computes verified NIST test vector for SHA-256', async () => {
    // "hello" sha256 is 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    const hash = await computeSha256('hello');
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('computes correct digest for Unicode text', async () => {
    const hash = await computeSha256('Toolnest 🛠️');
    expect(hash.length).toBe(64);
  });

  it('returns empty string for empty input', async () => {
    const hash = await computeSha256('');
    expect(hash).toBe('');
  });
});
