import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, Search } from 'lucide-react';

interface NotFoundPageProps {
  onOpenSearch?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onOpenSearch }) => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary shadow-sm">
        <FileQuestion className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-on-surface">404</h1>
        <h2 className="text-base font-semibold text-on-surface">Page Not Found</h2>
        <p className="text-xs text-on-surface-variant max-w-sm">
          The requested path does not exist in Toolnest or may have moved.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-opacity"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        {onOpenSearch ? (
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search Tools</span>
          </button>
        ) : (
          <Link
            to="/tools"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse Tools</span>
          </Link>
        )}
      </div>
    </div>
  );
};
