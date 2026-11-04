import React from 'react';
import { ShieldCheck, Columns2, Command, WifiOff, Sparkles } from 'lucide-react';

export const ArchitectureBentoSection: React.FC = () => {
  return (
    <section className="space-y-6 pt-4">
      <div>
        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Toolnest Standard</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
          Engineered for Speed, Privacy & Focus
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Privacy by Architecture (Span 2) */}
        <div className="md:col-span-2 p-6 rounded-2xl glass-card space-y-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg font-bold text-on-surface">
              100% Client-Side Engine (Zero Cloud Latency)
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Every cryptographic digest, regular expression, JSON parse, and document conversion
              executes directly within your browser memory using the native Web Crypto API and
              WebAssembly. No requests leave your device — safe for confidential tokens, proprietary
              schemas, and private production logs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-outline">
            <span className="px-2.5 py-1 rounded-md bg-surface border border-outline-variant">
              ✓ Zero Analytics
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface border border-outline-variant">
              ✓ Zero Trackers
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface border border-outline-variant">
              ✓ Zero Backend Databases
            </span>
          </div>
        </div>

        {/* Card 2: Dual Split View (Span 1) */}
        <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/10 border border-primary/20 text-primary flex items-center justify-center">
              <Columns2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-on-surface">Dual Split-View Canvas</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Work with two utilities side-by-side using the <kbd className="font-mono">Alt+S</kbd>{' '}
              hotkey. Test an API in the REST Client while formatting JSON payloads in parallel.
            </p>
          </div>
          <span className="text-[11px] font-mono text-primary font-semibold">
            Press Alt+S inside any tool →
          </span>
        </div>

        {/* Card 3: Command Palette (Span 1) */}
        <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center">
              <Command className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-on-surface">Raycast-Grade Command Palette</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Search all 36 tools, filter categories, and execute actions with sub-millisecond
              response times via <kbd className="font-mono">⌘K</kbd> or{' '}
              <kbd className="font-mono">Ctrl+K</kbd>.
            </p>
          </div>
          <span className="text-[11px] font-mono text-sky-500 font-semibold">
            Global hotkey ⌘K available everywhere →
          </span>
        </div>

        {/* Card 4: Offline PWA (Span 2) */}
        <div className="md:col-span-2 p-6 rounded-2xl glass-card space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center">
            <WifiOff className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg font-bold text-on-surface">
              Offline-First Progressive Web App (PWA)
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Install Toolnest to your desktop dock or mobile home screen. Service workers cache
              core assets and lazy-loaded utilities so your workstation continues operating
              flawlessly on airplanes, remote trains, or during internet outages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
