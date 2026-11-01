import React, { useState, useMemo, useCallback } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw, KeyRound, Lock } from 'lucide-react';
import {
  PasswordOptions,
  PassphraseOptions,
  generatePassword,
  generatePassphrase,
  calculatePasswordEntropy,
  calculatePassphraseEntropy,
  getStrengthRating,
} from './passwordLogic';
import { PasswordControls } from './PasswordControls';
import { copyToClipboard } from '@/lib/clipboard';

const DEFAULT_PWD_OPTS: PasswordOptions = {
  length: 16,
  useUpper: true,
  useLower: true,
  useNumbers: true,
  useSymbols: true,
  excludeAmbiguous: false,
};

const DEFAULT_PASS_OPTS: PassphraseOptions = {
  wordCount: 5,
  separator: '-',
  capitalize: 'title',
  includeNumber: true,
};

export const PasswordGeneratorTool: React.FC = () => {
  const [mode, setMode] = useState<'password' | 'passphrase'>('password');
  const [pwdOptions, setPwdOptions] = useState<PasswordOptions>(DEFAULT_PWD_OPTS);
  const [passOptions, setPassOptions] = useState<PassphraseOptions>(DEFAULT_PASS_OPTS);
  const [quantity, setQuantity] = useState<number>(1);
  const [seed, setSeed] = useState<number>(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const items = useMemo(() => {
    // seed triggers regeneration
    void seed;
    const list: string[] = [];
    for (let i = 0; i < quantity; i += 1) {
      list.push(
        mode === 'password' ? generatePassword(pwdOptions) : generatePassphrase(passOptions)
      );
    }
    return list;
  }, [mode, pwdOptions, passOptions, quantity, seed]);

  const entropy = useMemo(() => {
    return mode === 'password'
      ? calculatePasswordEntropy(pwdOptions)
      : calculatePassphraseEntropy(passOptions);
  }, [mode, pwdOptions, passOptions]);

  const strength = useMemo(() => getStrengthRating(entropy), [entropy]);

  const handleRegenerate = useCallback(() => {
    setIsSpinning(true);
    setSeed((s) => s + 1);
    setTimeout(() => setIsSpinning(false), 300);
  }, []);

  const handleCopy = async (text: string, idx: number) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  const handleCopyAll = async () => {
    const ok = await copyToClipboard(items.join('\n'));
    if (ok) {
      setCopiedIdx(-1);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Ribbon */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>Cryptographically Secure:</strong> Uses native{' '}
            <code>crypto.getRandomValues</code> for true uniform entropy. Passwords never touch a
            server.
          </span>
        </div>
      </div>

      {/* Main Grid: Controls (5 cols) & Display (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <PasswordControls
            mode={mode}
            onModeChange={setMode}
            pwdOptions={pwdOptions}
            onPwdOptionsChange={setPwdOptions}
            passOptions={passOptions}
            onPassOptionsChange={setPassOptions}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
        </div>

        <div className="lg:col-span-7 space-y-4">
          {/* Primary Password Card */}
          <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-outline">
              <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider">
                <KeyRound className="w-4 h-4 text-primary" />
                Primary Generated {mode === 'password' ? 'Password' : 'Passphrase'}
              </span>
              <span className="font-mono text-xs">{items[0]?.length || 0} characters</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant flex items-center justify-between gap-3">
              <span className="font-mono text-base md:text-lg text-on-surface break-all select-all font-semibold">
                {items[0] || ''}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleRegenerate}
                  title="Generate new"
                  className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isSpinning ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(items[0], 0)}
                  title="Copy password"
                  className="p-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-xs"
                >
                  {copiedIdx === 0 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Strength Meter Bar & Estimates */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/40">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Strength: <span className={`font-bold ${strength.color}`}>{strength.label}</span>
                </span>
                <span className="text-outline">
                  ~{strength.entropy} bits entropy ({strength.crackTime})
                </span>
              </div>

              {/* 5-Segment Bar */}
              <div className="grid grid-cols-5 gap-1.5 h-1.5">
                {[1, 2, 3, 4, 5].map((seg) => (
                  <div
                    key={seg}
                    className={`h-full rounded-full transition-colors ${
                      seg <= strength.score ? strength.bgClass : 'bg-surface-container-high'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Batch List (if quantity > 1) */}
          {items.length > 1 && (
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-outline uppercase tracking-wider">
                  Batch Results ({items.length})
                </span>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors"
                >
                  {copiedIdx === -1 ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedIdx === -1 ? 'All Copied' : 'Copy All'}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-between gap-2"
                  >
                    <span className="font-mono text-xs text-on-surface truncate select-all">
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item, idx)}
                      className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
                    >
                      {copiedIdx === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordGeneratorTool;
