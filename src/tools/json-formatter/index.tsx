import React, { useState, useRef, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatJson, minifyJson, validateJson } from './jsonLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';
import { useToolHandoff } from '@/lib/handoff/crossToolHandoff';
import { JsonFormatterToolbar } from './JsonFormatterToolbar';

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

  useToolHandoff('json-formatter', (payload) => {
    if (payload) {
      setInput(payload);
      setOutput('');
      setError(null);
    }
  });

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

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleDownload = () => {
    downloadFile(output || input, {
      filename: 'formatted.json',
      mimeType: 'application/json',
    });
  };

  const getHandoffData = useCallback(() => output || input, [output, input]);

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      <JsonFormatterToolbar
        indent={indent}
        onIndentChange={setIndent}
        onPrettify={handlePrettify}
        onMinify={handleMinify}
        onValidate={handleValidate}
        onUploadClick={() => fileInputRef.current?.click()}
        onSample={() => setInput(SAMPLE_JSON)}
        onClear={handleClear}
        onCopy={handleCopy}
        copied={copied}
        onDownload={handleDownload}
        getHandoffData={getHandoffData}
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">JSON Syntax Error: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

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
