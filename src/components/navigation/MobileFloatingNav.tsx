import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Search, Star, Layers } from 'lucide-react';
import { useFavorites } from '@/features/favorites/useFavorites';

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
  const favoriteCount = favorites.length;

  const isHome = location.pathname === '/';
  const isExplore = location.pathname === '/tools';
  const isFavorites = location.pathname === '/favorites';

  return (
    <nav
      aria-label="Mobile bottom navigation dock"
      className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto z-40 md:hidden glass-dock rounded-2xl p-1.5 shadow-2xl shadow-black/15 flex items-center justify-around"
    >
      <Link
        to="/"
        className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-medium transition-colors ${
          isHome ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </Link>

      <Link
        to="/tools"
        className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-medium transition-colors ${
          isExplore ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span>Explore</span>
      </Link>

      {/* Prominent Center Search Button */}
      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 text-white shadow-md shadow-primary/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Search tools with command palette"
      >
        <Search className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={onOpenCategories}
        className="flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-medium text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <Layers className="w-5 h-5 mb-0.5" />
        <span>Categories</span>
      </button>

      <Link
        to="/favorites"
        className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-medium transition-colors ${
          isFavorites ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <Star className="w-5 h-5 mb-0.5" />
        <span>Favorites</span>
        {favoriteCount > 0 && (
          <span className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-amber-400 text-zinc-950 font-mono text-[9px] font-bold flex items-center justify-center">
            {favoriteCount}
          </span>
        )}
      </Link>
    </nav>
  );
};
