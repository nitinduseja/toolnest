/**
 * Bradley-Roth Adaptive Thresholding using Integral Image.
 * Provides shadow-free, clean document binarization under uneven lighting.
 */

export interface AdaptiveThresholdOptions {
  windowFraction?: number; // default ~0.125 (width / 8)
  percentage?: number; // default 15% darker than average
}

function computeIntegralImage(gray: Uint8Array, width: number, height: number): Int32Array {
  const integral = new Int32Array(width * height);
  for (let y = 0; y < height; y += 1) {
    let sum = 0;
    const rowOffset = y * width;
    for (let x = 0; x < width; x += 1) {
      sum += gray[rowOffset + x];
      if (y === 0) {
        integral[rowOffset + x] = sum;
      } else {
        integral[rowOffset + x] = integral[(y - 1) * width + x] + sum;
      }
    }
  }
  return integral;
}

function getWindowSum(
  integral: Int32Array,
  width: number,
  box: { x1: number; y1: number; x2: number; y2: number }
): number {
  const { x1, y1, x2, y2 } = box;
  const a = integral[y2 * width + x2];
  const b = y1 > 0 ? integral[(y1 - 1) * width + x2] : 0;
  const c = x1 > 0 ? integral[y2 * width + (x1 - 1)] : 0;
  const d = x1 > 0 && y1 > 0 ? integral[(y1 - 1) * width + (x1 - 1)] : 0;
  return a - b - c + d;
}

function getWindowBox(
  pt: { x: number; y: number },
  s: number,
  bounds: { width: number; height: number }
): { x1: number; y1: number; x2: number; y2: number } {
  const halfS = Math.floor(s / 2);
  return {
    x1: Math.max(0, pt.x - halfS),
    y1: Math.max(0, pt.y - halfS),
    x2: Math.min(bounds.width - 1, pt.x + halfS),
    y2: Math.min(bounds.height - 1, pt.y + halfS),
  };
}

function binarizeRow(
  integral: Int32Array,
  gray: Uint8Array,
  rowParams: {
    y: number;
    width: number;
    height: number;
    s: number;
    t: number;
    out: Uint8ClampedArray;
  }
): void {
  const { y, width, height, s, t, out } = rowParams;
  const bounds = { width, height };
  const rowOffset = y * width;

  for (let x = 0; x < width; x += 1) {
    const box = getWindowBox({ x, y }, s, bounds);
    const count = (box.x2 - box.x1 + 1) * (box.y2 - box.y1 + 1);
    const sum = getWindowSum(integral, width, box);
    const pixel = gray[rowOffset + x];
    const val = pixel * count <= sum * ((100 - t) / 100) ? 0 : 255;

    const outIdx = (rowOffset + x) * 4;
    out[outIdx] = val;
    out[outIdx + 1] = val;
    out[outIdx + 2] = val;
    out[outIdx + 3] = 255;
  }
}

export function applyBradleyAdaptiveThreshold(
  src: ImageData,
  opts: AdaptiveThresholdOptions = {}
): ImageData {
  const { width, height, data } = src;
  const gray = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i += 1) {
    const idx = i * 4;
    gray[i] = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
  }

  const integral = computeIntegralImage(gray, width, height);
  const out = new Uint8ClampedArray(width * height * 4);
  const s = Math.max(8, Math.round(width * (opts.windowFraction ?? 0.125)));
  const t = opts.percentage ?? 15;

  for (let y = 0; y < height; y += 1) {
    binarizeRow(integral, gray, { y, width, height, s, t, out });
  }

  if (typeof globalThis.ImageData !== 'undefined') {
    return new ImageData(out, width, height);
  }
  return { width, height, data: out, colorSpace: 'srgb' } as ImageData;
}
