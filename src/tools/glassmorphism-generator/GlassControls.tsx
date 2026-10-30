import React from 'react';
import { GlassConfig } from './glassmorphismLogic';

interface GlassControlsProps {
  config: GlassConfig;
  onUpdate: (key: keyof GlassConfig, val: number | string) => void;
}

export const GlassControls: React.FC<GlassControlsProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant">
      <h2 className="text-xs font-semibold text-outline uppercase tracking-wider">
        Glass & Shadow Properties
      </h2>

      {/* Blur Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-on-surface font-medium">Backdrop Blur</span>
          <span className="font-mono text-outline">{config.blur}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="40"
          value={config.blur}
          onChange={(e) => onUpdate('blur', Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Background Opacity & Color */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-on-surface font-medium">Background Opacity</span>
          <span className="font-mono text-outline">{Math.round(config.bgOpacity * 100)}%</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.bgOpacity}
            onChange={(e) => onUpdate('bgOpacity', Number(e.target.value))}
            className="w-full accent-primary"
          />
          <input
            type="color"
            value={config.bgColor}
            onChange={(e) => onUpdate('bgColor', e.target.value)}
            className="w-8 h-8 rounded border border-outline-variant cursor-pointer p-0.5 bg-transparent"
            title="Glass Tint Color"
          />
        </div>
      </div>

      {/* Border Width & Opacity */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-on-surface font-medium">Border Width & Opacity</span>
          <span className="font-mono text-outline">
            {config.borderWidth}px • {Math.round(config.borderOpacity * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={config.borderWidth}
            onChange={(e) => onUpdate('borderWidth', Number(e.target.value))}
            className="w-24 accent-primary"
            title="Border Width"
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.borderOpacity}
            onChange={(e) => onUpdate('borderOpacity', Number(e.target.value))}
            className="w-full accent-primary"
            title="Border Opacity"
          />
          <input
            type="color"
            value={config.borderColor}
            onChange={(e) => onUpdate('borderColor', e.target.value)}
            className="w-8 h-8 rounded border border-outline-variant cursor-pointer p-0.5 bg-transparent"
            title="Border Color"
          />
        </div>
      </div>

      {/* Border Radius Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-on-surface font-medium">Border Radius</span>
          <span className="font-mono text-outline">{config.borderRadius}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="48"
          value={config.borderRadius}
          onChange={(e) => onUpdate('borderRadius', Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Elevation Shadow Blur & Opacity */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-on-surface font-medium">Elevation Shadow</span>
          <span className="font-mono text-outline">
            {config.shadowBlur}px blur • {Math.round(config.shadowOpacity * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="60"
            value={config.shadowBlur}
            onChange={(e) => onUpdate('shadowBlur', Number(e.target.value))}
            className="w-full accent-primary"
            title="Shadow Blur"
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.shadowOpacity}
            onChange={(e) => onUpdate('shadowOpacity', Number(e.target.value))}
            className="w-28 accent-primary"
            title="Shadow Opacity"
          />
          <input
            type="color"
            value={config.shadowColor}
            onChange={(e) => onUpdate('shadowColor', e.target.value)}
            className="w-8 h-8 rounded border border-outline-variant cursor-pointer p-0.5 bg-transparent"
            title="Shadow Color"
          />
        </div>
      </div>
    </div>
  );
};
