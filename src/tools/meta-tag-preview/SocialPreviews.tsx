import React, { useState } from 'react';
import { Globe, MessageSquare, Share2, Search } from 'lucide-react';
import { MetaTagConfig, SocialPlatform } from './types';
import { extractHostname } from './metaLogic';

interface SocialPreviewsProps {
  config: MetaTagConfig;
}

export const SocialPreviews: React.FC<SocialPreviewsProps> = ({ config }) => {
  const [platform, setPlatform] = useState<SocialPlatform>('google');
  const domain = extractHostname(config.url);

  return (
    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
      {/* Platform Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-outline">
          Live Social Preview
        </span>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-outline-variant/60">
          <button
            type="button"
            onClick={() => setPlatform('google')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              platform === 'google'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('twitter')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              platform === 'twitter'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Twitter / X</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('linkedin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              platform === 'linkedin'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('discord')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              platform === 'discord'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discord</span>
          </button>
        </div>
      </div>

      {/* Preview Card Stage */}
      <div className="p-4 sm:p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-center min-h-64">
        {/* Google Preview */}
        {platform === 'google' && (
          <div className="w-full max-w-lg p-4 rounded-xl bg-surface border border-outline-variant/40 space-y-1 text-left shadow-xs">
            <div className="text-[12px] text-outline flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[9px]">
                G
              </span>
              <span className="truncate">{domain}</span>
              <span>›</span>
              <span className="truncate text-outline/80">
                {config.url.replace(/^https?:\/\/[^/]+/, '') || 'home'}
              </span>
            </div>
            <h4 className="text-base text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer line-clamp-1">
              {config.title || 'Page Title'}
            </h4>
            <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
              {config.description ||
                'Provide a meta description to see how it renders on Google SERP results.'}
            </p>
          </div>
        )}

        {/* Twitter Card */}
        {platform === 'twitter' && (
          <div className="w-full max-w-md rounded-2xl overflow-hidden border border-outline-variant/60 bg-surface shadow-xs">
            <div className="h-44 bg-surface-container-high relative overflow-hidden flex items-center justify-center">
              {config.imageUrl ? (
                <img
                  src={config.imageUrl}
                  alt={config.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-xs text-outline font-medium">No Image URL</span>
              )}
            </div>
            <div className="p-3.5 space-y-1">
              <span className="text-[11px] text-outline block">{domain}</span>
              <h4 className="text-sm font-bold text-on-surface line-clamp-1">{config.title}</h4>
              <p className="text-xs text-on-surface-variant line-clamp-2">{config.description}</p>
            </div>
          </div>
        )}

        {/* LinkedIn Preview */}
        {platform === 'linkedin' && (
          <div className="w-full max-w-md rounded-xl overflow-hidden border border-outline-variant/60 bg-surface shadow-xs">
            <div className="h-44 bg-surface-container-high relative overflow-hidden flex items-center justify-center">
              {config.imageUrl ? (
                <img
                  src={config.imageUrl}
                  alt={config.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-xs text-outline font-medium">No Image URL</span>
              )}
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="text-sm font-semibold text-on-surface line-clamp-1">{config.title}</h4>
              <span className="text-[11px] text-outline block">{domain}</span>
            </div>
          </div>
        )}

        {/* Discord Embed */}
        {platform === 'discord' && (
          <div
            className="w-full max-w-md p-3.5 rounded-lg bg-[#2f3136] text-white space-y-2 border-l-4 shadow-md"
            style={{ borderLeftColor: config.themeColor || '#5865F2' }}
          >
            <span className="text-[11px] font-semibold text-gray-400 block">
              {config.siteName || 'Site Name'}
            </span>
            <h4 className="text-sm font-bold text-blue-400 hover:underline cursor-pointer line-clamp-1">
              {config.title}
            </h4>
            <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
              {config.description}
            </p>
            {config.imageUrl && (
              <div className="h-36 rounded-md overflow-hidden bg-black/20 mt-2">
                <img
                  src={config.imageUrl}
                  alt={config.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
