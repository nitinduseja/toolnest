import React, { useState, useMemo } from 'react';
import { X, Trash2, Bookmark, Clock, ArrowRight, Search } from 'lucide-react';
import { HistoryItem, ApiRequest } from './types';
import { CollectionsList } from './CollectionsList';

export interface HistoryDrawerProps {
  isOpen: boolean;
  history: HistoryItem[];
  collections: ApiRequest[];
  currentRequest: ApiRequest;
  onClose: () => void;
  onSelectRequest: (req: ApiRequest) => void;
  onClearHistory: () => void;
  onSaveToCollection: (collectionName: string, requestName: string) => void;
  onDeleteFromCollection: (id: string) => void;
  onDeleteCollection: (collectionName: string) => void;
  onRenameCollection: (oldName: string, newName: string) => void;
  onDuplicateRequest: (req: ApiRequest) => void;
  onRunCollection: (collectionName: string, requests: ApiRequest[]) => void;
  onExportCollection: (collectionName: string, requests: ApiRequest[]) => void;
  onExportAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  history,
  collections,
  currentRequest,
  onClose,
  onSelectRequest,
  onClearHistory,
  onSaveToCollection,
  onDeleteFromCollection,
  onDeleteCollection,
  onRenameCollection,
  onDuplicateRequest,
  onRunCollection,
  onExportCollection,
  onExportAll,
}) => {
  const [tab, setTab] = useState<'history' | 'collections'>('history');
  const [historySearch, setHistorySearch] = useState<string>('');

  const filteredHistory = useMemo(() => {
    if (!historySearch.trim()) return history;
    const term = historySearch.toLowerCase();
    return history.filter(
      (h) =>
        h.request.url.toLowerCase().includes(term) ||
        h.request.method.toLowerCase().includes(term) ||
        (h.request.name && h.request.name.toLowerCase().includes(term))
    );
  }, [history, historySearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-surface-container-low border-l border-outline-variant flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                tab === 'history'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>History ({history.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('collections')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                tab === 'collections'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Collections ({collections.length})</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tab === 'history' && (
            <>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-outline absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Filter history..."
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-outline pb-1 border-b border-outline-variant/40">
                <span>RECENT REQUESTS</span>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className="flex items-center gap-1 text-red-500 hover:underline text-[11px] cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {filteredHistory.length === 0 ? (
                <p className="text-xs text-outline italic py-4 text-center">
                  {historySearch ? 'No matching history found.' : 'No history recorded yet.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectRequest(item.request);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant cursor-pointer transition-colors space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[11px] text-primary">
                          {item.request.method}
                        </span>
                        <span className="text-[10px] text-outline">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-on-surface truncate">
                        {item.request.url}
                      </p>
                      <div className="flex items-center justify-end text-[11px] text-primary group-hover:translate-x-0.5 transition-transform">
                        <span>Load request</span>
                        <ArrowRight className="w-3 h-3 ml-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'collections' && (
            <CollectionsList
              collections={collections}
              currentRequest={currentRequest}
              onSelectRequest={(req) => {
                onSelectRequest(req);
                onClose();
              }}
              onSaveToCollection={onSaveToCollection}
              onDeleteRequest={onDeleteFromCollection}
              onDeleteCollection={onDeleteCollection}
              onRenameCollection={onRenameCollection}
              onDuplicateRequest={onDuplicateRequest}
              onRunCollection={onRunCollection}
              onExportCollection={onExportCollection}
              onExportAll={onExportAll}
            />
          )}
        </div>
      </div>
    </div>
  );
};
