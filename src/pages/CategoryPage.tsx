import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ChevronLeft, X } from 'lucide-react';
import { CATEGORIES } from '@/registry/categories';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { ToolCard } from '@/components/molecules/ToolCard';
import { Icon } from '@/components/atoms/Icon';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [query, setQuery] = useState('');

  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  const categoryTools = useMemo(() => {
    if (!category) return [];
    return ALL_TOOLS.filter((t) => t.category === category.id);
  }, [category]);

  const filteredTools = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return categoryTools;
    return categoryTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [categoryTools, query]);

  if (!category) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-on-surface">Category Not Found</h1>
        <p className="text-xs text-on-surface-variant">
          The category you are looking for does not exist in the registry.
        </p>
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
            <Icon name={category.iconName} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-on-surface">{category.name}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-container text-on-surface-variant">
                {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              {category.description}
            </p>
          </div>
        </div>

        {/* Category-specific Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${category.name}...`}
            autoComplete="off"
            enterKeyHint="search"
            className="w-full h-10 pl-10 pr-9 rounded-xl bg-surface border border-outline-variant text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search input"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filtered Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center rounded-xl border border-dashed border-outline-variant text-outline text-xs">
          No tools in &ldquo;{category.name}&rdquo; matched &ldquo;{query}&rdquo;.
        </div>
      )}
    </div>
  );
};
