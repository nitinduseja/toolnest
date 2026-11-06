import React from 'react';
import { Columns2, AlignLeft, ArrowLeftRight, Download, Copy, Check, Trash2 } from 'lucide-react';
import { DiffMode } from './diffLogic';

interface DiffToolbarProps {
  viewMode: 'split' | 'unified';
  onViewModeChange: (mode: 'split' | 'unified') => void;
  mode: DiffMode;
  onModeChange: (mode: DiffMode) => void;
  ignoreWhitespace: boolean;
  onIgnoreWhitespaceChange: (val: boolean) => void;
  ignoreCase: boolean;
  onIgnoreCaseChange: (val: boolean) => void;
  collapseUnchanged: boolean;
  onCollapseUnchangedChange: (val: boolean) => void;
  enableWordDiff: boolean;
  onEnableWordDiffChange: (val: boolean) => void;
  stats: { additions: number; deletions: number };
  onSwapTexts: () => void;
  onClearBoth: () => void;
  onApplySample: () => void;
  onCopyDiff: () => void;
  onExportPatch: () => void;
  copied: boolean;
}

export const DiffToolbar: React.FC<DiffToolbarProps> = ({
  viewMode,
  onViewModeChange,
  mode,
  onModeChange,
  ignoreWhitespace,
  onIgnoreWhitespaceChange,
  ignoreCase,
  onIgnoreCaseChange,
  collapseUnchanged,
  onCollapseUnchangedChange,
  enableWordDiff,
  onEnableWordDiffChange,
  stats,
  onSwapTexts,
  onClearBoth,
  onApplySample,
  onCopyDiff,
  onExportPatch,
  copied,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        {/* View Mode Toggle */}
        <div className="flex bg-surface-container rounded-xl p-0.5 border border-outline-variant/40">
          <button
            type="button"
            onClick={() => onViewModeChange('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('unified')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'unified'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Unified</span>
          </button>
        </div>

        {/* Swap Texts Button */}
        <button
          type="button"
          onClick={onSwapTexts}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-outline-variant/60 bg-surface hover:bg-surface-container text-xs font-medium text-on-surface transition-all"
          title="Swap Original and Modified texts"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">Swap</span>
        </button>

        {/* Granularity (Words vs Lines) */}
        {viewMode === 'unified' && (
          <div className="flex bg-surface-container rounded-xl p-0.5 border border-outline-variant/40">
            <button
              type="button"
              onClick={() => onModeChange('lines')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mode === 'lines' ? 'bg-primary text-white' : 'text-on-surface-variant'
              }`}
            >
              Lines
            </button>
            <button
              type="button"
              onClick={() => onModeChange('words')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mode === 'words' ? 'bg-primary text-white' : 'text-on-surface-variant'
              }`}
            >
              Words
            </button>
          </div>
        )}

        {/* Word Diff Highlight in Split Mode */}
        {viewMode === 'split' && (
          <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer px-1">
            <input
              type="checkbox"
              checked={enableWordDiff}
              onChange={(e) => onEnableWordDiffChange(e.target.checked)}
              className="rounded accent-primary w-3.5 h-3.5"
            />
            <span>Word Highlights</span>
          </label>
        )}

        {/* Collapse Unchanged Toggle */}
        <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer px-1">
          <input
            type="checkbox"
            checked={collapseUnchanged}
            onChange={(e) => onCollapseUnchangedChange(e.target.checked)}
            className="rounded accent-primary w-3.5 h-3.5"
          />
          <span>Collapse Same</span>
        </label>

        {/* Diff Filters */}
        <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer px-1">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(e) => onIgnoreWhitespaceChange(e.target.checked)}
            className="rounded accent-primary w-3.5 h-3.5"
          />
          <span>Ignore Space</span>
        </label>

        <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer px-1">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => onIgnoreCaseChange(e.target.checked)}
            className="rounded accent-primary w-3.5 h-3.5"
          />
          <span>Ignore Case</span>
        </label>

        {/* Stats */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            +{stats.additions}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 font-bold">
            -{stats.deletions}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onApplySample}
          className="px-2.5 py-1.5 rounded-xl text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          Sample
        </button>
        <button
          type="button"
          onClick={onClearBoth}
          className="p-1.5 rounded-xl text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
          title="Clear Both"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-outline-variant/60" />

        <button
          type="button"
          onClick={onExportPatch}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant/60 transition-all"
          title="Download Git-compatible .patch file"
        >
          <Download className="w-3.5 h-3.5 text-primary" />
          <span className="hidden md:inline">.patch</span>
        </button>

        <button
          type="button"
          onClick={onCopyDiff}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary/90 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
