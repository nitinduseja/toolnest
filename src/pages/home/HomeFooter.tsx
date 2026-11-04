import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield } from 'lucide-react';
import { GithubIcon } from '@/components/atoms/GithubIcon';

interface HomeFooterProps {
  onOpenShortcuts: () => void;
}

export const HomeFooter: React.FC<HomeFooterProps> = ({ onOpenShortcuts }) => {
  return (
    <footer className="pt-16 pb-8 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-outline">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-bold text-on-surface">TOOLNEST</span>
          <span className="text-outline ml-2">— Open-Source Client-Side Workstation</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs">
        <Link to="/tools" className="hover:text-on-surface transition-colors">
          All Tools
        </Link>
        <Link to="/settings" className="hover:text-on-surface transition-colors">
          Settings
        </Link>
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="hover:text-on-surface transition-colors cursor-pointer"
        >
          Shortcuts (?)
        </button>
        <a
          href="https://github.com/nitinduseja/toolnest"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-on-surface transition-colors"
        >
          <GithubIcon className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </a>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-mono">
        <Shield className="w-3.5 h-3.5 text-emerald-500" />
        <span>MIT License • Zero Tracking</span>
      </div>
    </footer>
  );
};
