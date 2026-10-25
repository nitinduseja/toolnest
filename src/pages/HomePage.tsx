import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Shield, X } from 'lucide-react';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { CATEGORIES } from '@/registry/categories';
import { ToolCard } from '@/components/molecules/ToolCard';
import { Icon } from '@/components/atoms/Icon';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [quickQuery, setQuickQuery] = useState('');
  const { recentToolIds } = useRecentTools();

  const recentTools = ALL_TOOLS.filter((t) => recentToolIds.includes(t.id));
  const featuredTools = ALL_TOOLS.slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12">
      {/* Hero & Workspace Header */}
      <section className="relative overflow-hidden rounded-2xl p-6 sm:p-10 bg-surface-container-low border border-outline-variant shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>LOCAL ENGINE ACTIVE</span>
            <span className="text-outline">/</span>
            <span className="text-primary font-medium">{ALL_TOOLS.length} UTILITIES READY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
            Useful tools. One workspace.
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Open-source, client-side developer toolbox. 100% in-browser processing with zero server
            dependencies, zero telemetry, and zero data leakage.
          </p>

          {/* Quick Search Launcher */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 sm:w-5 sm:h-5 text-outline pointer-events-none" />
              <input
                type="search"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search tools (e.g. JSON, UUID)..."
                autoComplete="off"
                enterKeyHint="search"
                className="w-full h-11 pl-10 sm:pl-11 pr-24 sm:pr-28 rounded-xl bg-surface border border-outline-variant text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                {quickQuery && (
                  <button
                    type="button"
                    onClick={() => setQuickQuery('')}
                    aria-label="Clear search input"
                    className="p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-all shadow-xs active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Quick Access Launcher Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-outline uppercase text-[10px] font-semibold tracking-wider">
              Quick:
            </span>
            {ALL_TOOLS.slice(0, 4).map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.slug}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-container-high text-on-surface border border-outline-variant/60 transition-colors"
              >
                <Icon name={tool.iconName} className="w-3.5 h-3.5 text-primary" />
                <span>{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Used Tools (if any) */}
      {recentTools.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-outline">
              Recently Used
            </h2>
            <Link to="/recent" className="text-xs text-primary font-medium hover:underline">
              View All Recent
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTools.slice(0, 3).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-on-surface">Core Utilities</h2>
            <p className="text-xs text-on-surface-variant">
              Essential tools for rapid daily developer workflows.
            </p>
          </div>
          <Link
            to="/tools"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>All Tools ({ALL_TOOLS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Category Discovery */}
      <section className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-on-surface">Explore by Category</h2>
          <p className="text-xs text-on-surface-variant">
            Browse utilities organized by technical domain.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant hover:border-primary-container/80 hover:bg-surface-container transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Icon name={cat.iconName} className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs text-on-surface truncate group-hover:text-primary transition-colors">
                  {cat.name}
                </div>
                <div className="text-[11px] text-outline truncate">{cat.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Open Source / Netlify Guarantee Banner */}
      <section className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-on-surface">Privacy First Guarantee</h3>
            <p className="text-xs text-on-surface-variant">
              Toolnest is static, open source, and runs entirely in your browser. No backend
              databases or user tracking.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/nitinduseja/toolnest"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors"
          >
            GitHub Source
          </a>
          <Link
            to="/settings"
            className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-medium hover:opacity-90 transition-opacity"
          >
            View Settings
          </Link>
        </div>
      </section>
    </div>
  );
};
