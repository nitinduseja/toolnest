import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Search, Layers, MoreHorizontal, Star, Clock } from 'lucide-react';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';

interface MobileFloatingNavProps {
  onOpenCommandPalette: () => void;
  onOpenCategories: () => void;
}

export const MobileFloatingNav: React.FC<MobileFloatingNavProps> = ({
  onOpenCommandPalette,
  onOpenCategories,
}) => {
  const location = useLocation();
  const { favorites } = useFavorites();
  const { recentToolIds } = useRecentTools();
  const [moreOpen, setMoreOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const favoriteCount = favorites.length;
  const recentCount = recentToolIds.length;

  const isHome = location.pathname === '/';
  const isExplore = location.pathname === '/tools';
  const isFavorites = location.pathname === '/favorites';
  const isRecent = location.pathname === '/recent';
  const isMoreActive = isFavorites || isRecent || moreOpen;

  // Click outside and escape handler to dismiss More popover
  useEffect(() => {
    if (!moreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  return (
    <nav
      aria-label="Mobile bottom navigation dock"
      className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto z-40 md:hidden glass-dock rounded-2xl p-1.5 shadow-2xl shadow-black/15 flex items-center justify-around"
    >
      {/* 1. Home Link */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-medium transition-colors ${
          isHome ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </Link>

      {/* 2. Explore Catalog Link */}
      <Link
        to="/tools"
        className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-medium transition-colors ${
          isExplore ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span>Explore</span>
      </Link>

      {/* 3. Elevated Floating Center Search Button */}
      <div className="relative -mt-5 flex items-center justify-center">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white shadow-xl shadow-primary/35 ring-4 ring-surface dark:ring-surface flex items-center justify-center hover:scale-105 active:scale-95 transition-all -translate-y-1"
          aria-label="Search tools with command palette"
          title="Search tools (⌘K)"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* 4. Categories Quick Sheet Trigger */}
      <button
        type="button"
        onClick={onOpenCategories}
        className="flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <Layers className="w-5 h-5 mb-0.5" />
        <span>Categories</span>
      </button>

      {/* 5. More (Three-Dot) Popover Menu */}
      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setMoreOpen(!moreOpen)}
          aria-expanded={moreOpen}
          aria-label="More navigation options"
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            isMoreActive
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>More</span>
          {favoriteCount > 0 && (
            <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        {/* More Popover Menu */}
        {moreOpen && (
          <div className="absolute bottom-full right-0 mb-3 w-48 rounded-2xl bg-surface dark:bg-surface-container-lowest border border-outline-variant/80 shadow-2xl shadow-black/25 p-1.5 space-y-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 select-none">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-outline border-b border-outline-variant/40 flex items-center justify-between">
              <span>Quick Library</span>
            </div>

            <Link
              to="/favorites"
              onClick={() => setMoreOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isFavorites
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star
                  className={`w-4 h-4 ${
                    favoriteCount > 0 ? 'text-amber-500 fill-amber-400' : 'text-outline'
                  }`}
                />
                <span>Favorites</span>
              </div>
              {favoriteCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-[10px] font-mono font-bold text-on-surface-variant">
                  {favoriteCount}
                </span>
              )}
            </Link>

            <Link
              to="/recent"
              onClick={() => setMoreOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isRecent
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-outline" />
                <span>Recent Tools</span>
              </div>
              {recentCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-[10px] font-mono font-bold text-on-surface-variant">
                  {recentCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
