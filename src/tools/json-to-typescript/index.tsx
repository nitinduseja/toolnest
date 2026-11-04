import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Trash2, AlertTriangle, FileCode2, Sparkles } from 'lucide-react';
import { generateTypeScript, generateZodSchema } from './schemaLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

const SAMPLE_JSON = `{
  "id": 1042,
  "username": "alex_developer",
  "email": "alex@example.dev",
  "isVerified": true,
  "roles": ["admin", "contributor"],
  "profile": {
    "displayName": "Alex Rivera",
    "avatarUrl": "https://avatars.example.com/alex.png",
    "reputation": 4950
  },
  "settings": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}`;

export const JsonToTypescriptTool: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON);
  const [format, setFormat] = useState<'interface' | 'type' | 'zod'>('interface');
  const [rootName, setRootName] = useState<string>('User');
  const [exportTypes, setExportTypes] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => {
    if (format === 'zod') {
      return generateZodSchema(jsonInput, { rootName, exportTypes });
    }
    return generateTypeScript(jsonInput, {
      rootName,
      outputFormat: format,
      exportTypes,
    });
  }, [jsonInput, format, rootName, exportTypes]);

  const handleCopy = async () => {
    if (!result.code) return;
    const ok = await copyToClipboard(result.code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result.code) return;
    const ext = format === 'zod' ? 'schema.ts' : 'types.ts';
    downloadFile(result.code, { filename: `${rootName.toLowerCase() || 'types'}.${ext}`, mimeType: 'text/typescript' });
  };

  return (
    <div className="space-y-4">
      {/* Controls & Configuration Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-3">
          {/* Format selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60">
            <button
              type="button"
              onClick={() => setFormat('interface')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                format === 'interface'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              TS Interface
            </button>
            <button
              type="button"
              onClick={() => setFormat('type')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                format === 'type'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              TS Type
            </button>
            <button
              type="button"
              onClick={() => setFormat('zod')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                format === 'zod'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Zod Schema
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="root-name" className="text-xs text-outline font-medium">
              Root Name:
            </label>
            <input
              id="root-name"
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder="e.g. User"
              className="w-28 h-8 px-2.5 rounded-lg bg-surface border border-outline-variant text-xs font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={exportTypes}
              onChange={(e) => setExportTypes(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>Export Declarations</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setJsonInput(SAMPLE_JSON)}
            className="px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={() => setJsonInput('')}
            className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
            title="Clear Input"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!result.code}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!result.code}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
            title="Download Typescript file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {result.error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {/* Split Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">JSON Input Payload</span>
            <span className="font-mono text-[11px]">{jsonInput.length} chars</span>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste raw JSON object or array here..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">
              {format === 'zod' ? 'Generated Zod Schema' : 'Generated TypeScript'}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-outline">
              <FileCode2 className="w-3.5 h-3.5 text-primary" />
              <span>{format.toUpperCase()}</span>
            </div>
          </div>
          <textarea
            readOnly
            value={result.code}
            placeholder="Generated TypeScript interfaces or Zod schema will appear here..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Tip footer */}
      <div className="flex items-center gap-2 text-[11px] text-outline px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>
          Schema generator recursively maps object properties, arrays, and primitive datatypes into clean, idiomatic TypeScript definitions.
        </span>
      </div>
    </div>
  );
};

export default JsonToTypescriptTool;

