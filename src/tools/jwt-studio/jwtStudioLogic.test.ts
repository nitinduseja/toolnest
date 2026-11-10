import { describe, it, expect } from 'vitest';
import {
  stringToBase64Url,
  base64UrlToString,
  signJwt,
  verifyJwt,
  JWT_PRESETS,
} from './jwtStudioLogic';
import { JwtHeader, JwtPayload } from './types';

describe('jwtStudioLogic', () => {
  it('correctly encodes and decodes Base64Url strings without padding', () => {
    const raw = '{"alg":"HS256","typ":"JWT"}';
    const encoded = stringToBase64Url(raw);
    expect(encoded).not.toContain('=');
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(base64UrlToString(encoded)).toBe(raw);
  });

  it('signs and verifies a valid HS256 token', async () => {
    const header: JwtHeader = { alg: 'HS256', typ: 'JWT' };
    const payload: JwtPayload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };
    const secret = 'test-secret-key';

    const token = await signJwt(header, payload, secret);
    expect(token.split('.').length).toBe(3);

    const result = await verifyJwt(token, secret);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe('Signature Verified');
  });

  it('detects signature mismatch when secret differs', async () => {
    const header: JwtHeader = { alg: 'HS256', typ: 'JWT' };
    const payload: JwtPayload = { sub: 'user_1' };
    const token = await signJwt(header, payload, 'secret-A');

    const result = await verifyJwt(token, 'wrong-secret-B');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Invalid Signature');
  });

  it('detects expired tokens correctly', async () => {
    const header: JwtHeader = { alg: 'HS256', typ: 'JWT' };
    const payload: JwtPayload = {
      sub: 'expired_user',
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour in the past
    };
    const secret = 'secret-key';
    const token = await signJwt(header, payload, secret);

    const result = await verifyJwt(token, secret);
    expect(result.isValid).toBe(true);
    expect(result.isExpired).toBe(true);
    expect(result.message).toContain('Expired');
  });

  it('supports algorithm "none"', async () => {
    const header: JwtHeader = { alg: 'none', typ: 'JWT' };
    const payload: JwtPayload = { sub: 'guest' };
    const token = await signJwt(header, payload, '');
    expect(token.endsWith('.')).toBe(true);

    const result = await verifyJwt(token, '');
    expect(result.isValid).toBe(true);
  });

  it('validates pre-configured presets', async () => {
    for (const preset of JWT_PRESETS) {
      const token = await signJwt(preset.header, preset.payload, preset.secret);
      expect(token).toBeTruthy();
      const verification = await verifyJwt(token, preset.secret);
      expect(verification.isValid).toBe(true);
    }
  });
});
