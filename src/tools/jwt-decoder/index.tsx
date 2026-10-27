import React, { useState, useMemo } from 'react';
import { Copy, Check, Trash2, KeyRound, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { parseJwt, getSampleJwt } from './jwtLogic';
import { copyToClipboard } from '@/lib/clipboard';

export const JwtDecoderTool: React.FC = () => {
  const [tokenInput, setTokenInput] = useState<string>(getSampleJwt());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parsed = useMemo(() => parseJwt(tokenInput), [tokenInput]);

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
            <strong>Zero Network Transmission:</strong> JWTs are decoded completely in your browser
            memory. Sensitive tokens are never sent across the network.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTokenInput(getSampleJwt())}
            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors"
          >
            Load Sample
          </button>
          <button
            type="button"
            onClick={() => setTokenInput('')}
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

      {/* Signature Section */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-semibold text-on-surface">Signature</span>
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
        <p className="font-mono text-xs text-outline break-all bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/50">
          {parsed.signature || '// Token signature string'}
        </p>
      </div>
    </div>
  );
};

export default JwtDecoderTool;
