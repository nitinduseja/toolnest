import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Copy, Check, RotateCcw, Sparkles, Palette } from 'lucide-react';
import {
  GlassConfig,
  generateGlassCss,
  generateTailwindClasses,
  getDefaultGlassConfig,
  getGlassPresets,
} from './glassmorphismLogic';
import { GlassControls } from './GlassControls';
import { copyToClipboard } from '@/lib/clipboard';

const PREVIEW_BACKGROUNDS = [
  {
    id: 'mesh',
    name: 'Mesh Gradient',
    className: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400',
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    className: 'bg-gradient-to-br from-rose-500 via-orange-400 to-yellow-300',
  },
  {
    id: 'nebula',
    name: 'Dark Nebula',
    className: 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900',
  },
  {
    id: 'emerald',
    name: 'Aurora',
    className: 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500',
  },
];

export const GlassmorphismTool: React.FC = () => {
  const [config, setConfig] = useState<GlassConfig>(getDefaultGlassConfig());
  const [activeBg, setActiveBg] = useState(PREVIEW_BACKGROUNDS[0]);
  const [codeTab, setCodeTab] = useState<'css' | 'tailwind'>('css');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const presets = useMemo(() => getGlassPresets(), []);
  const cssOutput = useMemo(() => generateGlassCss(config), [config]);
  const tailwindOutput = useMemo(() => generateTailwindClasses(config), [config]);

  const updateConfig = (key: keyof GlassConfig, val: number | string) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const handleCopy = async (text: string, key: string) => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const glassStyle: React.CSSProperties = {
    background: cssOutput.background,
    backdropFilter: cssOutput.backdropFilter,
    WebkitBackdropFilter: cssOutput.webkitBackdropFilter,
    borderRadius: cssOutput.borderRadius,
    border: cssOutput.border,
    boxShadow: cssOutput.boxShadow,
  };

  return (
    <div className="space-y-6">
      {/* Notice & Reset Ribbon */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Modern Glassmorphism & Elevation:</strong> Generate backdrop blur and elevation
            shadows with instant CSS and Tailwind class output.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setConfig(getDefaultGlassConfig())}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Workspace: Controls + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5">
          <GlassControls config={config} onUpdate={updateConfig} />
        </div>

        {/* Live Preview Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">
              Live Preview
            </span>
            {/* Background Selector Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {PREVIEW_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setActiveBg(bg)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeBg.id === bg.id
                      ? 'bg-primary-container text-on-primary-container shadow-xs font-semibold'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {bg.name}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas with Backdrop and Glass Card */}
          <div
            className={`w-full min-h-[340px] sm:min-h-[380px] p-6 sm:p-10 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 ${activeBg.className}`}
          >
            {/* Decorative background spheres */}
            <div className="absolute top-6 left-8 w-28 h-28 rounded-full bg-white/40 blur-sm pointer-events-none" />
            <div className="absolute bottom-6 right-8 w-36 h-36 rounded-full bg-cyan-300/40 blur-sm pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-20 h-20 rounded-full bg-amber-300/50 blur-xs pointer-events-none" />

            {/* Glass Container Card */}
            <div
              style={glassStyle}
              className="relative z-10 w-full max-w-sm p-6 text-white space-y-3 transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold tracking-tight text-white drop-shadow-xs">
                    Toolnest Glass
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/25 text-white">
                  Live
                </span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed drop-shadow-xs">
                Ultra-smooth frosted glass card with client-side CSS backdrop filtration and dynamic
                lighting.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg bg-white/30 hover:bg-white/40 text-xs font-semibold text-white transition-all shadow-xs"
                >
                  Explore Component
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Export Section */}
      <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
              <button
                type="button"
                onClick={() => setCodeTab('css')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  codeTab === 'css'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                CSS
              </button>
              <button
                type="button"
                onClick={() => setCodeTab('tailwind')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  codeTab === 'tailwind'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Tailwind CSS
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleCopy(codeTab === 'css' ? cssOutput.cssBlock : tailwindOutput, codeTab)
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors"
          >
            {copiedKey === codeTab ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedKey === codeTab ? 'Copied' : `Copy ${codeTab.toUpperCase()}`}</span>
          </button>
        </div>

        <pre className="w-full p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface overflow-x-auto">
          {codeTab === 'css' ? cssOutput.cssBlock : tailwindOutput}
        </pre>
      </div>

      {/* Curated Presets */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider px-1 block">
          Curated Glassmorphism Presets
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setConfig(preset.config)}
              className="p-3.5 rounded-xl border bg-surface-container-low border-outline-variant hover:bg-surface-container text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Palette className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-on-surface">{preset.name}</span>
              </div>
              <p className="text-[11px] text-on-surface-variant line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlassmorphismTool;
