import { describe, it, expect } from 'vitest';
import {
  decodeBase64Url,
  encodeBase64Url,
  parseJwt,
  formatRelativeTime,
  getSampleJwt,
} from './jwtLogic';

describe('jwtLogic', () => {
  describe('encodeBase64Url and decodeBase64Url', () => {
    it('roundtrips ASCII and UTF-8 strings accurately', () => {
      const original = 'Hello World! 🚀 Toolnest 2026';
      const encoded = encodeBase64Url(original);
      expect(encoded).not.toContain('+');
      expect(encoded).not.toContain('/');
      expect(encoded).not.toContain('=');
      expect(decodeBase64Url(encoded)).toBe(original);
    });
  });

  describe('formatRelativeTime', () => {
    it('formats future expiration correctly', () => {
      const nowMs = 1700000000000;
      const targetSec = 1700000000 + 3600 * 2; // 2 hours in future
      expect(formatRelativeTime(targetSec, nowMs)).toBe('Expires in 2h');
    });

    it('formats past expiration correctly', () => {
      const nowMs = 1700000000000;
      const targetSec = 1700000000 - 86400 * 3; // 3 days in past
      expect(formatRelativeTime(targetSec, nowMs)).toBe('Expired 3d ago');
    });
  });

  describe('parseJwt', () => {
    it('returns error when token is empty', () => {
      const result = parseJwt('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Please enter a JWT');
    });

    it('returns error when token does not have 3 parts', () => {
      const result = parseJwt('partOne.partTwo');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Expected 3 dot-separated parts');
    });

    it('returns error when payload is not valid JSON', () => {
      const header = encodeBase64Url('{"alg":"HS256"}');
      const badPayload = encodeBase64Url('not-json');
      const result = parseJwt(`${header}.${badPayload}.signature`);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('parses valid active JWT correctly with standard claims', () => {
      const nowMs = 1700000000000;
      const header = { alg: 'RS256', typ: 'JWT' };
      const payload = {
        sub: 'user_123',
        iss: 'https://auth.example.com',
        aud: 'api.example.com',
        iat: 1700000000 - 100,
        exp: 1700000000 + 3600,
      };

      const token = `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(
        JSON.stringify(payload)
      )}.dummySignature`;

      const result = parseJwt(token, nowMs);
      expect(result.valid).toBe(true);
      expect(result.header?.alg).toBe('RS256');
      expect(result.payload?.sub).toBe('user_123');
      expect(result.claimsSummary?.isExpired).toBe(false);
      expect(result.claimsSummary?.issuer).toBe('https://auth.example.com');
      expect(result.claimsSummary?.subject).toBe('user_123');
    });

    it('identifies expired JWTs', () => {
      const nowMs = 1700000000000;
      const header = { alg: 'HS256' };
      const payload = {
        sub: 'user_expired',
        exp: 1700000000 - 500, // already expired
      };

      const token = `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(
        JSON.stringify(payload)
      )}.sig`;

      const result = parseJwt(token, nowMs);
      expect(result.valid).toBe(true);
      expect(result.claimsSummary?.isExpired).toBe(true);
      expect(result.claimsSummary?.timeRemainingText).toContain('Expired');
    });
  });

  describe('getSampleJwt', () => {
    it('produces a valid parseable token', () => {
      const sample = getSampleJwt();
      const parsed = parseJwt(sample);
      expect(parsed.valid).toBe(true);
      expect(parsed.header?.alg).toBe('HS256');
      expect(parsed.payload?.sub).toBe('usr_981247612');
    });
  });
});
