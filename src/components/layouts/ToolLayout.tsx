import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import { ToolDefinition } from '@/registry/types';
import { CATEGORY_MAP } from '@/registry/categories';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { ToolCard } from '@/components/molecules/ToolCard';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecentTool } = useRecentTools();
  const category = CATEGORY_MAP.get(tool.category);
  const favorite = isFavorite(tool.id);

  useEffect(() => {
    addRecentTool(tool.id);
  }, [tool.id, addRecentTool]);

  const relatedTools = ALL_TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-outline">
        <Link to="/" className="hover:text-on-surface transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {category && (
          <>
            <Link
              to={`/categories/${category.slug}`}
              className="hover:text-on-surface transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-on-surface font-medium truncate">{tool.name}</span>
      </nav>

      {/* Tool Header Box */}
      <header className="p-4 sm:p-6 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-on-surface">
              {tool.name}
            </h1>
            {tool.badge && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-surface-container-highest text-primary">
                {tool.badge}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl">{tool.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => toggleFavorite(tool.id)}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors shadow-xs"
          >
            <Star className={`w-3.5 h-3.5 ${favorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{favorite ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>
      </header>

      {/* Main Tool Content Pane */}
      <div className="w-full">{children}</div>

      {/* Related Category Tools */}
      {relatedTools.length > 0 && (
        <section className="pt-8 border-t border-outline-variant/60 space-y-4">
          <h2 className="text-sm font-semibold text-on-surface uppercase tracking-wider">
            Related Tools in {category?.name || 'Category'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <ToolCard key={relTool.id} tool={relTool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
