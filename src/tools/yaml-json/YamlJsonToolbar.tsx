import React from 'react';
import { Copy, Check, Download, Upload, Trash2, ArrowLeftRight } from 'lucide-react';

export type YamlJsonDirection = 'yaml-to-json' | 'json-to-yaml';

interface YamlJsonToolbarProps {
  direction: YamlJsonDirection;
  setDirection: (d: YamlJsonDirection) => void;
  handleSwap: () => void;
  indent: number;
  setIndent: (n: number) => void;
  onUploadClick: () => void;
  onLoadSample: () => void;
  onClear: () => void;
  handleCopy: () => void;
  copied: boolean;
  handleDownload: () => void;
  hasOutput: boolean;
}

export const YamlJsonToolbar: React.FC<YamlJsonToolbarProps> = ({
  direction,
  setDirection,
  handleSwap,
  indent,
  setIndent,
  onUploadClick,
  onLoadSample,
  onClear,
  handleCopy,
  copied,
  handleDownload,
  hasOutput,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60">
          <button
            type="button"
            onClick={() => setDirection('yaml-to-json')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              direction === 'yaml-to-json'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            YAML to JSON
          </button>
          <button
            type="button"
            onClick={() => setDirection('json-to-yaml')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              direction === 'json-to-yaml'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            JSON to YAML
          </button>
        </div>

        <button
          type="button"
          onClick={handleSwap}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          title="Swap input and output"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Swap</span>
        </button>

        <div className="h-4 w-px bg-outline-variant" />

        <div className="flex items-center gap-1.5 text-xs text-outline">
          <span>Indent:</span>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="h-8 px-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUploadClick}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
          title="Upload File"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>
        <button
          type="button"
          onClick={onLoadSample}
          className="px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          Sample
        </button>
        <button
          type="button"
          onClick={onClear}
          className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
          title="Clear Input"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-outline-variant" />
        <button
          type="button"
          onClick={handleCopy}
          disabled={!hasOutput}
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
          disabled={!hasOutput}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 shadow-sm transition-opacity disabled:opacity-40"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};
