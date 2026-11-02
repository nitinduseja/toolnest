import React from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { CompressionStats } from './types';
import { formatBytes } from './compressorLogic';

export interface CompressionStatsBarProps {
  stats: CompressionStats;
  doneCount: number;
  totalCount: number;
  onDownloadAll: () => void;
}

export const CompressionStatsBar: React.FC<CompressionStatsBarProps> = ({
  stats,
  doneCount,
  totalCount,
  onDownloadAll,
}) => {
  if (doneCount === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="font-semibold text-on-surface">
          {doneCount} of {totalCount} image{totalCount > 1 ? 's' : ''} compressed
        </span>
      </div>

      <div className="flex items-center gap-4 font-mono">
        <span>
          <span className="text-outline">Original: </span>
          <strong>{formatBytes(stats.totalOriginalBytes)}</strong>
        </span>
        <span>
          <span className="text-outline">Compressed: </span>
          <strong>{formatBytes(stats.totalCompressedBytes)}</strong>
        </span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
          Saved {formatBytes(stats.totalSavedBytes)} (-{stats.savingsPercentage}%)
        </span>
      </div>

      <button
        type="button"
        onClick={onDownloadAll}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Download All ({doneCount})</span>
      </button>
    </div>
  );
};
