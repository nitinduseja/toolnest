import React from 'react';
import { SecurityPreset, SecurityHeadersConfig } from './types';
import { SECURITY_PRESETS } from './securityHeadersLogic';

interface SecurityPresetsBarProps {
  onSelect: (config: SecurityHeadersConfig) => void;
}

export const SecurityPresetsBar: React.FC<SecurityPresetsBarProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-surface-primary/60 p-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        Security Presets:
      </span>
      {SECURITY_PRESETS.map((preset: SecurityPreset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset.config)}
          className="rounded-lg border border-border/60 bg-surface-secondary/60 px-3 py-1 text-xs font-medium text-text-primary transition hover:border-primary/50 hover:bg-surface-secondary"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};
