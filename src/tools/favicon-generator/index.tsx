import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Upload, Copy, Check, FileCode, Archive } from 'lucide-react';
import { GeneratedIconItem } from './types';
import {
  generateIcons,
  generateHtmlSnippet,
  generateManifestJson,
  createSampleLogoFile,
} from './faviconLogic';
import { IconPreviewGrid } from './IconPreviewGrid';
import { downloadFile, downloadZip } from '@/lib/downloads';
import { copyToClipboard } from '@/lib/clipboard';

export const FaviconGeneratorTool: React.FC = () => {
  const [icons, setIcons] = useState<GeneratedIconItem[]>([]);
  const [icoIcon, setIcoIcon] = useState<GeneratedIconItem | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = async () => {
      try {
        const res = await generateIcons(img);
        setIcons(res.pngIcons);
        setIcoIcon(res.icoIcon);
      } finally {
        URL.revokeObjectURL(url);
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setIsProcessing(false);
    };
    img.src = url;
  }, []);

  const handleLoadSample = useCallback(async () => {
    const file = await createSampleLogoFile();
    await processFile(file);
  }, [processFile]);

  useEffect(() => {
    handleLoadSample();
  }, [handleLoadSample]);

  const handleDownloadAll = async () => {
    const all = icoIcon ? [icoIcon, ...icons] : icons;
    if (all.length === 0) return;

    const filesToZip: Record<string, Uint8Array | string> = {};
    for (const item of all) {
      const buf = await item.blob.arrayBuffer();
      filesToZip[item.filename] = new Uint8Array(buf);
    }

    filesToZip['site.webmanifest'] = generateManifestJson({
      name: 'Toolnest',
      shortName: 'Tools',
      themeColor: '#6366f1',
      backgroundColor: '#ffffff',
    });

    downloadZip(filesToZip, 'favicon-suite.zip');
  };

  const handleCopyHtml = async () => {
    const ok = await copyToClipboard(generateHtmlSnippet());
    if (ok) {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">Favicon & App Icon Generator</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Multi-Size Suite
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Generate standard multi-resolution .ico, Apple Touch, Android PWA icons, and
            manifest.json.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Sample Logo</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Logo / Icon</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.png,.jpg,.jpeg,.webp,.svg"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              if (e.target.files?.[0]) processFile(e.target.files[0]);
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>
      </div>

      {/* Generated Icons Preview */}
      <IconPreviewGrid
        icons={icons}
        icoIcon={icoIcon}
        onDownload={(item) => downloadFile(item.blob, { filename: item.filename })}
      />

      {/* Action Bar */}
      {icons.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20 flex-wrap gap-3">
          <span className="text-xs font-semibold text-on-surface">
            Ready to deploy to your static web root (`/`)
          </span>
          <button
            type="button"
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Download ZIP Suite ({icons.length + 1} assets)</span>
          </button>
        </div>
      )}

      {/* HTML Snippet Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-primary" />
            <span>HTML &lt;HEAD&gt; TAGS</span>
          </span>
          <button
            type="button"
            onClick={handleCopyHtml}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-xs font-semibold text-on-surface cursor-pointer"
          >
            {copiedHtml ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-primary" />
            )}
            <span>{copiedHtml ? 'Copied' : 'Copy HTML'}</span>
          </button>
        </div>

        <pre className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs font-mono text-on-surface overflow-x-auto">
          {generateHtmlSnippet()}
        </pre>
      </div>
    </div>
  );
};

export default FaviconGeneratorTool;
