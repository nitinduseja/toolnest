import React, { useState } from 'react';
import { GradientConfig, GradientType, RadialShape } from './types';
import { createDefaultConfig, createRandomConfig } from './gradientLogic';
import { GradientPresetsBar } from './GradientPresetsBar';
import { ColorStopControls } from './ColorStopControls';
import { GradientPreviewStage } from './GradientPreviewStage';
import { Icon } from '@/components/atoms/Icon';

export const GradientGenerator: React.FC = () => {
  const [config, setConfig] = useState<GradientConfig>(createDefaultConfig());

  const setType = (type: GradientType) => {
    setConfig((prev) => ({ ...prev, type }));
  };

  const setAngle = (angle: number) => {
    setConfig((prev) => ({ ...prev, angle }));
  };

  const setRadialShape = (radialShape: RadialShape) => {
    setConfig((prev) => ({ ...prev, radialShape }));
  };

  const handleRandomize = () => {
    setConfig(createRandomConfig());
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon name="Palette" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              CSS Gradient & Mesh Studio
            </h1>
            <p className="text-xs text-text-secondary sm:text-sm">
              Design multi-stop linear, radial, and conic gradients with live visual preview and
              instant CSS / Tailwind export.
            </p>
          </div>
        </div>
      </div>

      {/* Presets Bar */}
      <GradientPresetsBar onSelectPreset={setConfig} />

      {/* Main Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controls Column */}
        <div className="flex flex-col gap-4 lg:col-span-6">
          {/* Gradient Type & Geometry */}
          <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-surface-primary/60 p-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Gradient Type
              </span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'conic'] as GradientType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${
                      config.type === t
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'border border-border/50 bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Specific Controls */}
            {config.type !== 'radial' ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="gradient-angle"
                    className="text-xs font-semibold text-text-secondary"
                  >
                    Angle ({config.angle}°)
                  </label>
                  <button
                    type="button"
                    onClick={() => setAngle((config.angle + 45) % 360)}
                    className="text-xs text-primary hover:underline"
                  >
                    +45°
                  </button>
                </div>
                <input
                  id="gradient-angle"
                  type="range"
                  min={0}
                  max={360}
                  value={config.angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-text-secondary">Radial Shape</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['circle', 'ellipse'] as RadialShape[]).map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => setRadialShape(shape)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                        config.radialShape === shape
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border/50 bg-surface-secondary text-text-secondary'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color Stops Controls */}
          <ColorStopControls
            stops={config.stops}
            onChange={(stops) => setConfig((prev) => ({ ...prev, stops }))}
          />
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-6">
          <GradientPreviewStage config={config} onRandomize={handleRandomize} />
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
