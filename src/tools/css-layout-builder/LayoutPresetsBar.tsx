import React from 'react';
import { Sparkles } from 'lucide-react';
import { LayoutPreset } from './types';
import { LAYOUT_PRESETS } from './layoutLogic';

interface LayoutPresetsBarProps {
  onSelectPreset: (preset: LayoutPreset) => void;
  activeId?: string;
}

export const LayoutPresetsBar: React.FC<LayoutPresetsBarProps> = ({ onSelectPreset, activeId }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-outline mr-1">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span>Presets:</span>
      </div>
      {LAYOUT_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelectPreset(preset)}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
            activeId === preset.id
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/60 text-on-surface'
          }`}
          title={preset.description}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};
