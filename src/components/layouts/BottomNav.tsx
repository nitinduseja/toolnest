import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutGrid,
  Layers,
  Star,
  History,
  Search,
  MoreHorizontal,
  Settings,
  X,
  ChevronRight,
} from 'lucide-react';
import { CATEGORIES } from '@/registry/categories';
import { Icon } from '@/components/atoms/Icon';

interface BottomNavProps {
  onOpenCommandPalette?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenCommandPalette }) => {
  const [showMore, setShowMore] = useState(false);

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-xl text-[10px] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
      isActive
        ? 'bg-primary-container/15 text-primary font-semibold'
        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
    }`;

  return (
    <>
      {/* Mobile "More" Bottom Sheet Backdrop & Drawer */}
      {showMore && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setShowMore(false)}
        >
          <div
            className="w-full max-h-[80vh] bg-surface-container-low border-t border-outline-variant rounded-t-3xl p-5 space-y-4 overflow-y-auto pointer-events-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
              <span className="font-bold text-sm text-on-surface">
                More Options &amp; Navigation
              </span>
              <button
                type="button"
                onClick={() => setShowMore(false)}
                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/recent"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-outline-variant hover:border-primary/50 text-xs font-semibold text-on-surface transition-colors"
              >
                <History className="w-4 h-4 text-primary shrink-0" />
                <span>Recent Tools</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-outline-variant hover:border-primary/50 text-xs font-semibold text-on-surface transition-colors"
              >
                <Settings className="w-4 h-4 text-primary shrink-0" />
                <span>Settings</span>
              </Link>
            </div>

            {/* Categories Exploration */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-outline px-1">
                Explore Categories
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/categories/${cat.slug}`}
                    onClick={() => setShowMore(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface hover:bg-surface-container text-xs text-on-surface transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon name={cat.iconName} className="w-3.5 h-3.5 text-primary" />
                      <span>{cat.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-outline" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Dock Bar */}
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

          <button
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            aria-label="More navigation and categories"
            className={`flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-xl text-[10px] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer ${
              showMore
                ? 'bg-primary-container/15 text-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
            }`}
          >
            <MoreHorizontal className="w-4 h-4 shrink-0" />
            <span>More</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default BottomNav;
