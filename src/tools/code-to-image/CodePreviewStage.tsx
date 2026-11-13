
import React, { useEffect, useState } from 'react';

import {
  Copy,
  Check,
  Image as ImageIcon,
  FileCode,
  AlertCircle,
} from 'lucide-react';

import { CodeCardConfig } from './types';
import { generateCardSvg } from './svgGenerator';

import {
  downloadPngFromSvg,
  copyPngToClipboard,
} from './canvasRenderer';

import { downloadFile } from '@/lib/downloads';
import { copyToClipboard } from '@/lib/clipboard';

interface CodePreviewStageProps {
  config: CodeCardConfig;
}

type FeedbackType = 'png' | 'svg' | 'download' | null;

function createFilename(title: string, extension: string): string {
  const base = title
    .replace(/\.[a-zA-Z0-9]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 100);

  return `${base || 'code-snippet'}.${extension}`;
}

export const CodePreviewStage: React.FC<CodePreviewStageProps> = ({
  config,
}) => {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [error, setError] = useState('');

  const svgMarkup = generateCardSvg(config);

  useEffect(() => {
    if (!feedback) return;

    const timer = window.setTimeout(() => {
      setFeedback(null);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleCopyPng = async () => {
    setError('');

    try {
      const success = await copyPngToClipboard(svgMarkup);

      if (success) {
        setFeedback('png');
      } else {
        setError(
          'PNG copying is not supported by this browser or permission was denied.'
        );
      }
    } catch {
      setError('Unable to copy PNG.');
    }
  };

  const handleCopySvg = async () => {
    setError('');

    try {
      const success = await copyToClipboard(svgMarkup);

      if (success) {
        setFeedback('svg');
      } else {
        setError('Unable to copy SVG.');
      }
    } catch {
      setError('Unable to copy SVG.');
    }
  };

  const handleDownloadPng = async () => {
    setError('');

    try {
      const filename = createFilename(config.title, 'png');

      const success = await downloadPngFromSvg(
        svgMarkup,
        filename
      );

      if (success) {
        setFeedback('download');
      } else {
        setError('PNG download failed. Please try again.');
      }
    } catch {
      setError('PNG download failed.');
    }
  };

  const handleDownloadSvg = async () => {
    setError('');

    try {
      const filename = createFilename(config.title, 'svg');

      const success = await downloadFile(
        new Blob([svgMarkup], {
          type: 'image/svg+xml;charset=utf-8',
        }),
        {
          filename,
          mimeType: 'image/svg+xml;charset=utf-8',
        }
      );

      if (success) {
        setFeedback('download');
      } else {
        setError('SVG download failed.');
      }
    } catch {
      setError('SVG download failed.');
    }
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Live Preview */}
      <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl border border-outline-variant bg-surface-container-low min-h-[380px] overflow-auto shadow-inner">

        <div
          data-testid="code-card-canvas"
          className="max-w-full overflow-auto rounded-xl transition-all duration-200"
          dangerouslySetInnerHTML={{
            __html: svgMarkup,
          }}
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
            {feedback === 'png' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}

            <span>
              {feedback === 'png' ? 'Copied PNG!' : 'Copy PNG'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleCopySvg}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container text-xs font-medium text-on-surface transition-colors cursor-pointer"
          >
            {feedback === 'svg' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}

            <span>
              {feedback === 'svg' ? 'Copied SVG!' : 'Copy SVG'}
            </span>
          </button>

        </div>
      </div>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 text-xs text-red-500"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {feedback === 'download' && (
        <p role="status" className="text-xs text-emerald-500">
          Download completed successfully.
        </p>
      )}
    </div>
  );
};
