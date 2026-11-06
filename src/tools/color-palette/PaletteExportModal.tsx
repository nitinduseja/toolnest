import React, { useState } from 'react';
import { X, Copy, Check, Download, Code2 } from 'lucide-react';
import { exportPaletteAsCss, exportPaletteAsTailwind } from './paletteLogic';
import { downloadFile } from '@/lib/downloads';

interface PaletteExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
}

type ExportTab = 'css' | 'tailwind' | 'json';

export const PaletteExportModal: React.FC<PaletteExportModalProps> = ({
  isOpen,
  onClose,
  colors,
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>('css');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getExportText = () => {
    switch (activeTab) {
      case 'css':
        return exportPaletteAsCss(colors);
      case 'tailwind':
        return exportPaletteAsTailwind(colors);
      case 'json':
        return JSON.stringify(colors, null, 2);
    }
  };

  const codeText = getExportText();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    const swatchWidth = 80;
    const swatchHeight = 80;
    const totalWidth = colors.length * swatchWidth;
    const rects = colors
      .map(
        (hex, i) =>
          `<rect x="${i * swatchWidth}" y="0" width="${swatchWidth}" height="${swatchHeight}" fill="${hex}" />
           <text x="${i * swatchWidth + 10}" y="${swatchHeight - 12}" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold">${hex}</text>`
      )
      .join('\n');

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${swatchHeight}" width="${totalWidth}" height="${swatchHeight}">
      ${rects}
    </svg>`;

    downloadFile(svgContent, { filename: 'palette.svg', mimeType: 'image/svg+xml' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-surface border border-outline-variant/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/40 bg-surface-container-low">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-on-surface">Export Color Palette</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-outline-variant/40 px-4 pt-2 gap-2 bg-surface-container-low">
          {(['css', 'tailwind', 'json'] as ExportTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 uppercase ${
                activeTab === tab
                  ? 'border-primary text-primary bg-surface'
                  : 'border-transparent text-outline hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <pre className="p-3 bg-surface-container-high rounded-xl text-xs font-mono text-on-surface overflow-x-auto max-h-48 border border-outline-variant/50">
              <code>{codeText}</code>
            </pre>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
