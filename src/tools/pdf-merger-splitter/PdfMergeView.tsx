import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Download, Layers, Loader2 } from 'lucide-react';
import { PdfFileItem, mergePdfDocuments } from './pdfLogic';
import { PdfDropZone } from './PdfDropZone';

export interface PdfMergeViewProps {
  files: PdfFileItem[];
  onAddFiles: (files: File[]) => void;
  onReorder: (newList: PdfFileItem[]) => void;
  onRemove: (id: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export const PdfMergeView: React.FC<PdfMergeViewProps> = ({
  files,
  onAddFiles,
  onReorder,
  onRemove,
}) => {
  const [isMerging, setIsMerging] = useState<boolean>(false);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const updated = [...files];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    onReorder(updated);
  };

  const handleMergeDownload = async () => {
    if (files.length === 0) return;
    try {
      setIsMerging(true);
      const mergedBytes = await mergePdfDocuments(files.map((f) => f.data));
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged-document-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsMerging(false);
    }
  };

  const totalPages = files.reduce((acc, f) => acc + f.pageCount, 0);

  return (
    <div className="space-y-4">
      <PdfDropZone onFilesSelected={onAddFiles} multiple label="Add PDF files to merge" />

      {files.length > 0 && (
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-outline uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" />
              <span>
                Queue ({files.length} documents • {totalPages} pages total)
              </span>
            </span>
            <button
              type="button"
              onClick={handleMergeDownload}
              disabled={isMerging || files.length < 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold transition-colors shadow-xs disabled:opacity-40"
            >
              {isMerging ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isMerging ? 'Merging...' : 'Merge & Download'}</span>
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {files.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-surface-container text-outline flex items-center justify-center text-[10px] font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-on-surface truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[11px] text-outline">
                      {formatBytes(item.size)} • {item.pageCount} pages
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    title="Move up"
                    className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-on-surface disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === files.length - 1}
                    title="Move down"
                    className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-on-surface disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    title="Remove from queue"
                    className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
