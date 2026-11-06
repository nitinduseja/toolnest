import React from 'react';
import { Bookmark, AlertTriangle } from 'lucide-react';
import { ChmodPreset, ChmodState } from './types';
import { COMMON_CHMOD_PRESETS, parseOctalInput, calculateOctalString } from './chmodLogic';

interface ChmodPresetsProps {
  state: ChmodState;
  onSelectPreset: (newState: ChmodState) => void;
}

export const ChmodPresets: React.FC<ChmodPresetsProps> = ({ state, onSelectPreset }) => {
  const currentOctal = calculateOctalString(state);

  const handlePresetClick = (preset: ChmodPreset) => {
    const parsed = parseOctalInput(preset.octal);
    if (!parsed) return;

    onSelectPreset({
      ...state,
      owner: parsed.owner ?? state.owner,
      group: parsed.group ?? state.group,
      others: parsed.others ?? state.others,
      special: parsed.special ?? { setuid: false, setgid: false, sticky: false },
      isDirectory:
        preset.id === '755' || preset.id === '700' || preset.id === '775' || preset.id === '1777',
    });
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-primary" />
          Common Linux Presets
        </h3>
        <span className="text-[11px] text-outline font-medium">Click to apply profile</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {COMMON_CHMOD_PRESETS.map((preset) => {
          const isActive = currentOctal === preset.octal;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetClick(preset)}
              title={preset.description}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                isActive
                  ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary/30'
                  : 'bg-surface border-outline-variant/50 hover:border-outline hover:bg-surface-container-high'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-on-surface flex items-center gap-1">
                  {preset.octal}
                  {preset.isWarning && (
                    <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </span>
                <span className="font-mono text-[9px] text-outline">{preset.symbolic}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-medium mt-1 truncate group-hover:text-on-surface">
                {preset.name.split(' (')[0]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
