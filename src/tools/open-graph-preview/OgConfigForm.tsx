import React, { ChangeEvent } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { MetaTagsConfig, OpenGraphType, TwitterCardType } from './types';
import { calculateTitleScore, calculateDescriptionScore } from './ogLogic';

interface OgConfigFormProps {
  config: MetaTagsConfig;
  onChange: (updated: MetaTagsConfig) => void;
}

export const OgConfigForm: React.FC<OgConfigFormProps> = ({ config, onChange }) => {
  const titleScore = calculateTitleScore(config.title);
  const descScore = calculateDescriptionScore(config.description);

  const handleChange = (field: keyof MetaTagsConfig, val: string) => {
    onChange({ ...config, [field]: val });
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleChange('image', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getMeterColor = (status: 'too-short' | 'optimal' | 'too-long') => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-500';
      case 'too-long':
        return 'bg-amber-500';
      default:
        return 'bg-zinc-400';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="og-title" className="font-bold text-on-surface uppercase tracking-wider">
            Page Title
          </label>
          <span className="font-mono text-[11px] text-outline">
            {titleScore.length}/60 chars ({titleScore.status})
          </span>
        </div>
        <input
          id="og-title"
          type="text"
          value={config.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g. Toolnest — Useful tools in one workspace"
          className="w-full px-3.5 py-2 text-xs rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40"
        />
        <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getMeterColor(titleScore.status)}`}
            style={{ width: `${Math.min(100, (titleScore.length / 60) * 100)}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="og-desc" className="font-bold text-on-surface uppercase tracking-wider">
            Description
          </label>
          <span className="font-mono text-[11px] text-outline">
            {descScore.length}/160 chars ({descScore.status})
          </span>
        </div>
        <textarea
          id="og-desc"
          rows={2}
          value={config.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="e.g. Privacy-first, local-only developer tools and generators..."
          className="w-full px-3.5 py-2 text-xs rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40 resize-y"
        />
        <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getMeterColor(descScore.status)}`}
            style={{ width: `${Math.min(100, (descScore.length / 160) * 100)}%` }}
          />
        </div>
      </div>

      {/* URL & Site Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="og-url" className="text-xs font-semibold text-outline">
            Canonical URL
          </label>
          <input
            id="og-url"
            type="text"
            value={config.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="og-sitename" className="text-xs font-semibold text-outline">
            Site Name
          </label>
          <input
            id="og-sitename"
            type="text"
            value={config.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
            placeholder="e.g. Toolnest"
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface"
          />
        </div>
      </div>

      {/* Image URL & File Upload */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="og-image" className="font-semibold text-outline">
            Image URL or Local Upload
          </label>
          <label className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer">
            <Upload className="w-3 h-3" />
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-surface-container border border-outline-variant/60 text-outline">
            <ImageIcon className="w-4 h-4" />
          </div>
          <input
            id="og-image"
            type="text"
            value={config.image}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://example.com/og-image.png"
            className="w-full px-3 py-1.5 text-xs font-mono rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface truncate"
          />
        </div>
      </div>

      {/* Content Type & Twitter Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="og-type" className="text-xs font-semibold text-outline">
            Content Type (og:type)
          </label>
          <select
            id="og-type"
            value={config.contentType}
            onChange={(e) => handleChange('contentType', e.target.value as OpenGraphType)}
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface"
          >
            <option value="website">website</option>
            <option value="article">article</option>
            <option value="product">product</option>
            <option value="profile">profile</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="twitter-card" className="text-xs font-semibold text-outline">
            Twitter Card Type
          </label>
          <select
            id="twitter-card"
            value={config.twitterCard}
            onChange={(e) => handleChange('twitterCard', e.target.value as TwitterCardType)}
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface"
          >
            <option value="summary_large_image">summary_large_image (Large Banner)</option>
            <option value="summary">summary (Small Thumbnail)</option>
          </select>
        </div>
      </div>

      {/* Author & Twitter Handle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="og-author" className="text-xs font-semibold text-outline">
            Author / Creator
          </label>
          <input
            id="og-author"
            type="text"
            value={config.author}
            onChange={(e) => handleChange('author', e.target.value)}
            placeholder="Author Name"
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="twitter-handle" className="text-xs font-semibold text-outline">
            Twitter / X Handle
          </label>
          <input
            id="twitter-handle"
            type="text"
            value={config.twitterHandle}
            onChange={(e) => handleChange('twitterHandle', e.target.value)}
            placeholder="@username"
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface"
          />
        </div>
      </div>
    </div>
  );
};
