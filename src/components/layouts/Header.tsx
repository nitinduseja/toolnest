import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { GithubIcon } from '@/components/atoms/GithubIcon';

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant z-40">
      <div className="w-full h-14 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center p-1.5 shadow-sm group-hover:border-primary-container transition-colors">
            <div className="grid grid-cols-2 gap-0.5 w-full h-full">
              <div className="rounded-sm bg-primary-container" />
              <div className="rounded-sm bg-primary-container/70" />
              <div className="rounded-sm bg-primary-container/40" />
              <div className="rounded-sm bg-emerald-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-on-surface tracking-tight">Toolnest</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[11px] font-mono bg-surface-container text-on-surface-variant">
              v1.0
            </span>
          </div>
        </Link>

        {/* Command Palette Trigger */}
        <div className="flex-1 max-w-xl mx-1.5 sm:mx-4">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search tools and commands"
            className="w-full h-9 px-2.5 sm:px-3 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex items-center justify-between transition-all border border-outline-variant/60 shadow-xs active:scale-[0.99]"
          >
            <span className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-outline shrink-0" />
              <span className="truncate sm:hidden">Search tools...</span>
              <span className="hidden sm:inline truncate">Search tools, commands, or press ⌘K</span>
            </span>
            <span className="sm:hidden px-1.5 py-0.5 rounded bg-surface-container text-outline font-mono text-[10px] shrink-0">
              ⌘K
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-mono text-[11px] shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Theme Toggle & Github Link */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />

          <a
            href="https://github.com/nitinduseja/toolnest"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
