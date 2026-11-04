import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Columns2, Star, Maximize2, Minimize2, Search, HelpCircle } from 'lucide-react';
import { ToolDefinition } from '@/registry/types';
import { CATEGORY_MAP } from '@/registry/categories';
import { Icon } from '@/components/atoms/Icon';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { useFavorites } from '@/features/favorites/useFavorites';

interface StandaloneToolHeaderProps {
  tool: ToolDefinition;
  isSplit: boolean;
  onToggleSplit: () => void;
  onOpenCommandPalette: () => void;
  onOpenShortcuts: () => void;
}

export const StandaloneToolHeader: React.FC<StandaloneToolHeaderProps> = ({
  tool,
  isSplit,
  onToggleSplit,
  onOpenCommandPalette,
  onOpenShortcuts,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const favorite = isFavorite(tool.id);
  const category = CATEGORY_MAP.get(tool.category);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-13 glass-dock border-b border-outline-variant/60 flex items-center justify-between px-3 sm:px-6 shrink-0 z-30 select-none">
      {/* Left: Back to Hub + Tool identity */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors group shrink-0"
          title="Return to Toolnest Hub (Esc)"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Hub</span>
        </Link>

        <div className="h-4 w-px bg-outline-variant shrink-0" />

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary-container/15 text-primary border border-primary/25 flex items-center justify-center shrink-0">
            <Icon name={tool.iconName} className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-on-surface truncate">{tool.name}</h1>
            {category && (
              <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-container text-on-surface-variant truncate">
                {category.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Command Palette quick-switcher */}
      <div className="hidden sm:flex items-center justify-center">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-xs text-on-surface-variant transition-colors"
          title="Switch tool or search (⌘K)"
        >
          <Search className="w-3 h-3 text-outline" />
          <span className="text-[11px]">Quick Switcher</span>
          <kbd className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-surface border border-outline-variant text-outline">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onToggleSplit}
          title="Toggle Dual Tool Split View (Alt+S)"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            isSplit
              ? 'bg-primary text-on-primary font-semibold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{isSplit ? 'Close Split' : 'Split View'}</span>
        </button>

        <button
          type="button"
          onClick={() => toggleFavorite(tool.id)}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className="p-2 rounded-lg text-outline hover:text-amber-500 hover:bg-surface-container transition-colors"
          title={favorite ? 'Favorited' : 'Add to Favorites'}
        >
          <Star className={`w-4 h-4 ${favorite ? 'fill-amber-400 text-amber-500' : ''}`} />
        </button>

        <button
          type="button"
          onClick={toggleNativeFullscreen}
          className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors hidden sm:block"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <ThemeToggle />

        <button
          type="button"
          onClick={onOpenShortcuts}
          className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          title="Keyboard Shortcuts (?)"
          aria-label="Open keyboard shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
