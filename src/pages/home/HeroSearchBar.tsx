import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { CATEGORIES } from '@/registry/categories';
import { Icon } from '@/components/atoms/Icon';

interface HeroSearchBarProps {
  onOpenCommandPalette: (initialQuery?: string) => void;
}

const QUICK_PICKS = [
  { name: 'JSON Formatter', slug: 'json-formatter' },
  { name: 'Regex Tester', slug: 'regex-tester' },
  { name: 'REST Client', slug: 'rest-api-client' },
  { name: 'cURL Converter', slug: 'curl-converter' },
  { name: 'UUID Generator', slug: 'uuid-generator' },
  { name: 'Subnet Calc', slug: 'subnet-calculator' },
];

export const HeroSearchBar: React.FC<HeroSearchBarProps> = ({ onOpenCommandPalette }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter matching tools
  const matchingTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_TOOLS.filter((t) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }).slice(0, 6);
  }, [query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Click outside to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (matchingTools.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % matchingTools.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (matchingTools.length > 0) {
        setSelectedIndex((prev) => (prev <= 0 ? matchingTools.length - 1 : prev - 1));
      }
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < matchingTools.length) {
        e.preventDefault();
        setIsFocused(false);
        navigate(`/tools/${matchingTools[selectedIndex].slug}`);
      } else if (query.trim()) {
        e.preventDefault();
        setIsFocused(false);
        navigate(`/tools?q=${encodeURIComponent(query.trim())}`);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    if (query.trim()) {
      navigate(`/tools?q=${encodeURIComponent(query.trim())}`);
    } else {
      onOpenCommandPalette('');
    }
  };

  const isDropdownOpen = isFocused && query.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative max-w-2xl mx-auto w-full space-y-3 transition-all ${
        isDropdownOpen ? 'z-50' : 'z-20'
      }`}
    >
      <div className="relative z-30">
        {/* Search Input Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center rounded-2xl glass-card bg-surface dark:bg-surface-container-lowest backdrop-blur-xl border border-outline-variant/80 hover:border-primary/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 shadow-xl shadow-black/5 dark:shadow-black/40 transition-all duration-200"
        >
          <Search className="w-5 h-5 text-outline group-focus-within:text-primary transition-colors shrink-0 ml-4 pointer-events-none" />

          {/* Text Input - explicitly type="text" to prevent browser rendering its own native cancel X */}
          <input
            ref={inputRef}
            type="text"
            inputMode="search"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search 36+ tools, categories, or press ⌘K..."
            aria-label="Search developer tools"
            autoComplete="off"
            enterKeyHint="search"
            className="w-full h-14 pl-3 pr-3 bg-transparent text-sm sm:text-base text-on-surface placeholder:text-outline/70 focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />

          {/* Single Dedicated Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors mr-1"
              aria-label="Clear search input"
              title="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Command Palette Hotkey Badge */}
          <button
            type="button"
            onClick={() => onOpenCommandPalette(query)}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-surface-container border border-outline-variant text-outline hover:text-on-surface hover:border-primary/40 transition-all mr-2"
            title="Open Command Palette (⌘K)"
          >
            <span>⌘K</span>
          </button>

          {/* Primary Search Submit Button */}
          <button
            type="submit"
            className="mr-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-primary/25 hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        {/* Live Dropdown Search Results - Positioned directly below form with elevated z-index & solid background */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-surface dark:bg-surface-container-lowest border border-outline-variant/80 shadow-[0_25px_60px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.65)] p-2 space-y-1 max-h-[360px] sm:max-h-[420px] overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-top-2 duration-150 text-left">
            {matchingTools.length > 0 ? (
              <>
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-outline flex items-center justify-between border-b border-outline-variant/40 pb-1.5">
                  <span>Matching Tools</span>
                  <span>{matchingTools.length} found</span>
                </div>
                <div className="space-y-1 pt-1">
                  {matchingTools.map((tool, idx) => {
                    const isSelected = idx === selectedIndex;
                    const catDef = CATEGORIES.find((c) => c.id === tool.category);
                    const categoryTitle = catDef ? catDef.name : tool.category;

                    return (
                      <Link
                        key={tool.id}
                        to={`/tools/${tool.slug}`}
                        onClick={() => setIsFocused(false)}
                        className={`group flex items-start sm:items-center justify-between p-3 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                            : 'text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors ${
                              isSelected
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-surface-container-high text-primary'
                            }`}
                          >
                            <Icon name={tool.iconName} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-semibold text-on-surface leading-snug">
                                {tool.name}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant/40 text-on-surface-variant uppercase tracking-wider font-medium">
                                {categoryTitle}
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-on-surface-variant opacity-85 leading-relaxed line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-4 self-center text-outline group-hover:text-primary transition-colors">
                          <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Launch
                          </span>
                          <CornerDownLeft className="w-3.5 h-3.5 opacity-70" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="pt-2.5 px-3 pb-1 border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-outline">
                  <span>↵ Open selected • ↑↓ Navigate • Esc to close</span>
                  <button
                    type="button"
                    onClick={() => onOpenCommandPalette(query)}
                    className="text-primary hover:underline font-medium text-left sm:text-right"
                  >
                    Open in Command Palette →
                  </button>
                </div>
              </>
            ) : (
              <div className="py-6 px-4 text-center space-y-2">
                <p className="text-xs text-on-surface font-medium">
                  No direct tools match &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Press <kbd className="font-mono bg-surface-container px-1 rounded">Enter</kbd> to
                  search across tags and descriptions in the catalog.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Launch Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs relative z-10">
        <span className="text-[11px] font-mono text-outline uppercase tracking-wider">Quick:</span>
        {QUICK_PICKS.map((pick) => (
          <Link
            key={pick.slug}
            to={`/tools/${pick.slug}`}
            className="px-2.5 py-1 rounded-lg glass-card hover:border-primary/50 text-[11px] font-medium text-on-surface-variant hover:text-on-surface hover:-translate-y-0.5 transition-all shadow-2xs"
          >
            {pick.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
