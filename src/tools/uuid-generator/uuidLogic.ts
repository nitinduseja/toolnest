/**
 * Cryptographically secure ID and UUID generators conforming to RFC 4122 (v4),
 * RFC 9562 (v7, time-ordered), ULID (Crockford Base32), and NanoID specifications.
 */

export type IdType = 'uuid-v4' | 'uuid-v7' | 'nanoid' | 'ulid';

export interface IdOptions {
  type?: IdType;
  count?: number;
  uppercase?: boolean;
  noHyphens?: boolean;
  nanoLength?: number;
  nanoAlphabet?: string;
  format?: 'plain' | 'json' | 'comma';
}

const DEFAULT_NANOID_ALPHABET = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLFG_';
const ULID_CROCKFORD_ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Generates an RFC 4122 compliant UUID v4 using CSPRNG.
 */
export function generateUuidV4(): string {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    if (typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // v4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 1
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
  }
  throw new Error('Cryptographically secure random generation (CSPRNG) is unavailable.');
}

/**
 * Alias for backward compatibility
 */
export const generateSingleUuid = generateUuidV4;

/**
 * Generates an RFC 9562 UUID v7 (Unix timestamp in ms + random bits).
 * Monotonically sortable by creation time.
 */
export function generateUuidV7(timestampMs?: number): string {
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    throw new Error('CSPRNG unavailable.');
  }

  const ts = Math.floor(timestampMs ?? Date.now());
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // 48-bit timestamp (Big-Endian)
  bytes[0] = (ts / 0x10000000000) & 0xff;
  bytes[1] = (ts / 0x100000000) & 0xff;
  bytes[2] = (ts / 0x1000000) & 0xff;
  bytes[3] = (ts / 0x10000) & 0xff;
  bytes[4] = (ts / 0x100) & 0xff;
  bytes[5] = ts & 0xff;

  // version 7 (0111xxxx)
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // variant 1 (10xxxxxx)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Generates a NanoID using CSPRNG with unbiased rejection sampling.
 */
export function generateNanoId(
  size = 21,
  alphabet = DEFAULT_NANOID_ALPHABET
): string {
  if (size <= 0) return '';
  const len = alphabet.length;
  if (len < 2 || len > 256) {
    throw new Error('Alphabet length must be between 2 and 256');
  }

  const mask = (2 << (31 - Math.clz32((len - 1) | 1))) - 1;
  const step = Math.ceil((1.6 * mask * size) / len);

  let id = '';
  while (id.length < size) {
    const bytes = new Uint8Array(step);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < bytes.length && id.length < size; i++) {
      const idx = bytes[i] & mask;
      if (idx < len) {
        id += alphabet[idx];
      }
    }
  }
  return id;
}

/**
 * Generates a ULID (Universally Unique Lexicographically Sortable Identifier).
 * 26 Crockford Base32 characters: 10 chars timestamp + 16 chars randomness.
 */
export function generateUlid(timestampMs?: number): string {
  const ts = Math.floor(timestampMs ?? Date.now());

  // 10 chars timestamp (48-bit Big-Endian Crockford Base32)
  let timeStr = '';
  let time = ts;
  for (let i = 9; i >= 0; i--) {
    timeStr = ULID_CROCKFORD_ENCODING[time % 32] + timeStr;
    time = Math.floor(time / 32);
  }

  // 16 chars randomness (80-bit = 10 bytes)
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);
  let randStr = '';

  for (let group = 0; group < 2; group++) {
    const offset = group * 5;
    const b0 = randomBytes[offset];
    const b1 = randomBytes[offset + 1];
    const b2 = randomBytes[offset + 2];
    const b3 = randomBytes[offset + 3];
    const b4 = randomBytes[offset + 4];

    randStr += ULID_CROCKFORD_ENCODING[(b0 >> 3) & 31];
    randStr += ULID_CROCKFORD_ENCODING[((b0 << 2) | (b1 >> 6)) & 31];
    randStr += ULID_CROCKFORD_ENCODING[(b1 >> 1) & 31];
    randStr += ULID_CROCKFORD_ENCODING[((b1 << 4) | (b2 >> 4)) & 31];
    randStr += ULID_CROCKFORD_ENCODING[((b2 << 1) | (b3 >> 7)) & 31];
    randStr += ULID_CROCKFORD_ENCODING[(b3 >> 2) & 31];
    randStr += ULID_CROCKFORD_ENCODING[((b3 << 3) | (b4 >> 5)) & 31];
    randStr += ULID_CROCKFORD_ENCODING[b4 & 31];
  }

  return timeStr + randStr;
}

/**
 * Generates batches of IDs with customizable options.
 */
export function generateIdBatch(options: IdOptions = {}): string[] {
  const {
    type = 'uuid-v4',
    count = 5,
    uppercase = false,
    noHyphens = false,
    nanoLength = 21,
    nanoAlphabet = DEFAULT_NANOID_ALPHABET,
  } = options;

  const boundedCount = Math.max(1, Math.min(count, 100));
  const results: string[] = [];

  for (let i = 0; i < boundedCount; i++) {
    let id = '';
    switch (type) {
      case 'uuid-v7':
        id = generateUuidV7();
        break;
      case 'nanoid':
        id = generateNanoId(nanoLength, nanoAlphabet);
        break;
      case 'ulid':
        id = generateUlid();
        break;
      case 'uuid-v4':
      default:
        id = generateUuidV4();
        break;
    }

    if (noHyphens && (type === 'uuid-v4' || type === 'uuid-v7')) {
      id = id.replace(/-/g, '');
    }

    results.push(uppercase ? id.toUpperCase() : id.toLowerCase());
  }

  return results;
}

/**
 * Legacy wrapper for backward compatibility with existing tests
 */
export function generateUuidBatch(count: number, uppercase = false): string[] {
  return generateIdBatch({ type: 'uuid-v4', count, uppercase });
}
