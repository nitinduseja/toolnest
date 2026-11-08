import React from 'react';
import { FlexConfig } from './types';

interface FlexControlsProps {
  config: FlexConfig;
  onChange: (updated: FlexConfig) => void;
}

export const FlexControls: React.FC<FlexControlsProps> = ({ config, onChange }) => {
  const handleChange = <K extends keyof FlexConfig>(field: K, val: FlexConfig[K]) => {
    onChange({ ...config, [field]: val });
  };

  return (
    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-4">
      {/* Direction */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider">
          flex-direction
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['row', 'row-reverse', 'column', 'column-reverse'] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => handleChange('direction', dir)}
              className={`px-2.5 py-1.5 text-xs font-mono font-medium rounded-xl border transition-all ${
                config.direction === dir
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
              }`}
            >
              {dir}
            </button>
          ))}
        </div>
      </div>

      {/* Justify Content */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider">
          justify-content
        </label>
        <select
          value={config.justifyContent}
          onChange={(e) =>
            handleChange('justifyContent', e.target.value as FlexConfig['justifyContent'])
          }
          className="w-full px-3 py-1.5 text-xs font-mono rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface"
        >
          <option value="flex-start">flex-start (Start)</option>
          <option value="center">center (Center)</option>
          <option value="flex-end">flex-end (End)</option>
          <option value="space-between">space-between (Between)</option>
          <option value="space-around">space-around (Around)</option>
          <option value="space-evenly">space-evenly (Evenly)</option>
        </select>
      </div>

      {/* Align Items */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider">
          align-items
        </label>
        <select
          value={config.alignItems}
          onChange={(e) => handleChange('alignItems', e.target.value as FlexConfig['alignItems'])}
          className="w-full px-3 py-1.5 text-xs font-mono rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface"
        >
          <option value="stretch">stretch (Stretch)</option>
          <option value="flex-start">flex-start (Start)</option>
          <option value="center">center (Center)</option>
          <option value="flex-end">flex-end (End)</option>
          <option value="baseline">baseline (Baseline)</option>
        </select>
      </div>

      {/* Flex Wrap */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider">
          flex-wrap
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['nowrap', 'wrap', 'wrap-reverse'] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => handleChange('wrap', w)}
              className={`px-2 py-1.5 text-xs font-mono font-medium rounded-xl border transition-all ${
                config.wrap === w
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
              }`}
            >
              {w}
            </button>
          ))}
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
    </div>
  );
};
