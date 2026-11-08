export interface BcryptHashResult {
  hash: string;
  rounds: number;
  salt: string;
  durationMs: number;
  algorithm: string;
}

export interface BcryptParsedDetails {
  valid: boolean;
  algorithm?: string;
  rounds?: number;
  salt?: string;
  checksum?: string;
}

export interface BcryptVerifyResult {
  valid: boolean;
  details: BcryptParsedDetails;
  durationMs: number;
  message: string;
}

export interface CostBenchmarkItem {
  rounds: number;
  durationMs: number;
  iterations: number;
  securityLevel: 'Insecure' | 'Fast / Dev' | 'Recommended' | 'High Security';
}
