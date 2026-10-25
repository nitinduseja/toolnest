import React, { useState, useMemo } from 'react';
import { Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { parseHex, rgbToHex, rgbToHsl, getRelativeLuminance, getContrastRatio } from './colorLogic';
import { copyToClipboard } from '@/lib/clipboard';

export const ColorConverterTool: React.FC = () => {
  const [hexInput, setHexInput] = useState('#635BFF');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parsed = useMemo(() => {
    try {
      const rgb = parseHex(hexInput);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const lum = getRelativeLuminance(rgb.r, rgb.g, rgb.b);

      const contrastWhite = getContrastRatio(lum, 1.0);
      const contrastBlack = getContrastRatio(lum, 0.0);

      return {
        isValid: true,
        hex,
        rgb,
        hsl,
        rgbString: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        contrastWhite,
        contrastBlack,
        error: null,
      };
    } catch (err: unknown) {
      return {
        isValid: false,
        hex: '#000000',
        rgb: { r: 0, g: 0, b: 0 },
        hsl: { h: 0, s: 0, l: 0 },
        rgbString: '',
        hslString: '',
        contrastWhite: 1,
        contrastBlack: 1,
        error: err instanceof Error ? err.message : 'Invalid color format',
      };
    }
  }, [hexInput]);

  const handleCopy = async (val: string, key: string) => {
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Swatch and Direct Color Picker */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div
          className="w-32 h-32 rounded-2xl border border-white/20 shadow-md flex items-center justify-center transition-all relative overflow-hidden group cursor-pointer"
          style={{ backgroundColor: parsed.isValid ? parsed.hex : '#222' }}
        >
          <input
            type="color"
            value={parsed.isValid ? parsed.hex : '#000000'}
            onChange={(e) => setHexInput(e.target.value.toUpperCase())}
            aria-label="Color Picker"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <span className="text-[11px] font-mono font-semibold px-2 py-1 rounded bg-black/60 text-white backdrop-blur-xs group-hover:opacity-100 transition-opacity">
            Click to Pick
          </span>
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-xl font-bold font-mono tracking-wide text-on-surface">
            {parsed.isValid ? parsed.hex : 'Invalid Color'}
          </h2>
          <p className="text-xs text-on-surface-variant">
            Adjust the color using the native picker or type any valid HEX, RGB, or HSL value below.
          </p>
        </div>
      </div>

      {parsed.error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{parsed.error}</span>
        </div>
      )}

      {/* Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* HEX */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
          <div className="flex items-center justify-between text-xs text-outline">
            <span className="font-semibold uppercase">HEX Format</span>
            <button
              type="button"
              onClick={() => handleCopy(parsed.hex, 'hex')}
              className="text-primary hover:underline flex items-center gap-1"
            >
              {copiedKey === 'hex' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedKey === 'hex' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant font-mono text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>

        {/* RGB */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
          <div className="flex items-center justify-between text-xs text-outline">
            <span className="font-semibold uppercase">RGB Format</span>
            <button
              type="button"
              onClick={() => handleCopy(parsed.rgbString, 'rgb')}
              className="text-primary hover:underline flex items-center gap-1"
            >
              {copiedKey === 'rgb' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedKey === 'rgb' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={parsed.rgbString}
            className="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant font-mono text-xs text-on-surface focus:outline-none"
          />
        </div>

        {/* HSL */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
          <div className="flex items-center justify-between text-xs text-outline">
            <span className="font-semibold uppercase">HSL Format</span>
            <button
              type="button"
              onClick={() => handleCopy(parsed.hslString, 'hsl')}
              className="text-primary hover:underline flex items-center gap-1"
            >
              {copiedKey === 'hsl' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedKey === 'hsl' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={parsed.hslString}
            className="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant font-mono text-xs text-on-surface focus:outline-none"
          />
        </div>
      </div>

      {/* WCAG 2.2 Accessibility Contrast Analysis */}
      <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            WCAG 2.2 AA / AAA Contrast Analysis
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contrast with White */}
          <div className="p-4 rounded-lg bg-surface border border-outline-variant flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-outline font-medium">Against White (#FFFFFF)</span>
              <div className="text-lg font-bold font-mono text-on-surface">
                {parsed.contrastWhite}:1
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  parsed.contrastWhite >= 4.5
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                {parsed.contrastWhite >= 4.5 ? 'Passes AA' : 'Fails AA'}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  parsed.contrastWhite >= 7.0
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-surface-container text-outline'
                }`}
              >
                {parsed.contrastWhite >= 7.0 ? 'Passes AAA' : 'Fails AAA'}
              </span>
            </div>
          </div>

          {/* Contrast with Black */}
          <div className="p-4 rounded-lg bg-surface border border-outline-variant flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-outline font-medium">Against Black (#000000)</span>
              <div className="text-lg font-bold font-mono text-on-surface">
                {parsed.contrastBlack}:1
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  parsed.contrastBlack >= 4.5
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                {parsed.contrastBlack >= 4.5 ? 'Passes AA' : 'Fails AA'}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  parsed.contrastBlack >= 7.0
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-surface-container text-outline'
                }`}
              >
                {parsed.contrastBlack >= 7.0 ? 'Passes AAA' : 'Fails AAA'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorConverterTool;
