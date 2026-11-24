import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Layers, Plus, Trash2, ArrowUpRight, Sparkles } from 'lucide-react';
import {
  WorkspaceSession,
  CURATED_WORKSPACES,
  getCustomWorkspaces,
  saveCustomWorkspace,
  deleteCustomWorkspace,
  buildWorkspacePath,
} from './workspaceLogic';
import { TOOL_SLUG_MAP } from '@/registry/tool-registry';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentToolSlug?: string;
  currentSecondarySlug?: string;
  isSplit?: boolean;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  currentToolSlug,
  currentSecondarySlug,
  isSplit = false,
}) => {
  const navigate = useNavigate();
  const [customList, setCustomList] = useState<WorkspaceSession[]>(getCustomWorkspaces);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  if (!isOpen) return null;

  const handleLaunch = (workspace: WorkspaceSession) => {
    const path = buildWorkspacePath(workspace);
    navigate(path);
    onClose();
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentToolSlug || !newName.trim()) return;

    const saved = saveCustomWorkspace({
      name: newName,
      description: newDesc,
      primaryToolSlug: currentToolSlug,
      secondaryToolSlug: isSplit ? currentSecondarySlug : undefined,
      isSplit,
    });

    setCustomList([saved, ...customList]);
    setIsCreating(false);
    setNewName('');
    setNewDesc('');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomWorkspace(id);
    setCustomList((prev) => prev.filter((w) => w.id !== id));
  };

  const getToolName = (slug?: string) => (slug ? TOOL_SLUG_MAP.get(slug)?.name || slug : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Multi-Tool Workspaces</h2>
              <p className="text-[11px] text-outline">
                Curated dual-pane suites and saved customized developer workflows.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {/* Save Current Session Form */}
          {currentToolSlug && (
            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60">
              {!isCreating ? (
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-semibold text-on-surface">Current Active Layout: </span>
                    <span className="text-primary font-mono">{getToolName(currentToolSlug)}</span>
                    {isSplit && currentSecondarySlug && (
                      <span className="text-outline">
                        {' '}
                        +{' '}
                        <span className="text-primary font-mono">
                          {getToolName(currentSecondarySlug)}
                        </span>{' '}
                        (Split View)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(true);
                      setNewName(
                        `${getToolName(currentToolSlug)}${isSplit ? ` & ${getToolName(currentSecondarySlug)}` : ''} Workspace`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold shadow-xs hover:opacity-95 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Layout</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveCurrent} className="space-y-3">
                  <div className="text-xs font-semibold text-on-surface">
                    Save Current Session as Preset
                  </div>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Workspace Name (e.g. My API Testing Suite)"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Brief description (optional)"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-2.5 py-1 rounded-lg text-xs text-outline hover:text-on-surface"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold shadow-xs hover:opacity-95"
                    >
                      Save Workspace
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* User Custom Workspaces */}
          {customList.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-outline px-1">
                Your Saved Workspaces ({customList.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {customList.map((ws) => (
                  <div
                    key={ws.id}
                    onClick={() => handleLaunch(ws)}
                    className="group p-3 rounded-xl bg-surface-container border border-outline-variant/60 hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors">
                          {ws.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(ws.id, e)}
                          title="Delete workspace"
                          className="p-1 rounded text-outline hover:text-red-500 hover:bg-surface-container-high transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-outline line-clamp-1">{ws.description}</p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[10px] text-outline font-mono">
                      <span>
                        {getToolName(ws.primaryToolSlug)} + {getToolName(ws.secondaryToolSlug)}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curated Presets */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-outline px-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Curated Presets ({CURATED_WORKSPACES.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CURATED_WORKSPACES.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => handleLaunch(ws)}
                  className="group p-3 rounded-xl bg-surface hover:bg-surface-container border border-outline-variant/60 hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors">
                        {ws.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-primary/10 text-primary">
                        PRESET
                      </span>
                    </div>
                    <p className="text-[11px] text-outline line-clamp-2 leading-relaxed">
                      {ws.description}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[10px] text-outline font-mono">
                    <span>
                      {getToolName(ws.primaryToolSlug)} + {getToolName(ws.secondaryToolSlug)}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
