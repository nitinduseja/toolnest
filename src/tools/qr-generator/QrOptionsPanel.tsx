import React from 'react';
import type { QrErrorCorrectionLevel } from './qrLogic';

interface QrOptionsPanelProps {
  size: number;
  setSize: (val: number) => void;
  margin: number;
  setMargin: (val: number) => void;
  ecc: QrErrorCorrectionLevel;
  setEcc: (val: QrErrorCorrectionLevel) => void;
  darkColor: string;
  setDarkColor: (val: string) => void;
  lightColor: string;
  setLightColor: (val: string) => void;
}

export const QrOptionsPanel: React.FC<QrOptionsPanelProps> = ({
  size,
  setSize,
  margin,
  setMargin,
  ecc,
  setEcc,
  darkColor,
  setDarkColor,
  lightColor,
  setLightColor,
}) => {
  return (
    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
        Options &amp; Dimensions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-on-surface-variant block mb-1">Pixel Size ({size}px)</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
          >
            <option value={200}>200 x 200 px</option>
            <option value={300}>300 x 300 px</option>
            <option value={400}>400 x 400 px</option>
            <option value={600}>600 x 600 px (HD)</option>
          </select>
        </div>

        <div>
          <label className="text-on-surface-variant block mb-1">Quiet Zone Margin ({margin})</label>
          <select
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
          >
            <option value={1}>Compact (1 module)</option>
            <option value={2}>Standard (2 modules)</option>
            <option value={4}>Generous (4 modules)</option>
          </select>
        </div>

        <div>
          <label className="text-on-surface-variant block mb-1">Error Correction ({ecc})</label>
          <select
            value={ecc}
            onChange={(e) => setEcc(e.target.value as QrErrorCorrectionLevel)}
            className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
          >
            <option value="L">L (~7% damage recovery)</option>
            <option value="M">M (~15% recovery, default)</option>
            <option value="Q">Q (~25% damage recovery)</option>
            <option value="H">H (~30% damage recovery)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-3">
          <label className="text-on-surface-variant text-xs">QR Foreground:</label>
          <input
            type="color"
            value={darkColor}
            onChange={(e) => setDarkColor(e.target.value)}
            className="w-8 h-8 rounded border border-outline-variant cursor-pointer"
          />
          <span className="font-mono text-xs">{darkColor}</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-on-surface-variant text-xs">Background:</label>
          <input
            type="color"
            value={lightColor}
            onChange={(e) => setLightColor(e.target.value)}
            className="w-8 h-8 rounded border border-outline-variant cursor-pointer"
          />
          <span className="font-mono text-xs">{lightColor}</span>
        </div>
      </div>
    </div>
  );
};
