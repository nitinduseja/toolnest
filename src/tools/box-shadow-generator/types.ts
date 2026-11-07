export interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number; // 0 to 100
  inset: boolean;
  enabled: boolean;
}

export type ShadowExportFormat = 'css' | 'tailwind' | 'css-var';

export interface ShadowPreset {
  id: string;
  name: string;
  description: string;
  layers: Omit<ShadowLayer, 'id'>[];
}
