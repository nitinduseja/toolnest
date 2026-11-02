/**
 * Pure IndexedDB persistence layer for local Document Scanner history and multi-page drafts.
 * Zero cloud dependency: All scanned documents stay completely on the user's local device.
 */

export interface StampOverlay {
  dataUrl: string;
  xPercent: number; // 0 to 100 percentage from left
  yPercent: number; // 0 to 100 percentage from top
  scale: number; // default 1.0
}

export interface ScannedPageItem {
  id: string;
  originalDataUrl: string;
  rawCaptureUrl?: string;
  processedDataUrl: string;
  rotation: number;
  filter: 'original' | 'magic' | 'bw' | 'grayscale' | 'adaptive';
  brightness: number;
  contrast: number;
  ocrText?: string;
  ocrWords?: { text: string; x0: number; y0: number; x1: number; y1: number }[];
  signatureDataUrl?: string;
  signatureStamp?: StampOverlay;
}

export interface SavedScanDocument {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  pages: ScannedPageItem[];
}

const DB_NAME = 'toolnest_document_scanner_db';
const DB_VERSION = 1;
const STORE_NAME = 'scanned_documents';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function saveDocument(doc: SavedScanDocument): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(doc);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getDocument(id: string): Promise<SavedScanDocument | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function listDocuments(): Promise<SavedScanDocument[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const items = (req.result as SavedScanDocument[]) || [];
      items.sort((a, b) => b.updatedAt - a.updatedAt);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
