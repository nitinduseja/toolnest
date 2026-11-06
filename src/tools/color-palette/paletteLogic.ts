import { RgbColor, HslColor, ExtractedColor, HarmonyMode, HarmonicColor } from './types';

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): RgbColor | null {
  const cleaned = hex.trim().replace(/^#/, '');
  if (!/^(?:[0-9a-fA-F]{3}){1,2}$/.test(cleaned)) return null;

  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }

  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
}

export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
      h = ((b - r) / delta + 2) * 60;
    } else {
      h = ((r - g) / delta + 4) * 60;
    }
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb(hsl: HslColor): RgbColor {
  const h = hsl.h % 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (h >= 0 && h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h >= 60 && h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h >= 120 && h < 180) [r1, g1, b1] = [0, c, x];
  else if (h >= 180 && h < 240) [r1, g1, b1] = [0, x, c];
  else if (h >= 240 && h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export function calculateLuminance(rgb: RgbColor): number {
  const transform = (val: number) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * transform(rgb.r) + 0.7152 * transform(rgb.g) + 0.0722 * transform(rgb.b);
}

export function calculateContrastRatio(rgb1: RgbColor, rgb2: RgbColor): number {
  const lum1 = calculateLuminance(rgb1);
  const lum2 = calculateLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

export function quantizePixels(pixelData: Uint8ClampedArray, maxColors = 6): ExtractedColor[] {
  const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  const totalPixels = Math.floor(pixelData.length / 4);
  if (totalPixels === 0) return [];

  // Downsample to increase speed while preserving color accuracy
  const step = Math.max(1, Math.floor(totalPixels / 10000)) * 4;

  for (let i = 0; i < pixelData.length; i += step) {
    const a = pixelData[i + 3];
    if (a < 128) continue; // Ignore transparent pixels

    // Quantize 8-bit to 5-bit color buckets
    const r = Math.round(pixelData[i] / 8) * 8;
    const g = Math.round(pixelData[i + 1] / 8) * 8;
    const b = Math.round(pixelData[i + 2] / 8) * 8;

    const key = `${r},${g},${b}`;
    const existing = buckets.get(key);
    if (existing) {
      existing.count++;
    } else {
      buckets.set(key, { r, g, b, count: 1 });
    }
  }

  const sorted = Array.from(buckets.values()).sort((a, b) => b.count - a.count);
  const totalCount = sorted.reduce((sum, item) => sum + item.count, 0) || 1;

  const whiteRgb: RgbColor = { r: 255, g: 255, b: 255 };
  const blackRgb: RgbColor = { r: 0, g: 0, b: 0 };

  // Filter distinct colors (minimum euclidean color distance)
  const distinct: ExtractedColor[] = [];
  for (const item of sorted) {
    if (distinct.length >= maxColors) break;

    const rgb: RgbColor = { r: item.r, g: item.g, b: item.b };
    const tooClose = distinct.some((d) => {
      const dr = d.rgb.r - rgb.r;
      const dg = d.rgb.g - rgb.g;
      const db = d.rgb.b - rgb.b;
      return Math.sqrt(dr * dr + dg * dg + db * db) < 38;
    });

    if (tooClose && distinct.length > 0) continue;

    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb);
    const lum = calculateLuminance(rgb);
    const isDark = lum < 0.2;
    const contrastWhite = calculateContrastRatio(rgb, whiteRgb);
    const contrastBlack = calculateContrastRatio(rgb, blackRgb);

    distinct.push({
      hex,
      rgb,
      hsl,
      percentage: Number(((item.count / totalCount) * 100).toFixed(1)),
      isDark,
      contrastWhite,
      contrastBlack,
      passAA: Math.max(contrastWhite, contrastBlack) >= 4.5,
      passAAA: Math.max(contrastWhite, contrastBlack) >= 7.0,
    });
  }

  return distinct;
}

export function generateHarmonies(baseHex: string, mode: HarmonyMode): HarmonicColor[] {
  const baseRgb = hexToRgb(baseHex) || { r: 99, g: 91, b: 255 };
  const baseHsl = rgbToHsl(baseRgb);

  const createHarmonic = (
    hOffset: number,
    label: string,
    factors?: { s?: number; l?: number }
  ): HarmonicColor => {
    const sFactor = factors?.s ?? 1;
    const lFactor = factors?.l ?? 1;
    const h = (baseHsl.h + hOffset + 360) % 360;
    const s = Math.max(0, Math.min(100, Math.round(baseHsl.s * sFactor)));
    const l = Math.max(0, Math.min(100, Math.round(baseHsl.l * lFactor)));
    const rgb = hslToRgb({ h, s, l });
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return {
      hex,
      rgb,
      hsl: { h, s, l },
      label,
      isDark: calculateLuminance(rgb) < 0.2,
    };
  };

  switch (mode) {
    case 'complementary':
      return [createHarmonic(0, 'Base Color'), createHarmonic(180, 'Complementary (180°)')];
    case 'analogous':
      return [
        createHarmonic(-30, 'Analogous (-30°)'),
        createHarmonic(0, 'Base Color'),
        createHarmonic(30, 'Analogous (+30°)'),
      ];
    case 'triadic':
      return [
        createHarmonic(0, 'Base Color'),
        createHarmonic(120, 'Triad 1 (120°)'),
        createHarmonic(240, 'Triad 2 (240°)'),
      ];
    case 'tetradic':
      return [
        createHarmonic(0, 'Base Color'),
        createHarmonic(90, 'Tetrad 1 (90°)'),
        createHarmonic(180, 'Tetrad 2 (180°)'),
        createHarmonic(270, 'Tetrad 3 (270°)'),
      ];
    case 'split-complementary':
      return [
        createHarmonic(0, 'Base Color'),
        createHarmonic(150, 'Split 1 (150°)'),
        createHarmonic(210, 'Split 2 (210°)'),
      ];
    case 'monochromatic':
      return [
        createHarmonic(0, 'Deep Shade', { s: 0.4, l: 0.2 }),
        createHarmonic(0, 'Darker', { s: 0.7, l: 0.4 }),
        createHarmonic(0, 'Base Color'),
        createHarmonic(0, 'Lighter', { s: 0.8, l: 1.3 }),
        createHarmonic(0, 'Pale Tint', { s: 0.5, l: 1.6 }),
      ];
  }
}

export function exportPaletteAsCss(hexColors: string[]): string {
  const vars = hexColors.map((hex, i) => `  --color-${i + 1}: ${hex};`).join('\n');
  return `:root {\n${vars}\n}`;
}

export function exportPaletteAsTailwind(hexColors: string[]): string {
  const entries = hexColors.map((hex, i) => `        'brand-${i + 1}': '${hex}',`).join('\n');
  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      }\n    }\n  }\n};`;
}
