import React, { useState, useMemo } from 'react';
import { Sparkles, Copy, Check, Download, RotateCcw, RefreshCw, FileCode } from 'lucide-react';
import {
  FieldConfig,
  PresetSchema,
  generateMockDataset,
  exportToJson,
  exportToCsv,
  getPresetSchemas,
} from './mockDataLogic';
import { SchemaEditor } from './SchemaEditor';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

const ROW_COUNTS = [5, 10, 25, 50, 100];

export const MockDataGeneratorTool: React.FC = () => {
  const presets = useMemo(() => getPresetSchemas(), []);
  const [fields, setFields] = useState<FieldConfig[]>(presets[0].fields);
  const [activePreset, setActivePreset] = useState<string | null>(presets[0].name);
  const [count, setCount] = useState<number>(10);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [seed, setSeed] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const dataset = useMemo(() => {
    return generateMockDataset(fields, count, seed);
  }, [fields, count, seed]);

  const output = useMemo(() => {
    return format === 'json' ? exportToJson(dataset) : exportToCsv(dataset);
  }, [dataset, format]);

  const handleAddField = () => {
    setActivePreset(null);
    const newId = String(Date.now());
    setFields((prev) => [
      ...prev,
      { id: newId, name: `field_${prev.length + 1}`, type: 'full_name' },
    ]);
  };

  const handleRemoveField = (id: string) => {
    setActivePreset(null);
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpdateField = (id: string, updates: Partial<FieldConfig>) => {
    setActivePreset(null);
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleSelectPreset = (preset: PresetSchema) => {
    setActivePreset(preset.name);
    setFields(preset.fields);
    setSeed((s) => s + 1);
  };

  const handleReset = () => {
    setActivePreset(presets[0].name);
    setFields(presets[0].fields);
    setCount(10);
    setSeed(0);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setSeed((s) => s + 1);
    setTimeout(() => setIsRegenerating(false), 300);
  };

  const handleCopy = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const filename = format === 'json' ? 'mock-data.json' : 'mock-data.csv';
    const mimeType =
      format === 'json' ? 'application/json;charset=utf-8' : 'text/csv;charset=utf-8';
    downloadFile(output, { filename, mimeType });
  };

  return (
    <div className="space-y-6">
      {/* Notice Ribbon */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Client-Side Mock Data Engine:</strong> Generates synthetic test records in
            browser memory. Zero external API calls.
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Preset Schemas Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-outline uppercase tracking-wider">
          Templates:
        </span>
        {presets.map((preset) => {
          const isActive = activePreset === preset.name;
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-primary text-on-primary border border-primary shadow-xs font-semibold'
                  : 'bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Two Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schema & Options Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <SchemaEditor
            fields={fields}
            onAddField={handleAddField}
            onRemoveField={handleRemoveField}
            onUpdateField={handleUpdateField}
          />

          {/* Generator Controls */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                Rows Count
              </span>
              <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
                {ROW_COUNTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCount(c)}
                    className={`px-2 py-0.5 rounded-md text-xs font-semibold transition-colors ${
                      count === c
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                Format
              </span>
              <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
                <button
                  type="button"
                  onClick={() => setFormat('json')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    format === 'json'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  JSON
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    format === 'csv'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  CSV
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRegenerate}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors border border-outline-variant/60 active:scale-[0.99]"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isRegenerating ? 'rotate-180 text-primary' : ''
                }`}
              />
              <span>Regenerate Dataset</span>
            </button>
          </div>
        </div>

        {/* Live Output Column (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                Generated {format.toUpperCase()} ({count} records)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors disabled:opacity-40"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!output}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <pre className="w-full h-[520px] p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface overflow-auto">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MockDataGeneratorTool;
