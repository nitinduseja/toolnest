import React from 'react';
import { Download, Copy, Check } from 'lucide-react';

interface QrPreviewCardProps {
  size: number;
  dataUrl: string;
  svgString: string;
  copiedSvg: boolean;
  handleDownloadPng: () => void;
  handleDownloadSvg: () => void;
  handleCopySvg: () => void;
}

export const QrPreviewCard: React.FC<QrPreviewCardProps> = ({
  size,
  dataUrl,
  svgString,
  copiedSvg,
  handleDownloadPng,
  handleDownloadSvg,
  handleCopySvg,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col items-center justify-between text-center space-y-4">
      <div className="w-full flex items-center justify-between text-xs text-outline">
        <span className="font-semibold uppercase">QR Code Preview</span>
        <span className="font-mono text-[11px]">
          {size}x{size}
        </span>
      </div>

      <div className="p-3 bg-white rounded-xl shadow-md border border-outline-variant/60">
        {dataUrl ? (
          <img src={dataUrl} alt="Generated QR Code" className="w-48 h-48 object-contain rounded" />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center text-zinc-400 text-xs italic">
            Enter payload to render
          </div>
        )}
      </div>

      <div className="w-full space-y-2">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={!dataUrl}
          className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 shadow-sm transition-opacity disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          <span>Download PNG Image</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={!svgString}
            className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Vector SVG</span>
          </button>

          <button
            type="button"
            onClick={handleCopySvg}
            disabled={!svgString}
            className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors disabled:opacity-40"
          >
            {copiedSvg ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedSvg ? 'Copied' : 'Copy SVG'}</span>
          </button>
        </div>

        <p className="text-[11px] text-outline pt-1">
          Generated locally via Canvas &amp; SVG vector rendering. Zero external servers.
        </p>
      </div>
    </div>
  );
};
