import React, { useState, useMemo } from 'react';
import { Copy, Check, Code2, Sparkles } from 'lucide-react';
import { MetaTagConfig } from './types';
import { DEFAULT_META_CONFIG, generateMetaHtml, calculateLengthStatus } from './metaLogic';
import { SocialPreviews } from './SocialPreviews';
import { copyToClipboard } from '@/lib/clipboard';

export const MetaTagPreviewTool: React.FC = () => {
  const [config, setConfig] = useState<MetaTagConfig>(DEFAULT_META_CONFIG);
  const [copied, setCopied] = useState<boolean>(false);

  const titleStatus = useMemo(() => calculateLengthStatus(config.title, 30, 60), [config.title]);
  const descStatus = useMemo(
    () => calculateLengthStatus(config.description, 100, 160),
    [config.description]
  );
  const metaHtml = useMemo(() => generateMetaHtml(config), [config]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(metaHtml);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">
              Open Graph &amp; SEO Meta Tag Studio
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Studio Tool
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Craft high-converting meta tags and preview real-time cards for Google, Twitter/X,
            LinkedIn, and Discord.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfig(DEFAULT_META_CONFIG)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Reset Sample</span>
        </button>
      </div>

      {/* Inputs Form */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
          Metadata Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-on-surface">Page Title</label>
              <span
                className={`text-[11px] font-mono ${
                  titleStatus.isOptimal
                    ? 'text-emerald-500'
                    : titleStatus.isTooLong
                      ? 'text-red-500'
                      : 'text-outline'
                }`}
              >
                {titleStatus.len}/60 chars
              </span>
            </div>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-on-surface"
            />
          </div>

          {/* Canonical URL */}
          <div className="space-y-1">
            <label className="font-semibold text-on-surface">Canonical URL</label>
            <input
              type="url"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-on-surface"
            />
          </div>

          {/* Description */}
          <div className="space-y-1 md:col-span-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-on-surface">Meta Description</label>
              <span
                className={`text-[11px] font-mono ${
                  descStatus.isOptimal
                    ? 'text-emerald-500'
                    : descStatus.isTooLong
                      ? 'text-red-500'
                      : 'text-outline'
                }`}
              >
                {descStatus.len}/160 chars
              </span>
            </div>
            <textarea
              rows={2}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-on-surface"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="font-semibold text-on-surface">OG Image URL (1200x630)</label>
            <input
              type="url"
              value={config.imageUrl}
              onChange={(e) => setConfig({ ...config, imageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-on-surface"
            />
          </div>

          {/* Site Name & Twitter Handle */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-semibold text-on-surface">Site Name</label>
              <input
                type="text"
                value={config.siteName}
                onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-on-surface">Twitter @Handle</label>
              <input
                type="text"
                value={config.twitterHandle}
                onChange={(e) => setConfig({ ...config, twitterHandle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-on-surface"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Social Previews Stage */}
      <SocialPreviews config={config} />

      {/* Generated HTML Tags */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-outline">
              Generated HTML Meta Tags
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied HTML!' : 'Copy Meta Tags'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface overflow-x-auto max-h-64">
          <code>{metaHtml}</code>
        </pre>
      </div>
    </div>
  );
};

export default MetaTagPreviewTool;
