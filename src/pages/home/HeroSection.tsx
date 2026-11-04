import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Shield, Cpu, Zap } from 'lucide-react';
import { ALL_TOOLS } from '@/registry/tool-registry';

interface HeroSectionProps {
  onOpenCommandPalette: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCommandPalette }) => {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');

  const quickPicks = [
    { name: 'JSON Formatter', slug: 'json-formatter' },
    { name: 'Regex Tester', slug: 'regex-tester' },
    { name: 'REST Client', slug: 'rest-api-client' },
    { name: 'cURL Converter', slug: 'curl-converter' },
    { name: 'UUID Generator', slug: 'uuid-generator' },
    { name: 'Subnet Calc', slug: 'subnet-calculator' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/tools?q=${encodeURIComponent(query.trim())}`);
    } else {
      onOpenCommandPalette();
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 text-center space-y-8">
      {/* Glow orb background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Pill Announcement Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-dock text-xs font-mono text-on-surface-variant border border-outline-variant/60 shadow-xs hover:border-primary/40 transition-colors">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-on-surface">LOCAL ENGINE ACTIVE</span>
        <span className="text-outline">/</span>
        <span className="text-primary font-medium">{ALL_TOOLS.length} UTILITIES READY</span>
      </div>

      {/* Hero Headline */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-on-surface leading-[1.15]">
          Useful tools. One workspace.{' '}
          <span className="block bg-gradient-to-r from-primary via-indigo-400 to-sky-400 bg-clip-text text-transparent">
            Right in your browser.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
          Fast, privacy-first developer essentials with distraction-free standalone workspaces. Zero
          telemetry, zero cloud latency, completely open-source.
        </p>
      </div>

      {/* Focal Search Launcher */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center group">
          <Search className="absolute left-4 w-5 h-5 text-outline pointer-events-none group-focus-within:text-primary transition-colors" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => {
              if (!query) onOpenCommandPalette();
            }}
            placeholder="Search tools or press ⌘K (e.g. JSON, Regex, cURL, PDF)..."
            className="w-full h-13 pl-12 pr-28 rounded-2xl glass-card bg-surface/90 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-xl shadow-black/5 dark:shadow-black/30 transition-all cursor-pointer"
          />
          <div className="absolute right-2.5 flex items-center gap-1.5">
            <kbd className="hidden sm:inline-block px-2 py-1 rounded-lg text-[10px] font-mono bg-surface-container border border-outline-variant text-outline">
              ⌘K
            </kbd>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:opacity-95 shadow-md shadow-primary/20 transition-all active:scale-95 cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Launch Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
          <span className="text-[11px] font-mono text-outline uppercase tracking-wider">
            Quick:
          </span>
          {quickPicks.map((pick) => (
            <Link
              key={pick.slug}
              to={`/tools/${pick.slug}`}
              className="px-2.5 py-1 rounded-lg glass-card hover:border-primary/50 text-[11px] font-medium text-on-surface-variant hover:text-on-surface hover:-translate-y-0.5 transition-all"
            >
              {pick.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Trust & Performance Metrics Strip */}
      <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {[
          { icon: Zap, label: '0ms Cloud Latency', detail: 'Instant WebCrypto & WASM' },
          { icon: Shield, label: 'Air-Gapped Privacy', detail: 'Zero data leaves machine' },
          { icon: Cpu, label: 'Standalone Fullscreen', detail: 'Distraction-free canvas' },
          { icon: Sparkles, label: 'Offline Ready PWA', detail: 'Works without internet' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-xl glass-card text-left space-y-1 hover:border-outline transition-colors"
            >
              <div className="flex items-center gap-2 text-primary">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-bold text-on-surface">{item.label}</span>
              </div>
              <p className="text-[11px] text-outline line-clamp-1">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
