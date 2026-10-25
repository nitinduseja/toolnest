import { describe, it, expect } from 'vitest';
import { generateSingleUuid, generateUuidBatch } from './uuidLogic';

describe('UUID Generator Domain Logic', () => {
  const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  it('generates a valid RFC 4122 v4 UUID string', () => {
    const uuid = generateSingleUuid();
    expect(UUID_V4_REGEX.test(uuid)).toBe(true);
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

  it('supports uppercase formatting', () => {
    const batch = generateUuidBatch(3, true);
    batch.forEach((u) => {
      expect(u).toBe(u.toUpperCase());
    });
  });
});
