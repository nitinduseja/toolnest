import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import { DockerPreset } from './types';
import { DOCKER_PRESETS } from './dockerLogic';

interface DockerPresetsBarProps {
  onSelectPreset: (preset: DockerPreset) => void;
}

export const DockerPresetsBar: React.FC<DockerPresetsBarProps> = ({ onSelectPreset }) => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> Popular Docker Run Presets
        </span>
        <span className="text-[11px] text-outline font-medium">Click to load</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {DOCKER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset)}
            className="p-3 rounded-xl bg-surface border border-outline-variant/50 hover:border-primary/50 hover:bg-surface-container text-left transition-all group"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-on-surface truncate">{preset.name}</span>
            </div>
            <p className="text-[11px] text-outline mt-1.5 line-clamp-2 leading-relaxed">
              {preset.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
