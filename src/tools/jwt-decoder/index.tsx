import React, { useState, useMemo, useEffect } from 'react';
import {
  Copy,
  Check,
  Trash2,
  KeyRound,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Key,
} from 'lucide-react';
import { parseJwt, getSampleJwt, verifyJwtSignature } from './jwtLogic';
import { copyToClipboard } from '@/lib/clipboard';

export const JwtDecoderTool: React.FC = () => {
  const [tokenInput, setTokenInput] = useState<string>(getSampleJwt());
  const [secretKey, setSecretKey] = useState<string>('');
  const [sigStatus, setSigStatus] = useState<'idle' | 'valid' | 'invalid' | 'error'>('idle');
  const [sigError, setSigError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parsed = useMemo(() => parseJwt(tokenInput), [tokenInput]);

  useEffect(() => {
    let isCancelled = false;

    if (!secretKey.trim() || !parsed.valid) {
      setSigStatus('idle');
      setSigError(null);
      return;
    }

    verifyJwtSignature(tokenInput, secretKey)
      .then((res) => {
        if (!isCancelled) {
          if (res.error) {
            setSigStatus('error');
            setSigError(res.error);
          } else if (res.verified) {
            setSigStatus('valid');
            setSigError(null);
          } else {
            setSigStatus('invalid');
            setSigError('Signature does not match secret key');
          }
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setSigStatus('error');
          setSigError(err instanceof Error ? err.message : 'Verification failed');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [tokenInput, secretKey, parsed.valid]);

  const handleCopy = async (text: string, key: string) => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const formattedHeader = parsed.header ? JSON.stringify(parsed.header, null, 2) : '';
  const formattedPayload = parsed.payload ? JSON.stringify(parsed.payload, null, 2) : '';

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Zero Network Transmission:</strong> JWTs are decoded and verified completely in
            your browser memory via native Web Crypto. Secrets are never transmitted.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTokenInput(getSampleJwt());
              setSecretKey('');
            }}
            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors"
          >
            Load Sample
          </button>
          <button
            type="button"
            onClick={() => {
              setTokenInput('');
              setSecretKey('');
            }}
            disabled={!tokenInput}
            className="p-1.5 rounded-lg text-outline hover:text-red-400 hover:bg-surface-container transition-colors disabled:opacity-40"
            title="Clear Token"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Token Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-semibold text-outline uppercase tracking-wider">
            Encoded JWT Token
          </label>
          <span className="text-[11px] font-mono text-outline">
            {tokenInput.length} chars • {tokenInput ? tokenInput.split('.').length : 0}/3 parts
          </span>
        </div>
        <textarea
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Paste JWT string (header.payload.signature) here..."
          className="w-full h-32 sm:h-28 p-3 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
        />
      </div>

      {/* Validation / Status Indicator */}
      {parsed.error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{parsed.error}</span>
        </div>
      )}

      {parsed.valid && parsed.claimsSummary && (
        <div
          className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
            parsed.claimsSummary.isExpired
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              {parsed.claimsSummary.isExpired ? 'Token Expired' : 'Active Token'}
            </span>
            <span>—</span>
            <span>{parsed.claimsSummary.timeRemainingText || 'No expiration set'}</span>
          </div>
          {parsed.claimsSummary.expirationDate && (
            <span className="font-mono text-[11px]">
              Exp: {parsed.claimsSummary.expirationDate.toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Decoded Output Panels (Header & Payload) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Header Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                Header
              </span>
              {Boolean(parsed.header?.alg) && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary-container/20 text-primary">
                  {String(parsed.header?.alg)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(formattedHeader, 'header')}
              disabled={!formattedHeader}
              className="flex items-center gap-1 text-[11px] text-outline hover:text-on-surface disabled:opacity-40"
            >
              {copiedKey === 'header' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedKey === 'header' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="w-full h-64 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface overflow-auto">
            {formattedHeader || '// Decoded header JSON will appear here'}
          </pre>
        </div>

        {/* Payload Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                Payload (Claims)
              </span>
              {parsed.claimsSummary?.subject && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-container text-on-surface-variant truncate max-w-[150px]">
                  sub: {parsed.claimsSummary.subject}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(formattedPayload, 'payload')}
              disabled={!formattedPayload}
              className="flex items-center gap-1 text-[11px] text-outline hover:text-on-surface disabled:opacity-40"
            >
              {copiedKey === 'payload' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedKey === 'payload' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="w-full h-64 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface overflow-auto">
            {formattedPayload || '// Decoded payload JSON will appear here'}
          </pre>
        </div>
      </div>

      {/* Signature Verification Section */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-semibold text-on-surface">
              HMAC-SHA256 Signature Verification
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(parsed.signature, 'signature')}
            disabled={!parsed.signature}
            className="flex items-center gap-1 text-[11px] text-outline hover:text-on-surface disabled:opacity-40"
          >
            {copiedKey === 'signature' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedKey === 'signature' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="jwt-secret" className="text-xs text-outline font-medium">
            Secret Key (for HS256 validation):
          </label>
          <input
            id="jwt-secret"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter secret key to verify signature..."
            className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>

        {/* Verification Status Pill */}
        {sigStatus === 'valid' && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              Signature Verified: Valid secret key for this token.
            </span>
          </div>
        )}
        {sigStatus === 'invalid' && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              {sigError || 'Signature Invalid: Secret key does not match.'}
            </span>
          </div>
        )}

        <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 font-mono text-xs text-outline break-all">
          {parsed.signature || '// Token signature string'}
        </div>
      </div>
    </div>
  );
};

export default JwtDecoderTool;
