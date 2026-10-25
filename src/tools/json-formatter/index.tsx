import React, { useState, useRef } from 'react';
import {
  Copy,
  Check,
  Download,
  Upload,
  Trash2,
  Wand2,
  Minimize2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { formatJson, minifyJson, validateJson } from './jsonLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

const SAMPLE_JSON = `{
  "name": "Toolnest",
  "version": "1.0.0",
  "private": true,
  "features": [
    "100% Local-First",
    "Privacy First",
    "Zero Telemetry"
  ],
  "stats": {
    "utilities": 12,
    "rating": 5.0
  }
}`;

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState<2 | 4 | 'tab'>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrettify = () => {
    try {
      const formatted = formatJson(input, { indent });
      setOutput(formatted);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleMinify = () => {
    try {
      const min = minifyJson(input);
      setOutput(min);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleValidate = () => {
    const result = validateJson(input);
    if (result.isValid) {
      setError(null);
      setOutput('Valid JSON structure.');
    } else {
      setError(result.error || 'Syntax error');
    }
  };

  const handleCopy = async () => {
    const textToCopy = output || input;
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      file.text().then((text) => {
        setInput(text);
        setError(null);
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      file.text().then((text) => {
        setInput(text);
        setError(null);
      });
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrettify}
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
                onClick={() => setIndent(opt)}
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
            onClick={handleMinify}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs text-on-surface border border-outline-variant/60 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Compact</span>
          </button>

          <button
            type="button"
            onClick={handleValidate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs text-on-surface border border-outline-variant/60 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Validate</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            title="Upload JSON File"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setInput(SAMPLE_JSON)}
            className="px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={() => {
              setInput('');
              setOutput('');
              setError(null);
            }}
            className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
            title="Clear All"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleCopy}
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
            onClick={() =>
              downloadFile(output || input, {
                filename: 'formatted.json',
                mimeType: 'application/json',
              })
            }
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Download JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Parsing Error Notice */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">JSON Syntax Error: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Split Code Viewers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className={`flex flex-col space-y-2 rounded-xl transition-all ${
            isDragging ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium">
              Raw Payload (Input){isDragging && ' — Drop file to load'}
            </span>
            <span className="font-mono text-[11px]">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste raw JSON here, or drag and drop a .json file..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium">Formatted / Minified Output</span>
            <span className="font-mono text-[11px]">{output.length} chars</span>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Prettified or minified output will appear here..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
