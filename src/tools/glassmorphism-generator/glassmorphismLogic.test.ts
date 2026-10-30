import { describe, it, expect } from 'vitest';
import {
  clamp,
  hexToRgba,
  generateGlassCss,
  generateTailwindClasses,
  getDefaultGlassConfig,
  getGlassPresets,
} from './glassmorphismLogic';

describe('glassmorphismLogic', () => {
  describe('clamp', () => {
    it('clamps numbers within bounds', () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(7, 0, 10)).toBe(7);
    });
  });

  describe('hexToRgba', () => {
    it('converts 6-digit hex and opacity accurately', () => {
      expect(hexToRgba('#ffffff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
      expect(hexToRgba('#000000', 0.8)).toBe('rgba(0, 0, 0, 0.8)');
      expect(hexToRgba('#ff0000', 1)).toBe('rgba(255, 0, 0, 1)');
    });

    it('converts 3-digit shorthand hex', () => {
      expect(hexToRgba('#fff', 0.2)).toBe('rgba(255, 255, 255, 0.2)');
    });

    it('handles malformed hex gracefully by falling back to 255', () => {
      expect(hexToRgba('not-a-hex', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
    });

    it('clamps alpha between 0 and 1', () => {
      expect(hexToRgba('#ffffff', 1.5)).toBe('rgba(255, 255, 255, 1)');
      expect(hexToRgba('#ffffff', -0.5)).toBe('rgba(255, 255, 255, 0)');
    });
  });

  describe('generateGlassCss', () => {
    it('generates correct CSS properties block', () => {
      const config = getDefaultGlassConfig();
      const output = generateGlassCss(config);

      expect(output.backdropFilter).toBe('blur(16px)');
      expect(output.webkitBackdropFilter).toBe('blur(16px)');
      expect(output.borderRadius).toBe('20px');
      expect(output.border).toContain('1px solid rgba(255, 255, 255,');
      expect(output.boxShadow).toContain('0px 10px 30px 0px rgba(0, 0, 0,');
      expect(output.cssBlock).toContain('backdrop-filter: blur(16px);');
    });

    it('handles zero border and zero shadow correctly', () => {
      const config = {
        ...getDefaultGlassConfig(),
        borderWidth: 0,
        shadowOpacity: 0,
      };
      const output = generateGlassCss(config);
      expect(output.border).toBe('none');
      expect(output.boxShadow).toBe('none');
    });
  });

  describe('generateTailwindClasses', () => {
    it('generates expected tailwind utility classes', () => {
      const config = getDefaultGlassConfig();
      const classes = generateTailwindClasses(config);

      expect(classes).toContain('backdrop-blur-md');
      expect(classes).toContain('bg-[#ffffff]/20');
      expect(classes).toContain('border');
      expect(classes).toContain('rounded-2xl');
      expect(classes).toContain('shadow-xl');
    });

    it('handles blur 0 and border 0', () => {
      const config = {
        ...getDefaultGlassConfig(),
        blur: 0,
        borderWidth: 0,
      };
      const classes = generateTailwindClasses(config);
      expect(classes).toContain('backdrop-blur-none');
      expect(classes).not.toContain('border');
    });
  });

  describe('getGlassPresets', () => {
    it('provides valid presets with unique names', () => {
      const presets = getGlassPresets();
      expect(presets.length).toBeGreaterThanOrEqual(4);

      const names = presets.map((p) => p.name);
      expect(new Set(names).size).toBe(names.length);

      for (const preset of presets) {
        const css = generateGlassCss(preset.config);
        expect(css.cssBlock).toBeTruthy();
      }
    });
  });
});
