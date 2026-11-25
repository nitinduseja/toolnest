import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { TOOL_MAP } from '@/registry/tool-registry';
import { ToolDefinition } from '@/registry/types';
import { useFavorites } from '@/features/favorites/useFavorites';
import { DraggableFavoriteGrid } from '@/features/favorites/DraggableFavoriteGrid';

export const PinnedFavoritesSection: React.FC = () => {
  const { favorites, reorderFavorites, moveFavorite } = useFavorites();

  const pinnedTools = useMemo(
    () =>
      favorites
        .map((id) => TOOL_MAP.get(id))
        .filter((tool): tool is ToolDefinition => Boolean(tool)),
    [favorites]
  );

  if (pinnedTools.length === 0) return null;

  return (
    <section className="space-y-5 relative z-10" aria-label="Pinned Favorites">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Pinned Quick Access</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
            Your Favorite Utilities
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Drag and drop cards or click arrows to customize your dashboard order.
          </p>
        </div>

        <Link
          to="/favorites"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs font-semibold text-on-surface hover:border-primary/50 transition-colors self-start sm:self-auto"
        >
          <span>Manage Favorites ({pinnedTools.length})</span>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
        </Link>
      </div>

      <DraggableFavoriteGrid
        tools={pinnedTools}
        onReorder={reorderFavorites}
        onMoveStep={moveFavorite}
        columnsClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      />
    </section>
  );
};
