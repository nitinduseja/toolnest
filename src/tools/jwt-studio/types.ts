export type JwtAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'none';

export interface JwtHeader {
  alg: JwtAlgorithm;
  typ: string;
  [key: string]: unknown;
}

export interface JwtPayload {
  sub?: string;
  name?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export interface JwtPreset {
  id: string;
  name: string;
  description: string;
  header: JwtHeader;
  payload: JwtPayload;
  secret: string;
}

export interface JwtVerificationResult {
  isValid: boolean;
  isExpired: boolean;
  message: string;
  expirationTime?: string;
}
