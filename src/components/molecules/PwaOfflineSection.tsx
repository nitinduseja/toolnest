import React, { useState, useEffect } from 'react';
import { Download, HardDriveDownload, CheckCircle2 } from 'lucide-react';
import { usePwaInstall } from '@/lib/pwa/usePwaInstall';
import { getOfflineCacheAssetCount, warmOfflineCache } from '@/lib/pwa/pwaManager';

export const PwaOfflineSection: React.FC = () => {
  const { canInstall, installApp } = usePwaInstall();
  const [cachedCount, setCachedCount] = useState<number>(0);
  const [warming, setWarming] = useState<boolean>(false);
  const [warmStatus, setWarmStatus] = useState<string | null>(null);

  useEffect(() => {
    getOfflineCacheAssetCount()
      .then(setCachedCount)
      .catch(() => {});
  }, []);

  const handleWarmOffline = async () => {
    setWarming(true);
    setWarmStatus(null);
    const res = await warmOfflineCache();
    const updatedCount = res.cachedCount || (await getOfflineCacheAssetCount());
    setCachedCount(updatedCount);
    setWarming(false);
    setWarmStatus(
      res.ok
        ? `Cached ${updatedCount} offline assets cleanly.`
        : 'Offline bundle pre-caching activates on production builds.'
    );
    setTimeout(() => setWarmStatus(null), 4000);
  };

  return (
    <section className="p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface">
          Progressive Web App &amp; Offline
        </h2>
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          {cachedCount > 0 ? `${cachedCount} Cached Assets` : 'Offline Ready'}
        </span>
      </div>
      <p className="text-xs text-on-surface-variant">
        Toolnest runs 100% locally in your browser with service worker precaching for instant
        offline launches across all 60 tools.
      </p>
      {warmStatus && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{warmStatus}</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleWarmOffline}
          disabled={warming}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container text-on-surface text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
        >
          <HardDriveDownload className="w-3.5 h-3.5 text-primary" />
          <span>{warming ? 'Caching Tools...' : 'Cache All 60 Tools Offline'}</span>
        </button>

        {canInstall && (
          <button
            type="button"
            onClick={installApp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install Toolnest to Device</span>
          </button>
        )}
      </div>
    </section>
  );
};
