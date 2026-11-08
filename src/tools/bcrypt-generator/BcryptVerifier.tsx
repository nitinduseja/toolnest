import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, XCircle, Check } from 'lucide-react';
import { verifyBcryptHash } from './bcryptLogic';
import { BcryptVerifyResult } from './types';

const SAMPLE_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

export const BcryptVerifier: React.FC = () => {
  const [password, setPassword] = useState('secret');
  const [hash, setHash] = useState(SAMPLE_HASH);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BcryptVerifyResult | null>(null);

  const handleVerify = async () => {
    if (!password || !hash) return;
    setLoading(true);
    try {
      const res = await verifyBcryptHash(password, hash);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-4">
      {/* Password Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="verify-password"
          className="text-xs font-bold text-on-surface uppercase tracking-wider"
        >
          Candidate Plain Text Password
        </label>
        <div className="relative">
          <input
            id="verify-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type candidate password..."
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

      {/* Hash Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="verify-hash"
          className="text-xs font-bold text-on-surface uppercase tracking-wider"
        >
          Target Bcrypt Hash ($2a$ or $2b$)
        </label>
        <textarea
          id="verify-hash"
          rows={2}
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          placeholder="Paste $2a$ or $2b$ hash here..."
          className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40 resize-y"
        />
      </div>

      {/* Verify Button */}
      <button
        type="button"
        disabled={loading || !password || !hash}
        onClick={handleVerify}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer"
      >
        <Check className="w-4 h-4" />
        <span>{loading ? 'Verifying Hash...' : 'Verify Password Against Hash'}</span>
      </button>

      {/* Match Result Banner */}
      {result && (
        <div
          data-testid="verify-result-banner"
          className={`p-4 rounded-xl border flex flex-col gap-2 animate-in fade-in duration-150 ${
            result.valid
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-bold">
            {result.valid ? (
              <>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Password Matches! (Verification SUCCESS)</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 shrink-0" />
                <span>Password Does Not Match! (Verification FAILED)</span>
              </>
            )}
          </div>
          <p className="text-xs opacity-90">{result.message}</p>

          {result.details.valid && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-current/20 text-[11px] font-mono">
              <span className="opacity-80">Algo: {result.details.algorithm}</span>
              <span className="opacity-80">•</span>
              <span className="opacity-80">Cost: {result.details.rounds} rounds</span>
              <span className="opacity-80">•</span>
              <span className="opacity-80">Time: {result.durationMs}ms</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
