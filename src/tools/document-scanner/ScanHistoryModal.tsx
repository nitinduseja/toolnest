import React, { useState, useEffect } from 'react';
import { History, X, Trash2, FolderOpen, Calendar, Layers } from 'lucide-react';
import { SavedScanDocument, listDocuments, deleteDocument } from './scannerDb';

export interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (doc: SavedScanDocument) => void;
}

export const ScanHistoryModal: React.FC<ScanHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectDocument,
}) => {
  const [docs, setDocs] = useState<SavedScanDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadList = async () => {
    setLoading(true);
    try {
      const list = await listDocuments();
      setDocs(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadList();
    }
  }, [isOpen]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteDocument(id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-on-surface">Local Scan History</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-outline">Loading saved scans...</div>
          ) : docs.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-surface-container-lowest border border-dashed border-outline-variant space-y-2">
              <FolderOpen className="w-8 h-8 text-outline mx-auto" />
              <p className="text-xs font-semibold text-on-surface">No saved scan documents found</p>
              <p className="text-[11px] text-outline">
                Scanned documents are automatically saved to your browser&apos;s local IndexedDB.
              </p>
            </div>
          ) : (
            docs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  onSelectDocument(doc);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {doc.pages[0]?.processedDataUrl ? (
                    <img
                      src={doc.pages[0].processedDataUrl}
                      alt="Thumbnail"
                      className="w-12 h-16 object-cover rounded border border-outline-variant/60 shrink-0 bg-white"
                    />
                  ) : (
                    <div className="w-12 h-16 rounded bg-surface-container flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5 text-outline" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                      {doc.title || 'Untitled Document'}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-outline mt-1">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-primary" />
                        {doc.pages.length} {doc.pages.length === 1 ? 'page' : 'pages'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDelete(doc.id, e)}
                  title="Delete from history"
                  className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
