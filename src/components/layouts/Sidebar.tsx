import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Layers, Star, History, Settings, ExternalLink } from 'lucide-react';
import { CATEGORIES } from '@/registry/categories';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { Icon } from '@/components/atoms/Icon';
import { GithubIcon } from '@/components/atoms/GithubIcon';

export const Sidebar: React.FC = () => {
  const getCategoryToolCount = (categoryId: string) => {
    return ALL_TOOLS.filter((t) => t.category === categoryId).length;
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-2.5 lg:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
      isActive
        ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
    }`;

  return (
    <aside
      aria-label="Application Sidebar"
      className="hidden sm:flex fixed left-0 top-14 bottom-0 w-16 lg:w-60 bg-surface-container-lowest border-r border-outline-variant z-30 flex-col justify-between transition-all duration-200 ease-in-out"
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-4">
        {/* Main Workspace Navigation */}
        <section className="px-2">
          <div className="hidden lg:block px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-outline">
            Workspace
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/"
              end
              className={navItemClass}
              title="Home Workspace"
              aria-label="Home Workspace"
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline truncate">Home</span>
            </NavLink>

            <NavLink
              to="/tools"
              className={navItemClass}
              title="All Tools Catalog"
              aria-label="All Tools"
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline truncate">All Tools</span>
            </NavLink>

            <NavLink
              to="/favorites"
              className={navItemClass}
              title="Starred Favorites"
              aria-label="Favorites"
            >
              <Star className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline truncate">Favorites</span>
            </NavLink>

            <NavLink
              to="/recent"
              className={navItemClass}
              title="Recent History"
              aria-label="Recent History"
            >
              <History className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline truncate">Recent History</span>
            </NavLink>
          </nav>
        </section>

        {/* Subtle section divider on tablet */}
        <div className="sm:block lg:hidden my-1 border-t border-outline-variant/60 mx-2.5" />

        {/* Categories Section */}
        <section className="px-2">
          <div className="hidden lg:block px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-outline">
            Categories
          </div>
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => {
              const count = getCategoryToolCount(cat.id);
              return (
                <NavLink
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className={navItemClass}
                  title={`${cat.name} (${count} tools)`}
                  aria-label={cat.name}
                >
                  <Icon name={cat.iconName} className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline flex-1 truncate">{cat.name}</span>
                  {count > 0 && (
                    <span className="hidden lg:inline-block text-[11px] font-mono px-1.5 py-0.2 rounded bg-surface-container text-outline">
                      {count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </section>
      </div>

      {/* Footer Settings & Status */}
      <footer className="p-2 border-t border-outline-variant bg-surface-container-lowest space-y-1">
        <NavLink to="/settings" className={navItemClass} title="Settings" aria-label="Settings">
          <Settings className="w-4 h-4 shrink-0" />
          <span className="hidden lg:inline">Settings</span>
        </NavLink>

        {/* Desktop Footer Link */}
        <div className="hidden lg:flex pt-1 px-3 items-center justify-between text-[11px] text-on-surface-variant">
          <span>v1.0.0</span>
          <a
            href="https://github.com/nitinduseja/toolnest"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-on-surface"
            title="GitHub Repository"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Tablet Footer GitHub Icon */}
        <div className="flex lg:hidden justify-center pt-0.5">
          <a
            href="https://github.com/nitinduseja/toolnest"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            title="GitHub Repository"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </aside>
  );
};
