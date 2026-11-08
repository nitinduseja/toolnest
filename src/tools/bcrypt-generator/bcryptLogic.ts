import bcrypt from 'bcryptjs';
import {
  BcryptHashResult,
  BcryptParsedDetails,
  BcryptVerifyResult,
  CostBenchmarkItem,
} from './types';

export function parseBcryptHash(hashStr: string): BcryptParsedDetails {
  const hash = (hashStr || '').trim();
  const match = hash.match(/^\$(2[abxy])\$(\d{2})\$([A-Za-z0-9./]{22})([A-Za-z0-9./]{31})$/);
  if (!match) {
    return { valid: false };
  }
  return {
    valid: true,
    algorithm: `$${match[1]}$`,
    rounds: parseInt(match[2], 10),
    salt: match[3],
    checksum: match[4],
  };
}

export async function generateBcryptHash(password: string, rounds = 10): Promise<BcryptHashResult> {
  const startTime = performance.now();
  const salt = await bcrypt.genSalt(rounds);
  const hash = await bcrypt.hash(password, salt);
  const durationMs = Math.round(performance.now() - startTime);

  const parsed = parseBcryptHash(hash);
  return {
    hash,
    rounds,
    salt: parsed.salt || salt,
    durationMs,
    algorithm: parsed.algorithm || '$2a$',
  };
}

export async function verifyBcryptHash(
  password: string,
  hashStr: string
): Promise<BcryptVerifyResult> {
  const hash = (hashStr || '').trim();
  const details = parseBcryptHash(hash);

  if (!details.valid) {
    return {
      valid: false,
      details,
      durationMs: 0,
      message: 'Invalid bcrypt hash format. Must match $2a$ or $2b$ pattern.',
    };
  }

  const startTime = performance.now();
  const valid = await bcrypt.compare(password, hash);
  const durationMs = Math.round(performance.now() - startTime);

  return {
    valid,
    details,
    durationMs,
    message: valid
      ? 'Password matches the bcrypt hash successfully!'
      : 'Password does not match this hash.',
  };
}

export async function runCostBenchmark(
  password = 'TestPassword123!',
  roundsList = [4, 6, 8, 10]
): Promise<CostBenchmarkItem[]> {
  const results: CostBenchmarkItem[] = [];

  for (const rounds of roundsList) {
    const startTime = performance.now();
    await bcrypt.hash(password, rounds);
    const durationMs = Math.round(performance.now() - startTime);

    let securityLevel: CostBenchmarkItem['securityLevel'] = 'Insecure';
    if (rounds >= 12) securityLevel = 'High Security';
    else if (rounds >= 10) securityLevel = 'Recommended';
    else if (rounds >= 6) securityLevel = 'Fast / Dev';

    results.push({
      rounds,
      durationMs,
      iterations: Math.pow(2, rounds),
      securityLevel,
    });
  }

  return results;
}
