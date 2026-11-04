import React, { useState, useMemo } from 'react';
import { Copy, Check, Trash2, GitCompare, Columns2, AlignLeft } from 'lucide-react';
import { computeDiff, computeSideBySideDiff, DiffMode } from './diffLogic';
import { copyToClipboard } from '@/lib/clipboard';

const SAMPLE_ORIGINAL = `function calculateTotal(price, tax) {
  var total = price + tax;
  return total;
}`;

const SAMPLE_MODIFIED = `function calculateTotal(price: number, tax: number): number {
  const total = price + (price * tax);
  return Number(total.toFixed(2));
}`;

type ViewMode = 'split' | 'unified';

export const TextDiffTool: React.FC = () => {
  const [original, setOriginal] = useState(SAMPLE_ORIGINAL);
  const [modified, setModified] = useState(SAMPLE_MODIFIED);
  const [mode, setMode] = useState<DiffMode>('lines');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [copied, setCopied] = useState(false);

  const diffOptions = useMemo(
    () => ({ ignoreWhitespace, ignoreCase }),
    [ignoreWhitespace, ignoreCase]
  );

  const diffResult = useMemo(() => {
    return computeDiff(original, modified, mode, diffOptions);
  }, [original, modified, mode, diffOptions]);

  const sideBySideResult = useMemo(() => {
    return computeSideBySideDiff(original, modified, diffOptions);
  }, [original, modified, diffOptions]);

  const stats = useMemo(() => {
    let additions = 0;
    let deletions = 0;
    diffResult.forEach((part) => {
      if (part.added) additions++;
      if (part.removed) deletions++;
    });
    return { additions, deletions };
  }, [diffResult]);

  const handleCopyUnified = async () => {
    const text = diffResult
      .map((p) => {
        const prefix = p.added ? '+ ' : p.removed ? '- ' : '  ';
        return p.value
          .split('\n')
          .filter(Boolean)
          .map((line) => `${prefix}${line}`)
          .join('\n');
      })
      .join('\n');

    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode (Split vs Unified) */}
          <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'unified'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Unified</span>
            </button>
          </div>

          {/* Granularity (Lines vs Words) */}
          {viewMode === 'unified' && (
            <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
              <button
                type="button"
                onClick={() => setMode('lines')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'lines'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Lines
              </button>
              <button
                type="button"
                onClick={() => setMode('words')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'words'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Words
              </button>
            </div>
          )}

          {/* Diff Filters */}
          <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer px-1">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded accent-primary w-3.5 h-3.5"
            />
            <span>Ignore Whitespace</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer px-1">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="rounded accent-primary w-3.5 h-3.5"
            />
            <span>Ignore Case</span>
          </label>

          <div className="flex items-center gap-1.5 text-xs font-mono ml-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">
              +{stats.additions} added
            </span>
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-medium">
              -{stats.deletions} removed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setOriginal(SAMPLE_ORIGINAL);
              setModified(SAMPLE_MODIFIED);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={() => {
              setOriginal('');
              setModified('');
            }}
            className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors cursor-pointer"
            title="Clear Both"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleCopyUnified}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant/60 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy Diff'}</span>
          </button>
        </div>
      </div>

      {/* Inputs (Desktop Side-by-side / Mobile Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-outline px-1 block">Original Version</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original source text..."
            className="w-full h-44 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-outline px-1 block">Modified Version</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified source text..."
            className="w-full h-44 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>
      </div>

      {/* Visual Diff Output */}
      <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-semibold uppercase text-outline">
              Diff Visualization ({viewMode === 'split' ? 'Side-by-Side' : 'Unified'})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-outline">
            {viewMode === 'split' ? `${sideBySideResult.length} lines` : `${diffResult.length} blocks`}
          </span>
        </div>

        {viewMode === 'split' ? (
          /* Side-by-Side Synchronized View */
          <div className="border border-outline-variant rounded-lg overflow-x-auto bg-surface font-mono text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container text-outline text-[11px] border-b border-outline-variant">
                  <th className="w-12 py-1 px-2 text-right border-r border-outline-variant font-normal">#</th>
                  <th className="py-1 px-3 text-left w-1/2 border-r border-outline-variant">Original</th>
                  <th className="w-12 py-1 px-2 text-right border-r border-outline-variant font-normal">#</th>
                  <th className="py-1 px-3 text-left w-1/2">Modified</th>
                </tr>
              </thead>
              <tbody>
                {sideBySideResult.length > 0 ? (
                  sideBySideResult.map((row, idx) => {
                    const isRemoved = row.left?.type === 'removed';
                    const isAdded = row.right?.type === 'added';
                    const leftBg = isRemoved ? 'bg-red-500/15 text-red-500 dark:text-red-400' : '';
                    const rightBg = isAdded ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : '';

                    return (
                      <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-container/50">
                        {/* Left Line Num */}
                        <td className="py-0.5 px-2 text-right select-none text-outline border-r border-outline-variant/50 text-[11px] bg-surface-container-low/40">
                          {row.left?.lineNum ?? ''}
                        </td>
                        {/* Left Text */}
                        <td className={`py-0.5 px-3 border-r border-outline-variant/50 whitespace-pre font-mono ${leftBg}`}>
                          {row.left?.text ?? ''}
                        </td>
                        {/* Right Line Num */}
                        <td className="py-0.5 px-2 text-right select-none text-outline border-r border-outline-variant/50 text-[11px] bg-surface-container-low/40">
                          {row.right?.lineNum ?? ''}
                        </td>
                        {/* Right Text */}
                        <td className={`py-0.5 px-3 whitespace-pre font-mono ${rightBg}`}>
                          {row.right?.text ?? ''}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-outline italic">
                      Enter text above to inspect differences...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Unified Inline View */
          <div className="font-mono text-xs p-4 rounded-lg bg-surface border border-outline-variant overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {diffResult.length > 0 ? (
              diffResult.map((part, index) => {
                let colorClass = 'text-on-surface';
                if (part.added) {
                  colorClass = 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 px-0.5 rounded';
                } else if (part.removed) {
                  colorClass = 'bg-red-500/20 text-red-500 dark:text-red-400 line-through px-0.5 rounded';
                }
                return (
                  <span key={`${index}-${part.value.slice(0, 10)}`} className={colorClass}>
                    {part.value}
                  </span>
                );
              })
            ) : (
              <span className="text-outline italic">Enter text above to inspect differences...</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextDiffTool;
