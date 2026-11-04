import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, RefreshCw, Download, Sparkles } from 'lucide-react';
import { generateIdBatch, IdType } from './uuidLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

export const UuidGeneratorTool: React.FC = () => {
  const [idType, setIdType] = useState<IdType>('uuid-v4');
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [nanoLength, setNanoLength] = useState(21);
  const [outputFormat, setOutputFormat] = useState<'plain' | 'json' | 'comma'>('plain');
  const [ids, setIds] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const regenerate = useCallback(() => {
    const batch = generateIdBatch({
      type: idType,
      count: quantity,
      uppercase,
      noHyphens,
      nanoLength,
    });
    setIds(batch);
  }, [idType, quantity, uppercase, noHyphens, nanoLength]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const getFormattedExport = useCallback(() => {
    if (outputFormat === 'json') {
      return JSON.stringify(ids, null, 2);
    }
    if (outputFormat === 'comma') {
      return ids.join(', ');
    }
    return ids.join('\n');
  }, [ids, outputFormat]);

  const handleCopySingle = async (val: string, index: number) => {
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const handleCopyAll = async () => {
    const text = getFormattedExport();
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleDownload = () => {
    const content = getFormattedExport();
    const ext = outputFormat === 'json' ? 'json' : 'txt';
    downloadFile(content, { filename: `${idType}-list.${ext}` });
  };

  return (
    <div className="space-y-4">
      {/* Type Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-outline-variant">
        {[
          { id: 'uuid-v4', label: 'UUID v4', desc: 'Random RFC 4122' },
          { id: 'uuid-v7', label: 'UUID v7', desc: 'Time-Ordered RFC 9562' },
          { id: 'nanoid', label: 'NanoID', desc: 'Compact URL-safe' },
          { id: 'ulid', label: 'ULID', desc: 'Lexicographically Sortable' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIdType(item.id as IdType)}
            className={`flex flex-col text-left px-3.5 py-1.5 rounded-lg text-xs transition-all ${
              idType === item.id
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-medium'
            }`}
          >
            <span>{item.label}</span>
            <span className="text-[10px] opacity-75 font-normal">{item.desc}</span>
          </button>
        ))}
      </div>

      {/* Configuration Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-outline font-medium">Count:</span>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-8 px-2.5 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            >
              {[1, 5, 10, 20, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num} IDs
                </option>
              ))}
            </select>
          </div>

          {idType === 'nanoid' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-outline font-medium">Length:</span>
              <input
                type="number"
                min={4}
                max={64}
                value={nanoLength}
                onChange={(e) => setNanoLength(Math.max(4, Math.min(64, Number(e.target.value))))}
                className="w-16 h-8 px-2 rounded-lg bg-surface border border-outline-variant text-xs font-mono text-on-surface text-center focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-outline font-medium">Format:</span>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as 'plain' | 'json' | 'comma')}
              className="h-8 px-2.5 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            >
              <option value="plain">Lines (Plain Text)</option>
              <option value="json">JSON Array</option>
              <option value="comma">Comma Separated</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>Uppercase</span>
          </label>

          {(idType === 'uuid-v4' || idType === 'uuid-v7') && (
            <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={noHyphens}
                onChange={(e) => setNoHyphens(e.target.checked)}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span>No Hyphens</span>
            </label>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={regenerate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 shadow-sm transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors"
          >
            {copiedAll ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedAll ? 'Copied All' : 'Copy All'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Download list"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* UUIDs Display List */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-low divide-y divide-outline-variant/60 overflow-hidden">
        {ids.map((id, idx) => (
          <div
            key={`${id}-${idx}`}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-container/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-outline w-6 text-right select-none">
                {idx + 1}.
              </span>
              <span className="font-mono text-xs text-on-surface tracking-wider selection:bg-primary-container/20">
                {id}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopySingle(id, idx)}
              className="p-1.5 rounded-md text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
              title="Copy ID"
            >
              {copiedIndex === idx ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Helpful Spec Notice */}
      <div className="flex items-center gap-2 text-[11px] text-outline px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>
          {idType === 'uuid-v7' &&
            'UUID v7 encodes a 48-bit timestamp at the beginning, making it ideal for primary keys in B-Tree indexed databases.'}
          {idType === 'uuid-v4' &&
            'UUID v4 generates 122 cryptographically random bits with negligible collision probability.'}
          {idType === 'nanoid' &&
            'NanoID is URL-safe, compact, and provides equal or better collision resistance than UUID with fewer characters.'}
          {idType === 'ulid' &&
            'ULID uses Crockford 32-character alphabet, avoiding ambiguous letters like I, L, O, and U.'}
        </span>
      </div>
    </div>
  );
};

export default UuidGeneratorTool;
