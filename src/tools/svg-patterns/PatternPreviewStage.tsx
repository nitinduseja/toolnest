import React, { useState } from 'react';
import { PatternConfig, PatternExportFormat } from './types';
import {
  generatePatternSvg,
  generateDataUri,
  generateCssBackground,
  generateTailwindClass,
} from './patternLogic';
import { Icon } from '@/components/atoms/Icon';

interface PatternPreviewStageProps {
  config: PatternConfig;
}

export const PatternPreviewStage: React.FC<PatternPreviewStageProps> = ({ config }) => {
  const [format, setFormat] = useState<PatternExportFormat>('css');
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const dataUri = generateDataUri(config);
  const svgCode = generatePatternSvg(config);

  const getExportCode = () => {
    switch (format) {
      case 'svg':
        return svgCode;
      case 'data-uri':
        return dataUri;
      case 'tailwind':
        return generateTailwindClass(config);
      default:
        return generateCssBackground(config);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pattern-${config.type}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Live Repeating Preview Canvas */}
      <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-surface-secondary shadow-lg sm:h-80">
        <div
          data-testid="pattern-canvas"
          className="absolute inset-0 h-full w-full"
          style={{
            backgroundImage: `url("${dataUri}")`,
            backgroundColor: config.isTransparentBg ? 'transparent' : config.bgColor,
          }}
        />

        {/* Optional UI Mockup Overlay Card */}
        {showOverlay && (
          <div className="relative z-10 mx-4 max-w-sm rounded-xl border border-white/20 bg-black/50 p-5 text-white backdrop-blur-md shadow-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Live Preview Overlay
            </span>
            <h4 className="mt-1 text-base font-bold">Hero Banner Card</h4>
            <p className="mt-1 text-xs text-white/80">
              Previewing repeatable SVG pattern tile under glassmorphic cards and typography.
            </p>
          </div>
        )}

        {/* Overlay toggle */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-lg bg-black/60 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setShowOverlay(!showOverlay)}
            className="rounded px-2.5 py-1 text-xs font-medium text-white transition hover:bg-white/20"
          >
            {showOverlay ? 'Hide Overlay' : 'Show Overlay'}
          </button>
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="flex items-center gap-1 rounded bg-white/20 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/30"
          >
            <Icon name="Download" className="h-3 w-3" />
            <span>SVG File</span>
          </button>
        </div>
      </div>

      {/* Code Export Box */}
      <div className="rounded-xl border border-border/40 bg-surface-primary/60 p-4">
        <div className="flex items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-1.5">
            {(['css', 'tailwind', 'svg', 'data-uri'] as PatternExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`rounded-md px-3 py-1 text-xs font-semibold uppercase transition ${
                  format === fmt
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-text-secondary hover:bg-surface-secondary'
                }`}
              >
                {fmt === 'data-uri' ? 'URI' : fmt}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            <Icon name={copied ? 'Check' : 'Copy'} className="h-3.5 w-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="max-h-36 overflow-auto rounded-lg bg-surface-secondary/70 p-3 font-mono text-xs text-text-primary">
          <code>{getExportCode()}</code>
        </pre>
      </div>
    </div>
  );
};
