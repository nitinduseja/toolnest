import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Columns2 } from 'lucide-react';
import { ToolDefinition } from '@/registry/types';
import { CATEGORY_MAP } from '@/registry/categories';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { ToolCard } from '@/components/molecules/ToolCard';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';
import { SecondaryToolPane } from '@/features/split-view/SecondaryToolPane';
import {
  getStoredSecondarySlug,
  saveStoredSecondarySlug,
} from '@/features/split-view/splitViewLogic';

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecentTool } = useRecentTools();
  const [isSplit, setIsSplit] = useState<boolean>(false);
  const [secondarySlug, setSecondarySlug] = useState<string>(getStoredSecondarySlug);

  const category = CATEGORY_MAP.get(tool.category);
  const favorite = isFavorite(tool.id);

  useEffect(() => {
    addRecentTool(tool.id);
  }, [tool.id, addRecentTool]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSplit((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const relatedTools = ALL_TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 3);

  return (
    <div
      className={`w-full mx-auto px-4 lg:px-8 py-6 space-y-6 ${isSplit ? 'max-w-[1700px]' : 'max-w-7xl'}`}
    >
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
            onClick={() => setIsSplit((prev) => !prev)}
            title="Toggle Dual Tool Split View (Alt+S)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer shadow-xs ${
              isSplit
                ? 'bg-primary text-on-primary border-primary font-semibold'
                : 'bg-surface-container hover:bg-surface-container-high border-outline-variant text-on-surface'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>{isSplit ? 'Close Split' : 'Split View'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(tool.id)}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-xs font-medium text-on-surface transition-colors shadow-xs cursor-pointer"
          >
            <Star className={`w-3.5 h-3.5 ${favorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{favorite ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>
      </header>

      {/* Main Tool Content Pane or Split View */}
      <div className={isSplit ? 'grid grid-cols-1 xl:grid-cols-2 gap-6 items-start' : 'w-full'}>
        <div className="min-w-0 flex-1">{children}</div>
        {isSplit && (
          <SecondaryToolPane
            currentToolId={tool.id}
            selectedSlug={secondarySlug}
            onSelectSlug={(slug) => {
              setSecondarySlug(slug);
              saveStoredSecondarySlug(slug);
            }}
            onClose={() => setIsSplit(false)}
          />
        )}
      </div>

      {/* Related Category Tools */}
      {!isSplit && relatedTools.length > 0 && (
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
