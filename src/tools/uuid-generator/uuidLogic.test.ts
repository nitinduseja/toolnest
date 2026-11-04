import { describe, it, expect } from 'vitest';
import {
  generateSingleUuid,
  generateUuidV4,
  generateUuidV7,
  generateNanoId,
  generateUlid,
  generateIdBatch,
  generateUuidBatch,
} from './uuidLogic';

describe('UUID & ID Generator Domain Logic', () => {
  const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const UUID_V7_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;

  it('generates a valid RFC 4122 v4 UUID string', () => {
    const uuid = generateSingleUuid();
    expect(UUID_V4_REGEX.test(uuid)).toBe(true);
    expect(UUID_V4_REGEX.test(generateUuidV4())).toBe(true);
  });

  it('generates a valid RFC 9562 v7 UUID string with version 7', () => {
    const uuid7 = generateUuidV7();
    expect(UUID_V7_REGEX.test(uuid7)).toBe(true);
    // 13th hex character must be '7'
    expect(uuid7.charAt(14)).toBe('7');
  });

  it('generates chronological UUID v7 timestamps', () => {
    const t1 = 1700000000000;
    const t2 = 1750000000000;
    const u1 = generateUuidV7(t1);
    const u2 = generateUuidV7(t2);
    expect(u1 < u2).toBe(true);
  });

  it('generates NanoID with customizable length and alphabet', () => {
    const defaultNano = generateNanoId();
    expect(defaultNano.length).toBe(21);

    const customNano = generateNanoId(10, '0123456789ABCDEF');
    expect(customNano.length).toBe(10);
    expect(/^[0-9A-F]{10}$/.test(customNano)).toBe(true);
  });

  it('generates valid 26-character Crockford Base32 ULIDs', () => {
    const ulid = generateUlid();
    expect(ulid.length).toBe(26);
    expect(ULID_REGEX.test(ulid)).toBe(true);
  });

  it('generates batches of unique UUIDs up to limit', () => {
    const batch = generateUuidBatch(10);
    expect(batch.length).toBe(10);
    expect(new Set(batch).size).toBe(10);
    batch.forEach((u) => expect(UUID_V4_REGEX.test(u)).toBe(true));
  });

  it('bounds batch count between 1 and 100', () => {
    expect(generateUuidBatch(0).length).toBe(1);
    expect(generateUuidBatch(150).length).toBe(100);
  });

  it('supports uppercase formatting and no-hyphens options', () => {
    const batch = generateIdBatch({
      type: 'uuid-v4',
      count: 3,
      uppercase: true,
      noHyphens: true,
    });
    expect(batch.length).toBe(3);
    batch.forEach((u) => {
      expect(u).toBe(u.toUpperCase());
      expect(u.includes('-')).toBe(false);
      expect(u.length).toBe(32);
    });
  });

  it('supports ULID and NanoID batches', () => {
    const ulidBatch = generateIdBatch({ type: 'ulid', count: 5 });
    expect(ulidBatch.length).toBe(5);
    expect(new Set(ulidBatch).size).toBe(5);

    const nanoBatch = generateIdBatch({ type: 'nanoid', count: 5, nanoLength: 16 });
    expect(nanoBatch.length).toBe(5);
    nanoBatch.forEach((n) => expect(n.length).toBe(16));
  });
});
