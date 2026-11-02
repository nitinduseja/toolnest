import React, { useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

export interface PdfDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  label?: string;
}

export const PdfDropZone: React.FC<PdfDropZoneProps> = ({
  onFilesSelected,
  multiple = true,
  label = 'Drop PDF files here, or click to browse',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const pdfs = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );
      if (pdfs.length > 0) {
        onFilesSelected(multiple ? pdfs : [pdfs[0]]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const pdfs = Array.from(e.target.files).filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );
      if (pdfs.length > 0) {
        onFilesSelected(multiple ? pdfs : [pdfs[0]]);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="p-6 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary/60 bg-surface-container-low/60 hover:bg-surface-container-low transition-all cursor-pointer text-center group"
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="p-3 rounded-full bg-surface-container group-hover:bg-primary/10 transition-colors">
          <UploadCloud className="w-6 h-6 text-primary" />
        </div>
        <p className="text-xs font-semibold text-on-surface">{label}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-outline">
          <FileText className="w-3.5 h-3.5" />
          <span>
            Local client-side execution. Supports {multiple ? 'multiple files' : 'single file'}.
          </span>
        </div>
      </div>
    </div>
  );
};
