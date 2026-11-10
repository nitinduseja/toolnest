import React from 'react';
import { JwtPreset } from './types';
import { JWT_PRESETS } from './jwtStudioLogic';

interface JwtPresetsBarProps {
  onSelect: (preset: JwtPreset) => void;
}

export const JwtPresetsBar: React.FC<JwtPresetsBarProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-surface-primary/60 p-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        Token Presets:
      </span>
      {JWT_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset)}
          className="rounded-lg border border-border/60 bg-surface-secondary/60 px-3 py-1 text-xs font-medium text-text-primary transition hover:border-primary/50 hover:bg-surface-secondary"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};
