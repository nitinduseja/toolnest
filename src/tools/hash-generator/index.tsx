import React, { useState, useEffect } from 'react';
import { Copy, Check, Info, AlertTriangle } from 'lucide-react';
import { computeSha256 } from './hashLogic';
import { copyToClipboard } from '@/lib/clipboard';

export const HashGeneratorTool: React.FC = () => {
  const [input, setInput] = useState('Toolnest');
  const [hash, setHash] = useState('');
  const [uppercase, setUppercase] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (!input) {
      setHash('');
      setError(null);
      return;
    }

    computeSha256(input)
      .then((digest) => {
        if (!isCancelled) {
          setHash(uppercase ? digest.toUpperCase() : digest.toLowerCase());
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Cryptographic computation failed');
          setHash('');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [input, uppercase]);

  const handleCopy = async () => {
    if (!hash) return;
    const ok = await copyToClipboard(hash);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Educational Notice */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant space-y-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2 font-semibold text-on-surface">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>One-Way Digest vs Encryption &amp; Password Storage</span>
        </div>
        <p className="leading-relaxed">
          SHA-256 is a deterministic, one-way cryptographic hash function, not reversible
          encryption. Notice: Standard fast hashes like raw SHA-256 should <strong>not</strong> be
          used alone for password storage; password hashing requires salted, memory-hard algorithms
          (such as Argon2 or bcrypt) to resist rainbow tables and GPU brute-forcing.
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-outline px-1">
          <label htmlFor="hash-input" className="font-medium">
            Input Plaintext
          </label>
          <button
            type="button"
            onClick={() => setInput('')}
            className="hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        </div>
        <textarea
          id="hash-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to compute SHA-256 digest..."
          className="w-full h-36 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
        />
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Output Section */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-outline">SHA-256 Hex Digest</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant">
              256-bit / 64 chars
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span>Uppercase Hex</span>
            </label>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!hash}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-opacity disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface break-all select-all">
          {hash || (
            <span className="text-outline italic">Digest will compute automatically...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HashGeneratorTool;
