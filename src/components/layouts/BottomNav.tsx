import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Layers, Star, History } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
      isActive
        ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
    }`;

  return (
    <div className="sm:hidden fixed bottom-4 inset-x-4 max-w-sm mx-auto z-40 pointer-events-none pb-safe">
      <nav
        aria-label="Mobile Navigation Dock"
        className="pointer-events-auto w-full h-14 bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/80 rounded-2xl shadow-2xl px-2 flex items-center justify-around"
      >
        <NavLink to="/" end className={itemClass} aria-label="Home">
          <LayoutGrid className="w-4 h-4 shrink-0" />
          <span className="text-[11px]">Home</span>
        </NavLink>

        <NavLink to="/tools" className={itemClass} aria-label="All Tools">
          <Layers className="w-4 h-4 shrink-0" />
          <span className="text-[11px]">Tools</span>
        </NavLink>

        <NavLink to="/favorites" className={itemClass} aria-label="Favorites">
          <Star className="w-4 h-4 shrink-0" />
          <span className="text-[11px]">Saved</span>
        </NavLink>

        <NavLink to="/recent" className={itemClass} aria-label="Recent Tools">
          <History className="w-4 h-4 shrink-0" />
          <span className="text-[11px]">Recent</span>
        </NavLink>
      </nav>
    </div>
  );
};
