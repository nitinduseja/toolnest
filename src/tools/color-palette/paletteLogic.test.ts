import { describe, it, expect } from 'vitest';
import {
  rgbToHex,
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  calculateLuminance,
  calculateContrastRatio,
  quantizePixels,
  generateHarmonies,
  exportPaletteAsCss,
  exportPaletteAsTailwind,
} from './paletteLogic';

describe('paletteLogic', () => {
  describe('color conversions (HEX <-> RGB <-> HSL)', () => {
    it('converts RGB to HEX correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(99, 91, 255)).toBe('#635bff');
    });

    it('converts HEX to RGB correctly for 3 and 6 digit strings', () => {
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('635bff')).toEqual({ r: 99, g: 91, b: 255 });
      expect(hexToRgb('invalid')).toBeNull();
    });

    it('round trips RGB to HSL and back', () => {
      const red = { r: 255, g: 0, b: 0 };
      const hslRed = rgbToHsl(red);
      expect(hslRed).toEqual({ h: 0, s: 100, l: 50 });
      expect(hslToRgb(hslRed)).toEqual(red);

      const green = { r: 0, g: 255, b: 0 };
      expect(rgbToHsl(green)).toEqual({ h: 120, s: 100, l: 50 });
    });
  });

  describe('WCAG luminance and contrast ratio calculations', () => {
    it('computes correct relative luminance', () => {
      expect(calculateLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1.0, 2);
      expect(calculateLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0.0, 2);
    });

    it('computes contrast ratio according to WCAG 2.1 specifications', () => {
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 0, g: 0, b: 0 };
      expect(calculateContrastRatio(white, black)).toBe(21);
      expect(calculateContrastRatio(white, white)).toBe(1);
    });
  });

  describe('quantizePixels', () => {
    it('extracts dominant colors from pixel buffer', () => {
      // 4 pixels: 2 red, 1 green, 1 transparent
      const buffer = new Uint8ClampedArray([
        255,
        0,
        0,
        255, // red
        255,
        0,
        0,
        255, // red
        0,
        255,
        0,
        255, // green
        0,
        0,
        0,
        0, // transparent (ignored)
      ]);

      const colors = quantizePixels(buffer, 3);
      expect(colors.length).toBeGreaterThanOrEqual(1);
      expect(colors[0].hex).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colors[0].contrastWhite).toBeGreaterThan(1);
      expect(colors[0].contrastBlack).toBeGreaterThan(1);
    });

    it('returns empty array when given empty pixel data', () => {
      expect(quantizePixels(new Uint8ClampedArray([]))).toEqual([]);
    });
  });

  describe('generateHarmonies', () => {
    it('generates complementary colors (180 degree shift)', () => {
      const harmonies = generateHarmonies('#ff0000', 'complementary');
      expect(harmonies).toHaveLength(2);
      expect(harmonies[0].label).toContain('Base');
      expect(harmonies[1].label).toContain('Complementary');
      // Red hue is 0, complement should be cyan/teal around 180
      expect(harmonies[1].hsl.h).toBe(180);
    });

    it('generates triadic color palette (3 colors at 120 degree intervals)', () => {
      const harmonies = generateHarmonies('#ff0000', 'triadic');
      expect(harmonies).toHaveLength(3);
      expect(harmonies[1].hsl.h).toBe(120);
      expect(harmonies[2].hsl.h).toBe(240);
    });

    it('generates monochromatic variants', () => {
      const harmonies = generateHarmonies('#635bff', 'monochromatic');
      expect(harmonies.length).toBe(5);
    });
  });

  describe('export functions', () => {
    it('formats colors as CSS variables', () => {
      const css = exportPaletteAsCss(['#ff0000', '#00ff00']);
      expect(css).toContain('--color-1: #ff0000;');
      expect(css).toContain('--color-2: #00ff00;');
    });

    it('formats colors as Tailwind theme configuration', () => {
      const tailwind = exportPaletteAsTailwind(['#635bff']);
      expect(tailwind).toContain("'brand-1': '#635bff'");
    });
  });
});
