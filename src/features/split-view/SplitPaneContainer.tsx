import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import { SecondaryToolPane } from './SecondaryToolPane';
import {
  DEFAULT_SPLIT_RATIO,
  MIN_SPLIT_RATIO,
  MAX_SPLIT_RATIO,
  clampSplitRatio,
  getStoredSplitRatio,
  saveStoredSplitRatio,
  calculateSplitRatioFromDrag,
} from './splitViewLogic';

interface SplitPaneContainerProps {
  currentToolId: string;
  secondarySlug: string;
  onSelectSlug: (slug: string) => void;
  onClose: () => void;
  children: React.ReactNode;
}

const PRESET_RATIOS = [30, 50, 70];

export const SplitPaneContainer: React.FC<SplitPaneContainerProps> = ({
  currentToolId,
  secondarySlug,
  onSelectSlug,
  onClose,
  children,
}) => {
  const [splitRatio, setSplitRatio] = useState<number>(getStoredSplitRatio);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const applyRatio = useCallback((next: number) => {
    const clamped = clampSplitRatio(next);
    setSplitRatio(clamped);
    saveStoredSplitRatio(clamped);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handlePointerMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      applyRatio(
        calculateSplitRatioFromDrag({
          clientX: e.clientX,
          rectLeft: rect.left,
          rectWidth: rect.width,
        })
      );
    };
    const handlePointerUp = () => setIsDragging(false);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, applyRatio]);

  const handleDividerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      applyRatio(splitRatio - 5);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      applyRatio(splitRatio + 5);
    } else if (e.key === 'Home' || e.key === 'Enter') {
      e.preventDefault();
      applyRatio(DEFAULT_SPLIT_RATIO);
    }
  };

  return (
    <div className="space-y-3 max-w-[1750px] mx-auto">
      {/* Subtle Desktop Ratio Bar */}
      <div className="hidden xl:flex items-center justify-between px-1 text-[11px] text-outline">
        <span>Drag divider or press Left/Right arrow keys to resize split panes</span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-on-surface-variant mr-1">
            {splitRatio}% / {100 - splitRatio}%
          </span>
          {PRESET_RATIOS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyRatio(preset)}
              className={`px-2 py-0.5 rounded-md border font-mono text-[10px] transition-colors cursor-pointer ${
                splitRatio === preset
                  ? 'bg-primary-container text-on-primary-container border-primary/40 font-semibold'
                  : 'bg-surface-container-low border-outline-variant hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              {preset}/{100 - preset}
            </button>
          ))}
        </div>
      </div>

      {/* Split Panes Container */}
      <div
        ref={containerRef}
        className={`flex flex-col xl:flex-row gap-4 xl:gap-0 items-stretch ${
          isDragging ? 'select-none' : ''
        }`}
      >
        <div
          className={`min-w-0 w-full xl:shrink-0 ${
            isDragging ? '' : 'transition-[width] duration-75'
          }`}
          data-testid="primary-split-pane"
        >
          {children}
        </div>

        <style>{`
          @media (min-width: 1280px) {
            [data-testid="primary-split-pane"] {
              width: ${splitRatio}%;
              padding-right: 0.5rem;
            }
          }
        `}</style>

        {/* Draggable Resizer Handle (Desktop XL+) */}
        <div
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label="Resize split workspace panes"
          aria-valuemin={MIN_SPLIT_RATIO}
          aria-valuemax={MAX_SPLIT_RATIO}
          aria-valuenow={splitRatio}
          onPointerDown={() => setIsDragging(true)}
          onDoubleClick={() => applyRatio(DEFAULT_SPLIT_RATIO)}
          onKeyDown={handleDividerKeyDown}
          title="Drag to resize • Double-click to reset 50/50"
          className={`hidden xl:flex flex-col items-center justify-center w-4 shrink-0 cursor-col-resize group focus:outline-none ${
            isDragging ? 'text-primary' : 'text-outline hover:text-primary'
          }`}
        >
          <div
            className={`w-1 h-full min-h-[240px] rounded-full transition-colors flex items-center justify-center ${
              isDragging
                ? 'bg-primary'
                : 'bg-outline-variant/60 group-hover:bg-primary/60 group-focus:bg-primary'
            }`}
          >
            <div className="p-0.5 rounded-md bg-surface border border-outline-variant shadow-xs">
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Secondary Pane */}
        <div className="min-w-0 flex-1 xl:pl-2 flex flex-col">
          <SecondaryToolPane
            currentToolId={currentToolId}
            selectedSlug={secondarySlug}
            onSelectSlug={onSelectSlug}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
