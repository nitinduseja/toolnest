import React, { useState, useMemo } from 'react';
import { Copy, Check, Sparkles, Code2, Sliders } from 'lucide-react';
import { AnimationConfig, KeyframePoint } from './types';
import { ANIMATION_PRESETS } from './presets';
import { generateFullCss, generateTailwindSnippet } from './animationLogic';
import { AnimationPreview } from './AnimationPreview';
import { KeyframeTimeline } from './KeyframeTimeline';
import { copyToClipboard } from '@/lib/clipboard';

export const CssAnimationBuilderTool: React.FC = () => {
  const [config, setConfig] = useState<AnimationConfig>(ANIMATION_PRESETS[0].config);
  const [keyframes, setKeyframes] = useState<KeyframePoint[]>(ANIMATION_PRESETS[0].keyframes);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [exportMode, setExportMode] = useState<'css' | 'tailwind'>('css');
  const [copied, setCopied] = useState<boolean>(false);

  const fullCss = useMemo(() => generateFullCss(config, keyframes), [config, keyframes]);
  const tailwindSnippet = useMemo(
    () => generateTailwindSnippet(config, keyframes),
    [config, keyframes]
  );
  const currentOutput = exportMode === 'css' ? fullCss : tailwindSnippet;

  const handleCopy = async () => {
    const ok = await copyToClipboard(currentOutput);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyPreset = (presetId: string) => {
    const found = ANIMATION_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setConfig(found.config);
      setKeyframes(found.keyframes);
      setSelectedIdx(0);
    }
  };

  const handleAddPoint = () => {
    const nextOffset = Math.min(
      100,
      Math.max(...keyframes.map((p) => p.offset)) + 10 <= 100
        ? Math.max(...keyframes.map((p) => p.offset)) + 10
        : 50
    );
    const newPoint: KeyframePoint = {
      offset: nextOffset,
      translateX: 0,
      translateY: -10,
      scale: 1.1,
      rotate: 0,
      opacity: 1,
    };
    setKeyframes([...keyframes, newPoint]);
    setSelectedIdx(keyframes.length);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & Preset Selector */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">
              CSS Keyframes &amp; Animation Builder
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Studio Tool
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Design smooth CSS3 and Tailwind CSS keyframe animations with visual curve &amp; property
            timelines.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-outline font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Presets:
          </span>
          {ANIMATION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface hover:bg-surface-container border border-outline-variant text-on-surface transition-colors cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Preview & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimationPreview config={config} keyframes={keyframes} />

        {/* Global Config Controls */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-on-surface">Animation Configuration</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-outline text-[11px] font-medium">Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-on-surface font-mono"
              />
            </div>
            <div>
              <label className="text-outline text-[11px] font-medium">Duration (s)</label>
              <input
                type="number"
                min={0.1}
                max={10}
                step={0.1}
                value={config.duration}
                onChange={(e) => setConfig({ ...config, duration: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-on-surface"
              />
            </div>
            <div>
              <label className="text-outline text-[11px] font-medium">Timing Function</label>
              <select
                value={config.timingFunction}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    timingFunction: e.target.value as AnimationConfig['timingFunction'],
                  })
                }
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-on-surface"
              >
                <option value="ease">ease</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
                <option value="linear">linear</option>
              </select>
            </div>
            <div>
              <label className="text-outline text-[11px] font-medium">Iteration</label>
              <select
                value={config.iterationCount}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    iterationCount: e.target.value as AnimationConfig['iterationCount'],
                  })
                }
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-on-surface"
              >
                <option value="infinite">infinite</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe Timeline */}
      <KeyframeTimeline
        keyframes={keyframes}
        selectedIdx={selectedIdx}
        onSelectIdx={setSelectedIdx}
        onUpdatePoint={(idx, updated) => {
          const next = [...keyframes];
          next[idx] = { ...next[idx], ...updated };
          setKeyframes(next);
        }}
        onAddPoint={handleAddPoint}
        onDeletePoint={(idx) => {
          setKeyframes(keyframes.filter((_, i) => i !== idx));
          setSelectedIdx(0);
        }}
      />

      {/* Code Export Section */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-outline">
              Generated Code
            </span>
            <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                onClick={() => setExportMode('css')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  exportMode === 'css'
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Pure CSS
              </button>
              <button
                type="button"
                onClick={() => setExportMode('tailwind')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  exportMode === 'tailwind'
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Tailwind CSS
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface hover:bg-surface-container border border-outline-variant text-on-surface cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 font-mono text-xs text-on-surface overflow-x-auto max-h-60">
          <code>{currentOutput}</code>
        </pre>
      </div>
    </div>
  );
};

export default CssAnimationBuilderTool;
