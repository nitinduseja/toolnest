import { listDocuments } from '@/tools/document-scanner/scannerDb';
import {
  getCollectionItems,
  getEnvironments,
  getHistoryItems,
} from '@/tools/rest-api-client/apiStorage';

export type StorageCategory = 'preferences' | 'workspaces' | 'navigation' | 'other';

export interface StorageKeyEntry {
  key: string;
  label: string;
  category: StorageCategory;
  bytes: number;
  itemCount: number | null;
}

export interface IndexedDbAuditSummary {
  scannerDocuments: number;
  apiCollections: number;
  apiEnvironments: number;
  apiHistory: number;
}

export interface StorageAuditReport {
  localKeys: StorageKeyEntry[];
  totalLocalBytes: number;
  indexedDb: IndexedDbAuditSummary;
  cacheNames: string[];
  swActive: boolean;
}

const KNOWN_KEYS: Record<string, { label: string; category: StorageCategory }> = {
  toolnest_theme: { label: 'Theme Preference', category: 'preferences' },
  toolnest_favorites: { label: 'Pinned Favorites Order', category: 'navigation' },
  toolnest_recent_tools: { label: 'Recent Tools History', category: 'navigation' },
  toolnest_custom_workspaces: { label: 'Saved Split Workspaces', category: 'workspaces' },
  toolnest_split_secondary: { label: 'Last Secondary Split Tool', category: 'workspaces' },
  toolnest_split_ratio: { label: 'Split Pane Ratio (%)', category: 'workspaces' },
};

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function describeStorageKey(key: string): { label: string; category: StorageCategory } {
  return KNOWN_KEYS[key] || { label: key, category: 'other' };
}

function estimateArrayCount(raw: string): number | null {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : null;
  } catch {
    return null;
  }
}

export function inspectLocalStorage(): { entries: StorageKeyEntry[]; totalBytes: number } {
  const entries: StorageKeyEntry[] = [];
  let totalBytes = 0;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const val = localStorage.getItem(key) || '';
      const bytes = new TextEncoder().encode(key + val).length;
      const meta = describeStorageKey(key);
      totalBytes += bytes;
      entries.push({
        key,
        label: meta.label,
        category: meta.category,
        bytes,
        itemCount: estimateArrayCount(val),
      });
    }
  } catch {
    // Storage access unavailable
  }

  entries.sort((a, b) => b.bytes - a.bytes);
  return { entries, totalBytes };
}

export function purgeStorageKey(key: string): void {
  try {
    localStorage.removeItem(key);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new StorageEvent('storage', { key, newValue: null }));
    }
  } catch {
    // Ignore storage removal failures
  }
}

export async function runStorageAudit(): Promise<StorageAuditReport> {
  const { entries, totalBytes } = inspectLocalStorage();

  const [docs, collections, envs, history] = await Promise.all([
    listDocuments().catch(() => []),
    getCollectionItems().catch(() => []),
    getEnvironments().catch(() => []),
    getHistoryItems().catch(() => []),
  ]);

  let cacheNames: string[] = [];
  if (typeof caches !== 'undefined') {
    cacheNames = await caches.keys().catch(() => []);
  }

  let swActive = false;
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration().catch(() => undefined);
    swActive = Boolean(reg?.active);
  }

  return {
    localKeys: entries,
    totalLocalBytes: totalBytes,
    indexedDb: {
      scannerDocuments: docs.length,
      apiCollections: collections.length,
      apiEnvironments: envs.length,
      apiHistory: history.length,
    },
    cacheNames,
    swActive,
  };
}
