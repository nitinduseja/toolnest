import React from 'react';
import { X, Columns2 } from 'lucide-react';
import { ToolDefinition } from '@/registry/types';
import { TOOL_SLUG_MAP } from '@/registry/tool-registry';
import { getAvailableSecondaryTools } from './splitViewLogic';

export interface SecondaryToolPaneProps {
  currentToolId: string;
  selectedSlug: string;
  onSelectSlug: (slug: string) => void;
  onClose: () => void;
}

export const SecondaryToolPane: React.FC<SecondaryToolPaneProps> = ({
  currentToolId,
  selectedSlug,
  onSelectSlug,
  onClose,
}) => {
  const availableTools = getAvailableSecondaryTools(currentToolId);
  const secondaryTool = TOOL_SLUG_MAP.get(selectedSlug) || availableTools[0];
  const Component = secondaryTool ? secondaryTool.component : null;

  return (
    <div className="flex-1 min-w-0 flex flex-col rounded-2xl bg-surface-container-lowest border border-outline-variant overflow-hidden shadow-sm">
      {/* Pane Top Bar */}
      <div className="p-3 bg-surface-container border-b border-outline-variant flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Columns2 className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-outline shrink-0">SPLIT PANE:</span>
          <select
            value={secondaryTool ? secondaryTool.slug : ''}
            onChange={(e) => onSelectSlug(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant text-xs font-medium text-on-surface truncate cursor-pointer"
          >
            {availableTools.map((t: ToolDefinition) => (
              <option key={t.id} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onClose}
          title="Close split pane"
          className="p-1 rounded-lg hover:bg-surface-container-high text-outline hover:text-on-surface cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Pane Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {Component ? (
          <React.Suspense
            fallback={
              <div className="p-12 text-center text-xs text-outline">Loading secondary tool...</div>
            }
          >
            <Component />
          </React.Suspense>
        ) : (
          <div className="p-12 text-center text-xs text-outline">No secondary tool selected.</div>
        )}
      </div>
    </div>
  );
};
