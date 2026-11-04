import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, RefreshCw, Sparkles } from 'lucide-react';
import { generateLorem, LoremUnit } from './loremLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

export const LoremGeneratorTool: React.FC = () => {
  const [unit, setUnit] = useState<LoremUnit>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [wrapInHtml, setWrapInHtml] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const output = useMemo(() => {
    // seed triggers regeneration
    return generateLorem({ unit, count, startWithLorem, wrapInHtml });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, count, startWithLorem, wrapInHtml, seed]);

  const metrics = useMemo(() => {
    const chars = output.length;
    const words = output.trim() ? output.trim().split(/\s+/).length : 0;
    const paras = output.trim() ? output.split(/\n\n+/).length : 0;
    return { chars, words, paras };
  }, [output]);

  const handleCopy = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const ext = wrapInHtml ? 'html' : 'txt';
    downloadFile(output, {
      filename: `lorem-ipsum.${ext}`,
      mimeType: wrapInHtml ? 'text/html' : 'text/plain',
    });
  };

  return (
    <div className="space-y-4">
      {/* Configuration Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-3">
          {/* Unit selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60">
            {[
              { id: 'paragraphs', label: 'Paragraphs' },
              { id: 'sentences', label: 'Sentences' },
              { id: 'words', label: 'Words' },
              { id: 'list', label: 'List Items' },
            ].map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setUnit(u.id as LoremUnit)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  unit === u.id
                    ? 'bg-primary-container text-on-primary-container shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="lorem-count" className="text-xs text-outline font-medium">
              Quantity:
            </label>
            <input
              id="lorem-count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="w-16 h-8 px-2 rounded-lg bg-surface border border-outline-variant text-xs font-mono text-center text-on-surface focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>Start with &quot;Lorem ipsum...&quot;</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={wrapInHtml}
              onChange={(e) => setWrapInHtml(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>Wrap in HTML tags</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSeed((prev) => prev + 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
          <div className="h-4 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors disabled:opacity-40"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!output}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
            title="Download text file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Output Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-outline px-1">
          <span className="font-medium text-on-surface">Generated Placeholder Text</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>
              {metrics.paras} {unit === 'list' ? 'items' : 'paragraphs'}
            </span>
            <span>•</span>
            <span>{metrics.words} words</span>
            <span>•</span>
            <span>{metrics.chars} characters</span>
          </div>
        </div>
        <textarea
          readOnly
          value={output}
          className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface leading-relaxed focus:outline-none resize-y"
        />
      </div>

      <div className="flex items-center gap-2 text-[11px] text-outline px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>
          Generates standardized pseudo-Latin filler copy for layouts, mockups, design prototypes,
          and typography tests.
        </span>
      </div>
    </div>
  );
};

export default LoremGeneratorTool;
