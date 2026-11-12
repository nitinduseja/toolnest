import { downloadFile } from '@/lib/downloads';
import { copyToClipboard } from '@/lib/clipboard';

export function renderSvgToCanvas(svgString: string, scale = 2): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas 2D context not available'));
        return;
      }
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG into image'));
    };
    img.src = url;
  });
}

export async function downloadPngFromSvg(
  svgString: string,
  filename = 'code-card.png'
): Promise<boolean> {
  try {
    const canvas = await renderSvgToCanvas(svgString, 2);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        resolve(downloadFile(blob, { filename, mimeType: 'image/png' }));
      }, 'image/png');
    });
  } catch {
    return false;
  }
}

export async function copyPngToClipboard(svgString: string): Promise<boolean> {
  try {
    const canvas = await renderSvgToCanvas(svgString, 2);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob || !navigator.clipboard?.write) {
          const fallbackOk = await copyToClipboard(svgString);
          resolve(fallbackOk);
          return;
        }
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          resolve(true);
        } catch {
          const fallbackOk = await copyToClipboard(svgString);
          resolve(fallbackOk);
        }
      }, 'image/png');
    });
  } catch {
    return copyToClipboard(svgString);
  }
}
