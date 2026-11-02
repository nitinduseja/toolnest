/**
 * Edge detection and document corner identification algorithms.
 */

export interface Point {
  x: number;
  y: number;
}

export interface QuadCorners {
  tl: Point;
  tr: Point;
  br: Point;
  bl: Point;
}

export function distance(p1: Point, p2: Point): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function getDefaultCorners(width: number, height: number, insetRatio = 0.08): QuadCorners {
  const insetX = Math.round(width * insetRatio);
  const insetY = Math.round(height * insetRatio);

  return {
    tl: { x: insetX, y: insetY },
    tr: { x: width - insetX, y: insetY },
    br: { x: width - insetX, y: height - insetY },
    bl: { x: insetX, y: height - insetY },
  };
}

export function orderCorners(points: Point[]): QuadCorners {
  if (points.length !== 4) {
    throw new Error('Exactly 4 points are required to order quad corners.');
  }

  // Sort by sum (x + y): smallest is top-left, largest is bottom-right
  const sortedBySum = [...points].sort((a, b) => a.x + a.y - (b.x + b.y));
  const tl = sortedBySum[0];
  const br = sortedBySum[3];

  // Sort by difference (y - x): smallest is top-right, largest is bottom-left
  const sortedByDiff = [...points].sort((a, b) => a.y - a.x - (b.y - b.x));
  const tr = sortedByDiff[0];
  const bl = sortedByDiff[3];

  return { tl, tr, br, bl };
}

function sampleLuminance(data: Uint8ClampedArray, idx: number): number {
  return data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
}

export function detectDocumentCorners(imageData: ImageData): QuadCorners {
  const { width, height, data } = imageData;
  if (width < 20 || height < 20) return getDefaultCorners(width, height);

  // Scan boundary lines from 10% to 90% finding contrast thresholds
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  const step = Math.max(1, Math.floor(Math.min(width, height) / 80));
  for (let y = step; y < height - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      const idx = (y * width + x) * 4;
      const lum = sampleLuminance(data, idx);
      if (lum > 130) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX - minX < width * 0.25 || maxY - minY < height * 0.25) {
    return getDefaultCorners(width, height);
  }

  return {
    tl: { x: Math.max(0, minX), y: Math.max(0, minY) },
    tr: { x: Math.min(width, maxX), y: Math.max(0, minY) },
    br: { x: Math.min(width, maxX), y: Math.min(height, maxY) },
    bl: { x: Math.max(0, minX), y: Math.min(height, maxY) },
  };
}
