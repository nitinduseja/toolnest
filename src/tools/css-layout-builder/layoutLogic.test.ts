import { describe, it, expect } from 'vitest';
import {
  generateFlexCss,
  generateFlexTailwind,
  generateGridCss,
  generateGridTailwind,
  LAYOUT_PRESETS,
} from './layoutLogic';
import { FlexConfig, GridConfig } from './types';

describe('layoutLogic', () => {
  describe('Flexbox Generator', () => {
    it('generates standard flex CSS', () => {
      const flex: FlexConfig = {
        direction: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        wrap: 'wrap',
        gap: 20,
      };

      const css = generateFlexCss(flex);
      expect(css).toContain('display: flex;');
      expect(css).toContain('flex-direction: row;');
      expect(css).toContain('justify-content: space-between;');
      expect(css).toContain('gap: 20px;');
    });

    it('generates Tailwind flex utility classes', () => {
      const flex: FlexConfig = {
        direction: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        wrap: 'nowrap',
        gap: 16,
      };

      const tw = generateFlexTailwind(flex);
      expect(tw).toBe('flex flex-col justify-center items-center flex-nowrap gap-[16px]');
    });
  });

  describe('Grid Generator', () => {
    it('generates standard grid CSS', () => {
      const grid: GridConfig = {
        columns: 4,
        gap: 24,
        justifyItems: 'stretch',
        alignItems: 'center',
      };

      const css = generateGridCss(grid);
      expect(css).toContain('display: grid;');
      expect(css).toContain('grid-template-columns: repeat(4, minmax(0, 1fr));');
      expect(css).toContain('gap: 24px;');
    });

    it('generates Tailwind grid utility classes', () => {
      const grid: GridConfig = {
        columns: 3,
        gap: 12,
        justifyItems: 'center',
        alignItems: 'stretch',
      };

      const tw = generateGridTailwind(grid);
      expect(tw).toBe('grid grid-cols-3 justify-items-center items-stretch gap-[12px]');
    });
  });

  describe('Presets', () => {
    it('has valid presets for both flex and grid', () => {
      expect(LAYOUT_PRESETS.length).toBeGreaterThan(0);
      const flexPreset = LAYOUT_PRESETS.find((p) => p.mode === 'flex');
      const gridPreset = LAYOUT_PRESETS.find((p) => p.mode === 'grid');
      expect(flexPreset?.flex).toBeDefined();
      expect(gridPreset?.grid).toBeDefined();
    });
  });
});
