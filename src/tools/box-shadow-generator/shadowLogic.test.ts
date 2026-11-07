import { describe, it, expect } from 'vitest';
import {
  hexToRgba,
  layerToCss,
  buildBoxShadowCss,
  buildTailwindArbitrary,
  formatShadowCode,
  SHADOW_PRESETS,
} from './shadowLogic';
import { ShadowLayer } from './types';

describe('shadowLogic', () => {
  it('converts hex and opacity to rgba string', () => {
    expect(hexToRgba('#000000', 50)).toBe('rgba(0, 0, 0, 0.50)');
    expect(hexToRgba('#fff', 100)).toBe('rgba(255, 255, 255, 1.00)');
    expect(hexToRgba('#ff0000', 0)).toBe('rgba(255, 0, 0, 0.00)');
  });

  it('formats single shadow layer to CSS', () => {
    const layer: ShadowLayer = {
      id: '1',
      x: 2,
      y: 4,
      blur: 8,
      spread: 0,
      color: '#000000',
      opacity: 20,
      inset: false,
      enabled: true,
    };
    expect(layerToCss(layer)).toBe('2px 4px 8px 0px rgba(0, 0, 0, 0.20)');

    const insetLayer: ShadowLayer = { ...layer, inset: true };
    expect(layerToCss(insetLayer)).toBe('inset 2px 4px 8px 0px rgba(0, 0, 0, 0.20)');
  });

  it('builds combined multi-layer CSS box-shadow', () => {
    const layers: ShadowLayer[] = [
      {
        id: '1',
        x: 0,
        y: 2,
        blur: 4,
        spread: 0,
        color: '#000000',
        opacity: 10,
        inset: false,
        enabled: true,
      },
      {
        id: '2',
        x: 0,
        y: 4,
        blur: 8,
        spread: 0,
        color: '#000000',
        opacity: 20,
        inset: false,
        enabled: false,
      },
    ];
    // Disabled layer 2 should not be included
    expect(buildBoxShadowCss(layers)).toBe('0px 2px 4px 0px rgba(0, 0, 0, 0.10)');
    expect(buildBoxShadowCss([])).toBe('none');
  });

  it('builds tailwind arbitrary shadow class', () => {
    const layers: ShadowLayer[] = [
      {
        id: '1',
        x: 0,
        y: 4,
        blur: 6,
        spread: -1,
        color: '#000000',
        opacity: 10,
        inset: false,
        enabled: true,
      },
    ];
    expect(buildTailwindArbitrary(layers)).toBe('shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.10)]');
    expect(buildTailwindArbitrary([])).toBe('shadow-none');
  });

  it('formats output according to requested export format', () => {
    const preset = SHADOW_PRESETS[0];
    const layers: ShadowLayer[] = preset.layers.map((l, idx) => ({ ...l, id: String(idx) }));

    const css = formatShadowCode(layers, 'css');
    expect(css).toContain('box-shadow:');

    const tailwind = formatShadowCode(layers, 'tailwind');
    expect(tailwind).toContain('shadow-[');

    const cssVar = formatShadowCode(layers, 'css-var');
    expect(cssVar).toContain('--custom-box-shadow');
  });
});
