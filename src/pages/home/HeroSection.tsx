import React from 'react';
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { HeroSearchBar } from './HeroSearchBar';

interface HeroSectionProps {
  onOpenCommandPalette: (initialQuery?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCommandPalette }) => {
  return (
    <section className="relative z-30 pt-2 pb-12 sm:pt-8 md:pt-12 lg:pt-14 sm:pb-16 text-center space-y-6 sm:space-y-8">
      {/* Glow orb background - isolated in its own overflow container so the section itself does not clip dropdowns */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full" />
      </div>

      {/* Pill Announcement Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-dock text-xs font-mono text-on-surface-variant border border-outline-variant/60 shadow-xs hover:border-primary/40 transition-colors">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-on-surface">LOCAL ENGINE ACTIVE</span>
        <span className="text-outline">/</span>
        <span className="text-primary font-medium">{ALL_TOOLS.length} UTILITIES READY</span>
      </div>

      {/* Hero Headline */}
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-on-surface leading-tight sm:leading-[1.18] lg:leading-[1.15]">
          Useful tools. One workspace.{' '}
          <span className="block mt-1 sm:mt-1.5 pb-1 sm:pb-2 bg-gradient-to-r from-primary via-indigo-400 to-sky-400 bg-clip-text text-transparent">
            Right in your browser.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed pt-1">
          Fast, privacy-first developer essentials with distraction-free standalone workspaces. Zero
          telemetry, zero cloud latency, completely open-source.
        </p>
      </div>

      {/* Modern Focal Search Bar with Live Suggestions */}
      <HeroSearchBar onOpenCommandPalette={onOpenCommandPalette} />

      {/* Trust & Performance Metrics Strip */}
      <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto relative z-0">
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
