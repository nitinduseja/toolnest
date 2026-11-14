import { downloadFile } from '@/lib/downloads';

const MAX_CANVAS_DIMENSION = 16384;
const MAX_CANVAS_PIXELS = 64_000_000;

function getSvgDimensions(svg: string): {
  width: number;
  height: number;
} {
  const viewBox = svg.match(/viewBox\s*=\s*["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/);

  const widthMatch = svg.match(/\bwidth\s*=\s*["']([\d.]+)(?:px)?["']/);
  const heightMatch = svg.match(/\bheight\s*=\s*["']([\d.]+)(?:px)?["']/);

  const width = Number(viewBox?.[1] || widthMatch?.[1]);
  const height = Number(viewBox?.[2] || heightMatch?.[1]);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error('Invalid SVG dimensions');
  }

  return { width, height };
}

export function renderSvgToCanvas(svgString: string, scale = 2): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    let objectUrl: string | null = null;

    try {
      if (typeof document === 'undefined' || typeof Image === 'undefined') {
        throw new Error('Canvas rendering requires a browser');
      }

      const safeScale = Number.isFinite(scale) ? Math.min(4, Math.max(1, scale)) : 2;

      const { width, height } = getSvgDimensions(svgString);

      const canvasWidth = Math.ceil(width * safeScale);
      const canvasHeight = Math.ceil(height * safeScale);

      if (
        canvasWidth > MAX_CANVAS_DIMENSION ||
        canvasHeight > MAX_CANVAS_DIMENSION ||
        canvasWidth * canvasHeight > MAX_CANVAS_PIXELS
      ) {
        throw new Error('Image dimensions exceed the supported canvas size');
      }

      const blob = new Blob([svgString], {
        type: 'image/svg+xml;charset=utf-8',
      });

      objectUrl = URL.createObjectURL(blob);

      const img = new Image();

      const cleanup = () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          const context = canvas.getContext('2d');

          if (!context) {
            throw new Error('Canvas 2D context not available');
          }

          context.setTransform(safeScale, 0, 0, safeScale, 0, 0);

          context.drawImage(img, 0, 0, width, height);

          cleanup();
          resolve(canvas);
        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      img.onerror = () => {
        cleanup();
        reject(new Error('Failed to load SVG into image'));
      };

      img.src = objectUrl;
    } catch (error) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(error);
    }
  });
}

export async function downloadPngFromSvg(
  svgString: string,
  filename = 'code-card.png'
): Promise<boolean> {
  try {
    const canvas = await renderSvgToCanvas(svgString, 2);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });

    if (!blob) return false;

    return Boolean(
      await downloadFile(blob, {
        filename,
        mimeType: 'image/png',
      })
    );
  } catch (error) {
    console.error('PNG download failed:', error);
    return false;
  }
}

export async function copyPngToClipboard(svgString: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
      return false;
    }

    const canvas = await renderSvgToCanvas(svgString, 2);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });

    if (!blob) return false;

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);

    return true;
  } catch (error) {
    console.error('PNG clipboard copy failed:', error);
    return false;
  }
}
