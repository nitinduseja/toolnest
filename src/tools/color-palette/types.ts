export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface ExtractedColor {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  percentage: number;
  isDark: boolean;
  contrastWhite: number;
  contrastBlack: number;
  passAA: boolean;
  passAAA: boolean;
}

export type HarmonyMode =
  'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary' | 'monochromatic';

export interface HarmonicColor {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  label: string;
  isDark: boolean;
}

export interface PalettePreset {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  colors: string[];
}
