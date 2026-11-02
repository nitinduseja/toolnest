import React, { useState } from 'react';
import {
  RotateCw,
  Crop,
  PenTool,
  FileText,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ScannedPageItem, StampOverlay } from './scannerDb';
import { ScanFilterType, filterImageDataUrl, rotateDataUrl } from './filterLogic';
import { performOcr, SUPPORTED_OCR_LANGUAGES } from './ocrLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { PageStampOverlay } from './PageStampOverlay';

export interface PageEditorCanvasProps {
  page: ScannedPageItem;
  onUpdatePage: (updates: Partial<ScannedPageItem>) => void;
  onOpenCrop: () => void;
  onOpenSign: () => void;
  onApplyFilterToAll?: (filter: ScanFilterType) => void;
}

const FILTERS: { id: ScanFilterType; label: string }[] = [
  { id: 'original', label: 'Original' },
  { id: 'magic', label: 'Magic Color' },
  { id: 'adaptive', label: 'Shadow-Free B&W' },
  { id: 'bw', label: 'B&W Doc' },
  { id: 'grayscale', label: 'Grayscale' },
];

export const PageEditorCanvas: React.FC<PageEditorCanvasProps> = ({
  page,
  onUpdatePage,
  onOpenCrop,
  onOpenSign,
  onApplyFilterToAll,
}) => {
  const [ocrLoading, setOcrLoading] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [copiedOcr, setCopiedOcr] = useState<boolean>(false);
  const [ocrLang, setOcrLang] = useState<string>('eng');

  const applyNewFilter = async (newFilter: ScanFilterType) => {
    const processed = await filterImageDataUrl(page.originalDataUrl, newFilter, {
      brightness: page.brightness,
      contrast: page.contrast,
    });
    onUpdatePage({
      filter: newFilter,
      processedDataUrl: processed,
    });
  };

  const handleRotate = async () => {
    const rotatedOriginal = await rotateDataUrl(page.originalDataUrl, 90);
    const rotatedRaw = page.rawCaptureUrl ? await rotateDataUrl(page.rawCaptureUrl, 90) : undefined;
    const processed = await filterImageDataUrl(rotatedOriginal, page.filter, {
      brightness: page.brightness,
      contrast: page.contrast,
    });
    onUpdatePage({
      originalDataUrl: rotatedOriginal,
      rawCaptureUrl: rotatedRaw,
      processedDataUrl: processed,
      rotation: (page.rotation + 90) % 360,
    });
  };

  const handleRunOcr = async () => {
    try {
      setOcrLoading(true);
      setOcrProgress(0);
      const res = await performOcr(page.processedDataUrl || page.originalDataUrl, ocrLang, (p) =>
        setOcrProgress(p)
      );
      onUpdatePage({ ocrText: res.text, ocrWords: res.words });
    } catch {
      onUpdatePage({ ocrText: 'Failed to extract text from page.' });
    } finally {
      setOcrLoading(false);
    }
  };

  const handleCopyText = async () => {
    if (!page.ocrText) return;
    const ok = await copyToClipboard(page.ocrText);
    if (ok) {
      setCopiedOcr(true);
      setTimeout(() => setCopiedOcr(false), 1500);
    }
  };

  const currentStamp: StampOverlay | null =
    page.signatureStamp ||
    (page.signatureDataUrl
      ? { dataUrl: page.signatureDataUrl, xPercent: 60, yPercent: 75, scale: 1 }
      : null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Visual Canvas Display (7 cols) */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant min-h-[460px] shadow-xs relative">
        <div className="relative max-h-[580px] max-w-full overflow-hidden rounded-lg shadow-md border border-outline-variant/60 bg-white">
          <img
            src={page.processedDataUrl || page.originalDataUrl}
            alt="Scanned page"
            className="max-h-[560px] w-auto object-contain block select-none"
          />
          <PageStampOverlay
            stamp={currentStamp}
            onUpdate={(st) =>
              onUpdatePage({
                signatureStamp: st ?? undefined,
                signatureDataUrl: st ? st.dataUrl : undefined,
              })
            }
          />
        </div>
      </div>

      {/* Editing Toolbar & OCR Panel (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Filter Pills */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">
              Scanning Filters
            </span>
            {onApplyFilterToAll && (
              <button
                type="button"
                onClick={() => onApplyFilterToAll(page.filter)}
                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Apply to all pages</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => applyNewFilter(f.id)}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                  page.filter === f.id
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high border-outline-variant text-on-surface'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleRotate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate 90°</span>
            </button>
            <button
              type="button"
              onClick={onOpenCrop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors"
            >
              <Crop className="w-3.5 h-3.5 text-primary" />
              <span>Crop / Warp</span>
            </button>
            <button
              type="button"
              onClick={onOpenSign}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors"
            >
              <PenTool className="w-3.5 h-3.5 text-primary" />
              <span>Sign / Stamp</span>
            </button>
            {currentStamp && (
              <button
                type="button"
                onClick={() =>
                  onUpdatePage({ signatureStamp: undefined, signatureDataUrl: undefined })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Stamp</span>
              </button>
            )}
          </div>
        </div>

        {/* OCR Text Box */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-outline uppercase tracking-wider">
              <FileText className="w-4 h-4 text-primary" />
              <span>Searchable OCR</span>
            </span>
            <div className="flex items-center gap-2">
              <select
                value={ocrLang}
                onChange={(e) => setOcrLang(e.target.value)}
                className="text-xs bg-surface-container border border-outline-variant rounded-md px-2 py-1 text-on-surface"
              >
                {SUPPORTED_OCR_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleRunOcr}
                disabled={ocrLoading}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold transition-colors disabled:opacity-40"
              >
                {ocrLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <FileText className="w-3 h-3" />
                )}
                <span>{ocrLoading ? `${ocrProgress}%` : 'Extract'}</span>
              </button>
            </div>
          </div>

          {page.ocrText ? (
            <div className="space-y-2">
              <textarea
                value={page.ocrText}
                readOnly
                rows={5}
                className="w-full p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface focus:outline-hidden resize-none"
              />
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-outline">
                  {page.ocrWords?.length || 0} words mapped to PDF layer
                </span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-xs font-medium text-on-surface hover:bg-surface-container-high"
                >
                  {copiedOcr ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedOcr ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-outline italic">
              Extract text in 8+ languages to build a word-level searchable layer in exported PDFs.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
