import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createUniversalBackupPayload,
  restoreUniversalBackup,
  WorkspaceBackup,
} from './workspaceBackupLogic';
import * as scannerDb from '@/tools/document-scanner/scannerDb';
import * as apiStorage from '@/tools/rest-api-client/apiStorage';
import { getCustomWorkspaces, saveCustomWorkspace } from '@/features/workspaces/workspaceLogic';
import {
  getStoredSplitRatio,
  saveStoredSplitRatio,
  getStoredSecondarySlug,
} from '@/features/split-view/splitViewLogic';

describe('workspaceBackupLogic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates universal backup payload incorporating settings, workspaces, and stores', async () => {
    vi.spyOn(scannerDb, 'listDocuments').mockResolvedValue([
      { id: 'doc_1', title: 'Passport', createdAt: 1, updatedAt: 1, pages: [] },
    ]);
    vi.spyOn(apiStorage, 'getCollectionItems').mockResolvedValue([]);
    vi.spyOn(apiStorage, 'getEnvironments').mockResolvedValue([]);
    vi.spyOn(apiStorage, 'getHistoryItems').mockResolvedValue([]);

    saveStoredSplitRatio(65);
    saveCustomWorkspace({
      name: 'My API Suite',
      primaryToolSlug: 'rest-api-client',
      secondaryToolSlug: 'jwt-studio',
      isSplit: true,
    });

    const payload = await createUniversalBackupPayload({
      theme: 'dark',
      favorites: ['json-formatter'],
      recentToolIds: ['base64'],
    });

    expect(payload.app).toBe('Toolnest');
    expect(payload.version).toBe('2.9.0');
    expect(payload.settings.theme).toBe('dark');
    expect(payload.settings.splitRatio).toBe(65);
    expect(payload.settings.favorites).toContain('json-formatter');
    expect(payload.workspaces).toHaveLength(1);
    expect(payload.workspaces?.[0].name).toBe('My API Suite');
    expect(payload.documentScanner?.documents).toHaveLength(1);
  });

  it('restores universal backup documents, collections, workspaces, and split settings', async () => {
    const saveDocSpy = vi.spyOn(scannerDb, 'saveDocument').mockResolvedValue();
    const saveCollsSpy = vi.spyOn(apiStorage, 'saveCollectionItems').mockResolvedValue();
    const saveEnvsSpy = vi.spyOn(apiStorage, 'saveEnvironments').mockResolvedValue();
    const saveHistSpy = vi.spyOn(apiStorage, 'saveHistoryItem').mockResolvedValue();

    const backup: WorkspaceBackup = {
      app: 'Toolnest',
      version: '2.9.0',
      exportedAt: new Date().toISOString(),
      settings: {
        theme: 'light',
        favorites: [],
        splitRatio: 70,
        secondaryToolSlug: 'regex-tester',
      },
      workspaces: [
        {
          id: 'custom_ws_backup_1',
          name: 'Restored Regex Workspace',
          description: 'Backed up workspace',
          primaryToolSlug: 'json-formatter',
          secondaryToolSlug: 'regex-tester',
          isSplit: true,
          createdAt: 1700000000000,
        },
      ],
      documentScanner: {
        documents: [
          { id: 'd1', title: 'Contract', createdAt: 1, updatedAt: 1, pages: [] },
          { id: 'd2', title: 'Receipt', createdAt: 2, updatedAt: 2, pages: [] },
        ],
      },
      restApiClient: {
        collections: [
          {
            id: 'c1',
            method: 'GET',
            url: 'https://api.example.com',
            params: [],
            headers: [],
            auth: { type: 'none' },
            bodyType: 'none',
            bodyContent: '',
            formParams: [],
          },
        ],
        environments: [{ id: 'e1', name: 'Production', variables: [] }],
        history: [
          {
            id: 'h1',
            timestamp: 1000,
            request: {
              id: 'c1',
              method: 'GET',
              url: 'https://api.example.com',
              params: [],
              headers: [],
              auth: { type: 'none' },
              bodyType: 'none',
              bodyContent: '',
              formParams: [],
            },
          },
        ],
      },
    };

    const summary = await restoreUniversalBackup(backup);
    expect(summary.restoredDocuments).toBe(2);
    expect(summary.restoredCollections).toBe(1);
    expect(summary.restoredEnvironments).toBe(1);
    expect(summary.restoredWorkspaces).toBe(1);
    expect(summary.restoredSplitRatio).toBe(true);
    expect(getStoredSplitRatio()).toBe(70);
    expect(getStoredSecondarySlug()).toBe('regex-tester');
    expect(getCustomWorkspaces()).toHaveLength(1);
    expect(getCustomWorkspaces()[0].name).toBe('Restored Regex Workspace');
    expect(saveDocSpy).toHaveBeenCalledTimes(2);
    expect(saveCollsSpy).toHaveBeenCalledTimes(1);
    expect(saveEnvsSpy).toHaveBeenCalledTimes(1);
    expect(saveHistSpy).toHaveBeenCalledTimes(1);
  });
});
