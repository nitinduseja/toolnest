import React, { useState } from 'react';
import { Camera } from 'lucide-react';

import { CodeCardConfig } from './types';
import { createDefaultConfig } from './themeConfig';

import { CodeControls } from './CodeControls';
import { CodePresetsBar } from './CodePresetsBar';
import { CodePreviewStage } from './CodePreviewStage';

export const CodeToImage: React.FC = () => {
  const [config, setConfig] = useState<CodeCardConfig>(createDefaultConfig());

  const handleApplyPreset = (partial: Partial<CodeCardConfig>) => {
    setConfig((previous) => ({
      ...previous,
      ...partial,

      // Explicitly preserve user content.
      code: previous.code,
      title: previous.title,
      language: previous.language,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-2xs">
            <Camera className="w-5 h-5 text-primary" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-on-surface">
              Code Screenshot &amp; Card Studio
            </h1>

            <p className="text-xs sm:text-sm text-on-surface-variant">
              Generate presentation-ready code snippet cards with themes, window headers, gradient
              backgrounds, and PNG/SVG export.
            </p>
          </div>
        </div>
      </div>

      {/* Presets */}
      <CodePresetsBar onSelect={handleApplyPreset} />

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <CodeControls config={config} onChange={setConfig} />
        </div>

        <div className="lg:col-span-7">
          <CodePreviewStage config={config} />
        </div>
      </div>
    </div>
  );
};

export default CodeToImage;
