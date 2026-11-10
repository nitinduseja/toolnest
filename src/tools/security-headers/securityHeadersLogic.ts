import {
  CspDirectives,
  HstsConfig,
  SecurityHeadersConfig,
  SecurityAudit,
  ServerTarget,
  SecurityPreset,
  SecurityGrade,
} from './types';

export function buildCspHeader(csp: CspDirectives): string {
  const directives: string[] = [];
  if (csp.defaultSrc.length) directives.push(`default-src ${csp.defaultSrc.join(' ')}`);
  if (csp.scriptSrc.length) directives.push(`script-src ${csp.scriptSrc.join(' ')}`);
  if (csp.styleSrc.length) directives.push(`style-src ${csp.styleSrc.join(' ')}`);
  if (csp.imgSrc.length) directives.push(`img-src ${csp.imgSrc.join(' ')}`);
  if (csp.connectSrc.length) directives.push(`connect-src ${csp.connectSrc.join(' ')}`);
  if (csp.frameAncestors.length) directives.push(`frame-ancestors ${csp.frameAncestors.join(' ')}`);
  if (csp.upgradeInsecure) directives.push('upgrade-insecure-requests');
  return directives.join('; ');
}

export function buildHstsHeader(hsts: HstsConfig): string {
  if (!hsts.enabled) return '';
  const parts = [`max-age=${hsts.maxAge}`];
  if (hsts.includeSubDomains) parts.push('includeSubDomains');
  if (hsts.preload) parts.push('preload');
  return parts.join('; ');
}

function calculateGrade(score: number): SecurityGrade {
  if (score >= 95) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 45) return 'C';
  return 'F';
}

export function evaluateSecurityScore(config: SecurityHeadersConfig): SecurityAudit {
  let score = 20; // baseline
  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (config.hsts.enabled) {
    score += 25;
    if (config.hsts.preload) score += 5;
  } else {
    warnings.push('HSTS is disabled. Connections can be downgraded to HTTP.');
  }

  if (config.xContentTypeOptions) score += 15;
  else warnings.push('Missing X-Content-Type-Options: nosniff.');

  if (config.xFrameOptions !== 'OFF') score += 15;
  else warnings.push('Clickjacking protection (X-Frame-Options) is OFF.');

  if (config.csp.defaultSrc.length > 0) {
    score += 15;
    if (config.csp.scriptSrc.includes("'unsafe-inline'")) {
      warnings.push("CSP uses 'unsafe-inline' scripts, vulnerable to XSS.");
      score -= 10;
    }
    if (config.csp.scriptSrc.includes("'unsafe-eval'")) {
      warnings.push("CSP uses 'unsafe-eval', allowing eval() execution.");
      score -= 15;
    }
  } else {
    warnings.push('Content-Security-Policy has no default-src fallback.');
  }

  if (config.referrerPolicy) score += 5;

  const boundedScore = Math.max(0, Math.min(100, score));
  return {
    score: boundedScore,
    grade: calculateGrade(boundedScore),
    warnings,
    recommendations,
  };
}

export function getHeadersMap(config: SecurityHeadersConfig): Record<string, string> {
  const map: Record<string, string> = {};
  const csp = buildCspHeader(config.csp);
  if (csp) map['Content-Security-Policy'] = csp;
  const hsts = buildHstsHeader(config.hsts);
  if (hsts) map['Strict-Transport-Security'] = hsts;
  if (config.xContentTypeOptions) map['X-Content-Type-Options'] = 'nosniff';
  if (config.xFrameOptions !== 'OFF') map['X-Frame-Options'] = config.xFrameOptions;
  if (config.referrerPolicy) map['Referrer-Policy'] = config.referrerPolicy;
  if (config.permissionsPolicy) map['Permissions-Policy'] = config.permissionsPolicy;
  return map;
}

export function generateServerSnippets(
  config: SecurityHeadersConfig,
  target: ServerTarget
): string {
  const headers = getHeadersMap(config);
  const entries = Object.entries(headers);

  switch (target) {
    case 'nginx':
      return entries.map(([k, v]) => `add_header ${k} "${v}" always;`).join('\n');
    case 'apache':
      return entries.map(([k, v]) => `Header always set ${k} "${v}"`).join('\n');
    case 'netlify':
      return `/*\n${entries.map(([k, v]) => `  ${k}: ${v}`).join('\n')}`;
    case 'cloudflare':
      return `const headers = {\n${entries.map(([k, v]) => `  "${k}": "${v}",`).join('\n')}\n};`;
    default:
      return entries.map(([k, v]) => `${k}: ${v}`).join('\n');
  }
}

export function createDefaultConfig(): SecurityHeadersConfig {
  return {
    csp: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:'],
      frameAncestors: ["'none'"],
      upgradeInsecure: true,
    },
    hsts: {
      enabled: true,
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    xFrameOptions: 'DENY',
    xContentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
  };
}

export const SECURITY_PRESETS: SecurityPreset[] = [
  {
    id: 'strict-production',
    name: 'Strict Production (A+)',
    description: 'Hardened zero-trust policy for secure web apps and banking portals.',
    config: {
      csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'https:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecure: true,
      },
      hsts: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      xFrameOptions: 'DENY',
      xContentTypeOptions: true,
      referrerPolicy: 'no-referrer',
      permissionsPolicy: 'camera=(), microphone=(), geolocation=(), payment=()',
    },
  },
  {
    id: 'modern-spa',
    name: 'Modern Web SPA (A)',
    description: 'Balanced for React/Vite SPAs with CDN fonts, analytics, and images.',
    config: {
      csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'https:', 'wss:'],
        frameAncestors: ["'none'"],
        upgradeInsecure: true,
      },
      hsts: {
        enabled: true,
        maxAge: 15768000,
        includeSubDomains: true,
        preload: false,
      },
      xFrameOptions: 'SAMEORIGIN',
      xContentTypeOptions: true,
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: 'camera=(), microphone=()',
    },
  },
  {
    id: 'api-only',
    name: 'REST / GraphQL API',
    description: 'Header configuration tailored for headless API backends.',
    config: {
      csp: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'none'"],
        styleSrc: ["'none'"],
        imgSrc: ["'none'"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecure: true,
      },
      hsts: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      xFrameOptions: 'DENY',
      xContentTypeOptions: true,
      referrerPolicy: 'no-referrer',
      permissionsPolicy: '',
    },
  },
];
