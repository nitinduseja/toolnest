import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Star, Layers, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { useFavorites } from '@/features/favorites/useFavorites';

interface TabletFloatingNavProps {
  onOpenCommandPalette: () => void;
  onOpenCategories: () => void;
  onOpenShortcuts: () => void;
}

export const TabletFloatingNav: React.FC<TabletFloatingNavProps> = ({
  onOpenCommandPalette,
  onOpenCategories,
}) => {
  const location = useLocation();
  const { favorites } = useFavorites();
  const favoriteCount = favorites.length;

  const isToolsActive = location.pathname.startsWith('/tools');
  const isFavoritesActive = location.pathname === '/favorites';

  return (
    <header className="fixed top-3 left-4 right-4 max-w-2xl mx-auto z-40 hidden md:flex lg:hidden">
      <nav
        aria-label="Tablet primary navigation"
        className="w-full glass-dock rounded-2xl px-4 py-2 shadow-xl shadow-black/5 dark:shadow-black/40 flex items-center justify-between transition-all"
      >
        <Link to="/" className="flex items-center gap-2 group focus:outline-none">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-xs tracking-tight text-on-surface">TOOLNEST</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs">
          <Link
            to="/tools"
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              isToolsActive
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Explore
          </Link>

          <button
            type="button"
            onClick={onOpenCategories}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>

          <Link
            to="/favorites"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-medium transition-colors ${
              isFavoritesActive
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            {favoriteCount > 0 && <span>({favoriteCount})</span>}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface-variant"
            title="Search (⌘K)"
            aria-label="Search tools"
          >
            <Search className="w-4 h-4" />
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
