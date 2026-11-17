import React from 'react';
import { JwtPreset } from './types';
import { JWT_PRESETS } from './jwtStudioLogic';

interface JwtPresetsBarProps {
  onSelect: (preset: JwtPreset) => void;
}

export const JwtPresetsBar: React.FC<JwtPresetsBarProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface/60 p-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-outline">
        Token Presets:
      </span>
      {JWT_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset)}
          className="rounded-lg border border-outline-variant/60 bg-surface-container-low/60 px-3 py-1 text-xs font-medium text-on-surface transition hover:border-primary/50 hover:bg-surface-container-low"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};
