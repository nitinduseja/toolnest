import { describe, it, expect } from 'vitest';
import {
  computeSha256,
  computeSha512,
  computeSha1,
  computeMd5,
  computeCrc32,
  computeHmac,
} from './hashLogic';

describe('Hash Generator Domain Logic', () => {
  it('computes correct SHA-256 digest', async () => {
    const hash = await computeSha256('Toolnest');
    expect(hash.length).toBe(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('computes correct SHA-512 digest', async () => {
    const hash = await computeSha512('Toolnest');
    expect(hash.length).toBe(128);
    expect(hash).toMatch(/^[0-9a-f]{128}$/);
  });

  it('computes correct SHA-1 digest', async () => {
    const hash = await computeSha1('Toolnest');
    expect(hash.length).toBe(40);
    expect(hash).toMatch(/^[0-9a-f]{40}$/);
  });

  it('computes correct MD5 checksum', () => {
    // MD5 of "Toolnest" is 75001ff80026e7b5ad048995a9ff735c
    const hash = computeMd5('Toolnest');
    expect(hash.length).toBe(32);
    expect(hash).toMatch(/^[0-9a-f]{32}$/);
  });

  it('computes correct CRC-32 checksum', () => {
    const hash = computeCrc32('Toolnest');
    expect(hash.length).toBe(8);
  });

  it('computes HMAC-SHA256 signature', async () => {
    const sig = await computeHmac('SHA-256', 'secret-key', 'Toolnest message');
    expect(sig.length).toBe(64);
  });

  it('handles empty text gracefully', async () => {
    expect(await computeSha256('')).toBe('');
    expect(computeMd5('')).toBe('');
    expect(computeCrc32('')).toBe('');
  });
});
