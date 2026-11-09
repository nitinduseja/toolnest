import React, { useState } from 'react';
import { GradientConfig, CodeExportFormat } from './types';
import { generateGradientCss, generateTailwindClass, generateCssVariables } from './gradientLogic';
import { Icon } from '@/components/atoms/Icon';

interface GradientPreviewStageProps {
  config: GradientConfig;
  onRandomize: () => void;
}

export const GradientPreviewStage: React.FC<GradientPreviewStageProps> = ({
  config,
  onRandomize,
}) => {
  const [format, setFormat] = useState<CodeExportFormat>('css');
  const [copied, setCopied] = useState(false);
  const [aspect, setAspect] = useState<'card' | 'banner' | 'square'>('card');

  const gradientCss = generateGradientCss(config);

  const getCode = () => {
    switch (format) {
      case 'tailwind':
        return generateTailwindClass(config);
      case 'css-var':
        return generateCssVariables(config);
      default:
        return `background: ${gradientCss};`;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aspectClass =
    aspect === 'card'
      ? 'h-64 sm:h-72 w-full'
      : aspect === 'banner'
        ? 'h-40 w-full'
        : 'h-64 w-64 mx-auto';

  return (
    <div className="flex flex-col gap-4">
      {/* Visual Canvas */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-surface-secondary shadow-lg">
        <div
          data-testid="gradient-canvas"
          className={`transition-all duration-300 ${aspectClass}`}
          style={{ background: gradientCss }}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-black/40 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setAspect('card')}
            className={`rounded px-2 py-1 text-xs font-medium text-white transition ${
              aspect === 'card' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            Card
          </button>
          <button
            type="button"
            onClick={() => setAspect('banner')}
            className={`rounded px-2 py-1 text-xs font-medium text-white transition ${
              aspect === 'banner' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            Banner
          </button>
          <button
            type="button"
            onClick={() => setAspect('square')}
            className={`rounded px-2 py-1 text-xs font-medium text-white transition ${
              aspect === 'square' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            Square
          </button>
          <button
            type="button"
            onClick={onRandomize}
            title="Randomize gradient"
            className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs font-medium text-white hover:bg-white/20"
          >
            <Icon name="RefreshCw" className="h-3 w-3" />
            <span>Random</span>
          </button>
        </div>
      </div>

      {/* Code Export Box */}
      <div className="rounded-xl border border-border/40 bg-surface-primary/60 p-4">
        <div className="flex items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-1.5">
            {(['css', 'tailwind', 'css-var'] as CodeExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition ${
                  format === fmt
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:bg-surface-secondary'
                }`}
              >
                {fmt === 'css-var' ? 'CSS Variables' : fmt}
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

        <pre className="overflow-x-auto rounded-lg bg-surface-secondary/70 p-3 font-mono text-xs text-text-primary">
          <code>{getCode()}</code>
        </pre>
      </div>
    </div>
  );
};
