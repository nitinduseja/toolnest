import { describe, it, expect } from 'vitest';
import {
  parseHex,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getRelativeLuminance,
  getContrastRatio,
} from './colorLogic';

describe('Color Converter Domain Logic', () => {
  it('converts 6-digit and 3-digit HEX colors to RGB', () => {
    expect(parseHex('#635BFF')).toEqual({ r: 99, g: 91, b: 255 });
    expect(parseHex('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex('000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('converts RGB to HEX accurately', () => {
    expect(rgbToHex(99, 91, 255)).toBe('#635BFF');
  });

  it('converts RGB to HSL and back round-trip', () => {
    const hsl = rgbToHsl(99, 91, 255);
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    expect(Math.abs(rgb.r - 99)).toBeLessThanOrEqual(1);
    expect(Math.abs(rgb.g - 91)).toBeLessThanOrEqual(1);
    expect(Math.abs(rgb.b - 255)).toBeLessThanOrEqual(1);
  });

  it('computes exact contrast ratios according to WCAG 2.2', () => {
    // Pure black (lum 0) on pure white (lum 1) is 21:1
    const whiteLum = getRelativeLuminance(255, 255, 255);
    const blackLum = getRelativeLuminance(0, 0, 0);
    expect(getContrastRatio(whiteLum, blackLum)).toBe(21);
  });

  it('throws on invalid hex formats', () => {
    expect(() => parseHex('#invalid')).toThrow();
  });
});
