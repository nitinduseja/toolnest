import { useState, useCallback } from 'react';
import { ApiRequest } from './types';
import {
  saveCollectionItem,
  saveCollectionItems,
  deleteCollectionItem,
  deleteCollectionFolder,
  renameCollectionFolder,
} from './apiStorage';
import {
  duplicateCollectionRequest,
  exportCollectionAsPostman,
  exportAllCollectionsAsPostman,
} from './collectionGroupLogic';
import { downloadFile } from '../../lib/downloads';

export function useCollectionsManager(currentRequest: ApiRequest) {
  const [collections, setCollections] = useState<ApiRequest[]>([]);
  const [runnerState, setRunnerState] = useState<{
    isOpen: boolean;
    name: string;
    requests: ApiRequest[];
  }>({ isOpen: false, name: '', requests: [] });

  const saveToCollection = useCallback(
    async (collectionName: string, requestName: string) => {
      const item: ApiRequest = {
        ...currentRequest,
        id: `coll_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: requestName,
        collectionName,
      };
      await saveCollectionItem(item);
      setCollections((prev) => [...prev, item]);
    },
    [currentRequest]
  );

  const deleteRequest = useCallback(async (id: string) => {
    await deleteCollectionItem(id);
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const deleteCollection = useCallback(async (collectionName: string) => {
    await deleteCollectionFolder(collectionName);
    setCollections((prev) =>
      prev.filter((c) => (c.collectionName || 'Default Collection') !== collectionName)
    );
  }, []);

  const renameCollection = useCallback(async (oldName: string, newName: string) => {
    await renameCollectionFolder(oldName, newName);
    setCollections((prev) =>
      prev.map((c) =>
        (c.collectionName || 'Default Collection') === oldName
          ? { ...c, collectionName: newName }
          : c
      )
    );
  }, []);

  const duplicateRequest = useCallback(async (req: ApiRequest) => {
    const copy = duplicateCollectionRequest(req);
    await saveCollectionItem(copy);
    setCollections((prev) => [...prev, copy]);
  }, []);

  const exportCollection = useCallback((name: string, reqs: ApiRequest[]) => {
    const json = exportCollectionAsPostman(name, reqs);
    downloadFile(json, {
      filename: `${name.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.postman_collection.json`,
      mimeType: 'application/json',
    });
  }, []);

  const exportAll = useCallback(() => {
    const json = exportAllCollectionsAsPostman(collections);
    downloadFile(json, {
      filename: 'toolnest_all_collections.postman_collection.json',
      mimeType: 'application/json',
    });
  }, [collections]);

  const importCollection = useCallback(async (reqs: ApiRequest[]) => {
    await saveCollectionItems(reqs);
    setCollections((prev) => [...prev, ...reqs]);
  }, []);

  const openRunner = useCallback((name: string, requests: ApiRequest[]) => {
    setRunnerState({ isOpen: true, name, requests });
  }, []);

  const closeRunner = useCallback(() => {
    setRunnerState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    collections,
    setCollections,
    runnerState,
    saveToCollection,
    deleteRequest,
    deleteCollection,
    renameCollection,
    duplicateRequest,
    exportCollection,
    exportAll,
    importCollection,
    openRunner,
    closeRunner,
  };
}
