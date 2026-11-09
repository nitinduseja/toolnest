import { ColorStop, GradientConfig, GradientPreset } from './types';

export function formatColorStops(stops: ColorStop[]): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  return sorted.map((s) => `${s.color} ${s.position}%`).join(', ');
}

export function generateGradientCss(config: GradientConfig): string {
  const stopsStr = formatColorStops(config.stops);
  if (config.type === 'radial') {
    return `radial-gradient(${config.radialShape} at center, ${stopsStr})`;
  }
  if (config.type === 'conic') {
    return `conic-gradient(from ${config.angle}deg at 50% 50%, ${stopsStr})`;
  }
  return `linear-gradient(${config.angle}deg, ${stopsStr})`;
}

export function generateTailwindClass(config: GradientConfig): string {
  const css = generateGradientCss(config);
  // Replace spaces with underscores or encode for arbitrary values
  const safeCss = css.replace(/\s+/g, '_');
  return `bg-[${safeCss}]`;
}

export function generateCssVariables(config: GradientConfig): string {
  const css = generateGradientCss(config);
  return `:root {\n  --gradient-bg: ${css};\n}`;
}

export function createDefaultConfig(): GradientConfig {
  return {
    type: 'linear',
    angle: 135,
    radialShape: 'circle',
    stops: [
      { id: 'stop-1', color: '#6366f1', position: 0 },
      { id: 'stop-2', color: '#ec4899', position: 100 },
    ],
  };
}

const PALETTES = [
  ['#3b82f6', '#8b5cf6', '#ec4899'],
  ['#10b981', '#06b6d4', '#3b82f6'],
  ['#f59e0b', '#ef4444', '#831843'],
  ['#4ade80', '#3b82f6', '#9333ea'],
  ['#0f172a', '#334155', '#64748b'],
];

export function createRandomConfig(): GradientConfig {
  const types: GradientConfig['type'][] = ['linear', 'radial', 'conic'];
  const type = types[Math.floor(Math.random() * types.length)];
  const angle = Math.floor(Math.random() * 36) * 10;
  const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const stops: ColorStop[] = palette.map((color, idx) => ({
    id: `stop-${Date.now()}-${idx}`,
    color,
    position: Math.round((idx / (palette.length - 1)) * 100),
  }));

  return { type, angle, radialShape: 'circle', stops };
}

export const PRESET_GRADIENTS: GradientPreset[] = [
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    category: 'Vibrant',
    config: {
      type: 'linear',
      angle: 135,
      radialShape: 'circle',
      stops: [
        { id: 'p1', color: '#ff7e5f', position: 0 },
        { id: 'p2', color: '#feb47b', position: 100 },
      ],
    },
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    category: 'Neon',
    config: {
      type: 'linear',
      angle: 90,
      radialShape: 'circle',
      stops: [
        { id: 'p3', color: '#00f2fe', position: 0 },
        { id: 'p4', color: '#4facfe', position: 50 },
        { id: 'p5', color: '#f093fb', position: 100 },
      ],
    },
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    category: 'Nature',
    config: {
      type: 'radial',
      angle: 180,
      radialShape: 'ellipse',
      stops: [
        { id: 'p6', color: '#134e5e', position: 0 },
        { id: 'p7', color: '#71b280', position: 100 },
      ],
    },
  },
  {
    id: 'oceanic-deep',
    name: 'Oceanic Deep',
    category: 'Cool',
    config: {
      type: 'linear',
      angle: 160,
      radialShape: 'circle',
      stops: [
        { id: 'p8', color: '#2b5876', position: 0 },
        { id: 'p9', color: '#4e4376', position: 100 },
      ],
    },
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    category: 'Pastel',
    config: {
      type: 'conic',
      angle: 45,
      radialShape: 'circle',
      stops: [
        { id: 'p10', color: '#ffc3a0', position: 0 },
        { id: 'p11', color: '#ffafbd', position: 100 },
      ],
    },
  },
  {
    id: 'emerald-luxe',
    name: 'Emerald Luxe',
    category: 'Rich',
    config: {
      type: 'linear',
      angle: 120,
      radialShape: 'circle',
      stops: [
        { id: 'p12', color: '#0575e6', position: 0 },
        { id: 'p13', color: '#00f260', position: 100 },
      ],
    },
  },
];
