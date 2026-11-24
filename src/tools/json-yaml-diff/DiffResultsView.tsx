import React, { useState } from 'react';
import { Copy, Check, GitCommit, FileCode } from 'lucide-react';
import { DiffEntry, DiffSummary } from './types';
import { generateJsonPatch } from './diffLogic';
import { copyToClipboard } from '@/lib/clipboard';

interface DiffResultsViewProps {
  entries: DiffEntry[];
  summary: DiffSummary;
}

export const DiffResultsView: React.FC<DiffResultsViewProps> = ({ entries, summary }) => {
  const [showPatch, setShowPatch] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const jsonPatch = JSON.stringify(generateJsonPatch(entries), null, 2);

  const handleCopyPatch = async () => {
    const ok = await copyToClipboard(jsonPatch);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-surface-container-low border border-outline-variant">
        <GitCommit className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
        <p className="text-sm font-semibold text-on-surface">No Structural Differences Found</p>
        <p className="text-xs text-outline mt-1">
          Both data structures are semantically identical.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-on-surface">
            Structural Changes ({summary.total})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600">
            +{summary.added} Added
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-600">
            -{summary.removed} Removed
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600">
            ~{summary.replaced} Modified
          </span>
          <button
            type="button"
            onClick={() => setShowPatch(!showPatch)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface hover:bg-surface-container border border-outline-variant text-on-surface cursor-pointer ml-1"
          >
            <FileCode className="w-3.5 h-3.5 text-primary" />
            <span>{showPatch ? 'Show Diff List' : 'RFC 6902 Patch'}</span>
          </button>
        </div>
      </div>

      {/* JSON Patch view */}
      {showPatch ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-outline">RFC 6902 JSON Patch</span>
            <button
              type="button"
              onClick={handleCopyPatch}
              className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copied ? 'Copied' : 'Copy Patch'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface overflow-x-auto max-h-64">
            <code>{jsonPatch}</code>
          </pre>
        </div>
      ) : (
        /* Structural entries table */
        <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high/60 text-outline border-b border-outline-variant font-medium">
              <tr>
                <th className="py-2 px-3">Path</th>
                <th className="py-2 px-3">Action</th>
                <th className="py-2 px-3">Original (Left)</th>
                <th className="py-2 px-3">Modified (Right)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-mono text-[11px]">
              {entries.map((entry, idx) => {
                const badgeColor =
                  entry.op === 'add'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : entry.op === 'remove'
                      ? 'bg-red-500/10 text-red-600'
                      : 'bg-amber-500/10 text-amber-600';

                return (
                  <tr key={idx} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-2 px-3 font-semibold text-primary">{entry.path}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] ${badgeColor}`}
                      >
                        {entry.op}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-red-600/80 max-w-xs truncate">
                      {entry.oldValue !== undefined ? JSON.stringify(entry.oldValue) : '-'}
                    </td>
                    <td className="py-2 px-3 text-emerald-600/90 max-w-xs truncate">
                      {entry.newValue !== undefined ? JSON.stringify(entry.newValue) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
