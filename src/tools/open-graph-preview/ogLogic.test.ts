import { describe, it, expect } from 'vitest';
import {
  calculateTitleScore,
  calculateDescriptionScore,
  generateMetaHtml,
  OG_PRESETS,
} from './ogLogic';

describe('ogLogic', () => {
  describe('calculateTitleScore', () => {
    it('marks short titles as too-short', () => {
      const res = calculateTitleScore('Short');
      expect(res.status).toBe('too-short');
      expect(res.length).toBe(5);
    });

    it('marks optimal titles between 30 and 60 chars', () => {
      const res = calculateTitleScore('Toolnest — Useful tools in one single workspace');
      expect(res.status).toBe('optimal');
    });

    it('marks long titles as too-long', () => {
      const longTitle = 'A'.repeat(70);
      const res = calculateTitleScore(longTitle);
      expect(res.status).toBe('too-long');
    });
  });

  describe('calculateDescriptionScore', () => {
    it('marks short description as too-short', () => {
      const res = calculateDescriptionScore('Too short');
      expect(res.status).toBe('too-short');
    });

    it('marks optimal description between 50 and 160 chars', () => {
      const desc =
        'Toolnest is an open-source, privacy-first developer workbench providing essential utilities, converters, and formatters.';
      const res = calculateDescriptionScore(desc);
      expect(res.status).toBe('optimal');
    });

    it('marks long description as too-long', () => {
      const longDesc = 'B'.repeat(180);
      const res = calculateDescriptionScore(longDesc);
      expect(res.status).toBe('too-long');
    });
  });

  describe('generateMetaHtml', () => {
    it('generates standard, og, twitter, and json-ld tags', () => {
      const preset = OG_PRESETS[0];
      const html = generateMetaHtml(preset.config, true);

      expect(html).toContain('<title>Toolnest — Useful tools. One workspace.</title>');
      expect(html).toContain('<meta property="og:title"');
      expect(html).toContain('<meta property="og:image"');
      expect(html).toContain('<meta property="twitter:card"');
      expect(html).toContain('<script type="application/ld+json">');
    });

    it('can exclude json-ld structured data', () => {
      const preset = OG_PRESETS[0];
      const html = generateMetaHtml(preset.config, false);

      expect(html).not.toContain('<script type="application/ld+json">');
    });
  });
});
