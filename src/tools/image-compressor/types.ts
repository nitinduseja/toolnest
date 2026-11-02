/**
 * Types for the Image Compressor & Format Converter tool.
 */

export type TargetImageFormat = 'original' | 'image/jpeg' | 'image/png' | 'image/webp';

export interface CompressionOptions {
  quality: number; // 0.01 to 1.0 (e.g. 0.75)
  format: TargetImageFormat;
  maxWidth: number; // 0 = original
  maxHeight: number; // 0 = original
  grayscale: boolean;
}

export interface ImageFileItem {
  id: string;
  name: string;
  originalFile: File;
  originalUrl: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  compressedBlob: Blob | null;
  compressedUrl: string | null;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  errorMessage?: string;
}

export interface CompressionStats {
  totalOriginalBytes: number;
  totalCompressedBytes: number;
  totalSavedBytes: number;
  savingsPercentage: number;
}
