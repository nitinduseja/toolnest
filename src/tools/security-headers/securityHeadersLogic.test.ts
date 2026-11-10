import { describe, it, expect } from 'vitest';
import {
  buildCspHeader,
  buildHstsHeader,
  evaluateSecurityScore,
  generateServerSnippets,
  createDefaultConfig,
  SECURITY_PRESETS,
} from './securityHeadersLogic';
import { SecurityHeadersConfig } from './types';

describe('securityHeadersLogic', () => {
  it('builds Content-Security-Policy header correctly', () => {
    const config = createDefaultConfig();
    const csp = buildCspHeader(config.csp);
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('builds HSTS header string with options', () => {
    const config = createDefaultConfig();
    const hsts = buildHstsHeader(config.hsts);
    expect(hsts).toBe('max-age=31536000; includeSubDomains; preload');
  });

  it('evaluates security score with A+ for strict configuration', () => {
    const strictPreset = SECURITY_PRESETS[0];
    const audit = evaluateSecurityScore(strictPreset.config);
    expect(audit.grade).toBe('A+');
    expect(audit.score).toBeGreaterThanOrEqual(95);
    expect(audit.warnings.length).toBe(0);
  });

  it('flags unsafe-inline scripts with warnings and reduces score', () => {
    const config: SecurityHeadersConfig = {
      ...createDefaultConfig(),
      csp: {
        ...createDefaultConfig().csp,
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    };
    const audit = evaluateSecurityScore(config);
    expect(audit.warnings.some((w) => w.includes('unsafe-inline'))).toBe(true);
  });

  it('generates server configuration snippets for Nginx, Apache, and Netlify', () => {
    const config = createDefaultConfig();
    const nginx = generateServerSnippets(config, 'nginx');
    expect(nginx).toContain('add_header Content-Security-Policy');
    expect(nginx).toContain('always;');

    const apache = generateServerSnippets(config, 'apache');
    expect(apache).toContain('Header always set Content-Security-Policy');

    const netlify = generateServerSnippets(config, 'netlify');
    expect(netlify).toContain('/*\n');
  });
});
