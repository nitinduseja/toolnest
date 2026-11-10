import { JwtAlgorithm, JwtHeader, JwtPayload, JwtVerificationResult, JwtPreset } from './types';

export function stringToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlToString(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function getSubtleHashName(alg: JwtAlgorithm): string {
  switch (alg) {
    case 'HS384':
      return 'SHA-384';
    case 'HS512':
      return 'SHA-512';
    default:
      return 'SHA-256';
  }
}

export async function createHmacSignature(
  data: string,
  secret: string,
  alg: JwtAlgorithm
): Promise<string> {
  if (alg === 'none' || !secret) return '';
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return 'mock-sig';

  const enc = new TextEncoder();
  const key = await subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: { name: getSubtleHashName(alg) } },
    false,
    ['sign']
  );
  const signatureBuffer = await subtle.sign('HMAC', key, enc.encode(data));
  return bufferToBase64Url(signatureBuffer);
}

export async function signJwt(
  header: JwtHeader,
  payload: JwtPayload,
  secret: string
): Promise<string> {
  const encodedHeader = stringToBase64Url(JSON.stringify(header));
  const encodedPayload = stringToBase64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  if (header.alg === 'none') {
    return `${signingInput}.`;
  }
  const signature = await createHmacSignature(signingInput, secret, header.alg);
  return `${signingInput}.${signature}`;
}

export async function verifyJwt(token: string, secret: string): Promise<JwtVerificationResult> {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return {
      isValid: false,
      isExpired: false,
      message: 'Invalid JWT format (must have 3 dot-separated parts)',
    };
  }
  const [headerB64, payloadB64, signature] = parts;
  try {
    const header = JSON.parse(base64UrlToString(headerB64)) as JwtHeader;
    const payload = JSON.parse(base64UrlToString(payloadB64)) as JwtPayload;

    const isExpired = payload.exp ? Date.now() >= payload.exp * 1000 : false;
    const expTime = payload.exp ? new Date(payload.exp * 1000).toLocaleString() : undefined;

    if (header.alg === 'none') {
      return {
        isValid: !signature,
        isExpired,
        expirationTime: expTime,
        message: isExpired ? 'Token Expired' : 'Valid (alg: none)',
      };
    }

    const expectedSig = await createHmacSignature(`${headerB64}.${payloadB64}`, secret, header.alg);
    const isValid = signature === expectedSig;
    const message = !isValid
      ? 'Invalid Signature'
      : isExpired
        ? 'Valid Signature (Expired)'
        : 'Signature Verified';

    return { isValid, isExpired, expirationTime: expTime, message };
  } catch {
    return { isValid: false, isExpired: false, message: 'Failed to decode token JSON' };
  }
}

export const JWT_PRESETS: JwtPreset[] = [
  {
    id: 'admin-auth',
    name: 'Admin Session',
    description: 'Privileged user session with roles and 1-hour expiration.',
    header: { alg: 'HS256', typ: 'JWT' },
    payload: {
      sub: 'usr_9812401',
      name: 'Alex Mercer',
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    secret: 'super-secret-jwt-signing-key-toolnest',
  },
  {
    id: 'microservice-auth',
    name: 'Service-to-Service M2M',
    description: 'Internal API token with client credentials and scopes.',
    header: { alg: 'HS256', typ: 'JWT' },
    payload: {
      iss: 'auth.platform.internal',
      aud: 'payments.service.internal',
      scope: 'read:transactions write:charges',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7200,
    },
    secret: 'm2m-cluster-secret-key-prod',
  },
];
