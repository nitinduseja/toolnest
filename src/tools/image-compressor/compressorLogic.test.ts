import { describe, it, expect } from 'vitest';
import {
  computeScaledDimensions,
  determineOutputMime,
  formatBytes,
  calculateSavings,
  calculateTotalStats,
  getOutputFilename,
} from './compressorLogic';
import { ImageFileItem } from './types';

describe('compressorLogic', () => {
  describe('computeScaledDimensions', () => {
    it('preserves dimensions when max limits are 0', () => {
      const res = computeScaledDimensions(1920, 1080, { maxW: 0, maxH: 0 });
      expect(res).toEqual({ width: 1920, height: 1080 });
    });

    it('scales down width while maintaining aspect ratio', () => {
      const res = computeScaledDimensions(2000, 1000, { maxW: 1000, maxH: 0 });
      expect(res).toEqual({ width: 1000, height: 500 });
    });

    it('scales down height while maintaining aspect ratio', () => {
      const res = computeScaledDimensions(1000, 2000, { maxW: 0, maxH: 1000 });
      expect(res).toEqual({ width: 500, height: 1000 });
    });

    it('constrains by both max dimensions proportionally', () => {
      const res = computeScaledDimensions(3000, 2000, { maxW: 1500, maxH: 800 });
      expect(res.width).toBeLessThanOrEqual(1500);
      expect(res.height).toBeLessThanOrEqual(800);
      expect(res).toEqual({ width: 1200, height: 800 });
    });
  });

  describe('determineOutputMime', () => {
    it('returns target format when explicitly specified', () => {
      expect(determineOutputMime('image/png', 'image/webp')).toBe('image/webp');
      expect(determineOutputMime('image/png', 'image/jpeg')).toBe('image/jpeg');
    });

    it('preserves original mime when targetFormat is original', () => {
      expect(determineOutputMime('image/png', 'original')).toBe('image/png');
      expect(determineOutputMime('image/webp', 'original')).toBe('image/webp');
    });

    it('falls back to image/jpeg if original type is unknown', () => {
      expect(determineOutputMime('', 'original')).toBe('image/jpeg');
    });
  });

  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(500)).toBe('500 B');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(2097152)).toBe('2.00 MB');
    });
  });

  describe('calculateSavings', () => {
    it('computes savings percentage accurately', () => {
      const s1 = calculateSavings(1000, 400);
      expect(s1.percent).toBe(60);
      expect(s1.isSmaller).toBe(true);

      const s2 = calculateSavings(500, 600);
      expect(s2.percent).toBe(-20);
      expect(s2.isSmaller).toBe(false);
    });
  });

  describe('calculateTotalStats', () => {
    it('aggregates total stats across completed images', () => {
      const items: ImageFileItem[] = [
        {
          id: '1',
          name: 'photo1.jpg',
          originalFile: new File([], 'photo1.jpg'),
          originalUrl: '',
          originalSize: 1000,
          originalWidth: 100,
          originalHeight: 100,
          compressedBlob: new Blob([]),
          compressedUrl: '',
          compressedSize: 300,
          compressedWidth: 50,
          compressedHeight: 50,
          status: 'done',
        },
        {
          id: '2',
          name: 'photo2.png',
          originalFile: new File([], 'photo2.png'),
          originalUrl: '',
          originalSize: 2000,
          originalWidth: 200,
          originalHeight: 200,
          compressedBlob: new Blob([]),
          compressedUrl: '',
          compressedSize: 900,
          compressedWidth: 100,
          compressedHeight: 100,
          status: 'done',
        },
        {
          id: '3',
          name: 'pending.png',
          originalFile: new File([], 'pending.png'),
          originalUrl: '',
          originalSize: 500,
          originalWidth: 50,
          originalHeight: 50,
          compressedBlob: null,
          compressedUrl: null,
          compressedSize: 0,
          compressedWidth: 0,
          compressedHeight: 0,
          status: 'pending',
        },
      ];

      const stats = calculateTotalStats(items);
      expect(stats.totalOriginalBytes).toBe(3000);
      expect(stats.totalCompressedBytes).toBe(1200);
      expect(stats.totalSavedBytes).toBe(1800);
      expect(stats.savingsPercentage).toBe(60);
    });
  });

  describe('getOutputFilename', () => {
    it('renames extension based on target format', () => {
      expect(getOutputFilename('banner.png', 'image/webp')).toBe('banner.webp');
      expect(getOutputFilename('photo.png', 'image/jpeg')).toBe('photo.jpg');
      expect(getOutputFilename('image.webp', 'image/png')).toBe('image.png');
      expect(getOutputFilename('sample.custom.jpg', 'original')).toBe('sample.custom.jpg');
    });
  });
});
