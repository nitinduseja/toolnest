import { SvgOptimizeOptions, SvgOptimizationStats } from './types';
export type { SvgOptimizeOptions, SvgOptimizationStats };

export const DEFAULT_SVG_OPTIONS: SvgOptimizeOptions = {
  removeDoctype: true,
  removeComments: true,
  removeMetadata: true,
  removeEditorData: true,
  cleanIds: true,
  collapseWhitespace: true,
  roundCoordinates: true,
  precision: 2,
  removeXmlProcInst: true,
};

export function isValidSvg(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim();
  return trimmed.includes('<svg') && trimmed.includes('</svg>');
}

function stripCommentsAndMeta(svg: string, options: SvgOptimizeOptions): string {
  let res = svg;
  if (options.removeXmlProcInst) {
    res = res.replace(/<\?xml[\s\S]*?\?>/gi, '');
  }
  if (options.removeDoctype) {
    res = res.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
  }
  if (options.removeComments) {
    res = res.replace(/<!--[\s\S]*?-->/g, '');
  }
  if (options.removeMetadata) {
    res = res.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
  }
  return res;
}

function stripEditorAttributes(svg: string): string {
  return svg
    .replace(/\s*xmlns:(?:inkscape|sodipodi|illustrator|adobe|sketch)="[^"]*"/gi, '')
    .replace(/\s*(?:inkscape|sodipodi|sketch):[a-z0-9_-]+="[^"]*"/gi, '')
    .replace(/<sodipodi:namedview[\s\S]*?\/>/gi, '');
}

function roundNumberStrings(str: string, precision: number): string {
  return str.replace(/\b\d+\.\d{3,}\b/g, (match) => {
    const val = Number(match);
    return isNaN(val) ? match : val.toFixed(precision).replace(/\.?0+$/, '');
  });
}

function roundCoordinatesInAttributes(svg: string, precision: number): string {
  return svg.replace(
    /\b(d|points|viewBox)="([^"]+)"/g,
    (_, attr, val) => `${attr}="${roundNumberStrings(val, precision)}"`
  );
}

function collapseSvgWhitespace(svg: string): string {
  return svg
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([>/>])/g, '$1')
    .trim();
}

export function optimizeSvg(svg: string, options: SvgOptimizeOptions): string {
  if (!isValidSvg(svg)) return svg;
  let out = stripCommentsAndMeta(svg, options);

  if (options.removeEditorData) {
    out = stripEditorAttributes(out);
  }

  if (options.cleanIds) {
    out = out.replace(/\s*id="(?:[a-z0-9_-]+_[0-9]+|svg_[0-9]+)"/gi, '');
  }

  if (options.roundCoordinates) {
    out = roundCoordinatesInAttributes(out, options.precision);
  }

  if (options.collapseWhitespace) {
    out = collapseSvgWhitespace(out);
  }

  return out.trim();
}

export function calculateSvgStats(original: string, optimized: string): SvgOptimizationStats {
  const enc = new TextEncoder();
  const originalBytes = enc.encode(original).length;
  const optimizedBytes = enc.encode(optimized).length;
  const savedBytes = Math.max(0, originalBytes - optimizedBytes);
  const savingsPercentage = originalBytes > 0 ? Math.round((savedBytes / originalBytes) * 100) : 0;

  return {
    originalBytes,
    optimizedBytes,
    savedBytes,
    savingsPercentage,
  };
}
