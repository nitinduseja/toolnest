import React from 'react';
import { PatternConfig, PatternType } from './types';

const PATTERN_TYPES: { id: PatternType; label: string }[] = [
  { id: 'dots', label: 'Polka Dots' },
  { id: 'grid', label: 'Grid' },
  { id: 'isometric', label: 'Isometric' },
  { id: 'chevron', label: 'Chevron' },
  { id: 'diagonal', label: 'Diagonals' },
  { id: 'hexagons', label: 'Hexagons' },
  { id: 'circuit', label: 'Circuit PCB' },
];

interface PatternControlsProps {
  config: PatternConfig;
  onChange: (config: PatternConfig) => void;
}

export const PatternControls: React.FC<PatternControlsProps> = ({ config, onChange }) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-surface-primary/60 p-4">
      {/* Pattern Type Selector */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Pattern Type
        </span>
        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {PATTERN_TYPES.map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => onChange({ ...config, type: pt.id })}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                config.type === pt.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border/50 bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80'
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fg-color" className="text-xs font-semibold text-text-secondary">
            Pattern Color
          </label>
          <div className="flex items-center gap-2">
            <input
              id="fg-color"
              type="color"
              aria-label="Foreground color"
              value={config.fgColor}
              onChange={(e) => onChange({ ...config, fgColor: e.target.value })}
              className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
            />
            <input
              type="text"
              aria-label="Foreground hex"
              value={config.fgColor}
              onChange={(e) => onChange({ ...config, fgColor: e.target.value })}
              className="w-full rounded border border-border/60 bg-surface-secondary px-2.5 py-1 font-mono text-xs text-text-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="bg-color" className="text-xs font-semibold text-text-secondary">
              Background Color
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-text-tertiary">
              <input
                type="checkbox"
                checked={config.isTransparentBg}
                onChange={(e) => onChange({ ...config, isTransparentBg: e.target.checked })}
                className="rounded accent-primary"
              />
              Transparent
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="bg-color"
              type="color"
              aria-label="Background color"
              disabled={config.isTransparentBg}
              value={config.bgColor}
              onChange={(e) => onChange({ ...config, bgColor: e.target.value })}
              className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5 disabled:opacity-40"
            />
            <input
              type="text"
              aria-label="Background hex"
              disabled={config.isTransparentBg}
              value={config.bgColor}
              onChange={(e) => onChange({ ...config, bgColor: e.target.value })}
              className="w-full rounded border border-border/60 bg-surface-secondary px-2.5 py-1 font-mono text-xs text-text-primary disabled:opacity-40"
            />
          </div>
        </div>
      </div>

      {/* Sliders: Scale, Stroke Width, Opacity */}
      <div className="flex flex-col gap-3 border-t border-border/40 pt-3">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-text-secondary">Scale / Tile Size</span>
            <span className="font-mono text-text-tertiary">{config.scale}px</span>
          </div>
          <input
            type="range"
            aria-label="Scale"
            min={10}
            max={100}
            value={config.scale}
            onChange={(e) => onChange({ ...config, scale: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-text-secondary">Stroke / Dot Width</span>
            <span className="font-mono text-text-tertiary">{config.strokeWidth}px</span>
          </div>
          <input
            type="range"
            aria-label="Stroke Width"
            min={0.5}
            max={6}
            step={0.5}
            value={config.strokeWidth}
            onChange={(e) => onChange({ ...config, strokeWidth: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-text-secondary">Opacity</span>
            <span className="font-mono text-text-tertiary">
              {Math.round(config.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            aria-label="Opacity"
            min={0.1}
            max={1.0}
            step={0.05}
            value={config.opacity}
            onChange={(e) => onChange({ ...config, opacity: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
      </div>
    </div>
  );
};
