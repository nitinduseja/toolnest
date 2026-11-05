import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Star, Clock, Layers, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { BrandLogo } from '@/components/atoms/BrandLogo';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';

interface DesktopFloatingNavProps {
  onOpenCommandPalette: () => void;
  onOpenCategories: () => void;
  onOpenShortcuts: () => void;
}

export const DesktopFloatingNav: React.FC<DesktopFloatingNavProps> = ({
  onOpenCommandPalette,
  onOpenCategories,
  onOpenShortcuts,
}) => {
  const location = useLocation();
  const { favorites } = useFavorites();
  const { recentToolIds } = useRecentTools();
  const favoriteCount = favorites.length;

  const isHome = location.pathname === '/';
  const isToolsActive = location.pathname.startsWith('/tools');
  const isFavoritesActive = location.pathname === '/favorites';
  const isRecentActive = location.pathname === '/recent';

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 hidden lg:block">
      <nav
        aria-label="Desktop primary navigation"
        className="glass-dock rounded-full pl-4 pr-3 py-2 shadow-2xl shadow-black/5 dark:shadow-black/40 flex items-center gap-3 transition-all duration-200 hover:border-outline"
      >
        {/* Brand Logo & Name */}
        <Link
          to="/"
          className="flex items-center gap-2 group pr-2 focus:outline-none"
          title="Toolnest Home"
        >
          <BrandLogo className="w-7 h-7 rounded-lg shadow-xs group-hover:scale-105 transition-transform shrink-0" />
          <span className="font-extrabold text-xs tracking-tight text-on-surface bg-gradient-to-r from-on-surface via-on-surface to-primary bg-clip-text">
            TOOLNEST
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 text-xs">
          <Link
            to="/tools"
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              isToolsActive
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Explore
          </Link>

          <button
            type="button"
            onClick={onOpenCategories}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>

          <Link
            to="/favorites"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
              isFavoritesActive
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Favorites</span>
            {favoriteCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-zinc-950 font-mono text-[10px] font-bold flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </Link>

          <Link
            to="/recent"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
              isRecentActive
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recent</span>
            {recentToolIds.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
          </Link>
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-px bg-outline-variant" />

        {/* Command Palette Trigger Button (displayed on all portal pages except Home) */}
        {!isHome && (
          <>
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-xs text-on-surface-variant transition-colors"
              title="Open Command Palette (Ctrl+K or ⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-outline" />
              <span className="text-[11px] font-medium">Search...</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface border border-outline-variant text-outline">
                ⌘K
              </kbd>
            </button>
            <div className="h-4 w-px bg-outline-variant" />
          </>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Keyboard Shortcuts Trigger */}
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          title="Keyboard Shortcuts (?)"
          aria-label="Open keyboard shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </nav>
    </header>
  );
};
