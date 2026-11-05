import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { ToolCard } from '@/components/molecules/ToolCard';

const FILTER_TABS = [
  { id: 'all', label: 'All Popular' },
  { id: 'developer-tools', label: 'Developer' },
  { id: 'security-crypto', label: 'Security & Crypto' },
  { id: 'data-files', label: 'Data & Files' },
  { id: 'web-network', label: 'Network' },
];

export const FeaturedToolsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const displayedTools = useMemo(() => {
    if (activeTab === 'all') {
      return ALL_TOOLS.slice(0, 6);
    }
    return ALL_TOOLS.filter((t) => t.category === activeTab).slice(0, 6);
  }, [activeTab]);

  return (
    <section className="space-y-6 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Spotlight</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
            Popular Workstation Utilities
          </h2>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container border border-outline-variant/60 overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      <div className="text-center pt-2">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card hover:border-primary/60 text-xs font-bold text-on-surface transition-all group hover:scale-[1.02]"
        >
          <span>Explore Entire Catalog ({ALL_TOOLS.length} Utilities)</span>
          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
