import React, { useState, useEffect } from 'react';
import { Copy, Check, Trash2, ArrowUpDown, Info, AlertTriangle } from 'lucide-react';
import { encodeBase64, decodeBase64 } from './base64Logic';
import { copyToClipboard } from '@/lib/clipboard';

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('Toolnest: Useful tools. One workspace.');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }
      setError(null);
    } catch (err: unknown) {
      setOutput('');
      setError(err instanceof Error ? err.message : 'Transformation failed');
    }
  }, [input, mode]);

  const handleSwap = () => {
    setInput(output);
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
  };

  const handleCopy = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Notice Ribbon */}
      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-2.5 text-xs text-on-surface-variant">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <span>
          <strong>Encoding vs Encryption:</strong> Base64 is a binary-to-text encoding format used
          for transport, not a cryptographic security measure. It can be trivially reversed without
          a key.
        </span>
      </div>

      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
            <button
              type="button"
              onClick={() => setMode('encode')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                mode === 'encode'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Encode (Text → Base64)
            </button>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                mode === 'decode'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Decode (Base64 → Text)
            </button>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            disabled={!output}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
            title="Swap Input & Output"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInput('')}
            className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
            title="Clear Input"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant/60 transition-colors disabled:opacity-40"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy Result'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Side-by-side or stacked panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-outline px-1 block">
            {mode === 'encode' ? 'Plaintext (Input)' : 'Base64 String (Input)'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'
            }
            className="w-full h-72 sm:h-80 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-outline px-1 block">
            {mode === 'encode' ? 'Base64 Encoded (Output)' : 'Decoded Plaintext (Output)'}
          </label>
          <textarea
            readOnly
            value={output}
            placeholder="Result will appear here..."
            className="w-full h-72 sm:h-80 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};

export default Base64Tool;
