import React, { useMemo } from 'react';
import { Download, Trash2, Edit3, Archive, Layers } from 'lucide-react';
import { SvgBatchItem } from './types';
import { downloadFile, downloadZip } from '@/lib/downloads';

interface SvgBatchOptimizerProps {
  items: SvgBatchItem[];
  onRemove: (id: string) => void;
  onSelect: (item: SvgBatchItem) => void;
  onClearAll: () => void;
}

export const SvgBatchOptimizer: React.FC<SvgBatchOptimizerProps> = ({
  items,
  onRemove,
  onSelect,
  onClearAll,
}) => {
  const aggregateStats = useMemo(() => {
    let orig = 0;
    let opt = 0;
    items.forEach((item) => {
      orig += item.stats.originalBytes;
      opt += item.stats.optimizedBytes;
    });
    const saved = Math.max(0, orig - opt);
    const pct = orig > 0 ? Math.round((saved / orig) * 100) : 0;
    return { orig, opt, saved, pct };
  }, [items]);

  const handleDownloadAllZip = () => {
    if (items.length === 0) return;
    const files: Record<string, string> = {};
    items.forEach((item) => {
      const cleanName = item.name.endsWith('.svg') ? item.name : `${item.name}.svg`;
      files[cleanName] = item.optimizedSvg;
    });
    downloadZip(files, 'optimized-svgs.zip');
  };

  const handleDownloadSingle = (item: SvgBatchItem) => {
    const filename = item.name.endsWith('.svg') ? item.name : `${item.name}.svg`;
    downloadFile(item.optimizedSvg, { filename, mimeType: 'image/svg+xml' });
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
      {/* Batch Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-on-surface">
            Batch SVG Queue ({items.length} {items.length === 1 ? 'file' : 'files'})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadAllZip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Download All (.zip)</span>
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-outline hover:text-red-500 hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Queue</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats Summary */}
      <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-on-surface-variant font-medium">Batch Reduction Summary</span>
        <div className="flex items-center gap-4 font-mono text-[11px] sm:text-xs">
          <span>
            <span className="text-outline">Total Original: </span>
            <strong>{(aggregateStats.orig / 1024).toFixed(1)} KB</strong>
          </span>
          <span>
            <span className="text-outline">Optimized: </span>
            <strong>{(aggregateStats.opt / 1024).toFixed(1)} KB</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
            Saved {(aggregateStats.saved / 1024).toFixed(1)} KB (-{aggregateStats.pct}%)
          </span>
        </div>
      </div>

      {/* Files List Table */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container-high/60 text-outline border-b border-outline-variant font-medium">
            <tr>
              <th className="py-2.5 px-3">File Name</th>
              <th className="py-2.5 px-3 text-right">Original</th>
              <th className="py-2.5 px-3 text-right">Optimized</th>
              <th className="py-2.5 px-3 text-center">Savings</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container/40 transition-colors">
                <td className="py-2.5 px-3 font-medium text-on-surface max-w-xs truncate">
                  {item.name}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-outline">
                  {(item.stats.originalBytes / 1024).toFixed(1)} KB
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-on-surface font-semibold">
                  {(item.stats.optimizedBytes / 1024).toFixed(1)} KB
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                    -{item.stats.savingsPercentage}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      title="Inspect / Edit in Studio"
                      className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(item)}
                      title="Download SVG"
                      className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      title="Remove from batch"
                      className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
