/**
 * Pure IndexedDB persistence layer for REST API history, saved collections, and environments.
 */
import { HistoryItem, ApiRequest, Environment } from './types';

const DB_NAME = 'toolnest_rest_api_db';
const DB_VERSION = 2;
const STORE_HISTORY = 'history';
const STORE_COLLECTIONS = 'collections';
const STORE_ENVIRONMENTS = 'environments';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_HISTORY)) {
        db.createObjectStore(STORE_HISTORY, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_COLLECTIONS)) {
        db.createObjectStore(STORE_COLLECTIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_ENVIRONMENTS)) {
        db.createObjectStore(STORE_ENVIRONMENTS, { keyPath: 'id' });
      }
    };
  });
}

export async function saveHistoryItem(item: HistoryItem): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HISTORY, 'readwrite');
    const store = tx.objectStore(STORE_HISTORY);
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getHistoryItems(): Promise<HistoryItem[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HISTORY, 'readonly');
    const store = tx.objectStore(STORE_HISTORY);
    const req = store.getAll();
    req.onsuccess = () => {
      const items = (req.result || []) as HistoryItem[];
      items.sort((a, b) => b.timestamp - a.timestamp);
      resolve(items.slice(0, 50));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function clearHistory(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HISTORY, 'readwrite');
    const store = tx.objectStore(STORE_HISTORY);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function saveCollectionItem(item: ApiRequest): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_COLLECTIONS, 'readwrite');
    const store = tx.objectStore(STORE_COLLECTIONS);
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getCollectionItems(): Promise<ApiRequest[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_COLLECTIONS, 'readonly');
    const store = tx.objectStore(STORE_COLLECTIONS);
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result || []) as ApiRequest[]);
    req.onerror = () => reject(req.error);
  });
}

export async function saveCollectionItems(items: ApiRequest[]): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_COLLECTIONS, 'readwrite');
    const store = tx.objectStore(STORE_COLLECTIONS);
    items.forEach((item) => store.put(item));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteCollectionItem(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_COLLECTIONS, 'readwrite');
    const store = tx.objectStore(STORE_COLLECTIONS);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteCollectionFolder(folderName: string): Promise<void> {
  const items = await getCollectionItems();
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_COLLECTIONS, 'readwrite');
    const store = tx.objectStore(STORE_COLLECTIONS);
    items
      .filter((i) => (i.collectionName || 'Default Collection') === folderName)
      .forEach((i) => store.delete(i.id));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function renameCollectionFolder(oldName: string, newName: string): Promise<void> {
  const items = await getCollectionItems();
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_COLLECTIONS, 'readwrite');
    const store = tx.objectStore(STORE_COLLECTIONS);
    items
      .filter((i) => (i.collectionName || 'Default Collection') === oldName)
      .forEach((i) => store.put({ ...i, collectionName: newName }));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveEnvironments(envs: Environment[]): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ENVIRONMENTS, 'readwrite');
    const store = tx.objectStore(STORE_ENVIRONMENTS);
    store.clear();
    envs.forEach((e) => store.put(e));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getEnvironments(): Promise<Environment[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ENVIRONMENTS, 'readonly');
    const store = tx.objectStore(STORE_ENVIRONMENTS);
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result || []) as Environment[]);
    req.onerror = () => reject(req.error);
  });
}
