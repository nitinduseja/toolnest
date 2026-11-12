import React, { useState } from 'react';
import { Copy, Check, Image as ImageIcon, FileCode } from 'lucide-react';
import { CodeCardConfig } from './types';
import { generateCardSvg } from './codeImageLogic';
import { downloadPngFromSvg, copyPngToClipboard } from './canvasRenderer';
import { downloadFile } from '@/lib/downloads';
import { copyToClipboard } from '@/lib/clipboard';

interface CodePreviewStageProps {
  config: CodeCardConfig;
}

export const CodePreviewStage: React.FC<CodePreviewStageProps> = ({ config }) => {
  const [copiedPng, setCopiedPng] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const svgMarkup = generateCardSvg(config);

  const handleCopyPng = async () => {
    const success = await copyPngToClipboard(svgMarkup);
    if (success) {
      setCopiedPng(true);
      setTimeout(() => setCopiedPng(false), 2000);
    }
  };

  const handleCopySvg = async () => {
    const success = await copyToClipboard(svgMarkup);
    if (success) {
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    }
  };

  const handleDownloadPng = async () => {
    const filename = `${config.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'code-snippet'}.png`;
    await downloadPngFromSvg(svgMarkup, filename);
  };

  const handleDownloadSvg = () => {
    const filename = `${config.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'code-snippet'}.svg`;
    downloadFile(svgMarkup, { filename, mimeType: 'image/svg+xml;charset=utf-8' });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Live Preview Container */}
      <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl border border-outline-variant bg-surface-container-low min-h-[380px] overflow-auto shadow-inner">
        <div
          data-testid="code-card-canvas"
          className="max-w-full overflow-auto rounded-xl transition-all duration-200"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 shadow-2xs transition-opacity cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSvg}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container text-xs font-medium text-on-surface transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Download SVG</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyPng}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container text-xs font-medium text-on-surface transition-colors cursor-pointer"
          >
            {copiedPng ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedPng ? 'Copied PNG!' : 'Copy PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopySvg}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container text-xs font-medium text-on-surface transition-colors cursor-pointer"
          >
            {copiedSvg ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedSvg ? 'Copied SVG!' : 'Copy SVG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
