/**
 * Pure domain logic for CSS Glassmorphism and Box-Shadow generation.
 * Generates standards-compliant CSS properties and Tailwind CSS utility classes.
 */

export interface GlassConfig {
  blur: number; // 0 to 40 px
  bgOpacity: number; // 0 to 1
  bgColor: string; // hex color e.g. #ffffff
  borderWidth: number; // 0 to 4 px
  borderOpacity: number; // 0 to 1
  borderColor: string; // hex color e.g. #ffffff
  borderRadius: number; // 0 to 48 px
  shadowX: number; // -50 to 50 px
  shadowY: number; // -50 to 50 px
  shadowBlur: number; // 0 to 60 px
  shadowSpread: number; // -20 to 20 px
  shadowColor: string; // hex color e.g. #000000
  shadowOpacity: number; // 0 to 1
}

export interface GlassPreset {
  name: string;
  description: string;
  config: GlassConfig;
}

export interface GlassCssOutput {
  background: string;
  backdropFilter: string;
  webkitBackdropFilter: string;
  borderRadius: string;
  border: string;
  boxShadow: string;
  cssBlock: string;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '').trim();
  const safeAlpha = clamp(alpha, 0, 1);

  let r = 255;
  let g = 255;
  let b = 255;

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }

  const validR = isNaN(r) ? 255 : r;
  const validG = isNaN(g) ? 255 : g;
  const validB = isNaN(b) ? 255 : b;

  return `rgba(${validR}, ${validG}, ${validB}, ${safeAlpha})`;
}

export function generateGlassCss(config: GlassConfig): GlassCssOutput {
  const bg = hexToRgba(config.bgColor, config.bgOpacity);
  const borderRgba = hexToRgba(config.borderColor, config.borderOpacity);
  const shadowRgba = hexToRgba(config.shadowColor, config.shadowOpacity);

  const backdrop = `blur(${config.blur}px)`;
  const border = config.borderWidth > 0 ? `${config.borderWidth}px solid ${borderRgba}` : 'none';
  const shadow =
    config.shadowOpacity > 0
      ? `${config.shadowX}px ${config.shadowY}px ${config.shadowBlur}px ${config.shadowSpread}px ${shadowRgba}`
      : 'none';
  const radius = `${config.borderRadius}px`;

  const cssBlock = [
    `background: ${bg};`,
    `backdrop-filter: ${backdrop};`,
    `-webkit-backdrop-filter: ${backdrop};`,
    `border-radius: ${radius};`,
    `border: ${border};`,
    `box-shadow: ${shadow};`,
  ].join('\n');

  return {
    background: bg,
    backdropFilter: backdrop,
    webkitBackdropFilter: backdrop,
    borderRadius: radius,
    border,
    boxShadow: shadow,
    cssBlock,
  };
}

export function generateTailwindClasses(config: GlassConfig): string {
  const classes: string[] = [];

  // Backdrop blur
  if (config.blur === 0) classes.push('backdrop-blur-none');
  else if (config.blur <= 4) classes.push('backdrop-blur-xs');
  else if (config.blur <= 8) classes.push('backdrop-blur-sm');
  else if (config.blur <= 16) classes.push('backdrop-blur-md');
  else if (config.blur <= 24) classes.push('backdrop-blur-lg');
  else if (config.blur <= 40) classes.push('backdrop-blur-xl');
  else classes.push('backdrop-blur-2xl');

  // Background
  const pct = Math.round(config.bgOpacity * 100);
  classes.push(`bg-[${config.bgColor}]/${pct}`);

  // Border
  if (config.borderWidth > 0) {
    const borderPct = Math.round(config.borderOpacity * 100);
    classes.push(config.borderWidth === 1 ? 'border' : `border-[${config.borderWidth}px]`);
    classes.push(`border-[${config.borderColor}]/${borderPct}`);
  }

  // Radius
  if (config.borderRadius <= 4) classes.push('rounded-sm');
  else if (config.borderRadius <= 8) classes.push('rounded-md');
  else if (config.borderRadius <= 12) classes.push('rounded-lg');
  else if (config.borderRadius <= 16) classes.push('rounded-xl');
  else if (config.borderRadius <= 24) classes.push('rounded-2xl');
  else classes.push('rounded-3xl');

  // Shadow
  if (config.shadowOpacity > 0) {
    if (config.shadowBlur <= 8) classes.push('shadow-md');
    else if (config.shadowBlur <= 16) classes.push('shadow-lg');
    else if (config.shadowBlur <= 30) classes.push('shadow-xl');
    else classes.push('shadow-2xl');
  }

  return classes.join(' ');
}

export function getDefaultGlassConfig(): GlassConfig {
  return {
    blur: 16,
    bgOpacity: 0.2,
    bgColor: '#ffffff',
    borderWidth: 1,
    borderOpacity: 0.35,
    borderColor: '#ffffff',
    borderRadius: 20,
    shadowX: 0,
    shadowY: 10,
    shadowBlur: 30,
    shadowSpread: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
  };
}

export function getGlassPresets(): GlassPreset[] {
  return [
    {
      name: 'Frosted Crystal',
      description: 'Clean balanced glassmorphism for light and dark panels',
      config: getDefaultGlassConfig(),
    },
    {
      name: 'Deep Frost',
      description: 'Heavy atmospheric blur with prominent white rim border',
      config: {
        blur: 28,
        bgOpacity: 0.3,
        bgColor: '#ffffff',
        borderWidth: 1,
        borderOpacity: 0.5,
        borderColor: '#ffffff',
        borderRadius: 24,
        shadowX: 0,
        shadowY: 16,
        shadowBlur: 40,
        shadowSpread: 0,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
      },
    },
    {
      name: 'Dark Obsidian',
      description: 'Sleek dark smoked glass with soft ambient rim',
      config: {
        blur: 20,
        bgOpacity: 0.45,
        bgColor: '#0f172a',
        borderWidth: 1,
        borderOpacity: 0.2,
        borderColor: '#94a3b8',
        borderRadius: 16,
        shadowX: 0,
        shadowY: 12,
        shadowBlur: 32,
        shadowSpread: -2,
        shadowColor: '#000000',
        shadowOpacity: 0.4,
      },
    },
    {
      name: 'Neon Horizon',
      description: 'Vibrant indigo tinted glass with colorful depth',
      config: {
        blur: 16,
        bgOpacity: 0.25,
        bgColor: '#6366f1',
        borderWidth: 1,
        borderOpacity: 0.4,
        borderColor: '#a5b4fc',
        borderRadius: 24,
        shadowX: 0,
        shadowY: 14,
        shadowBlur: 36,
        shadowSpread: 0,
        shadowColor: '#4338ca',
        shadowOpacity: 0.35,
      },
    },
    {
      name: 'Minimal Borderless',
      description: 'Pure backdrop dispersion without a bounding border line',
      config: {
        blur: 24,
        bgOpacity: 0.15,
        bgColor: '#ffffff',
        borderWidth: 0,
        borderOpacity: 0,
        borderColor: '#ffffff',
        borderRadius: 20,
        shadowX: 0,
        shadowY: 8,
        shadowBlur: 24,
        shadowSpread: 0,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
      },
    },
  ];
}
