import React, { useState, useMemo } from 'react';
import { FileText, Scissors, RotateCw, Download, Loader2, Trash2 } from 'lucide-react';
import { PdfFileItem, parsePageRanges, extractPdfPages, rotatePdfPages } from './pdfLogic';

export interface PdfSplitRotateViewProps {
  file: PdfFileItem;
  onClear: () => void;
}

export const PdfSplitRotateView: React.FC<PdfSplitRotateViewProps> = ({ file, onClear }) => {
  const [subMode, setSubMode] = useState<'extract' | 'rotate'>('extract');
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const targetedIndices = useMemo(() => {
    return parsePageRanges(rangeInput, file.pageCount);
  }, [rangeInput, file.pageCount]);

  const handleExtractDownload = async () => {
    if (targetedIndices.length === 0) return;
    try {
      setIsProcessing(true);
      const extractedBytes = await extractPdfPages(file.data, targetedIndices);
      const blob = new Blob([extractedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted-pages-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotateDownload = async () => {
    try {
      setIsProcessing(true);
      const rotatedBytes = await rotatePdfPages(file.data, targetedIndices, rotationAngle);
      const blob = new Blob([rotatedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rotated-document-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsProcessing(false);
    }
  };

  const setPresetRange = (preset: 'all' | 'first' | 'odd' | 'even') => {
    if (preset === 'all') setRangeInput(`1-${file.pageCount}`);
    if (preset === 'first') setRangeInput('1');
    if (preset === 'odd') {
      const odds = Array.from({ length: file.pageCount }, (_, i) => i + 1).filter(
        (n) => n % 2 !== 0
      );
      setRangeInput(odds.join(', '));
    }
    if (preset === 'even') {
      const evens = Array.from({ length: file.pageCount }, (_, i) => i + 1).filter(
        (n) => n % 2 === 0
      );
      setRangeInput(evens.join(', ') || '2');
    }
  };

  return (
    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
      {/* File Info Bar */}
      <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <div className="min-w-0">
            <span className="font-semibold text-on-surface truncate block" title={file.name}>
              {file.name}
            </span>
            <span className="text-[11px] text-outline">
              Total Pages: <strong>{file.pageCount}</strong>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          title="Remove document"
          className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sub Mode Toggle */}
      <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
        <button
          type="button"
          onClick={() => setSubMode('extract')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            subMode === 'extract'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Extract Pages</span>
        </button>
        <button
          type="button"
          onClick={() => setSubMode('rotate')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            subMode === 'rotate'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Rotate Pages</span>
        </button>
      </div>

      {subMode === 'extract' ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1">
              Pages to Extract (e.g. 1-3, 5)
            </label>
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g. 1-3, 5"
              className="w-full p-2 rounded-lg bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface focus:outline-hidden focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-outline">Presets:</span>
            <button
              type="button"
              onClick={() => setPresetRange('first')}
              className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface"
            >
              Page 1
            </button>
            <button
              type="button"
              onClick={() => setPresetRange('odd')}
              className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface"
            >
              Odd Pages
            </button>
            <button
              type="button"
              onClick={() => setPresetRange('even')}
              className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface"
            >
              Even Pages
            </button>
            <button
              type="button"
              onClick={() => setPresetRange('all')}
              className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface"
            >
              All Pages
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
            <span className="text-xs text-outline">
              Selected: <strong>{targetedIndices.length}</strong> of {file.pageCount} pages
            </span>
            <button
              type="button"
              onClick={handleExtractDownload}
              disabled={isProcessing || targetedIndices.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold transition-colors shadow-xs disabled:opacity-40"
            >
              {isProcessing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isProcessing ? 'Extracting...' : 'Extract & Download'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1">
              Rotation Degree
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setRotationAngle(deg as 90 | 180 | 270)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    rotationAngle === deg
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant/60 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  +{deg}°
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface mb-1">
              Target Pages (leave empty for all pages)
            </label>
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g. 1-2, 4 (leave empty for all)"
              className="w-full p-2 rounded-lg bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface focus:outline-hidden focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
            <span className="text-xs text-outline">
              Rotating{' '}
              {targetedIndices.length > 0 ? `${targetedIndices.length} pages` : 'all pages'} by{' '}
              {rotationAngle}°
            </span>
            <button
              type="button"
              onClick={handleRotateDownload}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold transition-colors shadow-xs disabled:opacity-40"
            >
              {isProcessing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isProcessing ? 'Rotating...' : 'Rotate & Download'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
