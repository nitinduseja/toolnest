import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { TOOL_MAP } from '@/registry/tool-registry';
import { ToolDefinition } from '@/registry/types';
import { useFavorites } from '@/features/favorites/useFavorites';
import { DraggableFavoriteGrid } from '@/features/favorites/DraggableFavoriteGrid';

export const FavoritesPage: React.FC = () => {
  const { favorites, reorderFavorites, moveFavorite } = useFavorites();

  const favoriteTools = useMemo(
    () =>
      favorites
        .map((id) => TOOL_MAP.get(id))
        .filter((tool): tool is ToolDefinition => Boolean(tool)),
    [favorites]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Starred Favorites</h1>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Drag cards or use arrows to reorder your pinned utilities. Stored safely in your local
          browser.
        </p>
      </div>

      {favoriteTools.length > 0 ? (
        <DraggableFavoriteGrid
          tools={favoriteTools}
          onReorder={reorderFavorites}
          onMoveStep={moveFavorite}
        />
      ) : (
        <div className="py-20 text-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest/50 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-sm text-on-surface">No favorites starred yet</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Click the star icon on any tool card or tool page to pin it here for instant access.
          </p>
          <div className="pt-2">
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-opacity"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
