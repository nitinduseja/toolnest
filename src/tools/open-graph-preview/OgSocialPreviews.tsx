import React, { useState } from 'react';
import { Globe, Share2, ExternalLink, Sparkles } from 'lucide-react';
import { MetaTagsConfig, SocialPreviewPlatform } from './types';

interface OgSocialPreviewsProps {
  config: MetaTagsConfig;
}

export const OgSocialPreviews: React.FC<OgSocialPreviewsProps> = ({ config }) => {
  const [platform, setPlatform] = useState<SocialPreviewPlatform>('twitter');

  const getHostname = (urlStr: string) => {
    try {
      if (!urlStr) return 'example.com';
      const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
      return parsed.hostname;
    } catch {
      return 'example.com';
    }
  };

  const domain = getHostname(config.url);
  const fallbackImg =
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop';
  const displayImage = config.image || fallbackImg;

  const platforms: { id: SocialPreviewPlatform; label: string }[] = [
    { id: 'twitter', label: 'Twitter / X' },
    { id: 'google', label: 'Google SERP' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'discord', label: 'Discord' },
    { id: 'slack', label: 'Slack' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-4">
      {/* Platform Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-outline-variant/40">
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-wider">
          <Share2 className="w-3.5 h-3.5 text-primary" />
          <span>Social Platform Preview</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                platform === p.id
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mockup Canvas */}
      <div className="p-4 sm:p-6 rounded-2xl bg-surface-container border border-outline-variant/50 flex flex-col items-center justify-center min-h-[320px]">
        {/* Google SERP */}
        {platform === 'google' && (
          <div className="w-full max-w-xl p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1 font-sans text-left">
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px]">
                <Globe className="w-3 h-3 text-zinc-500" />
              </div>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {config.siteName || domain}
              </span>
              <span className="text-[11px] text-zinc-400">https://{domain} › ...</span>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer truncate">
              {config.title || 'Page Title'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {config.description ||
                'Page description previewing how it will be displayed on Google Search engine results pages.'}
            </p>
          </div>
        )}

        {/* Twitter / X */}
        {platform === 'twitter' && (
          <div className="w-full max-w-lg rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-xs font-sans text-left">
            {config.twitterCard === 'summary_large_image' ? (
              <div>
                <div className="relative aspect-16/9 w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                  <img
                    src={displayImage}
                    alt="Twitter Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImg;
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[11px] text-white font-mono">
                    {domain}
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {config.title || 'Page Title'}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {config.description || 'Page description snippet for Twitter / X summary card.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 flex items-center gap-3">
                <img
                  src={displayImage}
                  alt="Thumbnail"
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] text-zinc-500 uppercase">{domain}</span>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {config.title || 'Page Title'}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {config.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Facebook */}
        {platform === 'facebook' && (
          <div className="w-full max-w-lg rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs font-sans text-left">
            <div className="aspect-1.91/1 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <img
                src={displayImage}
                alt="Facebook Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3.5 space-y-1 bg-zinc-50 dark:bg-zinc-950">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                {domain}
              </span>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                {config.title || 'Page Title'}
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {config.description}
              </p>
            </div>
          </div>
        )}

        {/* LinkedIn */}
        {platform === 'linkedin' && (
          <div className="w-full max-w-lg rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs font-sans text-left">
            <div className="aspect-1.91/1 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <img
                src={displayImage}
                alt="LinkedIn Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3.5 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                {config.title || 'Page Title'}
              </h4>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <span>{domain}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </span>
            </div>
          </div>
        )}

        {/* Discord */}
        {platform === 'discord' && (
          <div className="w-full max-w-lg rounded-lg border-l-4 border-indigo-500 bg-[#2b2d31] text-zinc-200 p-4 shadow-md font-sans text-left space-y-2">
            <span className="text-[11px] text-zinc-400 font-medium">
              {config.siteName || domain}
            </span>
            <h4 className="text-sm font-bold text-[#00a8fc] hover:underline cursor-pointer">
              {config.title || 'Page Title'}
            </h4>
            <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
              {config.description}
            </p>
            <div className="rounded-lg overflow-hidden max-h-52 w-full mt-2">
              <img src={displayImage} alt="Discord Embed" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Slack */}
        {platform === 'slack' && (
          <div className="w-full max-w-lg rounded-lg border-l-4 border-amber-500 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 p-3.5 shadow-xs font-sans text-left space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="font-bold">{config.siteName || domain}</span>
            </div>
            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              {config.title || 'Page Title'}
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {config.description}
            </p>
            <div className="w-36 h-24 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 mt-2">
              <img
                src={displayImage}
                alt="Slack Thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
