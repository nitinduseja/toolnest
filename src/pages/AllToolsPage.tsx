import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { CATEGORIES } from '@/registry/categories';
import { ToolCard } from '@/components/molecules/ToolCard';

export const AllToolsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [featureFilter, setFeatureFilter] = useState<'all' | 'offline' | 'new'>('all');

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val) {
      searchParams.set('q', val);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId !== 'all') {
      searchParams.set('category', catId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filteredTools = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_TOOLS.filter((tool) => {
      const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesFeature =
        featureFilter === 'all' ||
        (featureFilter === 'offline' && tool.isOfflineReady) ||
        (featureFilter === 'new' && tool.isNew);
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchesCat && matchesFeature && matchesQuery;
    });
  }, [query, selectedCategory, featureFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Explore Tools</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Complete catalog of {ALL_TOOLS.length} privacy-first browser developer utilities.
          </p>
        </div>

        {/* Active Query Filter Pill if navigated with a search query */}
        {query && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-medium self-start sm:self-auto shadow-2xs">
            <span>Query: &ldquo;{query}&rdquo;</span>
            <button
              type="button"
              onClick={() => handleQueryChange('')}
              className="p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Clear query filter"
              title="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Quick Feature Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFeatureFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            featureFilter === 'all'
              ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
              : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          All Tools ({ALL_TOOLS.length})
        </button>
        <button
          type="button"
          onClick={() => setFeatureFilter('offline')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            featureFilter === 'offline'
              ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
              : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          ⚡ Offline Ready ({ALL_TOOLS.filter((t) => t.isOfflineReady).length})
        </button>
        <button
          type="button"
          onClick={() => setFeatureFilter('new')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            featureFilter === 'new'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30'
              : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          ✨ New in v2.8 ({ALL_TOOLS.filter((t) => t.isNew).length})
        </button>
      </div>

      {/* Category Filter Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none scrollbar-none">
        <button
          type="button"
          onClick={() => handleCategoryChange('all')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary text-on-primary font-semibold shadow-xs'
              : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          All Categories ({ALL_TOOLS.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = ALL_TOOLS.filter((t) => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-outline">
        <span>
          Showing {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
        </span>
        {(query || selectedCategory !== 'all' || featureFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              handleQueryChange('');
              handleCategoryChange('all');
              setFeatureFilter('all');
            }}
            className="text-primary hover:underline font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Tool Grid or Empty State */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest/50 space-y-3">
          <SlidersHorizontal className="w-8 h-8 text-outline mx-auto" />
          <h3 className="font-semibold text-sm text-on-surface">No matching tools found</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Try selecting a different category or clearing your active search filter.
          </p>
          <button
            type="button"
            onClick={() => {
              handleQueryChange('');
              handleCategoryChange('all');
            }}
            className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:opacity-95 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
