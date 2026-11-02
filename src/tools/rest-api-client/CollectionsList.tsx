import React, { useState, useMemo } from 'react';
import {
  BookmarkPlus,
  Play,
  Download,
  Trash2,
  Edit2,
  Copy,
  ChevronDown,
  ChevronRight,
  Search,
  Folder,
} from 'lucide-react';
import { ApiRequest } from './types';
import { groupRequestsByCollection } from './collectionGroupLogic';

export interface CollectionsListProps {
  collections: ApiRequest[];
  currentRequest: ApiRequest;
  onSelectRequest: (req: ApiRequest) => void;
  onSaveToCollection: (collectionName: string, requestName: string) => void;
  onDeleteRequest: (id: string) => void;
  onDeleteCollection: (collectionName: string) => void;
  onRenameCollection: (oldName: string, newName: string) => void;
  onDuplicateRequest: (req: ApiRequest) => void;
  onRunCollection: (collectionName: string, requests: ApiRequest[]) => void;
  onExportCollection: (collectionName: string, requests: ApiRequest[]) => void;
  onExportAll: () => void;
}

export const CollectionsList: React.FC<CollectionsListProps> = ({
  collections,
  currentRequest,
  onSelectRequest,
  onSaveToCollection,
  onDeleteRequest,
  onDeleteCollection,
  onRenameCollection,
  onDuplicateRequest,
  onRunCollection,
  onExportCollection,
  onExportAll,
}) => {
  const [search, setSearch] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('Default Collection');
  const [requestName, setRequestName] = useState<string>('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => groupRequestsByCollection(collections), [collections]);

  const existingCollectionNames = useMemo(
    () => Array.from(new Set(groups.map((g) => g.name))),
    [groups]
  );

  const toggleFolder = (name: string) => {
    setExpandedFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = () => {
    if (!requestName.trim() || !currentRequest.url.trim()) return;
    onSaveToCollection(collectionName.trim() || 'Default Collection', requestName.trim());
    setRequestName('');
  };

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const term = search.toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        requests: g.requests.filter(
          (r) =>
            r.name?.toLowerCase().includes(term) ||
            r.url.toLowerCase().includes(term) ||
            r.method.toLowerCase().includes(term) ||
            g.name.toLowerCase().includes(term)
        ),
      }))
      .filter((g) => g.requests.length > 0);
  }, [groups, search]);

  return (
    <div className="space-y-4">
      {/* Save current request */}
      <div className="p-3 rounded-xl bg-surface-container border border-outline-variant space-y-2">
        <span className="text-xs font-semibold text-outline">Save Current Request</span>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              list="existing-collections"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Collection / Folder name"
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-hidden"
            />
            <datalist id="existing-collections">
              {existingCollectionNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Request name (e.g. Get User Profile)"
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={!requestName.trim() || !currentRequest.url.trim()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold disabled:opacity-40"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Export All */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-outline absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections & endpoints..."
            className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-hidden"
          />
        </div>
        {collections.length > 0 && (
          <button
            type="button"
            onClick={onExportAll}
            title="Export all collections as Postman JSON"
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface text-xs flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>All</span>
          </button>
        )}
      </div>

      {/* Groups List */}
      {filteredGroups.length === 0 ? (
        <p className="text-xs text-outline italic py-4 text-center">
          {search ? 'No matching requests found.' : 'No saved collections yet.'}
        </p>
      ) : (
        <div className="space-y-3">
          {filteredGroups.map((group) => {
            const isExpanded = expandedFolders[group.name] !== false; // default open
            return (
              <div
                key={group.name}
                className="rounded-xl bg-surface-container border border-outline-variant overflow-hidden"
              >
                {/* Folder Header */}
                <div className="p-2.5 bg-surface-container-high flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFolder(group.name)}
                    className="flex items-center gap-2 flex-1 min-w-0 text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-outline shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-outline shrink-0" />
                    )}
                    <Folder className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-on-surface truncate">
                      {group.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-lowest text-outline font-mono">
                      {group.requests.length}
                    </span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onRunCollection(group.name, group.requests)}
                      title="Run Collection (Automated sequence)"
                      className="p-1 rounded hover:bg-surface-container text-primary"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onExportCollection(group.name, group.requests)}
                      title="Export collection as Postman v2.1 JSON"
                      className="p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newName = prompt('Enter new collection name:', group.name);
                        if (newName && newName.trim() && newName.trim() !== group.name) {
                          onRenameCollection(group.name, newName.trim());
                        }
                      }}
                      title="Rename collection"
                      className="p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete collection "${group.name}" and all its requests?`)) {
                          onDeleteCollection(group.name);
                        }
                      }}
                      title="Delete collection"
                      className="p-1 rounded hover:bg-surface-container text-outline hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Folder Requests */}
                {isExpanded && (
                  <div className="p-2 space-y-1.5">
                    {group.requests.map((req) => (
                      <div
                        key={req.id}
                        className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-between gap-2 transition-colors"
                      >
                        <div
                          onClick={() => onSelectRequest(req)}
                          className="flex-1 min-w-0 cursor-pointer space-y-0.5"
                        >
                          <span className="text-xs font-medium text-on-surface truncate block">
                            {req.name || 'Untitled'}
                          </span>
                          <p className="text-[11px] font-mono text-outline truncate">
                            <span className="text-primary font-bold mr-1">{req.method}</span>
                            {req.url}
                          </p>
                        </div>

                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => onDuplicateRequest(req)}
                            title="Duplicate request"
                            className="p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRequest(req.id)}
                            title="Delete request"
                            className="p-1 rounded hover:bg-surface-container text-outline hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
