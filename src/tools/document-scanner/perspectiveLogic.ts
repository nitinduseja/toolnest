/**
 * 4-Point Perspective Transform and Homography Warp for document flattening.
 */
import { Point, QuadCorners, distance } from './edgeDetectionLogic';

export function computeDestDimensions(corners: QuadCorners): { width: number; height: number } {
  const topW = distance(corners.tl, corners.tr);
  const botW = distance(corners.bl, corners.br);
  const leftH = distance(corners.tl, corners.bl);
  const rightH = distance(corners.tr, corners.br);

  const width = Math.max(100, Math.min(2400, Math.round(Math.max(topW, botW))));
  const height = Math.max(100, Math.min(3200, Math.round(Math.max(leftH, rightH))));

  return { width, height };
}

function solveGaussJordan(a: number[][], b: number[]): number[] {
  const n = 8;
  for (let i = 0; i < n; i += 1) {
    let maxRow = i;
    for (let k = i + 1; k < n; k += 1) {
      if (Math.abs(a[k][i]) > Math.abs(a[maxRow][i])) maxRow = k;
    }
    const tempRow = a[i];
    a[i] = a[maxRow];
    a[maxRow] = tempRow;
    const tempB = b[i];
    b[i] = b[maxRow];
    b[maxRow] = tempB;

    for (let k = i + 1; k < n; k += 1) {
      const c = -a[k][i] / a[i][i];
      for (let j = i; j < n; j += 1) {
        if (i === j) a[k][j] = 0;
        else a[k][j] += c * a[i][j];
      }
      b[k] += c * b[i];
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    let sum = b[i];
    for (let j = i + 1; j < n; j += 1) sum -= a[i][j] * x[j];
    x[i] = sum / a[i][i];
  }
  return [...x, 1];
}

export function computeHomography(from: Point[], to: Point[]): number[] {
  const a: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 4; i += 1) {
    const { x, y } = from[i];
    const { x: u, y: v } = to[i];
    a.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    a.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }

  return solveGaussJordan(a, b);
}

function getInverseHomography(corners: QuadCorners, dw: number, dh: number): number[] {
  const dstQuad: Point[] = [
    { x: 0, y: 0 },
    { x: dw, y: 0 },
    { x: dw, y: dh },
    { x: 0, y: dh },
  ];
  const srcQuad: Point[] = [corners.tl, corners.tr, corners.br, corners.bl];
  return computeHomography(dstQuad, srcQuad);
}

function warpPixels(src: ImageData, dst: ImageData, h: number[]): void {
  const { width: sw, height: sh, data: sData } = src;
  const { width: dw, height: dh, data: dData } = dst;

  for (let dy = 0; dy < dh; dy += 1) {
    for (let dx = 0; dx < dw; dx += 1) {
      const denom = h[6] * dx + h[7] * dy + h[8];
      const sx = Math.max(0, Math.min(sw - 1, (h[0] * dx + h[1] * dy + h[2]) / denom));
      const sy = Math.max(0, Math.min(sh - 1, (h[3] * dx + h[4] * dy + h[5]) / denom));
      const inIdx = (Math.floor(sy) * sw + Math.floor(sx)) * 4;
      const outIdx = (dy * dw + dx) * 4;

      dData[outIdx] = sData[inIdx];
      dData[outIdx + 1] = sData[inIdx + 1];
      dData[outIdx + 2] = sData[inIdx + 2];
      dData[outIdx + 3] = sData[inIdx + 3];
    }
  }
}

function createWarpImageData(width: number, height: number): ImageData {
  if (typeof globalThis.ImageData !== 'undefined') {
    return new ImageData(width, height);
  }
  return {
    width,
    height,
    data: new Uint8ClampedArray(width * height * 4),
    colorSpace: 'srgb',
  } as ImageData;
}

export function warpPerspective(srcData: ImageData, corners: QuadCorners): ImageData {
  const { width: dw, height: dh } = computeDestDimensions(corners);
  const dstData = createWarpImageData(dw, dh);
  const h = getInverseHomography(corners, dw, dh);
  warpPixels(srcData, dstData, h);
  return dstData;
}
