import React, { useState } from 'react';
import { JwtVerificationResult } from './types';
import { Icon } from '@/components/atoms/Icon';

interface JwtTokenBreakdownProps {
  token: string;
  verification: JwtVerificationResult;
}

export const JwtTokenBreakdown: React.FC<JwtTokenBreakdownProps> = ({ token, verification }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const parts = token.split('.');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = !verification.isValid
    ? 'text-red-500 bg-red-500/10 border-red-500/30'
    : verification.isExpired
      ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
      : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
      {/* Verification Status Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Encoded JWT & Signature
        </span>
        <div
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusColor}`}
        >
          <Icon name={verification.isValid ? 'Check' : 'Shield'} className="h-3.5 w-3.5" />
          <span>{verification.message}</span>
        </div>
      </div>

      {/* 3-Part Token Display */}
      <div className="group relative overflow-hidden rounded-lg border border-border/60 bg-surface-secondary/80 p-3 font-mono text-xs break-all">
        {parts.length === 3 ? (
          <p className="leading-relaxed">
            <span className="text-red-500 dark:text-red-400">{parts[0]}</span>
            <span className="text-text-tertiary">.</span>
            <span className="text-purple-500 dark:text-purple-400">{parts[1]}</span>
            <span className="text-text-tertiary">.</span>
            <span className="text-cyan-500 dark:text-cyan-400">{parts[2]}</span>
          </p>
        ) : (
          <span className="text-text-primary">{token}</span>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 flex items-center gap-1.5 rounded bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20"
        >
          <Icon name={copied ? 'Check' : 'Copy'} className="h-3 w-3" />
          <span>{copied ? 'Copied' : 'Copy Full Token'}</span>
        </button>
      </div>

      {/* Token Explanatory Legend */}
      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-red-500">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="font-semibold">Header (alg & typ)</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-500">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          <span className="font-semibold">Payload (claims)</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-500">
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
          <span className="font-semibold">Signature (HMAC)</span>
        </div>
      </div>
    </div>
  );
};
