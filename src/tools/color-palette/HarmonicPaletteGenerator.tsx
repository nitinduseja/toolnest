import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { HarmonyMode, HarmonicColor } from './types';
import { generateHarmonies } from './paletteLogic';

interface HarmonicPaletteGeneratorProps {
  onColorsGenerated: (colors: string[]) => void;
}

const HARMONY_MODES: Array<{ mode: HarmonyMode; label: string; desc: string }> = [
  { mode: 'complementary', label: 'Complementary', desc: 'Opposite on color wheel (180°)' },
  { mode: 'analogous', label: 'Analogous', desc: 'Neighboring hues (±30°)' },
  { mode: 'triadic', label: 'Triadic', desc: 'Equilateral triangle (120°)' },
  { mode: 'tetradic', label: 'Tetradic', desc: 'Double complementary (90°)' },
  { mode: 'split-complementary', label: 'Split-Comp', desc: 'Base + two adjacent to complement' },
  { mode: 'monochromatic', label: 'Monochromatic', desc: 'Single hue with varied tints & shades' },
];

export const HarmonicPaletteGenerator: React.FC<HarmonicPaletteGeneratorProps> = ({
  onColorsGenerated,
}) => {
  const [baseHex, setBaseHex] = useState<string>('#635bff');
  const [activeMode, setActiveMode] = useState<HarmonyMode>('triadic');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const harmonies: HarmonicColor[] = generateHarmonies(baseHex, activeMode);

  const handleModeChange = (mode: HarmonyMode) => {
    setActiveMode(mode);
    const newHarmonies = generateHarmonies(baseHex, mode);
    onColorsGenerated(newHarmonies.map((h) => h.hex));
  };

  const handleBaseChange = (hex: string) => {
    setBaseHex(hex);
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      const newHarmonies = generateHarmonies(hex, activeMode);
      onColorsGenerated(newHarmonies.map((h) => h.hex));
    }
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="space-y-5">
      {/* Base Color Picker & Mode Selector */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <input
                type="color"
                value={baseHex}
                onChange={(e) => handleBaseChange(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-outline-variant/80 p-0.5 bg-surface"
              />
            </div>
            <div>
              <label
                htmlFor="base-hex-input"
                className="block text-[11px] font-semibold text-outline uppercase tracking-wider"
              >
                Base Color
              </label>
              <input
                id="base-hex-input"
                type="text"
                value={baseHex}
                onChange={(e) => handleBaseChange(e.target.value)}
                maxLength={7}
                className="font-mono font-bold text-sm text-on-surface bg-transparent focus:outline-none uppercase w-20"
              />
            </div>
          </div>

          {/* Quick Base Color Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['#635bff', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#3b82f6'].map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => handleBaseChange(hex)}
                className="w-6 h-6 rounded-lg border border-black/10 dark:border-white/10 hover:scale-110 transition-transform shadow-2xs"
                style={{ backgroundColor: hex }}
                title={`Set base ${hex}`}
              />
            ))}
          </div>
        </div>

        {/* Harmony Mode Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-outline-variant/40">
          {HARMONY_MODES.map(({ mode, label, desc }) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleModeChange(mode)}
              title={desc}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeMode === mode
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface border-outline-variant/50 text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="text-xs font-bold leading-tight">{label}</div>
              <div
                className={`text-[9px] mt-0.5 truncate ${
                  activeMode === mode ? 'text-white/80' : 'text-outline'
                }`}
              >
                {desc.split('(')[1]?.replace(')', '') || desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Harmonies Swatches */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {harmonies.map((c) => (
          <div
            key={c.hex + c.label}
            onClick={() => handleCopy(c.hex)}
            className="group bg-surface border border-outline-variant/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <div
              className="h-28 sm:h-32 relative flex items-end p-2.5 transition-transform group-hover:scale-[1.02]"
              style={{ backgroundColor: c.hex }}
            >
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/45 text-white backdrop-blur-xs">
                {c.label}
              </span>
              <button
                type="button"
                className="absolute top-2.5 right-2.5 p-1 rounded-md bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy Hex"
              >
                {copiedHex === c.hex ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="p-3 space-y-1">
              <div className="font-mono font-bold text-xs text-on-surface uppercase flex justify-between">
                <span>{c.hex}</span>
                <span className="text-[10px] text-outline font-normal">H: {c.hsl.h}°</span>
              </div>
              <div className="text-[10px] font-mono text-outline">
                RGB({c.rgb.r}, {c.rgb.g}, {c.rgb.b})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
