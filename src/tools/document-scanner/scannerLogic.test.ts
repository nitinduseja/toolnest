import { describe, it, expect } from 'vitest';
import { getDefaultCorners, orderCorners, distance, Point } from './edgeDetectionLogic';
import { computeDestDimensions, computeHomography } from './perspectiveLogic';
import { applyScanFilters } from './filterLogic';
import { exportScannedPagesToPdf } from './pdfExportLogic';
import { ScannedPageItem } from './scannerDb';
import { classifyCameraError } from './cameraErrorLogic';

function makeMockImageData(width: number, height: number): ImageData {
  return {
    width,
    height,
    data: new Uint8ClampedArray(width * height * 4),
    colorSpace: 'srgb',
  } as ImageData;
}

describe('scannerLogic', () => {
  describe('edgeDetectionLogic', () => {
    it('computes Euclidean distance between points', () => {
      const p1: Point = { x: 0, y: 0 };
      const p2: Point = { x: 3, y: 4 };
      expect(distance(p1, p2)).toBe(5);
    });

    it('generates proportional default corners inset from canvas edge', () => {
      const corners = getDefaultCorners(1000, 800, 0.1);
      expect(corners.tl).toEqual({ x: 100, y: 80 });
      expect(corners.tr).toEqual({ x: 900, y: 80 });
      expect(corners.br).toEqual({ x: 900, y: 720 });
      expect(corners.bl).toEqual({ x: 100, y: 720 });
    });

    it('correctly orders quad corners from unsorted points', () => {
      const points: Point[] = [
        { x: 500, y: 500 }, // br
        { x: 0, y: 0 }, // tl
        { x: 500, y: 0 }, // tr
        { x: 0, y: 500 }, // bl
      ];
      const ordered = orderCorners(points);
      expect(ordered.tl).toEqual({ x: 0, y: 0 });
      expect(ordered.tr).toEqual({ x: 500, y: 0 });
      expect(ordered.br).toEqual({ x: 500, y: 500 });
      expect(ordered.bl).toEqual({ x: 0, y: 500 });
    });
  });

  describe('perspectiveLogic', () => {
    const corners = {
      tl: { x: 10, y: 20 },
      tr: { x: 410, y: 20 },
      br: { x: 410, y: 520 },
      bl: { x: 10, y: 520 },
    };

    it('computes output unwarped canvas dimensions', () => {
      const dims = computeDestDimensions(corners);
      expect(dims.width).toBe(400);
      expect(dims.height).toBe(500);
    });

    it('computes 3x3 homography projection matrix', () => {
      const src = [corners.tl, corners.tr, corners.br, corners.bl];
      const dst = [
        { x: 0, y: 0 },
        { x: 400, y: 0 },
        { x: 400, y: 500 },
        { x: 0, y: 500 },
      ];
      const matrix = computeHomography(src, dst);
      expect(matrix.length).toBe(9);
      expect(matrix[8]).toBe(1);
    });
  });

  describe('filterLogic', () => {
    it('applies grayscale filter producing equal RGB channels', () => {
      const imgData = makeMockImageData(2, 2);
      // Fill with red
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 200;
        imgData.data[i + 1] = 50;
        imgData.data[i + 2] = 50;
        imgData.data[i + 3] = 255;
      }

      const filtered = applyScanFilters(imgData, 'grayscale', { brightness: 0, contrast: 0 });
      // Grayscale pixel channels must be identical
      expect(filtered.data[0]).toBe(filtered.data[1]);
      expect(filtered.data[1]).toBe(filtered.data[2]);
    });

    it('applies black and white threshold binarizing values to 0 or 255', () => {
      const imgData = makeMockImageData(2, 2);
      imgData.data[0] = 240;
      imgData.data[1] = 240;
      imgData.data[2] = 240;
      imgData.data[3] = 255;
      imgData.data[4] = 20;
      imgData.data[5] = 20;
      imgData.data[6] = 20;
      imgData.data[7] = 255;

      const filtered = applyScanFilters(imgData, 'bw', { brightness: 0, contrast: 0 });
      expect(filtered.data[0]).toBe(255);
      expect(filtered.data[4]).toBe(0);
    });

    it('applies Bradley-Roth adaptive threshold to overcome shadows', () => {
      const imgData = makeMockImageData(4, 4);
      // Fill with light background
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 180;
        imgData.data[i + 1] = 180;
        imgData.data[i + 2] = 180;
        imgData.data[i + 3] = 255;
      }
      // Put a dark ink pixel
      imgData.data[0] = 30;
      imgData.data[1] = 30;
      imgData.data[2] = 30;

      const filtered = applyScanFilters(imgData, 'adaptive', { brightness: 0, contrast: 0 });
      expect(filtered.data[0]).toBe(0); // ink
      expect(filtered.data[4]).toBe(255); // background
    });
  });

  describe('pdfExportLogic', () => {
    it('throws error when exporting empty list of pages', async () => {
      await expect(exportScannedPagesToPdf([], 'Test')).rejects.toThrow(
        'No pages available to export to PDF.'
      );
    });

    it('exports multi-page document to PDF bytes', async () => {
      // 1x1 transparent png
      const blankPng =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const pages: ScannedPageItem[] = [
        {
          id: 'p1',
          originalDataUrl: blankPng,
          processedDataUrl: blankPng,
          rotation: 0,
          filter: 'original',
          brightness: 0,
          contrast: 0,
          ocrText: 'Invoice Sample',
        },
      ];

      const bytes = await exportScannedPagesToPdf(pages, 'Test Document', 'fit');
      expect(bytes.length).toBeGreaterThan(100);
      expect(bytes[0]).toBe(0x25); // %
      expect(bytes[1]).toBe(0x50); // P
      expect(bytes[2]).toBe(0x44); // D
      expect(bytes[3]).toBe(0x46); // F
    });

    it('exports PDF with watermark and word-level OCR layer', async () => {
      const blankPng =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const pages: ScannedPageItem[] = [
        {
          id: 'p1',
          originalDataUrl: blankPng,
          processedDataUrl: blankPng,
          rotation: 0,
          filter: 'original',
          brightness: 0,
          contrast: 0,
          ocrWords: [
            { text: 'Invoice', x0: 10, y0: 10, x1: 50, y1: 20 },
            { text: '#1234', x0: 55, y0: 10, x1: 95, y1: 20 },
          ],
        },
      ];

      const bytes = await exportScannedPagesToPdf(pages, {
        title: 'Watermarked Doc',
        pageSize: 'a4',
        watermarkText: 'CONFIDENTIAL',
      });
      expect(bytes.length).toBeGreaterThan(100);
      expect(bytes[0]).toBe(0x25);
    });
  });

  describe('classifyCameraError', () => {
    it('identifies NotAllowedError and permission denied as denied', () => {
      const err = new Error('Permission denied');
      err.name = 'NotAllowedError';
      const classified = classifyCameraError(err);
      expect(classified.type).toBe('denied');
      expect(classified.message).toContain('Camera permission was denied');
    });

    it('identifies NotFoundError as notfound', () => {
      const err = new Error('Requested device not found');
      err.name = 'NotFoundError';
      const classified = classifyCameraError(err);
      expect(classified.type).toBe('notfound');
      expect(classified.message).toContain('No camera hardware found');
    });

    it('identifies NotReadableError as inuse', () => {
      const err = new Error('Camera is in use');
      err.name = 'NotReadableError';
      const classified = classifyCameraError(err);
      expect(classified.type).toBe('inuse');
      expect(classified.message).toContain('in use by another app');
    });

    it('handles unexpected error types safely', () => {
      const classified = classifyCameraError('random string');
      expect(classified.type).toBe('other');
    });
  });
});
