import { PatternConfig, PatternPreset } from './types';

function renderDotsPattern(size: number, stroke: number, color: string): string {
  const r = Math.max(1, stroke);
  return `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${color}" />`;
}

function renderGridPattern(size: number, stroke: number, color: string): string {
  return `<path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color}" stroke-width="${stroke}" />`;
}

function renderIsometricPattern(size: number, stroke: number, color: string): string {
  const h = size * 0.577; // tan(30deg)
  return `<path d="M 0 ${h} L ${size / 2} 0 L ${size} ${h} L ${size / 2} ${2 * h} Z" fill="none" stroke="${color}" stroke-width="${stroke}" />`;
}

function renderChevronPattern(size: number, stroke: number, color: string): string {
  return `<path d="M 0 ${size / 2} L ${size / 2} 0 L ${size} ${size / 2} M 0 ${size} L ${size / 2} ${size / 2} L ${size} ${size}" fill="none" stroke="${color}" stroke-width="${stroke}" />`;
}

function renderDiagonalPattern(size: number, stroke: number, color: string): string {
  return `<path d="M 0 ${size} L ${size} 0 M 0 0 L ${size} ${size}" fill="none" stroke="${color}" stroke-width="${stroke}" />`;
}

function renderHexagonPattern(size: number, stroke: number, color: string): string {
  const h = size * 0.866;
  const p1 = `${size * 0.25},0 ${size * 0.75},0 ${size},${h * 0.5} ${size * 0.75},${h} ${size * 0.25},${h} 0,${h * 0.5}`;
  return `<polygon points="${p1}" fill="none" stroke="${color}" stroke-width="${stroke}" />`;
}

function renderCircuitPattern(size: number, stroke: number, color: string): string {
  const r = Math.max(1.5, stroke * 1.5);
  return `
    <path d="M 0 ${size / 2} H ${size / 2} V ${size} M ${size / 2} 0 V ${size / 4} H ${size}" fill="none" stroke="${color}" stroke-width="${stroke}" />
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${color}" />
    <circle cx="${size}" cy="${size / 4}" r="${r}" fill="${color}" />
  `;
}

export function getPatternContent(
  config: Pick<PatternConfig, 'type' | 'scale' | 'strokeWidth' | 'fgColor'>
): string {
  const { type, scale: size, strokeWidth: stroke, fgColor: color } = config;
  switch (type) {
    case 'grid':
      return renderGridPattern(size, stroke, color);
    case 'isometric':
      return renderIsometricPattern(size, stroke, color);
    case 'chevron':
      return renderChevronPattern(size, stroke, color);
    case 'diagonal':
      return renderDiagonalPattern(size, stroke, color);
    case 'hexagons':
      return renderHexagonPattern(size, stroke, color);
    case 'circuit':
      return renderCircuitPattern(size, stroke, color);
    default:
      return renderDotsPattern(size, stroke, color);
  }
}

export function generatePatternSvg(config: PatternConfig): string {
  const s = config.scale;
  const bg = config.isTransparentBg
    ? ''
    : `<rect width="100%" height="100%" fill="${config.bgColor}" />`;
  const patternInner = getPatternContent(config);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  ${bg}
  <g opacity="${config.opacity}">
    ${patternInner}
  </g>
</svg>`.trim();
}

export function generateDataUri(config: PatternConfig): string {
  const svg = generatePatternSvg(config);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function generateCssBackground(config: PatternConfig): string {
  const uri = generateDataUri(config);
  const bgProp = config.isTransparentBg ? '' : `\n  background-color: ${config.bgColor};`;
  return `background-image: url("${uri}");${bgProp}`;
}

export function generateTailwindClass(config: PatternConfig): string {
  const uri = generateDataUri(config);
  return `bg-[url('${uri}')]`;
}

export function createDefaultConfig(): PatternConfig {
  return {
    type: 'dots',
    fgColor: '#6366f1',
    bgColor: '#0f172a',
    isTransparentBg: false,
    scale: 24,
    strokeWidth: 2,
    opacity: 0.6,
  };
}

export const PATTERN_PRESETS: PatternPreset[] = [
  {
    id: 'blueprint-grid',
    name: 'Blueprint Grid',
    category: 'Engineering',
    config: {
      type: 'grid',
      fgColor: '#38bdf8',
      bgColor: '#0c4a6e',
      isTransparentBg: false,
      scale: 32,
      strokeWidth: 1,
      opacity: 0.5,
    },
  },
  {
    id: 'minimalist-dots',
    name: 'Minimalist Polka',
    category: 'Minimal',
    config: {
      type: 'dots',
      fgColor: '#94a3b8',
      bgColor: '#ffffff',
      isTransparentBg: false,
      scale: 20,
      strokeWidth: 1.5,
      opacity: 0.4,
    },
  },
  {
    id: 'circuit-board',
    name: 'Cyberpunk PCB',
    category: 'Tech',
    config: {
      type: 'circuit',
      fgColor: '#10b981',
      bgColor: '#052e16',
      isTransparentBg: false,
      scale: 48,
      strokeWidth: 1.5,
      opacity: 0.7,
    },
  },
  {
    id: 'warm-hexagons',
    name: 'Honeycomb Hive',
    category: 'Geometric',
    config: {
      type: 'hexagons',
      fgColor: '#f59e0b',
      bgColor: '#451a03',
      isTransparentBg: false,
      scale: 40,
      strokeWidth: 1.5,
      opacity: 0.6,
    },
  },
  {
    id: 'isometric-cube',
    name: 'Isometric Space',
    category: '3D',
    config: {
      type: 'isometric',
      fgColor: '#a855f7',
      bgColor: '#1e1b4b',
      isTransparentBg: false,
      scale: 36,
      strokeWidth: 1,
      opacity: 0.5,
    },
  },
  {
    id: 'chevron-zigzag',
    name: 'Nordic Chevron',
    category: 'Textile',
    config: {
      type: 'chevron',
      fgColor: '#ec4899',
      bgColor: '#18181b',
      isTransparentBg: false,
      scale: 30,
      strokeWidth: 1.5,
      opacity: 0.6,
    },
  },
];
