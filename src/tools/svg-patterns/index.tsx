import React, { useState } from 'react';
import { PatternConfig } from './types';
import { createDefaultConfig } from './patternLogic';
import { PatternPresetsBar } from './PatternPresetsBar';
import { PatternControls } from './PatternControls';
import { PatternPreviewStage } from './PatternPreviewStage';
import { Icon } from '@/components/atoms/Icon';

export const SvgPatterns: React.FC = () => {
  const [config, setConfig] = useState<PatternConfig>(createDefaultConfig());

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon name="Layers" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              SVG Pattern & Background Generator
            </h1>
            <p className="text-xs text-text-secondary sm:text-sm">
              Design seamless repeating SVG background patterns, grids, dot matrices, and isometric
              tiles with live CSS and Tailwind export.
            </p>
          </div>
        </div>
      </div>

      {/* Presets */}
      <PatternPresetsBar onSelect={setConfig} />

      {/* Main Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <PatternControls config={config} onChange={setConfig} />
        </div>
        <div className="lg:col-span-6">
          <PatternPreviewStage config={config} />
        </div>
      </div>
    </div>
  );
};

export default SvgPatterns;
