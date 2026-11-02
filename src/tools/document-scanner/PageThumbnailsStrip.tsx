import React from 'react';
import { Plus, ArrowLeft, ArrowRight, Copy, Trash2, Camera, Upload } from 'lucide-react';
import { ScannedPageItem } from './scannerDb';

export interface PageThumbnailsStripProps {
  pages: ScannedPageItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onReorder: (newList: ScannedPageItem[]) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenCam: () => void;
  onUploadClick: () => void;
}

export const PageThumbnailsStrip: React.FC<PageThumbnailsStripProps> = ({
  pages,
  activeId,
  onSelect,
  onReorder,
  onDuplicate,
  onDelete,
  onOpenCam,
  onUploadClick,
}) => {
  const movePage = (idx: number, dir: 'left' | 'right') => {
    const targetIdx = dir === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= pages.length) return;
    const updated = [...pages];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    onReorder(updated);
  };

  return (
    <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-outline uppercase tracking-wider">
        <span>Document Pages ({pages.length})</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenCam}
            title="Scan new page with camera"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-primary" />
            <span>Camera</span>
          </button>
          <button
            type="button"
            onClick={onUploadClick}
            title="Upload image as new page"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-primary" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
        {pages.map((page, idx) => {
          const isActive = page.id === activeId;
          return (
            <div
              key={page.id}
              onClick={() => onSelect(page.id)}
              className={`relative group shrink-0 w-24 p-1.5 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                  : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
              }`}
            >
              <img
                src={page.processedDataUrl || page.originalDataUrl}
                alt={`Page ${idx + 1}`}
                className="w-full h-28 object-contain rounded bg-white"
              />
              <span className="block text-[10px] text-center font-bold text-outline mt-1">
                Page {idx + 1}
              </span>

              {/* Action Overlay */}
              <div className="absolute inset-x-1 bottom-6 p-0.5 rounded bg-black/70 backdrop-blur-xs flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    movePage(idx, 'left');
                  }}
                  disabled={idx === 0}
                  className="p-0.5 text-white disabled:opacity-30 hover:text-primary"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(page.id);
                  }}
                  className="p-0.5 text-white hover:text-primary"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(page.id);
                  }}
                  disabled={pages.length <= 1}
                  className="p-0.5 text-white disabled:opacity-30 hover:text-error"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    movePage(idx, 'right');
                  }}
                  disabled={idx === pages.length - 1}
                  className="p-0.5 text-white disabled:opacity-30 hover:text-primary"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Page Tile */}
        <button
          type="button"
          onClick={onUploadClick}
          className="shrink-0 w-24 h-36 rounded-lg border-2 border-dashed border-outline-variant hover:border-primary/60 flex flex-col items-center justify-center gap-1 text-outline hover:text-primary transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase">Add Page</span>
        </button>
      </div>
    </div>
  );
};
