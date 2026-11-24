import React, { useState, useId } from 'react';
import { Play, Pause, RotateCcw, Box, Circle, Sparkles } from 'lucide-react';
import { KeyframePoint, AnimationConfig } from './types';
import { generateKeyframesCss } from './animationLogic';

interface AnimationPreviewProps {
  config: AnimationConfig;
  keyframes: KeyframePoint[];
}

export const AnimationPreview: React.FC<AnimationPreviewProps> = ({ config, keyframes }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [shape, setShape] = useState<'card' | 'circle' | 'badge'>('card');
  const [animKey, setAnimKey] = useState<number>(0);
  const styleId = useId();

  const effectiveDuration = Math.max(0.1, config.duration / speedMultiplier);
  const timing =
    config.timingFunction === 'cubic-bezier' && config.cubicBezier
      ? `cubic-bezier(${config.cubicBezier})`
      : config.timingFunction;

  const keyframesCss = generateKeyframesCss(config.name, keyframes);

  const handleRestart = () => {
    setIsPlaying(false);
    setAnimKey((prev) => prev + 1);
    setTimeout(() => setIsPlaying(true), 30);
  };

  return (
    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
      <style>{`
        ${keyframesCss}
        .anim-preview-${styleId} {
          animation-name: ${config.name};
          animation-duration: ${effectiveDuration}s;
          animation-timing-function: ${timing};
          animation-iteration-count: ${config.iterationCount};
          animation-direction: ${config.direction};
          animation-fill-mode: ${config.fillMode};
          animation-play-state: ${isPlaying ? 'running' : 'paused'};
        }
      `}</style>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title="Restart Animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-outline mr-1 font-medium">Speed:</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeedMultiplier(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                speedMultiplier === s
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Shape Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-surface border border-outline-variant/60 text-xs">
          <button
            type="button"
            onClick={() => setShape('card')}
            className={`p-1 rounded cursor-pointer ${shape === 'card' ? 'bg-surface-container text-primary' : 'text-outline'}`}
            title="Card"
          >
            <Box className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShape('circle')}
            className={`p-1 rounded cursor-pointer ${shape === 'circle' ? 'bg-surface-container text-primary' : 'text-outline'}`}
            title="Circle"
          >
            <Circle className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShape('badge')}
            className={`p-1 rounded cursor-pointer ${shape === 'badge' ? 'bg-surface-container text-primary' : 'text-outline'}`}
            title="Badge"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative h-64 w-full rounded-xl bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-center overflow-hidden">
        <div
          key={animKey}
          className={`anim-preview-${styleId} will-change-transform flex items-center justify-center select-none shadow-lg transition-colors ${
            shape === 'card'
              ? 'w-36 h-28 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 text-white p-3 font-semibold text-center text-xs'
              : shape === 'circle'
                ? 'w-24 h-24 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 text-white font-bold text-xs'
                : 'px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5'
          }`}
        >
          {shape === 'card' && 'CSS Keyframe Stage'}
          {shape === 'circle' && 'Preview'}
          {shape === 'badge' && 'Active Tag'}
        </div>
      </div>
    </div>
  );
};
