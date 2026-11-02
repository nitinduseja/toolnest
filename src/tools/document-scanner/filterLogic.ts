import { applyBradleyAdaptiveThreshold } from './adaptiveThresholdLogic';

/**
 * Scan enhancement filters: Magic Color, B&W Clean Document, Grayscale, and Adaptive B&W.
 */

export type ScanFilterType = 'original' | 'magic' | 'bw' | 'grayscale' | 'adaptive';

export interface FilterOptions {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
}

function clampByte(val: number): number {
  return Math.max(0, Math.min(255, Math.round(val)));
}

function applyAdjustment(val: number, b: number, cFactor: number): number {
  return clampByte((val + b - 128) * cFactor + 128);
}

function applyMagicColorPixel(r: number, g: number, b: number): [number, number, number] {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  // Push paper backgrounds to near white while enhancing ink
  const paperThreshold = 145;
  const scale = lum > paperThreshold ? 1.25 : 0.9;
  const newR = clampByte((r - lum) * 1.2 + lum * scale);
  const newG = clampByte((g - lum) * 1.2 + lum * scale);
  const newB = clampByte((b - lum) * 1.2 + lum * scale);
  return [newR, newG, newB];
}

function applyFilterPixel(
  rgb: [number, number, number],
  filter: ScanFilterType
): [number, number, number] {
  const [r, g, b] = rgb;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (filter === 'grayscale') {
    const l = clampByte(lum);
    return [l, l, l];
  }
  if (filter === 'bw') {
    const bwVal = lum > 140 ? 255 : 0;
    return [bwVal, bwVal, bwVal];
  }
  if (filter === 'magic') {
    return applyMagicColorPixel(r, g, b);
  }
  return [r, g, b];
}

function createNewImageData(width: number, height: number): ImageData {
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

export function applyScanFilters(
  src: ImageData,
  filter: ScanFilterType,
  opts: FilterOptions
): ImageData {
  if (filter === 'adaptive') {
    return applyBradleyAdaptiveThreshold(src);
  }

  const { width, height } = src;
  const out = createNewImageData(width, height);
  const dIn = src.data;
  const dOut = out.data;

  const b = (opts.brightness / 100) * 128;
  const cFactor = Math.max(0, (opts.contrast + 100) / 100);

  for (let i = 0; i < dIn.length; i += 4) {
    const adjR = applyAdjustment(dIn[i], b, cFactor);
    const adjG = applyAdjustment(dIn[i + 1], b, cFactor);
    const adjB = applyAdjustment(dIn[i + 2], b, cFactor);

    const [fr, fg, fb] = applyFilterPixel([adjR, adjG, adjB], filter);
    dOut[i] = fr;
    dOut[i + 1] = fg;
    dOut[i + 2] = fb;
    dOut[i + 3] = dIn[i + 3];
  }

  return out;
}

export function rotateCanvasData(canvas: HTMLCanvasElement, angle: number): HTMLCanvasElement {
  const normalized = ((angle % 360) + 360) % 360;
  if (normalized === 0) return canvas;

  const isPerpendicular = normalized === 90 || normalized === 270;
  const newWidth = isPerpendicular ? canvas.height : canvas.width;
  const newHeight = isPerpendicular ? canvas.width : canvas.height;

  const rotated = document.createElement('canvas');
  rotated.width = newWidth;
  rotated.height = newHeight;
  const ctx = rotated.getContext('2d');
  if (!ctx) return canvas;

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate((normalized * Math.PI) / 180);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  return rotated;
}

function renderImageToCanvas(dataUrl: string): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

export async function filterImageDataUrl(
  dataUrl: string,
  filter: ScanFilterType,
  opts: FilterOptions = { brightness: 0, contrast: 0 }
): Promise<string> {
  if (filter === 'original' && opts.brightness === 0 && opts.contrast === 0) {
    return dataUrl;
  }
  const canvas = await renderImageToCanvas(dataUrl);
  if (!canvas) return dataUrl;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  const srcData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const processed = applyScanFilters(srcData, filter, opts);
  ctx.putImageData(processed, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.94);
}

export async function rotateDataUrl(dataUrl: string, angle: number = 90): Promise<string> {
  const canvas = await renderImageToCanvas(dataUrl);
  if (!canvas) return dataUrl;
  const rotated = rotateCanvasData(canvas, angle);
  return rotated.toDataURL('image/jpeg', 0.94);
}
