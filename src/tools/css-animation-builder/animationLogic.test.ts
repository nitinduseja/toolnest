import { describe, it, expect } from 'vitest';
import {
  generateKeyframeTransform,
  generateKeyframesCss,
  generateAnimationPropertyCss,
  generateFullCss,
  generateTailwindSnippet,
} from './animationLogic';
import { KeyframePoint, AnimationConfig } from './types';

describe('animationLogic', () => {
  const samplePoints: KeyframePoint[] = [
    { offset: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1 },
    { offset: 100, translateX: 20, translateY: -10, scale: 1.2, rotate: 45, opacity: 0.5 },
  ];

  const sampleConfig: AnimationConfig = {
    name: 'custom-spin',
    duration: 1.2,
    timingFunction: 'ease-in-out',
    iterationCount: 'infinite',
    direction: 'alternate',
    fillMode: 'both',
  };

  it('generates transform string for keyframe point', () => {
    expect(generateKeyframeTransform(samplePoints[0])).toBe('none');
    expect(generateKeyframeTransform(samplePoints[1])).toBe(
      'translate3d(20px, -10px, 0) rotate(45deg) scale(1.2)'
    );
  });

  it('generates valid @keyframes CSS block', () => {
    const css = generateKeyframesCss(sampleConfig.name, samplePoints);
    expect(css).toContain('@keyframes custom-spin');
    expect(css).toContain('0%');
    expect(css).toContain('100%');
    expect(css).toContain('transform: translate3d(20px, -10px, 0) rotate(45deg) scale(1.2)');
    expect(css).toContain('opacity: 0.5');
  });

  it('generates shorthand animation property', () => {
    const prop = generateAnimationPropertyCss(sampleConfig);
    expect(prop).toBe('animation: custom-spin 1.2s ease-in-out infinite alternate both;');
  });

  it('supports cubic-bezier timing functions', () => {
    const cubicConfig: AnimationConfig = {
      ...sampleConfig,
      timingFunction: 'cubic-bezier',
      cubicBezier: '0.25, 0.1, 0.25, 1',
    };
    const prop = generateAnimationPropertyCss(cubicConfig);
    expect(prop).toBe(
      'animation: custom-spin 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite alternate both;'
    );
  });

  it('generates full CSS with class selector', () => {
    const full = generateFullCss(sampleConfig, samplePoints);
    expect(full).toContain('@keyframes custom-spin');
    expect(full).toContain('.animate-custom-spin {');
    expect(full).toContain('animation: custom-spin 1.2s ease-in-out infinite alternate both;');
  });

  it('generates Tailwind configuration snippet', () => {
    const tw = generateTailwindSnippet(sampleConfig, samplePoints);
    expect(tw).toContain('keyframes');
    expect(tw).toContain("'custom-spin'");
    expect(tw).toContain('animation');
  });
});
