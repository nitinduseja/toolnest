import React from 'react';
import { ColorStop } from './types';
import { Icon } from '@/components/atoms/Icon';

interface ColorStopControlsProps {
  stops: ColorStop[];
  onChange: (stops: ColorStop[]) => void;
}

export const ColorStopControls: React.FC<ColorStopControlsProps> = ({ stops, onChange }) => {
  const handleColorChange = (id: string, color: string) => {
    onChange(stops.map((s) => (s.id === id ? { ...s, color } : s)));
  };

  const handlePositionChange = (id: string, position: number) => {
    onChange(stops.map((s) => (s.id === id ? { ...s, position } : s)));
  };

  const handleAddStop = () => {
    if (stops.length >= 8) return;
    const newStop: ColorStop = {
      id: `stop-${Date.now()}`,
      color: '#a855f7',
      position: Math.round(stops.reduce((acc, s) => acc + s.position, 0) / stops.length),
    };
    onChange([...stops, newStop]);
  };

  const handleRemoveStop = (id: string) => {
    if (stops.length <= 2) return;
    onChange(stops.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-surface-primary/60 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Color Stops ({stops.length}/8)</h3>
        <button
          type="button"
          onClick={handleAddStop}
          disabled={stops.length >= 8}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-40"
        >
          <span>+ Add Color Stop</span>
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {stops.map((stop, idx) => (
          <div
            key={stop.id}
            className="flex items-center gap-3 rounded-lg border border-border/50 bg-surface-secondary/40 px-3 py-2"
          >
            <span className="w-5 text-xs font-semibold text-text-tertiary">#{idx + 1}</span>
            <input
              type="color"
              aria-label={`Color stop ${idx + 1}`}
              value={stop.color}
              onChange={(e) => handleColorChange(stop.id, e.target.value)}
              className="h-8 w-9 cursor-pointer rounded border border-border bg-transparent p-0.5"
            />
            <input
              type="text"
              aria-label={`Hex stop ${idx + 1}`}
              value={stop.color}
              onChange={(e) => handleColorChange(stop.id, e.target.value)}
              className="w-20 rounded border border-border/60 bg-surface-primary px-2 py-1 font-mono text-xs text-text-primary"
            />
            <div className="flex flex-1 items-center gap-2">
              <input
                type="range"
                aria-label={`Position stop ${idx + 1}`}
                min={0}
                max={100}
                value={stop.position}
                onChange={(e) => handlePositionChange(stop.id, Number(e.target.value))}
                className="w-full accent-primary"
              />
              <span className="w-10 text-right font-mono text-xs text-text-secondary">
                {stop.position}%
              </span>
            </div>
            <button
              type="button"
              aria-label={`Delete stop ${idx + 1}`}
              disabled={stops.length <= 2}
              onClick={() => handleRemoveStop(stop.id)}
              className="text-text-tertiary hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Icon name="Trash2" className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
