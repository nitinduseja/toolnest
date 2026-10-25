import React from 'react';
import { Link } from 'react-router-dom';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { ToolCard } from '@/components/molecules/ToolCard';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';

export const RecentPage: React.FC = () => {
  const { recentToolIds, removeRecentTool, clearRecentTools } = useRecentTools();

  // Preserves recent order
  const recentTools = recentToolIds
    .map((id) => ALL_TOOLS.find((t) => t.id === id))
    .filter((t): t is (typeof ALL_TOOLS)[0] => Boolean(t));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">Recent History</h1>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Recently opened tools during your sessions. Stored strictly in local browser memory.
          </p>
        </div>

        {recentTools.length > 0 && (
          <button
            type="button"
            onClick={clearRecentTools}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-high text-xs text-on-surface-variant hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {recentTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recentTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onRemove={() => removeRecentTool(tool.id)}
              removeLabel={`Remove ${tool.name} from history`}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest/50 space-y-3">
          <div className="w-12 h-12 rounded-full bg-surface-container-high text-outline flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-sm text-on-surface">No recent tools visited</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Your recently used tools will automatically appear here as you navigate the toolbox.
          </p>
          <div className="pt-2">
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-opacity"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
