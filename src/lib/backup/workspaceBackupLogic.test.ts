import { describe, it, expect, vi } from 'vitest';
import {
  createUniversalBackupPayload,
  restoreUniversalBackup,
  WorkspaceBackup,
} from './workspaceBackupLogic';
import * as scannerDb from '@/tools/document-scanner/scannerDb';
import * as apiStorage from '@/tools/rest-api-client/apiStorage';

describe('workspaceBackupLogic', () => {
  it('creates universal backup payload incorporating settings and stores', async () => {
    vi.spyOn(scannerDb, 'listDocuments').mockResolvedValue([
      { id: 'doc_1', title: 'Passport', createdAt: 1, updatedAt: 1, pages: [] },
    ]);
    vi.spyOn(apiStorage, 'getCollectionItems').mockResolvedValue([]);
    vi.spyOn(apiStorage, 'getEnvironments').mockResolvedValue([]);
    vi.spyOn(apiStorage, 'getHistoryItems').mockResolvedValue([]);

    const payload = await createUniversalBackupPayload({
      theme: 'dark',
      favorites: ['json-formatter'],
      recentToolIds: ['base64'],
    });

    expect(payload.app).toBe('Toolnest');
    expect(payload.version).toBe('2.0.0');
    expect(payload.settings.theme).toBe('dark');
    expect(payload.settings.favorites).toContain('json-formatter');
    expect(payload.documentScanner?.documents).toHaveLength(1);
  });

  it('restores universal backup documents and collections', async () => {
    const saveDocSpy = vi.spyOn(scannerDb, 'saveDocument').mockResolvedValue();
    const saveCollsSpy = vi.spyOn(apiStorage, 'saveCollectionItems').mockResolvedValue();
    const saveEnvsSpy = vi.spyOn(apiStorage, 'saveEnvironments').mockResolvedValue();
    const saveHistSpy = vi.spyOn(apiStorage, 'saveHistoryItem').mockResolvedValue();

    const backup: WorkspaceBackup = {
      app: 'Toolnest',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      settings: { theme: 'light', favorites: [] },
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
    expect(saveDocSpy).toHaveBeenCalledTimes(2);
    expect(saveCollsSpy).toHaveBeenCalledTimes(1);
    expect(saveEnvsSpy).toHaveBeenCalledTimes(1);
    expect(saveHistSpy).toHaveBeenCalledTimes(1);
  });
});
