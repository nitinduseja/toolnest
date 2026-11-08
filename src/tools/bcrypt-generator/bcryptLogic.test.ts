import { describe, it, expect } from 'vitest';
import {
  generateBcryptHash,
  verifyBcryptHash,
  parseBcryptHash,
  runCostBenchmark,
} from './bcryptLogic';

describe('bcryptLogic', () => {
  it('parses valid bcrypt hash into algorithm, rounds, and salt', () => {
    const hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
    const parsed = parseBcryptHash(hash);

    expect(parsed.valid).toBe(true);
    expect(parsed.algorithm).toBe('$2a$');
    expect(parsed.rounds).toBe(10);
    expect(parsed.salt).toBe('N9qo8uLOickgx2ZMRZoMye');
  });

  it('handles invalid bcrypt hash string gracefully', () => {
    expect(parseBcryptHash('not-a-hash').valid).toBe(false);
    expect(parseBcryptHash('').valid).toBe(false);
  });

  it('generates a valid hash and verifies positive match', async () => {
    const password = 'SecretPassword987!';
    const result = await generateBcryptHash(password, 4);

    expect(result.hash).toMatch(/^\$2[ab]\$04\$/);
    expect(result.rounds).toBe(4);

    const matchRes = await verifyBcryptHash(password, result.hash);
    expect(matchRes.valid).toBe(true);
    expect(matchRes.message).toContain('matches');
  });

  it('fails verification on wrong password', async () => {
    const password = 'CorrectPassword123';
    const result = await generateBcryptHash(password, 4);

    const matchRes = await verifyBcryptHash('WrongPassword999', result.hash);
    expect(matchRes.valid).toBe(false);
    expect(matchRes.message).toContain('does not match');
  });

  it('runs benchmark across specified rounds', async () => {
    const benchmarks = await runCostBenchmark('benchTest', [4, 5]);

    expect(benchmarks.length).toBe(2);
    expect(benchmarks[0].rounds).toBe(4);
    expect(benchmarks[0].iterations).toBe(16);
    expect(benchmarks[1].rounds).toBe(5);
    expect(benchmarks[1].iterations).toBe(32);
  });
});
