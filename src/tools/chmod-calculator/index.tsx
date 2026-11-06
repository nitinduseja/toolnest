import React, { useState } from 'react';
import { Key, Copy, Check, RotateCcw } from 'lucide-react';
import { ChmodState } from './types';
import {
  DEFAULT_CHMOD_STATE,
  calculateOctalString,
  calculateSymbolicString,
  parseOctalInput,
  parseSymbolicInput,
} from './chmodLogic';
import { PermissionMatrix } from './PermissionMatrix';
import { ChmodPresets } from './ChmodPresets';
import { CommandPreview } from './CommandPreview';
import { PermissionExplainer } from './PermissionExplainer';

export const ChmodCalculatorTool: React.FC = () => {
  const [state, setState] = useState<ChmodState>(DEFAULT_CHMOD_STATE);
  const [octalText, setOctalText] = useState<string>('755');
  const [symbolicText, setSymbolicText] = useState<string>('-rwxr-xr-x');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentOctal = calculateOctalString(state);
  const currentSymbolic = calculateSymbolicString(state);

  const syncState = (newState: ChmodState) => {
    setState(newState);
    setOctalText(calculateOctalString(newState));
    setSymbolicText(calculateSymbolicString(newState));
  };

  const handleOctalChange = (val: string) => {
    setOctalText(val);
    const parsed = parseOctalInput(val);
    if (parsed) {
      const nextState: ChmodState = {
        ...state,
        owner: parsed.owner ?? state.owner,
        group: parsed.group ?? state.group,
        others: parsed.others ?? state.others,
        special: parsed.special ?? state.special,
      };
      setState(nextState);
      setSymbolicText(calculateSymbolicString(nextState));
    }
  };

  const handleSymbolicChange = (val: string) => {
    setSymbolicText(val);
    const parsed = parseSymbolicInput(val);
    if (parsed) {
      const nextState: ChmodState = {
        ...state,
        owner: parsed.owner ?? state.owner,
        group: parsed.group ?? state.group,
        others: parsed.others ?? state.others,
        special: parsed.special ?? state.special,
        isDirectory: parsed.isDirectory ?? state.isDirectory,
      };
      setState(nextState);
      setOctalText(calculateOctalString(nextState));
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReset = () => {
    syncState(DEFAULT_CHMOD_STATE);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner & Fast Interactive Inputs */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">
                Chmod / Linux Permissions Calculator
              </h2>
              <p className="text-xs text-outline mt-0.5">
                Calculate octal permissions, symbolic flags, command strings, and security audits.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Octal Input Box */}
          <div className="bg-surface border border-outline-variant/60 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-2xs">
            <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">
              Octal
            </span>
            <input
              type="text"
              maxLength={4}
              value={octalText}
              onChange={(e) => handleOctalChange(e.target.value)}
              className="w-14 font-mono font-bold text-sm text-primary bg-transparent focus:outline-none"
              title="Type octal permission code (e.g., 755 or 1777)"
            />
            <button
              type="button"
              onClick={() => handleCopy(currentOctal, 'octal')}
              className="text-on-surface-variant hover:text-on-surface p-1 transition-colors"
              title="Copy octal"
            >
              {copiedKey === 'octal' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Symbolic Input Box */}
          <div className="bg-surface border border-outline-variant/60 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-2xs">
            <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">
              Symbolic
            </span>
            <input
              type="text"
              maxLength={10}
              value={symbolicText}
              onChange={(e) => handleSymbolicChange(e.target.value)}
              className="w-24 font-mono font-bold text-sm text-on-surface bg-transparent focus:outline-none"
              title="Type symbolic permissions (e.g., -rwxr-xr-x or drwxrwxrwt)"
            />
            <button
              type="button"
              onClick={() => handleCopy(currentSymbolic, 'symbolic')}
              className="text-on-surface-variant hover:text-on-surface p-1 transition-colors"
              title="Copy symbolic string"
            >
              {copiedKey === 'symbolic' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            title="Reset to default (755)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Permission Checkbox Matrix */}
      <PermissionMatrix state={state} onChange={syncState} />

      {/* Common Presets Selector */}
      <ChmodPresets state={state} onSelectPreset={syncState} />

      {/* Terminal Command Generator */}
      <CommandPreview state={state} />

      {/* Permission Explanation and Security Advisory */}
      <PermissionExplainer state={state} />
    </div>
  );
};

export default ChmodCalculatorTool;
