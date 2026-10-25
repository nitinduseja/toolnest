import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, RefreshCw, Download } from 'lucide-react';
import { generateUuidBatch } from './uuidLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

export const UuidGeneratorTool: React.FC = () => {
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const regenerate = useCallback(() => {
    let batch = generateUuidBatch(quantity, uppercase);
    if (noHyphens) {
      batch = batch.map((u) => u.replace(/-/g, ''));
    }
    setUuids(batch);
  }, [quantity, uppercase, noHyphens]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const handleCopySingle = async (uuid: string, index: number) => {
    const ok = await copyToClipboard(uuid);
    if (ok) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const handleCopyAll = async () => {
    const text = uuids.join('\n');
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Configuration Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-outline font-medium">Quantity:</span>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-8 px-2.5 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            >
              {[1, 5, 10, 20, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num} UUIDs
                </option>
              ))}
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

          <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={noHyphens}
              onChange={(e) => setNoHyphens(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>Remove Hyphens</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={regenerate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 shadow-sm transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant/60 transition-colors"
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
            onClick={() => downloadFile(uuids.join('\n'), { filename: 'uuids.txt' })}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Download list"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* UUIDs Display List */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-low divide-y divide-outline-variant/60 overflow-hidden">
        {uuids.map((uuid, idx) => (
          <div
            key={`${uuid}-${idx}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-surface-container/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-outline w-6 text-right select-none">
                {idx + 1}.
              </span>
              <span className="font-mono text-xs text-on-surface tracking-wider selection:bg-primary-container/20">
                {uuid}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopySingle(uuid, idx)}
              className="p-1.5 rounded-md text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
              title="Copy this UUID"
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
    </div>
  );
};

export default UuidGeneratorTool;
