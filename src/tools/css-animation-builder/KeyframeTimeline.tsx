import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { KeyframePoint } from './types';

interface KeyframeTimelineProps {
  keyframes: KeyframePoint[];
  selectedIdx: number;
  onSelectIdx: (idx: number) => void;
  onUpdatePoint: (idx: number, updated: Partial<KeyframePoint>) => void;
  onAddPoint: () => void;
  onDeletePoint: (idx: number) => void;
}

export const KeyframeTimeline: React.FC<KeyframeTimelineProps> = ({
  keyframes,
  selectedIdx,
  onSelectIdx,
  onUpdatePoint,
  onAddPoint,
  onDeletePoint,
}) => {
  const current = keyframes[selectedIdx] || keyframes[0];

  return (
    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
      {/* Header & Add Point */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
          Keyframe Steps ({keyframes.length})
        </h3>
        <button
          type="button"
          onClick={onAddPoint}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-surface hover:bg-surface-container border border-outline-variant text-on-surface cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-primary" />
          <span>Add Step</span>
        </button>
      </div>

      {/* Keyframe Step Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {keyframes.map((point, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectIdx(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              selectedIdx === idx
                ? 'bg-primary text-on-primary shadow-sm scale-105'
                : 'bg-surface border border-outline-variant/80 text-on-surface hover:bg-surface-container'
            }`}
          >
            {point.offset}%
          </button>
        ))}
      </div>

      {/* Selected Step Property Editor */}
      {current && (
        <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">
              Editing Keyframe: {current.offset}%
            </span>
            {keyframes.length > 2 && (
              <button
                type="button"
                onClick={() => onDeletePoint(selectedIdx)}
                className="text-xs text-red-500 hover:opacity-80 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Step</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {/* Offset */}
            <div>
              <div className="flex justify-between text-outline text-[11px] mb-1">
                <span>Offset</span>
                <span className="font-mono">{current.offset}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={current.offset}
                onChange={(e) => onUpdatePoint(selectedIdx, { offset: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            {/* Translate X */}
            <div>
              <div className="flex justify-between text-outline text-[11px] mb-1">
                <span>Translate X</span>
                <span className="font-mono">{current.translateX}px</span>
              </div>
              <input
                type="range"
                min={-80}
                max={80}
                value={current.translateX}
                onChange={(e) => onUpdatePoint(selectedIdx, { translateX: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            {/* Translate Y */}
            <div>
              <div className="flex justify-between text-outline text-[11px] mb-1">
                <span>Translate Y</span>
                <span className="font-mono">{current.translateY}px</span>
              </div>
              <input
                type="range"
                min={-80}
                max={80}
                value={current.translateY}
                onChange={(e) => onUpdatePoint(selectedIdx, { translateY: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            {/* Scale */}
            <div>
              <div className="flex justify-between text-outline text-[11px] mb-1">
                <span>Scale</span>
                <span className="font-mono">{current.scale}</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={2}
                step={0.05}
                value={current.scale}
                onChange={(e) => onUpdatePoint(selectedIdx, { scale: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            {/* Rotate */}
            <div>
              <div className="flex justify-between text-outline text-[11px] mb-1">
                <span>Rotate</span>
                <span className="font-mono">{current.rotate}°</span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                value={current.rotate}
                onChange={(e) => onUpdatePoint(selectedIdx, { rotate: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            {/* Opacity */}
            <div>
              <div className="flex justify-between text-outline text-[11px] mb-1">
                <span>Opacity</span>
                <span className="font-mono">{current.opacity}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={current.opacity}
                onChange={(e) => onUpdatePoint(selectedIdx, { opacity: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
