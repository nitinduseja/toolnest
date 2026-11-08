import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, Copy, Check, ShieldCheck, Clock } from 'lucide-react';
import { generateBcryptHash } from './bcryptLogic';
import { BcryptHashResult } from './types';
import { copyToClipboard } from '@/lib/clipboard';

export const BcryptHasher: React.FC = () => {
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rounds, setRounds] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BcryptHashResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleHash = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await generateBcryptHash(password, rounds);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const ok = await copyToClipboard(result.hash);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRoundsBadge = (r: number) => {
    if (r >= 12) return { label: 'High Security', color: 'text-purple-500 bg-purple-500/10' };
    if (r >= 10) return { label: 'Recommended', color: 'text-emerald-500 bg-emerald-500/10' };
    return { label: 'Fast / Low Security', color: 'text-amber-500 bg-amber-500/10' };
  };

  const badge = getRoundsBadge(rounds);

  return (
    <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-5">
      {/* Password Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="bcrypt-password"
          className="text-xs font-bold text-on-surface uppercase tracking-wider"
        >
          Plain Text Password
        </label>
        <div className="relative">
          <input
            id="bcrypt-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to hash..."
            className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Rounds / Cost Factor Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface uppercase tracking-wider">
              Cost Factor (Rounds)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <span className="font-mono text-primary font-bold">
            {rounds} (2^{rounds} = {Math.pow(2, rounds)} iterations)
          </span>
        </div>
        <input
          type="range"
          min={4}
          max={12}
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-outline font-mono">
          <span>4 (Fast)</span>
          <span>8 (Medium)</span>
          <span>10 (Standard)</span>
          <span>12 (Heavy)</span>
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        disabled={loading || !password}
        onClick={handleHash}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer"
      >
        <KeyRound className="w-4 h-4" />
        <span>{loading ? 'Computing Bcrypt Hash...' : 'Generate Bcrypt Hash'}</span>
      </button>

      {/* Result Display */}
      {result && (
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Generated Bcrypt Hash</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-outline font-mono">
                <Clock className="w-3 h-3" />
                <span>{result.durationMs}ms</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div
            data-testid="bcrypt-hash-output"
            className="p-3 rounded-lg bg-surface-container-highest/80 font-mono text-xs text-on-surface break-all select-all leading-relaxed"
          >
            {result.hash}
          </div>

          {/* Breakdown Badges */}
          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <div className="px-2 py-0.5 rounded bg-surface border border-outline-variant/40 text-outline">
              Algo: <span className="text-on-surface font-semibold">{result.algorithm}</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-surface border border-outline-variant/40 text-outline">
              Cost: <span className="text-on-surface font-semibold">{result.rounds}</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-surface border border-outline-variant/40 text-outline truncate max-w-xs">
              Salt: <span className="text-on-surface font-semibold">{result.salt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
