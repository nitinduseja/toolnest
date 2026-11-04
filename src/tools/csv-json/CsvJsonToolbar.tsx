import React from 'react';
import { Copy, Check, Download, Upload, Trash2, ArrowLeftRight } from 'lucide-react';

export type ConversionDirection = 'csv-to-json' | 'json-to-csv';

interface CsvJsonToolbarProps {
  direction: ConversionDirection;
  setDirection: (d: ConversionDirection) => void;
  handleSwap: () => void;
  delimiter: string;
  setDelimiter: (d: string) => void;
  hasHeader: boolean;
  setHasHeader: (h: boolean) => void;
  skipEmptyLines: boolean;
  setSkipEmptyLines: (s: boolean) => void;
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

export const CsvJsonToolbar: React.FC<CsvJsonToolbarProps> = ({
  direction,
  setDirection,
  handleSwap,
  delimiter,
  setDelimiter,
  hasHeader,
  setHasHeader,
  skipEmptyLines,
  setSkipEmptyLines,
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
            onClick={() => setDirection('csv-to-json')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              direction === 'csv-to-json'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            CSV to JSON
          </button>
          <button
            type="button"
            onClick={() => setDirection('json-to-csv')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              direction === 'json-to-csv'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            JSON to CSV
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

        {/* Delimiter */}
        <div className="flex items-center gap-1.5 text-xs text-outline">
          <span>Delimiter:</span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="h-8 px-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="&#9;">Tab (\t)</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="rounded border-outline-variant text-primary focus:ring-primary"
          />
          <span>Include Headers</span>
        </label>

        {direction === 'csv-to-json' && (
          <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={skipEmptyLines}
              onChange={(e) => setSkipEmptyLines(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>Skip Blank Lines</span>
          </label>
        )}

        {direction === 'csv-to-json' && (
          <div className="flex items-center gap-1.5 text-xs text-outline">
            <span>Indent:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="h-8 px-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={0}>Minified</option>
            </select>
          </div>
        )}
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors"
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
