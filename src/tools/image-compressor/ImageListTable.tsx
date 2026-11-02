import React from 'react';
import { Download, Trash2, SplitSquareVertical, Loader2, AlertCircle } from 'lucide-react';
import { ImageFileItem } from './types';
import { formatBytes, calculateSavings } from './compressorLogic';

export interface ImageListTableProps {
  items: ImageFileItem[];
  onCompare: (item: ImageFileItem) => void;
  onDownload: (item: ImageFileItem) => void;
  onRemove: (id: string) => void;
}

export const ImageListTable: React.FC<ImageListTableProps> = ({
  items,
  onCompare,
  onDownload,
  onRemove,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-outline px-1">
        <span>IMAGES ({items.length})</span>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const savings = calculateSavings(item.originalSize, item.compressedSize);

          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs"
            >
              {/* Thumbnail & File Name */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  onClick={() => item.compressedUrl && onCompare(item)}
                  className={`w-14 h-14 rounded-lg bg-surface-container-lowest border border-outline-variant/60 overflow-hidden shrink-0 flex items-center justify-center ${
                    item.compressedUrl ? 'cursor-pointer hover:opacity-80' : ''
                  }`}
                  title={item.compressedUrl ? 'Click to inspect comparison' : undefined}
                >
                  <img
                    src={item.compressedUrl || item.originalUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-semibold text-on-surface truncate">{item.name}</p>
                  <p className="text-[11px] text-outline font-mono">
                    {item.originalWidth > 0 && (
                      <span>
                        {item.originalWidth}×{item.originalHeight}
                        {item.compressedWidth > 0 &&
                          (item.compressedWidth !== item.originalWidth ||
                            item.compressedHeight !== item.originalHeight) && (
                            <span>
                              {' '}
                              → {item.compressedWidth}×{item.compressedHeight}
                            </span>
                          )}
                      </span>
                    )}
                  </p>
                  {item.errorMessage && (
                    <p className="text-[10px] text-red-500">{item.errorMessage}</p>
                  )}
                </div>
              </div>

              {/* Status and Size Metrics */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="text-right">
                  {item.status === 'processing' && (
                    <span className="flex items-center gap-1.5 text-primary text-[11px]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Compressing...</span>
                    </span>
                  )}

                  {item.status === 'error' && (
                    <span className="flex items-center gap-1 text-red-500 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Failed</span>
                    </span>
                  )}

                  {item.status === 'done' && (
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-outline line-through text-[11px]">
                        {formatBytes(item.originalSize)}
                      </span>
                      <span className="text-on-surface font-bold">
                        {formatBytes(item.compressedSize)}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          savings.isSmaller
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {savings.isSmaller
                          ? `-${savings.percent}%`
                          : `+${Math.abs(savings.percent)}%`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {item.compressedUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() => onCompare(item)}
                        title="Compare Before & After"
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer"
                      >
                        <SplitSquareVertical className="w-3.5 h-3.5 text-primary" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDownload(item)}
                        title="Download compressed image"
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-primary" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    title="Remove image"
                    className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
