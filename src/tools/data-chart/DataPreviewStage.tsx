import React, { useState, useEffect } from 'react';
import { Copy, Check, Image as ImageIcon, FileCode } from 'lucide-react';
import { AggregatedPoint, ChartConfig } from './types';
import { generateChartSvg } from './svgChartRenderer';

interface DataPreviewStageProps {
  points: AggregatedPoint[];
  config: ChartConfig;
}

export const DataPreviewStage: React.FC<DataPreviewStageProps> = ({ points, config }) => {
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const svgMarkup = generateChartSvg(points, config, isDark);

  const handleCopySvg = () => {
    navigator.clipboard.writeText(svgMarkup);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title || 'chart'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    const img = new Image();
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1600; // 2x retina
      canvas.height = 900;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `${config.title || 'chart'}.png`;
            a.click();
            URL.revokeObjectURL(pngUrl);
          }
        }, 'image/png');
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-on-surface">
          Chart Preview ({points.length} data points)
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySvg}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-on-surface bg-surface hover:bg-surface-container-high border border-outline-variant rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? 'Copied' : 'Copy SVG'}
          </button>
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-on-surface bg-surface hover:bg-surface-container-high border border-outline-variant rounded-lg transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-sky-500" />
            SVG
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-on-primary bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            PNG (2x)
          </button>
        </div>
      </div>

      <div
        className="w-full aspect-[16/9] max-h-[480px] rounded-xl overflow-hidden shadow-2xl border border-outline-variant bg-surface flex items-center justify-center p-2"
        data-testid="chart-svg-container"
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
    </div>
  );
};
