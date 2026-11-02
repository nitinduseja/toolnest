import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Sparkles, Trash2, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { CompressionOptions, ImageFileItem, TargetImageFormat } from './types';
import {
  compressImageFile,
  calculateTotalStats,
  getOutputFilename,
  triggerBlobDownload,
  createSampleImageFile,
} from './compressorLogic';
import { ImageDropZone } from './ImageDropZone';
import { CompressionControls } from './CompressionControls';
import { ImageListTable } from './ImageListTable';
import { ImageComparisonModal } from './ImageComparisonModal';
import { CompressionStatsBar } from './CompressionStatsBar';

const DEFAULT_OPTIONS: CompressionOptions = {
  quality: 0.75,
  format: 'original' as TargetImageFormat,
  maxWidth: 0,
  maxHeight: 0,
  grayscale: false,
};

export const ImageCompressorTool: React.FC = () => {
  const [items, setItems] = useState<ImageFileItem[]>([]);
  const [options, setOptions] = useState<CompressionOptions>(DEFAULT_OPTIONS);
  const [comparisonItem, setComparisonItem] = useState<ImageFileItem | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const itemsRef = useRef<ImageFileItem[]>(items);
  itemsRef.current = items;

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => {
        if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
      });
    };
  }, []);

  const processSingleFile = useCallback(
    async (file: File, opts: CompressionOptions, id: string): Promise<Partial<ImageFileItem>> => {
      try {
        const result = await compressImageFile(file, opts);
        const compUrl = URL.createObjectURL(result.blob);
        return {
          id,
          originalWidth: result.origWidth,
          originalHeight: result.origHeight,
          compressedBlob: result.blob,
          compressedUrl: compUrl,
          compressedSize: result.blob.size,
          compressedWidth: result.width,
          compressedHeight: result.height,
          status: 'done',
        };
      } catch (err) {
        return {
          id,
          status: 'error',
          errorMessage: err instanceof Error ? err.message : 'Compression failed',
        };
      }
    },
    []
  );

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      setIsProcessing(true);
      const newEntries: ImageFileItem[] = files.map((file) => ({
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        originalFile: file,
        originalUrl: URL.createObjectURL(file),
        originalSize: file.size,
        originalWidth: 0,
        originalHeight: 0,
        compressedBlob: null,
        compressedUrl: null,
        compressedSize: 0,
        compressedWidth: 0,
        compressedHeight: 0,
        status: 'processing',
      }));

      setItems((prev) => [...prev, ...newEntries]);

      for (const entry of newEntries) {
        const update = await processSingleFile(entry.originalFile, options, entry.id);
        setItems((prev) =>
          prev.map((item) => (item.id === entry.id ? { ...item, ...update } : item))
        );
      }
      setIsProcessing(false);
    },
    [options, processSingleFile]
  );

  const handleRecompressAll = useCallback(
    async (newOpts: CompressionOptions) => {
      setOptions(newOpts);
      if (items.length === 0) return;
      setIsProcessing(true);

      setItems((prev) =>
        prev.map((i) => {
          if (i.compressedUrl) URL.revokeObjectURL(i.compressedUrl);
          return { ...i, status: 'processing', compressedBlob: null, compressedUrl: null };
        })
      );

      for (const item of items) {
        const update = await processSingleFile(item.originalFile, newOpts, item.id);
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...update } : i)));
      }
      setIsProcessing(false);
    },
    [items, processSingleFile]
  );

  const handleDownload = (item: ImageFileItem) => {
    if (!item.compressedBlob) return;
    const name = getOutputFilename(item.name, options.format);
    triggerBlobDownload(item.compressedBlob, name);
  };

  const handleDownloadAll = () => {
    const doneItems = items.filter((i) => i.status === 'done' && i.compressedBlob);
    doneItems.forEach((item, index) => {
      setTimeout(() => handleDownload(item), index * 200);
    });
  };

  const handleRemove = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (target) {
      if (target.originalUrl) URL.revokeObjectURL(target.originalUrl);
      if (target.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    });
    setItems([]);
  };

  const handleLoadSample = async () => {
    const sample = await createSampleImageFile();
    await handleFilesSelected([sample]);
  };

  const stats = calculateTotalStats(items);
  const doneCount = items.filter((i) => i.status === 'done').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">Image Compressor & Converter</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              100% In-Browser
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Lossy and lossless compression, dimension resizing, and WebP conversion with zero cloud
            uploads.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Sample Image</span>
          </button>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-container hover:bg-surface-container-high border border-outline-variant text-outline hover:text-red-500 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <ImageDropZone onFilesSelected={handleFilesSelected} disabled={isProcessing} />

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-outline flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>COMPRESSION & CONVERSION SETTINGS</span>
          </span>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => handleRecompressAll(options)}
              disabled={isProcessing}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Recompress All</span>
            </button>
          )}
        </div>
        <CompressionControls
          options={options}
          onChange={(newOpts) => handleRecompressAll(newOpts)}
          disabled={isProcessing}
        />
      </div>

      <CompressionStatsBar
        stats={stats}
        doneCount={doneCount}
        totalCount={items.length}
        onDownloadAll={handleDownloadAll}
      />

      <ImageListTable
        items={items}
        onCompare={(item) => setComparisonItem(item)}
        onDownload={handleDownload}
        onRemove={handleRemove}
      />

      <ImageComparisonModal item={comparisonItem} onClose={() => setComparisonItem(null)} />
    </div>
  );
};

export default ImageCompressorTool;
