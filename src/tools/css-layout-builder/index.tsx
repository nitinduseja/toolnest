import React, { useState, useMemo } from 'react';
import { Layout, Copy, Check, RotateCcw, Code } from 'lucide-react';
import { LayoutMode, FlexConfig, GridConfig, LayoutItem, LayoutPreset } from './types';
import {
  generateFlexCss,
  generateFlexTailwind,
  generateGridCss,
  generateGridTailwind,
} from './layoutLogic';
import { LayoutPresetsBar } from './LayoutPresetsBar';
import { FlexControls } from './FlexControls';
import { GridControls } from './GridControls';
import { LayoutPreviewCanvas } from './LayoutPreviewCanvas';
import { copyToClipboard } from '@/lib/clipboard';

const DEFAULT_FLEX: FlexConfig = {
  direction: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  wrap: 'wrap',
  gap: 16,
};

const DEFAULT_GRID: GridConfig = {
  columns: 3,
  gap: 16,
  justifyItems: 'stretch',
  alignItems: 'stretch',
};

const createItems = (count: number): LayoutItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}-${Date.now()}`,
    label: `Item ${i + 1}`,
  }));
};

export const CssLayoutBuilderTool: React.FC = () => {
  const [mode, setMode] = useState<LayoutMode>('flex');
  const [flexConfig, setFlexConfig] = useState<FlexConfig>(DEFAULT_FLEX);
  const [gridConfig, setGridConfig] = useState<GridConfig>(DEFAULT_GRID);
  const [items, setItems] = useState<LayoutItem[]>(() => createItems(4));
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);
  const [codeTab, setCodeTab] = useState<'css' | 'tailwind'>('css');
  const [copied, setCopied] = useState(false);

  const generatedCode = useMemo(() => {
    if (mode === 'flex') {
      return codeTab === 'css' ? generateFlexCss(flexConfig) : generateFlexTailwind(flexConfig);
    }
    return codeTab === 'css' ? generateGridCss(gridConfig) : generateGridTailwind(gridConfig);
  }, [mode, flexConfig, gridConfig, codeTab]);

  const handleSelectPreset = (preset: LayoutPreset) => {
    setActivePresetId(preset.id);
    setMode(preset.mode);
    if (preset.flex) setFlexConfig(preset.flex);
    if (preset.grid) setGridConfig(preset.grid);
    setItems(createItems(preset.itemsCount));
  };

  const handleAddItem = () => {
    setActivePresetId(undefined);
    const nextIdx = items.length + 1;
    setItems([...items, { id: `item-${nextIdx}-${Date.now()}`, label: `Item ${nextIdx}` }]);
  };

  const handleRemoveItem = () => {
    setActivePresetId(undefined);
    if (items.length > 1) {
      setItems(items.slice(0, -1));
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(generatedCode);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">CSS Flexbox & Grid Playground</h2>
            <p className="text-xs text-outline mt-0.5">
              Interactive visual canvas to design and experiment with Flexbox and Grid layouts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="p-1 rounded-xl bg-surface-container border border-outline-variant/60 flex gap-1">
            <button
              type="button"
              onClick={() => {
                setActivePresetId(undefined);
                setMode('flex');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                mode === 'flex'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Flexbox
            </button>
            <button
              type="button"
              onClick={() => {
                setActivePresetId(undefined);
                setMode('grid');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                mode === 'grid'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              CSS Grid
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setFlexConfig(DEFAULT_FLEX);
              setGridConfig(DEFAULT_GRID);
              setItems(createItems(4));
              setActivePresetId(undefined);
            }}
            className="p-1.5 text-xs text-outline hover:text-on-surface rounded-xl border border-outline-variant hover:bg-surface-container transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Presets Bar */}
      <LayoutPresetsBar onSelectPreset={handleSelectPreset} activeId={activePresetId} />

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5">
          {mode === 'flex' ? (
            <FlexControls
              config={flexConfig}
              onChange={(c) => {
                setActivePresetId(undefined);
                setFlexConfig(c);
              }}
            />
          ) : (
            <GridControls
              config={gridConfig}
              onChange={(c) => {
                setActivePresetId(undefined);
                setGridConfig(c);
              }}
            />
          )}
        </div>

        {/* Canvas Column */}
        <div className="lg:col-span-7">
          <LayoutPreviewCanvas
            mode={mode}
            flexConfig={flexConfig}
            gridConfig={gridConfig}
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>

      {/* Code Output Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-wider">
            <Code className="w-3.5 h-3.5 text-primary" />
            <span>Generated {mode === 'flex' ? 'Flexbox' : 'Grid'} Code</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setCodeTab('css')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  codeTab === 'css'
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
                }`}
              >
                CSS
              </button>
              <button
                type="button"
                onClick={() => setCodeTab('tailwind')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  codeTab === 'tailwind'
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
                }`}
              >
                Tailwind
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-primary text-white shadow-xs hover:bg-primary/90 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-surface-container-highest/60 border border-outline-variant/50 font-mono text-xs text-on-surface overflow-x-auto leading-relaxed">
          {generatedCode}
        </pre>
      </div>
    </div>
  );
};

export default CssLayoutBuilderTool;
