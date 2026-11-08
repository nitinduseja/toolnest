import React from 'react';
import { GridConfig } from './types';

interface GridControlsProps {
  config: GridConfig;
  onChange: (updated: GridConfig) => void;
}

export const GridControls: React.FC<GridControlsProps> = ({ config, onChange }) => {
  const handleChange = <K extends keyof GridConfig>(field: K, val: GridConfig[K]) => {
    onChange({ ...config, [field]: val });
  };

  return (
    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-4">
      {/* Column Count */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-outline uppercase tracking-wider">
            Columns (grid-cols)
          </span>
          <span className="font-mono text-primary font-bold">{config.columns}</span>
        </div>
        <input
          type="range"
          min={1}
          max={6}
          value={config.columns}
          onChange={(e) => handleChange('columns', Number(e.target.value))}
          className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-outline font-mono">
          <span>1 col</span>
          <span>2 cols</span>
          <span>3 cols</span>
          <span>4 cols</span>
          <span>6 cols</span>
        </div>
      </div>

      {/* Gap Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-outline uppercase tracking-wider">gap</span>
          <span className="font-mono text-outline">{config.gap}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={64}
          value={config.gap}
          onChange={(e) => handleChange('gap', Number(e.target.value))}
          className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
        />
      </div>

      {/* justify-items */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider">
          justify-items
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['stretch', 'start', 'center', 'end'] as const).map((j) => (
            <button
              key={j}
              type="button"
              onClick={() => handleChange('justifyItems', j)}
              className={`px-2 py-1.5 text-xs font-mono font-medium rounded-xl border transition-all ${
                config.justifyItems === j
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
              }`}
            >
              {j}
            </button>
          ))}
        </div>
      </div>

      {/* align-items */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider">
          align-items
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['stretch', 'start', 'center', 'end'] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => handleChange('alignItems', a)}
              className={`px-2 py-1.5 text-xs font-mono font-medium rounded-xl border transition-all ${
                config.alignItems === a
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
