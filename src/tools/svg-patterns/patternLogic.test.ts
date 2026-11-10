import { describe, it, expect } from 'vitest';
import {
  generatePatternSvg,
  generateDataUri,
  generateCssBackground,
  generateTailwindClass,
  createDefaultConfig,
  PATTERN_PRESETS,
  getPatternContent,
} from './patternLogic';
import { PatternConfig, PatternType } from './types';

describe('patternLogic', () => {
  it('generates dot pattern SVG with background', () => {
    const config = createDefaultConfig();
    const svg = generatePatternSvg(config);
    expect(svg).toContain('<svg');
    expect(svg).toContain('<circle');
    expect(svg).toContain(`fill="${config.bgColor}"`);
    expect(svg).toContain(`opacity="${config.opacity}"`);
  });

  it('generates transparent background SVG when isTransparentBg is true', () => {
    const config: PatternConfig = {
      ...createDefaultConfig(),
      isTransparentBg: true,
    };
    const svg = generatePatternSvg(config);
    expect(svg).not.toContain('<rect');
  });

  it('generates valid SVG for all pattern types', () => {
    const types: PatternType[] = [
      'dots',
      'grid',
      'isometric',
      'chevron',
      'diagonal',
      'hexagons',
      'circuit',
    ];
    for (const t of types) {
      const content = getPatternContent({
        type: t,
        scale: 40,
        strokeWidth: 2,
        fgColor: '#fff',
      });
      expect(content).toBeTruthy();
      const config: PatternConfig = { ...createDefaultConfig(), type: t };
      const svg = generatePatternSvg(config);
      expect(svg).toContain('<svg');
    }
  });

  it('generates valid data URI encoded string', () => {
    const config = createDefaultConfig();
    const uri = generateDataUri(config);
    expect(uri.startsWith('data:image/svg+xml,')).toBe(true);
    expect(uri).toContain('%3Csvg');
  });

  it('generates CSS background-image style snippet', () => {
    const config = createDefaultConfig();
    const css = generateCssBackground(config);
    expect(css).toContain('background-image: url("data:image/svg+xml,');
    expect(css).toContain(`background-color: ${config.bgColor};`);
  });

  it('generates Tailwind arbitrary background class', () => {
    const config = createDefaultConfig();
    const tw = generateTailwindClass(config);
    expect(tw).toContain("bg-[url('data:image/svg+xml,");
  });

  it('provides all curated presets with valid configs', () => {
    expect(PATTERN_PRESETS.length).toBeGreaterThanOrEqual(6);
    for (const preset of PATTERN_PRESETS) {
      const svg = generatePatternSvg(preset.config);
      expect(svg).toContain('<svg');
    }
  });
});
