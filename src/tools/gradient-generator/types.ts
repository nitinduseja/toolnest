export type GradientType = 'linear' | 'radial' | 'conic';
export type RadialShape = 'circle' | 'ellipse';

export interface ColorStop {
  id: string;
  color: string;
  position: number; // 0 to 100
}

export interface GradientConfig {
  type: GradientType;
  angle: number; // 0 - 360 for linear and conic
  radialShape: RadialShape;
  stops: ColorStop[];
}

export interface GradientPreset {
  id: string;
  name: string;
  category: string;
  config: GradientConfig;
}

export type CodeExportFormat = 'css' | 'tailwind' | 'css-var';
