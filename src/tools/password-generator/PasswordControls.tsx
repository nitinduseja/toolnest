import React from 'react';
import { PasswordOptions, PassphraseOptions } from './passwordLogic';

export interface PasswordControlsProps {
  mode: 'password' | 'passphrase';
  onModeChange: (m: 'password' | 'passphrase') => void;
  pwdOptions: PasswordOptions;
  onPwdOptionsChange: (opts: PasswordOptions) => void;
  passOptions: PassphraseOptions;
  onPassOptionsChange: (opts: PassphraseOptions) => void;
  quantity: number;
  onQuantityChange: (q: number) => void;
}

const SEPARATORS = [
  { label: 'Hyphen (-)', val: '-' },
  { label: 'Space ( )', val: ' ' },
  { label: 'Underscore (_)', val: '_' },
  { label: 'Period (.)', val: '.' },
];

const QUANTITIES = [1, 5, 10];

export const PasswordControls: React.FC<PasswordControlsProps> = ({
  mode,
  onModeChange,
  pwdOptions,
  onPwdOptionsChange,
  passOptions,
  onPassOptionsChange,
  quantity,
  onQuantityChange,
}) => {
  return (
    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
      {/* Mode Switcher */}
      <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
        <button
          type="button"
          onClick={() => onModeChange('password')}
          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'password'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => onModeChange('passphrase')}
          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'passphrase'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Passphrase
        </button>
      </div>

      {mode === 'password' ? (
        <div className="space-y-3">
          {/* Length Slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-on-surface mb-1">
              <span>Password Length</span>
              <span className="font-mono font-bold text-primary">{pwdOptions.length}</span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              value={pwdOptions.length}
              onChange={(e) =>
                onPwdOptionsChange({ ...pwdOptions, length: Number(e.target.value) })
              }
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Charset Checkboxes */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={pwdOptions.useUpper}
                onChange={(e) => onPwdOptionsChange({ ...pwdOptions, useUpper: e.target.checked })}
                className="rounded accent-primary"
              />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={pwdOptions.useLower}
                onChange={(e) => onPwdOptionsChange({ ...pwdOptions, useLower: e.target.checked })}
                className="rounded accent-primary"
              />
              <span>Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2 text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={pwdOptions.useNumbers}
                onChange={(e) =>
                  onPwdOptionsChange({ ...pwdOptions, useNumbers: e.target.checked })
                }
                className="rounded accent-primary"
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={pwdOptions.useSymbols}
                onChange={(e) =>
                  onPwdOptionsChange({ ...pwdOptions, useSymbols: e.target.checked })
                }
                className="rounded accent-primary"
              />
              <span>Symbols (!@#$)</span>
            </label>
          </div>

          <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer select-none pt-1 border-t border-outline-variant/40">
            <input
              type="checkbox"
              checked={pwdOptions.excludeAmbiguous}
              onChange={(e) =>
                onPwdOptionsChange({ ...pwdOptions, excludeAmbiguous: e.target.checked })
              }
              className="rounded accent-primary"
            />
            <span>Avoid Ambiguous Characters (0, O, 1, l, I)</span>
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Word Count Slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-on-surface mb-1">
              <span>Word Count</span>
              <span className="font-mono font-bold text-primary">
                {passOptions.wordCount} words
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              value={passOptions.wordCount}
              onChange={(e) =>
                onPassOptionsChange({ ...passOptions, wordCount: Number(e.target.value) })
              }
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Separator */}
          <div>
            <span className="block text-xs font-medium text-on-surface mb-1">Word Separator</span>
            <div className="grid grid-cols-2 gap-1.5">
              {SEPARATORS.map((sep) => (
                <button
                  key={sep.val}
                  type="button"
                  onClick={() => onPassOptionsChange({ ...passOptions, separator: sep.val })}
                  className={`py-1 px-2 rounded-lg text-xs font-medium border text-left transition-colors ${
                    passOptions.separator === sep.val
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container border-outline-variant/60 text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {sep.label}
                </button>
              ))}
            </div>
          </div>

          {/* Capitalization & Number */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-outline-variant/40 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-on-surface">
              <input
                type="checkbox"
                checked={passOptions.capitalize === 'title'}
                onChange={(e) =>
                  onPassOptionsChange({
                    ...passOptions,
                    capitalize: e.target.checked ? 'title' : 'none',
                  })
                }
                className="rounded accent-primary"
              />
              <span>Capitalize Words</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none text-on-surface">
              <input
                type="checkbox"
                checked={passOptions.includeNumber}
                onChange={(e) =>
                  onPassOptionsChange({ ...passOptions, includeNumber: e.target.checked })
                }
                className="rounded accent-primary"
              />
              <span>Add Number</span>
            </label>
          </div>
        </div>
      )}

      {/* Batch Quantity */}
      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
        <span className="text-xs font-medium text-on-surface">Generate Batch</span>
        <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
          {QUANTITIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onQuantityChange(q)}
              className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors ${
                quantity === q
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
