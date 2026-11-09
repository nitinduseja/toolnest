import { describe, it, expect } from 'vitest';
import {
  formatColorStops,
  generateGradientCss,
  generateTailwindClass,
  generateCssVariables,
  createDefaultConfig,
  createRandomConfig,
  PRESET_GRADIENTS,
} from './gradientLogic';
import { GradientConfig } from './types';

describe('gradientLogic', () => {
  it('formats color stops correctly in ascending position order', () => {
    const stops = [
      { id: '2', color: '#ff0000', position: 100 },
      { id: '1', color: '#0000ff', position: 0 },
    ];
    expect(formatColorStops(stops)).toBe('#0000ff 0%, #ff0000 100%');
  });

  it('generates linear gradient CSS', () => {
    const config: GradientConfig = {
      type: 'linear',
      angle: 90,
      radialShape: 'circle',
      stops: [
        { id: '1', color: '#000', position: 0 },
        { id: '2', color: '#fff', position: 100 },
      ],
    };
    expect(generateGradientCss(config)).toBe('linear-gradient(90deg, #000 0%, #fff 100%)');
  });

  it('generates radial gradient CSS', () => {
    const config: GradientConfig = {
      type: 'radial',
      angle: 0,
      radialShape: 'circle',
      stops: [
        { id: '1', color: '#f00', position: 0 },
        { id: '2', color: '#00f', position: 100 },
      ],
    };
    expect(generateGradientCss(config)).toBe(
      'radial-gradient(circle at center, #f00 0%, #00f 100%)'
    );
  });

  it('generates conic gradient CSS', () => {
    const config: GradientConfig = {
      type: 'conic',
      angle: 180,
      radialShape: 'circle',
      stops: [
        { id: '1', color: '#0f0', position: 0 },
        { id: '2', color: '#000', position: 100 },
      ],
    };
    expect(generateGradientCss(config)).toBe(
      'conic-gradient(from 180deg at 50% 50%, #0f0 0%, #000 100%)'
    );
  });

  it('generates valid Tailwind arbitrary class', () => {
    const config = createDefaultConfig();
    const tw = generateTailwindClass(config);
    expect(tw).toContain('bg-[linear-gradient(');
    expect(tw).not.toContain(' ');
  });

  it('generates valid CSS variable root block', () => {
    const config = createDefaultConfig();
    const cssVars = generateCssVariables(config);
    expect(cssVars).toContain(':root {');
    expect(cssVars).toContain('--gradient-bg:');
  });

  it('creates default config with 2 stops', () => {
    const cfg = createDefaultConfig();
    expect(cfg.type).toBe('linear');
    expect(cfg.stops.length).toBe(2);
  });

  it('creates random config with valid attributes', () => {
    const cfg = createRandomConfig();
    expect(['linear', 'radial', 'conic']).toContain(cfg.type);
    expect(cfg.stops.length).toBeGreaterThanOrEqual(2);
  });

  it('has preset gradients defined', () => {
    expect(PRESET_GRADIENTS.length).toBeGreaterThanOrEqual(5);
    for (const preset of PRESET_GRADIENTS) {
      const css = generateGradientCss(preset.config);
      expect(css).toBeTruthy();
    }
  });
});
