/**
 * Universal Workspace Backup and Restore logic for Toolnest.
 * Exports and restores localStorage preferences, custom workspaces, and IndexedDB stores.
 */
import { listDocuments, saveDocument, SavedScanDocument } from '@/tools/document-scanner/scannerDb';
import {
  getCollectionItems,
  getEnvironments,
  getHistoryItems,
  saveCollectionItems,
  saveEnvironments,
  saveHistoryItem,
} from '@/tools/rest-api-client/apiStorage';
import { ApiRequest, Environment, HistoryItem } from '@/tools/rest-api-client/types';
import {
  WorkspaceSession,
  getCustomWorkspaces,
  restoreCustomWorkspaces,
} from '@/features/workspaces/workspaceLogic';
import {
  getStoredSplitRatio,
  saveStoredSplitRatio,
  getStoredSecondarySlug,
  saveStoredSecondarySlug,
} from '@/features/split-view/splitViewLogic';

export interface WorkspaceBackup {
  app: 'Toolnest';
  version: string;
  exportedAt: string;
  settings: {
    theme?: string;
    favorites?: string[];
    recentToolIds?: string[];
    splitRatio?: number;
    secondaryToolSlug?: string;
  };
  workspaces?: WorkspaceSession[];
  documentScanner?: {
    documents: SavedScanDocument[];
  };
  restApiClient?: {
    collections: ApiRequest[];
    environments: Environment[];
    history?: HistoryItem[];
  };
}

export interface RestoreSummary {
  restoredDocuments: number;
  restoredCollections: number;
  restoredEnvironments: number;
  restoredWorkspaces: number;
  restoredSplitRatio: boolean;
}

export async function createUniversalBackupPayload(settings: {
  theme?: string;
  favorites?: string[];
  recentToolIds?: string[];
}): Promise<WorkspaceBackup> {
  const [docs, collections, envs, history] = await Promise.all([
    listDocuments().catch(() => []),
    getCollectionItems().catch(() => []),
    getEnvironments().catch(() => []),
    getHistoryItems().catch(() => []),
  ]);

  return {
    app: 'Toolnest',
    version: '2.9.0',
    exportedAt: new Date().toISOString(),
    settings: {
      ...settings,
      splitRatio: getStoredSplitRatio(),
      secondaryToolSlug: getStoredSecondarySlug(),
    },
    workspaces: getCustomWorkspaces(),
    documentScanner: { documents: docs },
    restApiClient: { collections, environments: envs, history },
  };
}

function restoreLayoutAndWorkspaces(backup: WorkspaceBackup): {
  restoredWorkspaces: number;
  restoredSplitRatio: boolean;
} {
  let restoredWorkspaces = 0;
  let restoredSplitRatio = false;

  if (Array.isArray(backup.workspaces) && backup.workspaces.length > 0) {
    restoredWorkspaces = restoreCustomWorkspaces(backup.workspaces);
  }
  if (typeof backup.settings?.splitRatio === 'number') {
    saveStoredSplitRatio(backup.settings.splitRatio);
    restoredSplitRatio = true;
  }
  if (backup.settings?.secondaryToolSlug) {
    saveStoredSecondarySlug(backup.settings.secondaryToolSlug);
  }
  return { restoredWorkspaces, restoredSplitRatio };
}

export async function restoreUniversalBackup(backup: WorkspaceBackup): Promise<RestoreSummary> {
  let restoredDocuments = 0;
  let restoredCollections = 0;
  let restoredEnvironments = 0;

  if (backup.documentScanner?.documents?.length) {
    for (const doc of backup.documentScanner.documents) {
      await saveDocument(doc);
      restoredDocuments++;
    }
  }
  if (backup.restApiClient?.collections?.length) {
    await saveCollectionItems(backup.restApiClient.collections);
    restoredCollections = backup.restApiClient.collections.length;
  }
  if (backup.restApiClient?.environments?.length) {
    await saveEnvironments(backup.restApiClient.environments);
    restoredEnvironments = backup.restApiClient.environments.length;
  }
  if (backup.restApiClient?.history?.length) {
    for (const item of backup.restApiClient.history) {
      await saveHistoryItem(item);
    }
  }

  const { restoredWorkspaces, restoredSplitRatio } = restoreLayoutAndWorkspaces(backup);
  return {
    restoredDocuments,
    restoredCollections,
    restoredEnvironments,
    restoredWorkspaces,
    restoredSplitRatio,
  };
}
