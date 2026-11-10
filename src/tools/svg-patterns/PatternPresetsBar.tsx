import React from 'react';
import { PatternPreset, PatternConfig } from './types';
import { PATTERN_PRESETS, generateDataUri } from './patternLogic';

interface PatternPresetsBarProps {
  onSelect: (config: PatternConfig) => void;
}

export const PatternPresetsBar: React.FC<PatternPresetsBarProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-surface-primary/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Curated Background Patterns
        </span>
        <span className="text-xs text-text-tertiary">{PATTERN_PRESETS.length} presets</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
        {PATTERN_PRESETS.map((preset: PatternPreset) => {
          const uri = generateDataUri(preset.config);
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset.config)}
              className="group flex flex-col items-center gap-1.5 rounded-lg border border-border/50 p-2 text-left transition hover:border-primary/50 hover:bg-surface-secondary/50"
            >
              <div
                className="h-10 w-full rounded-md shadow-inner transition group-hover:scale-[1.02]"
                style={{
                  backgroundImage: `url("${uri}")`,
                  backgroundColor: preset.config.bgColor,
                }}
              />
              <span className="truncate text-xs font-medium text-text-primary">{preset.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
