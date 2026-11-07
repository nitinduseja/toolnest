import { ShadowLayer, ShadowPreset, ShadowExportFormat } from './types';

export function hexToRgba(hex: string, opacity: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const alpha = Math.min(1, Math.max(0, opacity / 100));
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export function layerToCss(layer: ShadowLayer): string {
  const rgba = hexToRgba(layer.color, layer.opacity);
  const insetStr = layer.inset ? 'inset ' : '';
  return `${insetStr}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${rgba}`;
}

export function buildBoxShadowCss(layers: ShadowLayer[]): string {
  const active = layers.filter((l) => l.enabled);
  if (active.length === 0) return 'none';
  return active.map(layerToCss).join(', ');
}

export function buildTailwindArbitrary(layers: ShadowLayer[]): string {
  const active = layers.filter((l) => l.enabled);
  if (active.length === 0) return 'shadow-none';

  const parts = active.map((l) => {
    const rgba = hexToRgba(l.color, l.opacity).replace(/\s+/g, '');
    const insetStr = l.inset ? 'inset_' : '';
    return `${insetStr}${l.x}px_${l.y}px_${l.blur}px_${l.spread}px_${rgba}`;
  });

  const joined = parts.join(',');
  const prefix = 'shadow-[';
  return `${prefix}${joined}]`;
}

export function formatShadowCode(layers: ShadowLayer[], format: ShadowExportFormat): string {
  const css = buildBoxShadowCss(layers);

  switch (format) {
    case 'tailwind':
      return buildTailwindArbitrary(layers);
    case 'css-var':
      return `:root {\n  --custom-box-shadow: ${css};\n}\n\n.my-element {\n  box-shadow: var(--custom-box-shadow);\n}`;
    case 'css':
    default:
      return `box-shadow: ${css};`;
  }
}

export const SHADOW_PRESETS: ShadowPreset[] = [
  {
    id: 'soft-card',
    name: 'Soft Elevation',
    description: 'Modern, clean subtle drop shadow for cards & dialogs',
    layers: [
      {
        x: 0,
        y: 4,
        blur: 6,
        spread: -1,
        color: '#000000',
        opacity: 10,
        inset: false,
        enabled: true,
      },
      {
        x: 0,
        y: 2,
        blur: 4,
        spread: -2,
        color: '#000000',
        opacity: 10,
        inset: false,
        enabled: true,
      },
    ],
  },
  {
    id: 'floating-deep',
    name: 'Floating 3D',
    description: 'Pronounced elevated float effect for hover states & modals',
    layers: [
      {
        x: 0,
        y: 20,
        blur: 25,
        spread: -5,
        color: '#000000',
        opacity: 15,
        inset: false,
        enabled: true,
      },
      {
        x: 0,
        y: 8,
        blur: 10,
        spread: -6,
        color: '#000000',
        opacity: 10,
        inset: false,
        enabled: true,
      },
    ],
  },
  {
    id: 'cyberpunk-glow',
    name: 'Neon Cyberpunk',
    description: 'Vibrant dual-color outer aura glow (Cyan + Pink)',
    layers: [
      {
        x: 0,
        y: 0,
        blur: 25,
        spread: 5,
        color: '#00e5ff',
        opacity: 60,
        inset: false,
        enabled: true,
      },
      {
        x: 0,
        y: 0,
        blur: 50,
        spread: 15,
        color: '#ff007f',
        opacity: 40,
        inset: false,
        enabled: true,
      },
    ],
  },
  {
    id: 'sharp-retro',
    name: 'Sharp Retro',
    description: 'Solid, non-blurred brutalist drop shadow',
    layers: [
      {
        x: 6,
        y: 6,
        blur: 0,
        spread: 0,
        color: '#111827',
        opacity: 100,
        inset: false,
        enabled: true,
      },
    ],
  },
  {
    id: 'inner-pressed',
    name: 'Inner Inset',
    description: 'Sunken well / pressed down input or button depth',
    layers: [
      { x: 0, y: 3, blur: 6, spread: 0, color: '#000000', opacity: 20, inset: true, enabled: true },
      { x: 0, y: 1, blur: 2, spread: 0, color: '#000000', opacity: 15, inset: true, enabled: true },
    ],
  },
];
