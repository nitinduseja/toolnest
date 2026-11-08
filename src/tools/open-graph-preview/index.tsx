import React, { useState, useMemo } from 'react';
import { Share2, Copy, Check, Download, Code, RotateCcw } from 'lucide-react';
import { MetaTagsConfig, OgPreset } from './types';
import { generateMetaHtml, OG_PRESETS } from './ogLogic';
import { OgPresetsBar } from './OgPresetsBar';
import { OgConfigForm } from './OgConfigForm';
import { OgSocialPreviews } from './OgSocialPreviews';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

export const OpenGraphPreviewTool: React.FC = () => {
  const [config, setConfig] = useState<MetaTagsConfig>(OG_PRESETS[0].config);
  const [activePresetId, setActivePresetId] = useState<string | undefined>('saas-landing');
  const [includeJsonLd, setIncludeJsonLd] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatedHtml = useMemo(
    () => generateMetaHtml(config, includeJsonLd),
    [config, includeJsonLd]
  );

  const handleSelectPreset = (preset: OgPreset) => {
    setActivePresetId(preset.id);
    setConfig(preset.config);
  };

  const handleFormChange = (newConfig: MetaTagsConfig) => {
    setActivePresetId(undefined);
    setConfig(newConfig);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(generatedHtml);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(generatedHtml, { filename: 'meta-tags.html', mimeType: 'text/html' });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Meta Tags & Open Graph (OG) Previewer
            </h2>
            <p className="text-xs text-outline mt-0.5">
              Live preview and generate meta tags for Google, Twitter/X, Facebook, LinkedIn,
              Discord, and Slack.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelectPreset(OG_PRESETS[0])}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-outline-variant hover:bg-surface-container text-outline hover:text-on-surface transition-all"
            title="Reset to default preset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied HTML!' : 'Copy Tags'}</span>
          </button>
        </div>
      </div>

      {/* Presets */}
      <OgPresetsBar onSelectPreset={handleSelectPreset} activeId={activePresetId} />

      {/* Main Workspace: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: 5 cols on lg */}
        <div className="lg:col-span-5">
          <OgConfigForm config={config} onChange={handleFormChange} />
        </div>

        {/* Right Preview: 7 cols on lg */}
        <div className="lg:col-span-7">
          <OgSocialPreviews config={config} />
        </div>
      </div>

      {/* Generated Meta Tags Drawer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-wider">
            <Code className="w-3.5 h-3.5 text-primary" />
            <span>Generated HTML &lt;head&gt; Meta Tags</span>
          </div>

          <label className="flex items-center gap-2 text-xs text-outline cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeJsonLd}
              onChange={(e) => setIncludeJsonLd(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>Include JSON-LD Schema</span>
          </label>
        </div>

        <pre className="p-4 rounded-xl bg-surface-container-highest/60 border border-outline-variant/50 font-mono text-xs text-on-surface overflow-x-auto leading-relaxed">
          {generatedHtml}
        </pre>
      </div>
    </div>
  );
};

export default OpenGraphPreviewTool;
