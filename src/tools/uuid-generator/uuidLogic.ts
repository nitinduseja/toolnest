/**
 * Cryptographically secure UUID v4 generator with CSPRNG fallback.
 */

export function generateSingleUuid(): string {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    if (typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant

      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
  }

  throw new Error('Cryptographically secure random generation (CSPRNG) is unavailable.');
}

export function generateUuidBatch(count: number, uppercase = false): string[] {
  const boundedCount = Math.max(1, Math.min(count, 100));
  const results: string[] = [];
  for (let i = 0; i < boundedCount; i++) {
    const uuid = generateSingleUuid();
    results.push(uppercase ? uuid.toUpperCase() : uuid.toLowerCase());
  }
  return results;
}
