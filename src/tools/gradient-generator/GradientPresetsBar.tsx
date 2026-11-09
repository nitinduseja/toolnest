import React from 'react';
import { GradientPreset, GradientConfig } from './types';
import { PRESET_GRADIENTS, generateGradientCss } from './gradientLogic';

interface GradientPresetsBarProps {
  onSelectPreset: (config: GradientConfig) => void;
}

export const GradientPresetsBar: React.FC<GradientPresetsBarProps> = ({ onSelectPreset }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-surface-primary/60 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Curated Palettes & Presets
        </span>
        <span className="text-xs text-text-tertiary">{PRESET_GRADIENTS.length} presets</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
        {PRESET_GRADIENTS.map((preset: GradientPreset) => {
          const bgCss = generateGradientCss(preset.config);
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.config)}
              className="group flex flex-col items-center gap-1.5 rounded-lg border border-border/50 p-2 text-left transition hover:border-primary/50 hover:bg-surface-secondary/50"
            >
              <div
                className="h-10 w-full rounded-md shadow-inner transition group-hover:scale-[1.02]"
                style={{ background: bgCss }}
              />
              <span className="truncate text-xs font-medium text-text-primary">{preset.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
