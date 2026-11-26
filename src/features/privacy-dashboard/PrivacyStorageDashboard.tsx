import React, { useEffect, useState, useCallback } from 'react';
import { Database, RefreshCw, Trash2, HardDrive, ShieldCheck } from 'lucide-react';
import {
  StorageAuditReport,
  formatBytes,
  purgeStorageKey,
  purgeDocumentScannerDb,
  purgeRestApiClientDb,
  purgeAllToolnestStorage,
  runStorageAudit,
} from './storageAuditLogic';
import { IndexedDbAuditSection } from './IndexedDbAuditSection';

interface PrivacyStorageDashboardProps {
  onDataPurged?: (message: string) => void;
}

export const PrivacyStorageDashboard: React.FC<PrivacyStorageDashboardProps> = ({
  onDataPurged,
}) => {
  const [report, setReport] = useState<StorageAuditReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAudit = useCallback(async () => {
    setIsRefreshing(true);
    const res = await runStorageAudit();
    setReport(res);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  const handlePurgeKey = async (key: string, label: string) => {
    purgeStorageKey(key);
    await loadAudit();
    onDataPurged?.(`Cleared "${label}" (${key}).`);
  };

  const handlePurgeCaches = async () => {
    if (typeof caches !== 'undefined') {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    }
    await loadAudit();
    onDataPurged?.('Offline service worker caches cleared.');
  };

  const handlePurgeScannerDb = async () => {
    await purgeDocumentScannerDb();
    await loadAudit();
    onDataPurged?.('Document Scanner IndexedDB scans cleared.');
  };

  const handlePurgeRestApiDb = async () => {
    await purgeRestApiClientDb();
    await loadAudit();
    onDataPurged?.('REST API Client collections & history cleared.');
  };

  const handlePurgeAll = async () => {
    if (
      window.confirm('Purge ALL Toolnest localStorage keys, IndexedDB stores, and offline caches?')
    ) {
      await purgeAllToolnestStorage();
      await loadAudit();
      onDataPurged?.('All Toolnest local storage, IndexedDB databases, and caches purged.');
    }
  };

  const totalIdbRecords = report
    ? report.indexedDb.scannerDocuments +
      report.indexedDb.apiCollections +
      report.indexedDb.apiEnvironments +
      report.indexedDb.apiHistory
    : 0;

  return (
    <section
      className="p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-5"
      aria-label="Local Privacy & Storage Dashboard"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <HardDrive className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface">
              Local Privacy &amp; Storage Inspector
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Live audit of browser storage keys, IndexedDB stores, and offline caches.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadAudit}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container text-xs font-medium text-on-surface cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>Refresh Audit</span>
          </button>
          <button
            type="button"
            onClick={handlePurgeAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-xs font-medium text-red-500 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {report && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-surface border border-outline-variant/80">
              <div className="text-[11px] text-outline uppercase font-semibold">LocalStorage</div>
              <div className="text-base font-bold font-mono text-on-surface mt-0.5">
                {formatBytes(report.totalLocalBytes)}
              </div>
              <div className="text-[10px] text-on-surface-variant">
                {report.localKeys.length} active keys
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-outline-variant/80">
              <div className="text-[11px] text-outline uppercase font-semibold">IndexedDB</div>
              <div className="text-base font-bold font-mono text-on-surface mt-0.5">
                {totalIdbRecords} records
              </div>
              <div className="text-[10px] text-on-surface-variant">
                {report.indexedDb.scannerDocuments} scans • {report.indexedDb.apiCollections} APIs
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-outline-variant/80">
              <div className="text-[11px] text-outline uppercase font-semibold">Offline Cache</div>
              <div className="text-base font-bold font-mono text-on-surface mt-0.5">
                {report.cacheNames.length} {report.cacheNames.length === 1 ? 'bucket' : 'buckets'}
              </div>
              <div className="text-[10px] text-on-surface-variant">
                {report.swActive ? 'Service Worker Active' : 'Standard Browser Cache'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Telemetry</span>
              </div>
              <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                0 bytes sent
              </div>
              <div className="text-[10px] text-on-surface-variant">100% browser resident</div>
            </div>
          </div>

          {/* Keys Breakdown Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-primary" />
                <span>Stored Local Keys</span>
              </span>
              {report.cacheNames.length > 0 && (
                <button
                  type="button"
                  onClick={handlePurgeCaches}
                  className="text-[11px] text-outline hover:text-red-500 underline cursor-pointer"
                >
                  Clear Offline Caches ({report.cacheNames.length})
                </button>
              )}
            </div>

            {report.localKeys.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-high/60 text-outline border-b border-outline-variant font-medium">
                    <tr>
                      <th className="py-2 px-3">Feature / Label</th>
                      <th className="py-2 px-3">Storage Key</th>
                      <th className="py-2 px-3 text-right">Size</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {report.localKeys.map((entry) => (
                      <tr key={entry.key} className="hover:bg-surface-container/30">
                        <td className="py-2 px-3 font-medium text-on-surface">
                          <span>{entry.label}</span>
                          {entry.itemCount !== null && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px]">
                              {entry.itemCount} items
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-outline">
                          {entry.key}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-on-surface">
                          {formatBytes(entry.bytes)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handlePurgeKey(entry.key, entry.label)}
                            aria-label={`Purge ${entry.label}`}
                            className="p-1 rounded-md text-outline hover:text-red-500 hover:bg-surface-container transition-colors cursor-pointer"
                            title="Delete this local storage key"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-outline rounded-xl border border-dashed border-outline-variant bg-surface">
                No localStorage keys are currently stored.
              </div>
            )}
          </div>

          <IndexedDbAuditSection
            indexedDb={report.indexedDb}
            onPurgeScanner={handlePurgeScannerDb}
            onPurgeRestApi={handlePurgeRestApiDb}
          />
        </>
      )}
    </section>
  );
};
