import React, { useState, useMemo, useRef } from 'react';
import { GitCompare, Upload } from 'lucide-react';
import {
  computeDiff,
  computeSideBySideDiff,
  collapseUnchangedRows,
  generateUnifiedPatch,
  DiffMode,
} from './diffLogic';
import { SideBySideDiffTable } from './SideBySideDiffTable';
import { DiffToolbar } from './DiffToolbar';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

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
  const [collapseUnchanged, setCollapseUnchanged] = useState(false);
  const [enableWordDiff, setEnableWordDiff] = useState(true);
  const [copied, setCopied] = useState(false);

  const origFileRef = useRef<HTMLInputElement>(null);
  const modFileRef = useRef<HTMLInputElement>(null);

  const diffOptions = useMemo(
    () => ({ ignoreWhitespace, ignoreCase }),
    [ignoreWhitespace, ignoreCase]
  );

  const diffResult = useMemo(() => {
    return computeDiff(original, modified, { ...diffOptions, mode });
  }, [original, modified, mode, diffOptions]);

  const rawSideBySideResult = useMemo(() => {
    return computeSideBySideDiff(original, modified, { ...diffOptions, enableWordDiff });
  }, [original, modified, diffOptions, enableWordDiff]);

  const sideBySideResult = useMemo(() => {
    if (!collapseUnchanged) return rawSideBySideResult;
    return collapseUnchangedRows(rawSideBySideResult);
  }, [rawSideBySideResult, collapseUnchanged]);

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

  const handleExportPatch = () => {
    const patch = generateUnifiedPatch(original, modified, 'changes.patch');
    downloadFile(patch, { filename: 'changes.patch', mimeType: 'text/x-patch' });
  };

  const handleSwapTexts = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  const handleFileUpload = (file: File, target: 'original' | 'modified') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      if (target === 'original') setOriginal(text);
      else setModified(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-12">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={origFileRef}
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'original')}
        className="hidden"
      />
      <input
        type="file"
        ref={modFileRef}
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'modified')}
        className="hidden"
      />

      {/* Action Toolbar */}
      <DiffToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        mode={mode}
        onModeChange={setMode}
        ignoreWhitespace={ignoreWhitespace}
        onIgnoreWhitespaceChange={setIgnoreWhitespace}
        ignoreCase={ignoreCase}
        onIgnoreCaseChange={setIgnoreCase}
        collapseUnchanged={collapseUnchanged}
        onCollapseUnchangedChange={setCollapseUnchanged}
        enableWordDiff={enableWordDiff}
        onEnableWordDiffChange={setEnableWordDiff}
        stats={stats}
        onSwapTexts={handleSwapTexts}
        onClearBoth={() => {
          setOriginal('');
          setModified('');
        }}
        onApplySample={() => {
          setOriginal(SAMPLE_ORIGINAL);
          setModified(SAMPLE_MODIFIED);
        }}
        onCopyDiff={handleCopyUnified}
        onExportPatch={handleExportPatch}
        copied={copied}
      />

      {/* Input Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs px-1 text-on-surface-variant">
            <span className="font-semibold">Original Version</span>
            <button
              type="button"
              onClick={() => origFileRef.current?.click()}
              className="text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <Upload className="w-3 h-3" /> Upload File
            </button>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original source text or upload a file..."
            className="w-full h-44 p-4 rounded-2xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs px-1 text-on-surface-variant">
            <span className="font-semibold">Modified Version</span>
            <button
              type="button"
              onClick={() => modFileRef.current?.click()}
              className="text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <Upload className="w-3 h-3" /> Upload File
            </button>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified source text or upload a file..."
            className="w-full h-44 p-4 rounded-2xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
          />
        </div>
      </div>

      {/* Visual Diff Output */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
              Diff Output ({viewMode === 'split' ? 'Side-by-Side' : 'Unified'})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-outline">
            {viewMode === 'split'
              ? `${sideBySideResult.length} lines`
              : `${diffResult.length} blocks`}
          </span>
        </div>

        {viewMode === 'split' ? (
          <SideBySideDiffTable rows={sideBySideResult} />
        ) : (
          <div className="font-mono text-xs p-4 rounded-xl bg-surface border border-outline-variant overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {diffResult.length > 0 ? (
              diffResult.map((part, index) => {
                let colorClass = 'text-on-surface';
                if (part.added) {
                  colorClass =
                    'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-0.5 rounded';
                } else if (part.removed) {
                  colorClass =
                    'bg-red-500/20 text-red-600 dark:text-red-400 line-through px-0.5 rounded';
                }
                return (
                  <span key={`${index}-${part.value.slice(0, 10)}`} className={colorClass}>
                    {part.value}
                  </span>
                );
              })
            ) : (
              <span className="text-outline italic">
                Enter text above to inspect differences...
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextDiffTool;
