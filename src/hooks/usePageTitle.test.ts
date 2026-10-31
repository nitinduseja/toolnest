import { describe, it, expect } from 'vitest';
import { getPageTitle, HOME_TITLE } from './usePageTitle';

describe('usePageTitle & getPageTitle', () => {
  it('returns canonical tagline for root path', () => {
    expect(getPageTitle('/')).toBe(HOME_TITLE);
  });

  it('returns All Tools for /tools', () => {
    expect(getPageTitle('/tools')).toBe('All Tools | Toolnest');
  });

  it('returns formatted tool name for valid tool route', () => {
    expect(getPageTitle('/tools/json-formatter')).toBe('JSON Formatter & Validator | Toolnest');
    expect(getPageTitle('/tools/uuid-generator')).toBe('UUID Generator | Toolnest');
    expect(getPageTitle('/tools/base64')).toBe('Base64 Encoder / Decoder | Toolnest');
    expect(getPageTitle('/tools/jwt-decoder')).toBe('JWT Decoder & Inspector | Toolnest');
    expect(getPageTitle('/tools/markdown-previewer')).toBe(
      'Markdown Previewer & Editor | Toolnest'
    );
    expect(getPageTitle('/tools/cron-parser')).toBe(
      'Cron Expression Parser & Humanizer | Toolnest'
    );
    expect(getPageTitle('/tools/glassmorphism-generator')).toBe(
      'CSS Glassmorphism & Box-Shadow Generator | Toolnest'
    );
    expect(getPageTitle('/tools/sql-formatter')).toBe('SQL Formatter & Beautifier | Toolnest');
  });

  it('returns Tool Not Found for unknown tool route', () => {
    expect(getPageTitle('/tools/non-existent-tool')).toBe('Tool Not Found | Toolnest');
  });

  it('returns category name for valid category route', () => {
    expect(getPageTitle('/categories/developer-tools')).toBe('Developer Tools | Toolnest');
    expect(getPageTitle('/categories/math-converters')).toBe('Math & Converters | Toolnest');
  });

  it('returns Category Not Found for unknown category route', () => {
    expect(getPageTitle('/categories/invalid-category')).toBe('Category Not Found | Toolnest');
  });

  it('returns descriptive titles for system pages', () => {
    expect(getPageTitle('/favorites')).toBe('Starred Favorites | Toolnest');
    expect(getPageTitle('/recent')).toBe('Recent History | Toolnest');
    expect(getPageTitle('/settings')).toBe('Settings & Preferences | Toolnest');
  });

  it('returns Page Not Found for invalid routes', () => {
    expect(getPageTitle('/random/path/not/found')).toBe('Page Not Found | Toolnest');
  });
});
