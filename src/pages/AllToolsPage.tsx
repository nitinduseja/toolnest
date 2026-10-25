import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { CATEGORIES } from '@/registry/categories';
import { ToolCard } from '@/components/molecules/ToolCard';

export const AllToolsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

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
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [query, selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">All Tools</h1>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Complete catalog of {ALL_TOOLS.length} privacy-first browser developer utilities.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search tools by name, tag, or function..."
            autoComplete="off"
            enterKeyHint="search"
            className="w-full h-10 pl-10 pr-9 rounded-xl bg-surface-container-low border border-outline-variant text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange('')}
              aria-label="Clear search query"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-container text-on-primary-container font-semibold'
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
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-outline pt-2">
        <span>
          Showing {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tool Grid or Empty State */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest/50 space-y-3">
          <SlidersHorizontal className="w-8 h-8 text-outline mx-auto" />
          <h3 className="font-semibold text-sm text-on-surface">No matching tools found</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Try adjusting your search terms or clearing your category filters.
          </p>
          <button
            type="button"
            onClick={() => {
              handleQueryChange('');
              handleCategoryChange('all');
            }}
            className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
