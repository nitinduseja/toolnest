import React, { useState, useRef } from 'react';
import { X, SplitSquareVertical } from 'lucide-react';
import { ImageFileItem } from './types';
import { formatBytes, calculateSavings } from './compressorLogic';

export interface ImageComparisonModalProps {
  item: ImageFileItem | null;
  onClose: () => void;
}

export const ImageComparisonModal: React.FC<ImageComparisonModalProps> = ({ item, onClose }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  if (!item || !item.compressedUrl) return null;

  const savings = calculateSavings(item.originalSize, item.compressedSize);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) updatePosition(e.clientX);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none"
    >
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <SplitSquareVertical className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <span className="text-sm font-semibold text-on-surface truncate block">
                {item.name}
              </span>
              <span className="text-xs text-outline">
                Drag slider to inspect compressed quality
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono">
              <span className="text-outline">Original: </span>
              <strong className="text-on-surface">{formatBytes(item.originalSize)}</strong>
              <span className="mx-1 text-outline">→</span>
              <span className="text-primary font-bold">{formatBytes(item.compressedSize)}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[11px]">
                -{savings.percent}%
              </span>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparison Stage */}
        <div className="relative flex-1 bg-surface-container-lowest flex items-center justify-center overflow-hidden p-4 min-h-[360px]">
          <div
            ref={containerRef}
            className="relative max-w-full max-h-[70vh] overflow-hidden rounded-xl border border-outline-variant shadow-lg"
          >
            {/* Compressed Background (Right Side) */}
            <img
              src={item.compressedUrl}
              alt="Compressed"
              className="block max-w-full max-h-[70vh] object-contain"
            />

            {/* Original Overlay (Left Side) */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
              <img
                src={item.originalUrl}
                alt="Original"
                className="absolute inset-0 max-w-none h-full object-cover"
                style={{
                  width: containerRef.current ? containerRef.current.clientWidth : '100%',
                }}
              />
            </div>

            {/* Labels */}
            <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-semibold pointer-events-none">
              Original ({item.originalWidth}×{item.originalHeight})
            </span>
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-primary/90 text-on-primary text-[11px] font-semibold pointer-events-none">
              Compressed ({item.compressedWidth}×{item.compressedHeight})
            </span>

            {/* Draggable Divider */}
            <div
              onMouseDown={handleMouseDown}
              onTouchMove={handleTouchMove}
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-2xl"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-white text-black shadow-md flex items-center justify-center text-xs font-bold pointer-events-none">
                ↔
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
