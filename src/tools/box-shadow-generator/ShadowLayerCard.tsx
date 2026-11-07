import React from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { ShadowLayer } from './types';

interface ShadowLayerCardProps {
  layer: ShadowLayer;
  index: number;
  canDelete: boolean;
  onUpdate: (updated: ShadowLayer) => void;
  onDelete: (id: string) => void;
}

export const ShadowLayerCard: React.FC<ShadowLayerCardProps> = ({
  layer,
  index,
  canDelete,
  onUpdate,
  onDelete,
}) => {
  const handleChange = (field: keyof ShadowLayer, val: string | number | boolean) => {
    onUpdate({ ...layer, [field]: val });
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all space-y-3 ${
        layer.enabled
          ? 'bg-surface-container-low border-outline-variant/60 shadow-xs'
          : 'bg-surface-container/40 border-outline-variant/30 opacity-60'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleChange('enabled', !layer.enabled)}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title={layer.enabled ? 'Disable layer' : 'Enable layer'}
          >
            {layer.enabled ? (
              <Eye className="w-4 h-4 text-primary" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
          <span className="text-xs font-bold text-on-surface uppercase">Layer #{index + 1}</span>
          {layer.inset && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">
              INSET
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-outline cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layer.inset}
              onChange={(e) => handleChange('inset', e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>Inset</span>
          </label>

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(layer.id)}
              className="p-1 text-outline hover:text-error rounded-lg hover:bg-surface-container transition-colors"
              title="Delete layer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* X Offset */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-outline font-medium">
            <span>X Offset</span>
            <span className="font-mono">{layer.x}px</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={layer.x}
            onChange={(e) => handleChange('x', Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
          />
        </div>

        {/* Y Offset */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-outline font-medium">
            <span>Y Offset</span>
            <span className="font-mono">{layer.y}px</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={layer.y}
            onChange={(e) => handleChange('y', Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
          />
        </div>

        {/* Blur */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-outline font-medium">
            <span>Blur</span>
            <span className="font-mono">{layer.blur}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={layer.blur}
            onChange={(e) => handleChange('blur', Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
          />
        </div>

        {/* Spread */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-outline font-medium">
            <span>Spread</span>
            <span className="font-mono">{layer.spread}px</span>
          </div>
          <input
            type="range"
            min={-50}
            max={50}
            value={layer.spread}
            onChange={(e) => handleChange('spread', Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Color & Opacity Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-outline-variant/40">
        {/* Color picker */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={layer.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-7 h-7 rounded-lg border border-outline-variant cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={layer.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="px-2 py-1 text-xs font-mono rounded-lg border border-outline-variant bg-surface-container text-on-surface w-24"
          />
        </div>

        {/* Opacity */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-outline font-medium">
            <span>Opacity</span>
            <span className="font-mono">{layer.opacity}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={layer.opacity}
            onChange={(e) => handleChange('opacity', Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
