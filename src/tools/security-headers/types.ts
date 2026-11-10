export interface CspDirectives {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  connectSrc: string[];
  frameAncestors: string[];
  upgradeInsecure: boolean;
}

export interface HstsConfig {
  enabled: boolean;
  maxAge: number;
  includeSubDomains: boolean;
  preload: boolean;
}

export interface SecurityHeadersConfig {
  csp: CspDirectives;
  hsts: HstsConfig;
  xFrameOptions: 'DENY' | 'SAMEORIGIN' | 'OFF';
  xContentTypeOptions: boolean;
  referrerPolicy: string;
  permissionsPolicy: string;
}

export type SecurityGrade = 'A+' | 'A' | 'B' | 'C' | 'F';

export interface SecurityAudit {
  grade: SecurityGrade;
  score: number; // 0 to 100
  warnings: string[];
  recommendations: string[];
}

export type ServerTarget = 'raw' | 'nginx' | 'apache' | 'netlify' | 'cloudflare';

export interface SecurityPreset {
  id: string;
  name: string;
  description: string;
  config: SecurityHeadersConfig;
}
