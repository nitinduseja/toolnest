import React, { useState } from 'react';
import { WifiOff, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { usePwa } from '@/lib/pwa/pwaManager';

export const PwaStatusBanner: React.FC = () => {
  const { isOnline, isUpdateAvailable, applyUpdate } = usePwa();
  const [offlineDismissed, setOfflineDismissed] = useState(false);

  // If update is available, prioritize update banner
  if (isUpdateAvailable) {
    return (
      <aside
        aria-label="Application update available"
        className="fixed bottom-4 right-4 z-50 max-w-sm p-3.5 rounded-2xl bg-surface-container-high border border-primary/30 shadow-2xl flex items-center justify-between gap-3 text-xs animate-in slide-in-from-bottom duration-300 select-none"
      >
        <div className="flex items-center gap-2 text-on-surface">
          <RefreshCw className="w-4 h-4 text-primary animate-spin" />
          <span>New version available!</span>
        </div>
        <button
          type="button"
          onClick={applyUpdate}
          className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-xs hover:opacity-95 cursor-pointer shrink-0"
        >
          Reload
        </button>
      </aside>
    );
  }

  // If offline and not dismissed, show subtle notice
  if (!isOnline && !offlineDismissed) {
    return (
      <aside
        aria-label="Offline mode indicator"
        className="fixed bottom-4 right-4 z-50 max-w-sm p-3 rounded-2xl bg-surface-container-high border border-outline-variant shadow-2xl flex items-center justify-between gap-3 text-xs select-none"
      >
        <div className="flex items-center gap-2 text-on-surface">
          <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <div className="font-semibold text-xs">Offline Mode</div>
            <div className="text-[11px] text-outline flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>All tools work 100% locally</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOfflineDismissed(true)}
          className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </aside>
    );
  }

  return null;
};
