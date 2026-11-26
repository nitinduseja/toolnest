import React from 'react';
import { Database, Trash2 } from 'lucide-react';
import { IndexedDbAuditSummary } from './storageAuditLogic';

interface IndexedDbAuditSectionProps {
  indexedDb: IndexedDbAuditSummary;
  onPurgeScanner: () => void;
  onPurgeRestApi: () => void;
}

export const IndexedDbAuditSection: React.FC<IndexedDbAuditSectionProps> = ({
  indexedDb,
  onPurgeScanner,
  onPurgeRestApi,
}) => {
  const restTotal = indexedDb.apiCollections + indexedDb.apiEnvironments + indexedDb.apiHistory;

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
        <Database className="w-3.5 h-3.5 text-primary" />
        <span>IndexedDB Databases</span>
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-surface border border-outline-variant flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-medium text-on-surface">Document Scanner Scans</div>
            <div className="text-[11px] font-mono text-outline">
              {indexedDb.scannerDocuments} saved{' '}
              {indexedDb.scannerDocuments === 1 ? 'document' : 'documents'}
            </div>
          </div>
          <button
            type="button"
            disabled={indexedDb.scannerDocuments === 0}
            onClick={onPurgeScanner}
            aria-label="Purge Document Scanner Database"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-outline-variant hover:border-red-500/40 hover:bg-red-500/10 text-[11px] text-on-surface hover:text-red-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Purge</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-outline-variant flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-medium text-on-surface">
              REST API Collections &amp; History
            </div>
            <div className="text-[11px] font-mono text-outline">
              {indexedDb.apiCollections} collections • {indexedDb.apiEnvironments} envs •{' '}
              {indexedDb.apiHistory} history
            </div>
          </div>
          <button
            type="button"
            disabled={restTotal === 0}
            onClick={onPurgeRestApi}
            aria-label="Purge REST API Database"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-outline-variant hover:border-red-500/40 hover:bg-red-500/10 text-[11px] text-on-surface hover:text-red-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Purge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
