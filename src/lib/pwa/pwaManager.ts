import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PwaState {
  isOnline: boolean;
  isInstallable: boolean;
  isUpdateAvailable: boolean;
  promptInstall: () => Promise<boolean>;
  applyUpdate: () => void;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let updateWaitingWorker: ServiceWorker | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function registerPwaServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyListeners();
  });

  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                updateWaitingWorker = newWorker;
                notifyListeners();
              }
            });
          });

          if (reg.waiting) {
            updateWaitingWorker = reg.waiting;
            notifyListeners();
          }
        })
        .catch(() => {
          // Registration ignored
        });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }
}

export async function getOfflineCacheAssetCount(): Promise<number> {
  if (typeof caches === 'undefined') return 0;
  try {
    const names = await caches.keys();
    let total = 0;
    for (const name of names) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      total += keys.length;
    }
    return total;
  } catch {
    return 0;
  }
}

export async function warmOfflineCache(): Promise<{ ok: boolean; cachedCount: number }> {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration().catch(() => undefined);
    const active = reg?.active || navigator.serviceWorker.controller;
    if (active && typeof MessageChannel !== 'undefined') {
      return new Promise((resolve) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => resolve({ ok: false, cachedCount: 0 }), 5000);
        channel.port1.onmessage = (event) => {
          clearTimeout(timer);
          resolve({
            ok: true,
            cachedCount: Number(event.data?.cachedCount || 0),
          });
        };
        active.postMessage({ type: 'WARM_OFFLINE_CACHE' }, [channel.port2]);
      });
    }
  }
  const count = await getOfflineCacheAssetCount();
  return { ok: count > 0, cachedCount: count };
}

export function usePwa(): PwaState {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const onChange = () => setTick((t) => t + 1);
    listeners.add(onChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      listeners.delete(onChange);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        deferredPrompt = null;
        notifyListeners();
        return true;
      }
    } catch {
      // Ignored
    }
    return false;
  }, []);

  const applyUpdate = useCallback(() => {
    if (updateWaitingWorker) {
      updateWaitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }, []);

  return {
    isOnline,
    isInstallable: Boolean(deferredPrompt),
    isUpdateAvailable: Boolean(updateWaitingWorker),
    promptInstall,
    applyUpdate,
  };
}
