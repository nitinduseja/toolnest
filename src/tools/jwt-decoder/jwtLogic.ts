/**
 * Pure domain logic for decoding and inspecting JSON Web Tokens (JWT).
 * RFC 7519 compliant client-side token parsing without network dependencies.
 */

export interface JwtClaimsSummary {
  issuer?: string;
  subject?: string;
  audience?: string | string[];
  expirationDate?: Date;
  issuedAtDate?: Date;
  notBeforeDate?: Date;
  isExpired: boolean;
  timeRemainingText?: string;
}

export interface ParsedJwtResult {
  valid: boolean;
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  rawHeader: string;
  rawPayload: string;
  claimsSummary: JwtClaimsSummary | null;
  error: string | null;
}

/**
 * Decodes a Base64URL-encoded string into a UTF-8 string.
 */
export function decodeBase64Url(base64UrlStr: string): string {
  let base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new TextDecoder().decode(bytes);
}

/**
 * Encodes a UTF-8 string into a Base64URL string.
 */
export function encodeBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Human-readable relative time string for expiration claims.
 */
export function formatRelativeTime(targetSec: number, nowMs = Date.now()): string {
  const diffSec = Math.round(targetSec - nowMs / 1000);
  const isPast = diffSec < 0;
  const absSec = Math.abs(diffSec);

  let intervalStr = `${absSec}s`;
  if (absSec >= 86400) {
    intervalStr = `${Math.floor(absSec / 86400)}d`;
  } else if (absSec >= 3600) {
    intervalStr = `${Math.floor(absSec / 3600)}h`;
  } else if (absSec >= 60) {
    intervalStr = `${Math.floor(absSec / 60)}m`;
  }

  return isPast ? `Expired ${intervalStr} ago` : `Expires in ${intervalStr}`;
}

function extractClaimsSummary(
  payload: Record<string, unknown>,
  nowMs = Date.now()
): JwtClaimsSummary {
  const exp = typeof payload.exp === 'number' ? payload.exp : undefined;
  const iat = typeof payload.iat === 'number' ? payload.iat : undefined;
  const nbf = typeof payload.nbf === 'number' ? payload.nbf : undefined;

  const isExpired = exp !== undefined ? nowMs >= exp * 1000 : false;
  const timeRemainingText = exp !== undefined ? formatRelativeTime(exp, nowMs) : undefined;

  return {
    issuer: typeof payload.iss === 'string' ? payload.iss : undefined,
    subject: typeof payload.sub === 'string' ? payload.sub : undefined,
    audience:
      typeof payload.aud === 'string' || Array.isArray(payload.aud)
        ? (payload.aud as string | string[])
        : undefined,
    expirationDate: exp ? new Date(exp * 1000) : undefined,
    issuedAtDate: iat ? new Date(iat * 1000) : undefined,
    notBeforeDate: nbf ? new Date(nbf * 1000) : undefined,
    isExpired,
    timeRemainingText,
  };
}

/**
 * Parses and inspects a JWT string without external network calls.
 */
export function parseJwt(token: string, nowMs = Date.now()): ParsedJwtResult {
  const trimmed = token.trim();
  if (!trimmed) {
    return {
      valid: false,
      header: null,
      payload: null,
      signature: '',
      rawHeader: '',
      rawPayload: '',
      claimsSummary: null,
      error: 'Please enter a JWT token string.',
    };
  }

  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    return {
      valid: false,
      header: null,
      payload: null,
      signature: '',
      rawHeader: '',
      rawPayload: '',
      claimsSummary: null,
      error: `Invalid JWT format. Expected 3 dot-separated parts, found ${parts.length}.`,
    };
  }

  try {
    const rawHeader = decodeBase64Url(parts[0]);
    const rawPayload = decodeBase64Url(parts[1]);
    const header = JSON.parse(rawHeader) as Record<string, unknown>;
    const payload = JSON.parse(rawPayload) as Record<string, unknown>;
    const claimsSummary = extractClaimsSummary(payload, nowMs);

    return {
      valid: true,
      header,
      payload,
      signature: parts[2],
      rawHeader,
      rawPayload,
      claimsSummary,
      error: null,
    };
  } catch (err: unknown) {
    return {
      valid: false,
      header: null,
      payload: null,
      signature: parts[2] || '',
      rawHeader: '',
      rawPayload: '',
      claimsSummary: null,
      error: err instanceof Error ? err.message : 'Failed to decode JWT base64/JSON payload.',
    };
  }
}

/**
 * Returns a realistic sample JWT for quick testing.
 */
export function getSampleJwt(): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: 'usr_981247612',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'administrator',
    iss: 'https://auth.toolnest.dev',
    aud: 'https://api.toolnest.dev',
    iat: Math.floor(Date.now() / 1000) - 3600,
    exp: Math.floor(Date.now() / 1000) + 86400 * 7,
  };

  const headerB64 = encodeBase64Url(JSON.stringify(header));
  const payloadB64 = encodeBase64Url(JSON.stringify(payload));
  const mockSig = 'wW1Tf19c96oT_P5Dk3W11bS9X-eO22mO0g7b6H-4sK8';

  return `${headerB64}.${payloadB64}.${mockSig}`;
}
