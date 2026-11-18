import React from 'react';
import { Copy, Check, Download, Upload, Trash2, Wand2, Minimize2, CheckCircle } from 'lucide-react';
import { CrossToolHandoffButton } from '@/components/molecules/CrossToolHandoffButton';

interface JsonFormatterToolbarProps {
  indent: 2 | 4 | 'tab';
  onIndentChange: (indent: 2 | 4 | 'tab') => void;
  onPrettify: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onUploadClick: () => void;
  onSample: () => void;
  onClear: () => void;
  onCopy: () => void;
  copied: boolean;
  onDownload: () => void;
  getHandoffData: () => string;
}

const HANDOFF_TARGETS = [
  {
    toolId: 'json-to-typescript',
    label: 'Generate Types / Zod',
    description: 'Create TypeScript interfaces or Zod schemas',
  },
  {
    toolId: 'data-chart',
    label: 'Visualize Chart',
    description: 'Plot charts and summarize datasets',
  },
  {
    toolId: 'csv-json',
    label: 'Convert to CSV',
    description: 'Convert JSON to CSV format',
  },
];

export const JsonFormatterToolbar: React.FC<JsonFormatterToolbarProps> = ({
  indent,
  onIndentChange,
  onPrettify,
  onMinify,
  onValidate,
  onUploadClick,
  onSample,
  onClear,
  onCopy,
  copied,
  onDownload,
  getHandoffData,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPrettify}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 shadow-sm transition-opacity"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Prettify</span>
        </button>

        <div className="flex items-center bg-surface-container rounded-lg p-0.5 border border-outline-variant/40 text-xs">
          {([2, 4, 'tab'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onIndentChange(opt)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                indent === opt
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {opt === 'tab' ? 'Tab' : `${opt} Sp`}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onMinify}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs text-on-surface border border-outline-variant/60 transition-colors"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Compact</span>
        </button>

        <button
          type="button"
          onClick={onValidate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs text-on-surface border border-outline-variant/60 transition-colors"
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Validate</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <CrossToolHandoffButton
          sourceToolId="json-formatter"
          targets={HANDOFF_TARGETS}
          getData={getHandoffData}
        />
        <div className="h-4 w-px bg-outline-variant" />
        <button
          type="button"
          onClick={onUploadClick}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          title="Upload JSON File"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>
        <button
          type="button"
          onClick={onSample}
          className="px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
        >
          Sample
        </button>
        <button
          type="button"
          onClick={onClear}
          className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
          title="Clear All"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-outline-variant" />
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant/60 transition-colors"
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
          onClick={onDownload}
          className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          title="Download JSON"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
