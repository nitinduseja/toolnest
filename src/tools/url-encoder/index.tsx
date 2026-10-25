import React, { useState, useEffect } from 'react';
import { Copy, Check, Trash2, ArrowUpDown, Info, AlertTriangle } from 'lucide-react';
import { encodeUrl, decodeUrl, UrlMode } from './urlLogic';
import { copyToClipboard } from '@/lib/clipboard';

export const UrlEncoderTool: React.FC = () => {
  const [action, setAction] = useState<'encode' | 'decode'>('encode');
  const [mode, setMode] = useState<UrlMode>('component');
  const [input, setInput] = useState('https://example.com/api?search=hello world&filter=code');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (action === 'encode') {
        setOutput(encodeUrl(input, mode));
      } else {
        setOutput(decodeUrl(input, mode));
      }
      setError(null);
    } catch (err: unknown) {
      setOutput('');
      setError(err instanceof Error ? err.message : 'Transformation failed');
    }
  }, [input, action, mode]);

  const handleSwap = () => {
    setInput(output);
    setAction((prev) => (prev === 'encode' ? 'decode' : 'encode'));
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
      {/* Notice explanation */}
      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-2.5 text-xs text-on-surface-variant">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <span>
          <strong>Component vs Full URI:</strong> &quot;Component&quot; encodes all delimiters (
          <code>&amp;</code>, <code>=</code>, <code>/</code>, <code>?</code>) making text safe as a
          query parameter value. &quot;Full URI&quot; preserves valid protocol and path separators.
        </span>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
            <button
              type="button"
              onClick={() => setAction('encode')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                action === 'encode'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => setAction('decode')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                action === 'decode'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Decode
            </button>
          </div>

          <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
            <button
              type="button"
              onClick={() => setMode('component')}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                mode === 'component'
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              URI Component
            </button>
            <button
              type="button"
              onClick={() => setMode('full')}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                mode === 'full'
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Full URI
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
            title="Clear"
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
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-outline px-1 block">
            {action === 'encode' ? 'Raw URI / String (Input)' : 'Percent-Encoded URI (Input)'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste URL text..."
            className="w-full h-72 sm:h-80 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-outline px-1 block">
            {action === 'encode' ? 'Percent-Encoded Output' : 'Decoded String Output'}
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

export default UrlEncoderTool;
