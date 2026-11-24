import { KeyframePoint, AnimationConfig } from './types';

export function generateKeyframeTransform(point: KeyframePoint): string {
  const parts: string[] = [];
  if (point.translateX !== 0 || point.translateY !== 0) {
    parts.push(`translate3d(${point.translateX}px, ${point.translateY}px, 0)`);
  }
  if (point.rotate !== 0) {
    parts.push(`rotate(${point.rotate}deg)`);
  }
  if (point.scale !== 1) {
    parts.push(`scale(${point.scale})`);
  }
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function generateKeyframesCss(name: string, points: KeyframePoint[]): string {
  const sorted = [...points].sort((a, b) => a.offset - b.offset);
  const body = sorted
    .map((p) => {
      const transform = generateKeyframeTransform(p);
      return `  ${p.offset}% {\n    transform: ${transform};\n    opacity: ${p.opacity};\n  }`;
    })
    .join('\n');

  return `@keyframes ${name} {\n${body}\n}`;
}

export function generateAnimationPropertyCss(config: AnimationConfig): string {
  const timing =
    config.timingFunction === 'cubic-bezier' && config.cubicBezier
      ? `cubic-bezier(${config.cubicBezier})`
      : config.timingFunction;

  return `animation: ${config.name} ${config.duration}s ${timing} ${config.iterationCount} ${config.direction} ${config.fillMode};`;
}

export function generateFullCss(config: AnimationConfig, points: KeyframePoint[]): string {
  const keyframes = generateKeyframesCss(config.name, points);
  const animProp = generateAnimationPropertyCss(config);

  return `${keyframes}\n\n.animate-${config.name} {\n  ${animProp}\n}`;
}

export function generateTailwindSnippet(config: AnimationConfig, points: KeyframePoint[]): string {
  const sorted = [...points].sort((a, b) => a.offset - b.offset);
  const keyframesObj = sorted
    .map(
      (p) =>
        `        '${p.offset}%': { transform: '${generateKeyframeTransform(p)}', opacity: '${p.opacity}' },`
    )
    .join('\n');

  const timing =
    config.timingFunction === 'cubic-bezier' && config.cubicBezier
      ? `cubic-bezier(${config.cubicBezier})`
      : config.timingFunction;

  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      keyframes: {\n        '${config.name}': {\n${keyframesObj}\n        },\n      },\n      animation: {\n        '${config.name}': '${config.name} ${config.duration}s ${timing} ${config.iterationCount}',\n      },\n    },\n  },\n};`;
}
