import React from 'react';
import { Sliders, Maximize2, Moon } from 'lucide-react';
import { CompressionOptions, TargetImageFormat } from './types';

export interface CompressionControlsProps {
  options: CompressionOptions;
  onChange: (options: CompressionOptions) => void;
  disabled?: boolean;
}

const QUALITY_PRESETS = [
  { label: 'High (90%)', value: 0.9 },
  { label: 'Balanced (75%)', value: 0.75 },
  { label: 'Compact (50%)', value: 0.5 },
  { label: 'Ultra (25%)', value: 0.25 },
];

const FORMAT_OPTIONS: { id: TargetImageFormat; label: string }[] = [
  { id: 'original', label: 'Keep Original' },
  { id: 'image/webp', label: 'WebP (Recommended)' },
  { id: 'image/jpeg', label: 'JPEG' },
  { id: 'image/png', label: 'PNG' },
];

const RESIZE_PRESETS = [
  { label: 'Original', maxW: 0, maxH: 0 },
  { label: '1920px (FHD)', maxW: 1920, maxH: 1080 },
  { label: '1280px (HD)', maxW: 1280, maxH: 720 },
  { label: '800px (Web)', maxW: 800, maxH: 600 },
];

export const CompressionControls: React.FC<CompressionControlsProps> = ({
  options,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quality Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-on-surface flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" />
              <span>Image Quality</span>
            </span>
            <span className="font-mono font-bold text-primary">
              {Math.round(options.quality * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="100"
            step="1"
            disabled={disabled}
            value={Math.round(options.quality * 100)}
            onChange={(e) => onChange({ ...options, quality: Number(e.target.value) / 100 })}
            className="w-full accent-primary cursor-pointer"
          />

          <div className="flex items-center gap-1 flex-wrap pt-1">
            {QUALITY_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...options, quality: p.value })}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                  Math.abs(options.quality - p.value) < 0.02
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container hover:bg-surface-container-high border-outline-variant text-on-surface'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-on-surface">Output Format</label>
          <div className="grid grid-cols-2 gap-1.5">
            {FORMAT_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...options, format: f.id })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-left truncate cursor-pointer ${
                  options.format === f.id
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high border-outline-variant text-on-surface'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {options.format === 'image/png' && (
            <p className="text-[11px] text-amber-500 pt-0.5">
              Notice: PNG is lossless. To reduce PNG file weight, adjust dimensions with Resize
              below.
            </p>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between flex-wrap gap-3">
        {/* Resize Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-on-surface flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-primary" />
            <span>Resize:</span>
          </span>
          {RESIZE_PRESETS.map((r) => {
            const isMatch = options.maxWidth === r.maxW && options.maxHeight === r.maxH;
            return (
              <button
                key={r.label}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...options, maxWidth: r.maxW, maxHeight: r.maxH })}
                className={`px-2 py-0.5 rounded text-[11px] border transition-colors cursor-pointer ${
                  isMatch
                    ? 'bg-primary text-on-primary border-primary font-semibold'
                    : 'bg-surface-container hover:bg-surface-container-high border-outline-variant text-on-surface'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Grayscale Toggle */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange({ ...options, grayscale: !options.grayscale })}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border transition-colors cursor-pointer ${
            options.grayscale
              ? 'bg-primary text-on-primary border-primary font-semibold'
              : 'bg-surface-container hover:bg-surface-container-high border-outline-variant text-on-surface'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Grayscale</span>
        </button>
      </div>
    </div>
  );
};
