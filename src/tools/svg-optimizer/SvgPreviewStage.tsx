import React, { useState } from 'react';
import { Eye, Code, Copy, Check, Download } from 'lucide-react';
import { SvgOptimizationStats } from './types';

export interface SvgPreviewStageProps {
  rawSvg: string;
  optimizedSvg: string;
  stats: SvgOptimizationStats;
  onDownload: () => void;
}

export const SvgPreviewStage: React.FC<SvgPreviewStageProps> = ({
  rawSvg,
  optimizedSvg,
  stats,
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rawDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(rawSvg)}`;
  const optDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(optimizedSvg)}`;

  return (
    <div className="rounded-2xl border border-outline-variant overflow-hidden bg-surface-container-low space-y-0">
      {/* Stage Header */}
      <div className="p-3.5 bg-surface-container border-b border-outline-variant flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'code'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Optimized Code</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-xs font-semibold text-on-surface cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-primary" />
            )}
            <span>{copied ? 'Copied' : 'Copy SVG'}</span>
          </button>

          <button
            type="button"
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Stage Body */}
      {activeTab === 'visual' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/60 min-h-[280px]">
          {/* Raw Render */}
          <div className="p-4 flex flex-col items-center justify-center space-y-2 bg-surface-container-lowest">
            <span className="text-[11px] font-semibold text-outline">
              Raw Original ({stats.originalBytes.toLocaleString()} bytes)
            </span>
            <div className="max-w-[220px] max-h-[220px] p-2 flex items-center justify-center">
              <img
                src={rawDataUrl}
                alt="Raw SVG"
                className="max-w-full max-h-[200px] object-contain"
              />
            </div>
          </div>

          {/* Optimized Render */}
          <div className="p-4 flex flex-col items-center justify-center space-y-2 bg-surface-container-lowest">
            <span className="text-[11px] font-semibold text-primary">
              Optimized Output ({stats.optimizedBytes.toLocaleString()} bytes • -
              {stats.savingsPercentage}%)
            </span>
            <div className="max-w-[220px] max-h-[220px] p-2 flex items-center justify-center">
              <img
                src={optDataUrl}
                alt="Optimized SVG"
                className="max-w-full max-h-[200px] object-contain"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-surface-container-lowest overflow-x-auto max-h-[380px]">
          <pre className="text-xs font-mono text-on-surface whitespace-pre-wrap break-all leading-relaxed">
            {optimizedSvg}
          </pre>
        </div>
      )}
    </div>
  );
};
