import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Layers, Star, History, Search } from 'lucide-react';

interface BottomNavProps {
  onOpenCommandPalette?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenCommandPalette }) => {
  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-xl text-[10px] transition-all duration-150 ${
      isActive
        ? 'bg-primary-container/15 text-primary font-semibold'
        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
    }`;

  return (
    <div className="sm:hidden fixed bottom-4 inset-x-4 max-w-sm mx-auto z-40 pointer-events-none pb-safe">
      <nav
        aria-label="Mobile Navigation Dock"
        className="pointer-events-auto relative w-full h-14 bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/80 rounded-2xl shadow-2xl px-2 flex items-center justify-around"
      >
        <NavLink to="/" end className={itemClass} aria-label="Home">
          <LayoutGrid className="w-4 h-4 shrink-0" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/tools" className={itemClass} aria-label="All Tools">
          <Layers className="w-4 h-4 shrink-0" />
          <span>Tools</span>
        </NavLink>

        {/* Floating Center Search Action */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          aria-label="Search tools and commands"
          title="Search tools and commands (⌘K)"
          className="-translate-y-4 w-12 h-12 rounded-full bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/35 ring-4 ring-surface flex items-center justify-center shrink-0 active:scale-90 hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          <Search className="w-5 h-5" />
        </button>

        <NavLink to="/favorites" className={itemClass} aria-label="Favorites">
          <Star className="w-4 h-4 shrink-0" />
          <span>Saved</span>
        </NavLink>

        <NavLink to="/recent" className={itemClass} aria-label="Recent Tools">
          <History className="w-4 h-4 shrink-0" />
          <span>Recent</span>
        </NavLink>
      </nav>
    </div>
  );
};
