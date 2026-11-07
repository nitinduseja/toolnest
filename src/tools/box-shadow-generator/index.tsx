import React, { useState, useMemo } from 'react';
import { Layers, Plus, Copy, Check, RotateCcw, Code } from 'lucide-react';
import { ShadowLayer, ShadowPreset, ShadowExportFormat } from './types';
import { buildBoxShadowCss, formatShadowCode, SHADOW_PRESETS } from './shadowLogic';
import { ShadowPresetsBar } from './ShadowPresetsBar';
import { ShadowLayerCard } from './ShadowLayerCard';
import { ShadowPreviewStage } from './ShadowPreviewStage';
import { copyToClipboard } from '@/lib/clipboard';

const createDefaultLayers = (): ShadowLayer[] => {
  return SHADOW_PRESETS[0].layers.map((l, idx) => ({
    ...l,
    id: `layer-${idx}-${Date.now()}`,
  }));
};

export const BoxShadowGeneratorTool: React.FC = () => {
  const [layers, setLayers] = useState<ShadowLayer[]>(createDefaultLayers);
  const [activePresetId, setActivePresetId] = useState<string | undefined>('soft-card');
  const [exportFormat, setExportFormat] = useState<ShadowExportFormat>('css');
  const [copied, setCopied] = useState(false);

  const boxShadowCss = useMemo(() => buildBoxShadowCss(layers), [layers]);
  const exportCode = useMemo(() => formatShadowCode(layers, exportFormat), [layers, exportFormat]);

  const handleSelectPreset = (preset: ShadowPreset) => {
    setActivePresetId(preset.id);
    setLayers(preset.layers.map((l, idx) => ({ ...l, id: `layer-${idx}-${Date.now()}` })));
  };

  const handleAddLayer = () => {
    setActivePresetId(undefined);
    const newLayer: ShadowLayer = {
      id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      x: 0,
      y: 8,
      blur: 16,
      spread: 0,
      color: '#000000',
      opacity: 15,
      inset: false,
      enabled: true,
    };
    setLayers([...layers, newLayer]);
  };

  const handleUpdateLayer = (updated: ShadowLayer) => {
    setActivePresetId(undefined);
    setLayers(layers.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleDeleteLayer = (id: string) => {
    setActivePresetId(undefined);
    setLayers(layers.filter((l) => l.id !== id));
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(exportCode);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">CSS Box Shadow & Glow Generator</h2>
            <p className="text-xs text-outline mt-0.5">
              Design multi-layered shadows, smooth elevations, and neon glows with instant CSS &
              Tailwind export.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelectPreset(SHADOW_PRESETS[0])}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-outline-variant hover:bg-surface-container text-outline hover:text-on-surface transition-all"
            title="Reset to default elevation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Presets */}
      <ShadowPresetsBar onSelectPreset={handleSelectPreset} activeId={activePresetId} />

      {/* Live Interactive Preview Stage */}
      <ShadowPreviewStage boxShadow={boxShadowCss} />

      {/* Code Export Format Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-wider">
            <Code className="w-3.5 h-3.5 text-primary" />
            <span>Generated Code</span>
          </div>

          {/* Format Tabs */}
          <div className="flex gap-1.5">
            {[
              { id: 'css' as const, label: 'CSS' },
              { id: 'tailwind' as const, label: 'Tailwind' },
              { id: 'css-var' as const, label: 'CSS Variables' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setExportFormat(f.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  exportFormat === f.id
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-3.5 rounded-xl bg-surface-container-highest/60 border border-outline-variant/50 font-mono text-xs text-on-surface overflow-x-auto leading-relaxed">
          {exportCode}
        </pre>
      </div>

      {/* Shadow Layers Header & List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Shadow Layers ({layers.length})
          </span>
          <button
            type="button"
            onClick={handleAddLayer}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Layer</span>
          </button>
        </div>

        <div className="space-y-3">
          {layers.map((layer, index) => (
            <ShadowLayerCard
              key={layer.id}
              layer={layer}
              index={index}
              canDelete={layers.length > 1}
              onUpdate={handleUpdateLayer}
              onDelete={handleDeleteLayer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoxShadowGeneratorTool;
