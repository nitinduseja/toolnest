import React, { useState } from 'react';
import { Palette } from 'lucide-react';

interface ShadowPreviewStageProps {
  boxShadow: string;
}

export const ShadowPreviewStage: React.FC<ShadowPreviewStageProps> = ({ boxShadow }) => {
  const [bgMode, setBgMode] = useState<'light' | 'slate' | 'dark' | 'gradient'>('light');
  const [boxColor, setBoxColor] = useState<'white' | 'slate' | 'dark' | 'primary'>('white');
  const [borderRadius, setBorderRadius] = useState<number>(16);

  const getStageBg = () => {
    switch (bgMode) {
      case 'slate':
        return 'bg-slate-200 dark:bg-slate-800';
      case 'dark':
        return 'bg-zinc-950';
      case 'gradient':
        return 'bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20';
      case 'light':
      default:
        return 'bg-zinc-100 dark:bg-zinc-900';
    }
  };

  const getBoxBg = () => {
    switch (boxColor) {
      case 'slate':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100';
      case 'dark':
        return 'bg-zinc-900 dark:bg-zinc-950 text-white border border-zinc-800';
      case 'primary':
        return 'bg-primary text-white';
      case 'white':
      default:
        return 'bg-white text-zinc-900';
    }
  };

  return (
    <div className="space-y-3">
      {/* Stage Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold text-outline">Stage:</span>
          {(['light', 'slate', 'dark', 'gradient'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setBgMode(m)}
              className={`px-2 py-0.5 rounded-lg border capitalize text-[11px] font-medium transition-all ${
                bgMode === m
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
              }`}
            >
              {m}
            </button>
          ))}
          <span className="font-semibold text-outline ml-2">Box:</span>
          {(['white', 'slate', 'dark', 'primary'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setBoxColor(c)}
              className={`px-2 py-0.5 rounded-lg border capitalize text-[11px] font-medium transition-all ${
                boxColor === c
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-outline">Radius:</span>
          <input
            type="range"
            min={0}
            max={48}
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            className="w-20 accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
          />
          <span className="font-mono text-outline">{borderRadius}px</span>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        className={`w-full min-h-[260px] sm:min-h-[320px] rounded-3xl border border-outline-variant/60 p-8 flex items-center justify-center transition-colors overflow-hidden ${getStageBg()}`}
      >
        <div
          data-testid="shadow-preview-box"
          style={{
            boxShadow,
            borderRadius: `${borderRadius}px`,
          }}
          className={`w-44 h-44 sm:w-56 sm:h-56 flex flex-col items-center justify-center p-4 transition-all duration-150 select-none ${getBoxBg()}`}
        >
          <span className="font-bold text-sm tracking-wide">Interactive Preview</span>
          <span className="text-[11px] opacity-70 mt-1">Multi-layer Shadow</span>
        </div>
      </div>
    </div>
  );
};
