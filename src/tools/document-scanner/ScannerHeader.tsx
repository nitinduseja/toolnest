import React from 'react';
import {
  ShieldCheck,
  History,
  Save,
  FileText,
  Camera,
  Upload,
  FileImage,
  Download,
} from 'lucide-react';

export interface ScannerHeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  isSaving: boolean;
  onOpenHistory: () => void;
  onSave: () => void;
  onOpenCam: () => void;
  onUploadClick: () => void;
  onExportJpg: () => void;
  onExportPdf: () => void;
}

export const ScannerHeader: React.FC<ScannerHeaderProps> = ({
  title,
  onTitleChange,
  isSaving,
  onOpenHistory,
  onSave,
  onOpenCam,
  onUploadClick,
  onExportJpg,
  onExportPdf,
}) => {
  return (
    <div className="space-y-4">
      {/* Privacy Notice Ribbon */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>Client-Side Document Scanner:</strong> Camera capture, 4-point perspective warp,
            OCR text extraction, and PDF generation occur 100% in local browser memory.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
          >
            <History className="w-3.5 h-3.5 text-primary" />
            <span>Scan History</span>
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-primary" />
            <span>{isSaving ? 'Saved!' : 'Save Scan'}</span>
          </button>
        </div>
      </div>

      {/* Document Title & Action Bar */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 min-w-[240px]">
          <FileText className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="font-semibold text-sm text-on-surface bg-transparent border-b border-transparent hover:border-outline-variant focus:border-primary focus:outline-hidden px-1 py-0.5"
            placeholder="Document Name..."
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onOpenCam}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-primary" />
            <span>Camera</span>
          </button>
          <button
            type="button"
            onClick={onUploadClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-primary" />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={onExportJpg}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <FileImage className="w-3.5 h-3.5 text-primary" />
            <span>Export JPG</span>
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
