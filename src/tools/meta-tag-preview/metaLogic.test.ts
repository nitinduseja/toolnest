import { describe, it, expect } from 'vitest';
import {
  generateMetaHtml,
  calculateLengthStatus,
  extractHostname,
  DEFAULT_META_CONFIG,
} from './metaLogic';

describe('metaLogic', () => {
  it('generates complete HTML meta tag markup', () => {
    const html = generateMetaHtml(DEFAULT_META_CONFIG);
    expect(html).toContain('<title>Toolnest — Modern Privacy-First Developer Toolbox</title>');
    expect(html).toContain(
      '<meta property="og:title" content="Toolnest — Modern Privacy-First Developer Toolbox" />'
    );
    expect(html).toContain('<meta property="og:type" content="website" />');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(html).toContain('<meta name="twitter:creator" content="@toolnestdev" />');
    expect(html).toContain('<link rel="canonical" href="https://toolnest.dev" />');
  });

  it('calculates length status boundaries correctly', () => {
    const optimal = calculateLengthStatus('Hello World, this is an optimal title text', 10, 60);
    expect(optimal.isOptimal).toBe(true);
    expect(optimal.isTooLong).toBe(false);

    const tooLong = calculateLengthStatus('A'.repeat(70), 10, 60);
    expect(tooLong.isTooLong).toBe(true);
    expect(tooLong.isOptimal).toBe(false);

    const tooShort = calculateLengthStatus('Hi', 10, 60);
    expect(tooShort.isTooShort).toBe(true);
  });

  it('extracts hostname safely', () => {
    expect(extractHostname('https://toolnest.dev/tools/regex')).toBe('toolnest.dev');
    expect(extractHostname('not a url')).toBe('example.com');
  });
});
