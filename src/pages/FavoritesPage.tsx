import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { ToolCard } from '@/components/molecules/ToolCard';
import { useFavorites } from '@/features/favorites/useFavorites';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const favoriteTools = ALL_TOOLS.filter((t) => favorites.includes(t.id));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Starred Favorites</h1>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Quickly access your most frequently used utilities. Stored safely in your local browser.
        </p>
      </div>

      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
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
