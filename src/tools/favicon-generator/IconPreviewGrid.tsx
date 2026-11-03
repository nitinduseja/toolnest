import React from 'react';
import { Download } from 'lucide-react';
import { GeneratedIconItem } from './types';

export interface IconPreviewGridProps {
  icons: GeneratedIconItem[];
  icoIcon: GeneratedIconItem | null;
  onDownload: (item: GeneratedIconItem) => void;
}

export const IconPreviewGrid: React.FC<IconPreviewGridProps> = ({ icons, icoIcon, onDownload }) => {
  const allIcons = icoIcon ? [icoIcon, ...icons] : icons;

  if (allIcons.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-outline px-1">
        <span>GENERATED ICONS ({allIcons.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {allIcons.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-center p-1 overflow-hidden shrink-0">
                <img
                  src={item.dataUrl}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="min-w-0 space-y-0.5">
                <p className="text-xs font-semibold text-on-surface truncate">{item.name}</p>
                <p className="text-[11px] font-mono text-outline">{item.filename}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDownload(item)}
              title={`Download ${item.filename}`}
              className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface hover:text-primary transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
