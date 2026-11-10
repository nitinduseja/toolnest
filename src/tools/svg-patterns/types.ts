export type PatternType =
  'dots' | 'grid' | 'isometric' | 'chevron' | 'diagonal' | 'hexagons' | 'circuit';

export interface PatternConfig {
  type: PatternType;
  fgColor: string;
  bgColor: string;
  isTransparentBg: boolean;
  scale: number; // 8 to 120
  strokeWidth: number; // 0.5 to 8
  opacity: number; // 0.1 to 1.0
}

export interface PatternPreset {
  id: string;
  name: string;
  category: string;
  config: PatternConfig;
}

export type PatternExportFormat = 'css' | 'svg' | 'data-uri' | 'tailwind';
