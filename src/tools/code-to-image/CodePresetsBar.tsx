import React from 'react';
import { Sparkles } from 'lucide-react';

import { CodeCardPreset, CodeCardConfig } from './types';
import { CODE_PRESETS } from './themeConfig';

interface CodePresetsBarProps {
  onSelect: (config: Partial<CodeCardConfig>) => void;
}

export const CodePresetsBar: React.FC<CodePresetsBarProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-outline mr-1">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span>Presets:</span>
      </div>

      {CODE_PRESETS.map((preset: CodeCardPreset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset.config)}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/80 transition-colors cursor-pointer shadow-2xs"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};
