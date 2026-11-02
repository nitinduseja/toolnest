import React, { useState } from 'react';
import { Download, X, FileText, Stamp, Loader2 } from 'lucide-react';
import { ScannedPageItem } from './scannerDb';
import { exportScannedPagesToPdf, downloadPdfBytes } from './pdfExportLogic';

export interface ExportPdfModalProps {
  isOpen: boolean;
  pages: ScannedPageItem[];
  defaultTitle: string;
  onClose: () => void;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  pages,
  defaultTitle,
  onClose,
}) => {
  const [title, setTitle] = useState<string>(defaultTitle || 'Scanned_Document');
  const [pageSize, setPageSize] = useState<'a4' | 'fit'>('a4');
  const [watermark, setWatermark] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const bytes = await exportScannedPagesToPdf(pages, {
        title,
        pageSize,
        watermarkText: watermark.trim() || undefined,
      });
      downloadPdfBytes(bytes, `${title.replace(/\s+/g, '_')}.pdf`);
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-on-surface">Export Document to PDF</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-outline font-medium mb-1">Document File Name</label>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container border border-outline-variant">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent text-on-surface w-full focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-outline font-medium mb-1">Page Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPageSize('a4')}
                className={`py-2 px-3 rounded-lg border font-medium transition-colors ${
                  pageSize === 'a4'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container text-on-surface border-outline-variant'
                }`}
              >
                Standard A4 Page
              </button>
              <button
                type="button"
                onClick={() => setPageSize('fit')}
                className={`py-2 px-3 rounded-lg border font-medium transition-colors ${
                  pageSize === 'fit'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container text-on-surface border-outline-variant'
                }`}
              >
                Fit Scan Aspect
              </button>
            </div>
          </div>

          <div>
            <label className="block text-outline font-medium mb-1">
              Document Watermark (Optional)
            </label>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container border border-outline-variant">
              <Stamp className="w-4 h-4 text-outline shrink-0" />
              <input
                type="text"
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                placeholder="e.g. CONFIDENTIAL, DRAFT, COPY"
                className="bg-transparent text-on-surface w-full focus:outline-hidden uppercase"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 space-y-1 text-on-surface-variant text-[11px]">
            <p>✓ {pages.length} scanned pages included</p>
            <p>✓ Invisible searchable OCR text layer embedded</p>
            <p>✓ Digital signatures & stamps applied</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold shadow-xs disabled:opacity-40"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
