/**
 * Pure business and canvas logic for client-side image compression and conversion.
 */
import { TargetImageFormat, CompressionOptions, CompressionStats, ImageFileItem } from './types';

export function computeScaledDimensions(
  origW: number,
  origH: number,
  limits: { maxW: number; maxH: number }
): { width: number; height: number } {
  const { maxW, maxH } = limits;
  if ((maxW <= 0 && maxH <= 0) || origW <= 0 || origH <= 0) {
    return { width: Math.max(1, origW), height: Math.max(1, origH) };
  }

  let width = origW;
  let height = origH;

  if (maxW > 0 && width > maxW) {
    height = Math.round((height * maxW) / width);
    width = maxW;
  }
  if (maxH > 0 && height > maxH) {
    width = Math.round((width * maxH) / height);
    height = maxH;
  }

  return { width: Math.max(1, width), height: Math.max(1, height) };
}

export function determineOutputMime(origType: string, targetFormat: TargetImageFormat): string {
  if (targetFormat === 'original') {
    return origType && origType.startsWith('image/') ? origType : 'image/jpeg';
  }
  return targetFormat;
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function calculateSavings(
  origBytes: number,
  compBytes: number
): { percent: number; isSmaller: boolean } {
  if (origBytes <= 0 || compBytes <= 0) return { percent: 0, isSmaller: false };
  const diff = origBytes - compBytes;
  const percent = Math.round((diff / origBytes) * 100);
  return { percent, isSmaller: percent > 0 };
}

export function calculateTotalStats(items: ImageFileItem[]): CompressionStats {
  const doneItems = items.filter((i) => i.status === 'done' && i.compressedSize > 0);
  const totalOriginalBytes = doneItems.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCompressedBytes = doneItems.reduce((acc, i) => acc + i.compressedSize, 0);
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalCompressedBytes);
  const savingsPercentage =
    totalOriginalBytes > 0 ? Math.round((totalSavedBytes / totalOriginalBytes) * 100) : 0;

  return {
    totalOriginalBytes,
    totalCompressedBytes,
    totalSavedBytes,
    savingsPercentage,
  };
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image file.'));
    };
    img.src = url;
  });
}

export function getOutputFilename(originalName: string, targetFormat: TargetImageFormat): string {
  const dotIdx = originalName.lastIndexOf('.');
  const base = dotIdx > 0 ? originalName.slice(0, dotIdx) : originalName;
  if (targetFormat === 'image/webp') return `${base}.webp`;
  if (targetFormat === 'image/jpeg') return `${base}.jpg`;
  if (targetFormat === 'image/png') return `${base}.png`;
  return originalName;
}

export async function compressImageFile(
  file: File,
  options: CompressionOptions
): Promise<{
  blob: Blob;
  width: number;
  height: number;
  origWidth: number;
  origHeight: number;
}> {
  const img = await loadImageElement(file);
  const origWidth = img.naturalWidth || 1;
  const origHeight = img.naturalHeight || 1;
  const { width, height } = computeScaledDimensions(origWidth, origHeight, {
    maxW: options.maxWidth,
    maxH: options.maxHeight,
  });

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas rendering context not supported.');

  if (options.grayscale) {
    ctx.filter = 'grayscale(100%)';
  }
  ctx.drawImage(img, 0, 0, width, height);

  const outMime = determineOutputMime(file.type, options.format);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          canvas.toBlob(
            (fallbackBlob) => {
              if (!fallbackBlob) return reject(new Error('Canvas image compression failed.'));
              resolve({ blob: fallbackBlob, width, height, origWidth, origHeight });
            },
            'image/jpeg',
            options.quality
          );
          return;
        }
        resolve({ blob, width, height, origWidth, origHeight });
      },
      outMime,
      options.quality
    );
  });
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function createSampleImageFile(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 1600, 1000);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(0.5, '#a855f7');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1600, 1000);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px sans-serif';
    ctx.fillText('Toolnest Image Compressor', 100, 480);
    ctx.font = '36px sans-serif';
    ctx.fillText('100% Client-Side In-Browser Compression', 100, 560);
  }
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob || new Blob()], 'sample-banner.png', { type: 'image/png' }));
    }, 'image/png');
  });
}
