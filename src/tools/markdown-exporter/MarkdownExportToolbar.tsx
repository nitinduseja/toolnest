import React from 'react';
import { DocumentMeta, ExportTheme, PageSize, PageOrientation } from './types';
import { Icon } from '@/components/atoms/Icon';

interface MarkdownExportToolbarProps {
  meta: DocumentMeta;
  onChangeMeta: (meta: DocumentMeta) => void;
  onPrint: () => void;
  onDownloadHtml: () => void;
  onCopyHtml: () => void;
  copied: boolean;
}

export const MarkdownExportToolbar: React.FC<MarkdownExportToolbarProps> = ({
  meta,
  onChangeMeta,
  onPrint,
  onDownloadHtml,
  onCopyHtml,
  copied,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
      {/* Row 1: Document Meta & Configuration */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <label htmlFor="doc-title-input" className="text-xs font-semibold text-text-secondary">
            Doc Title
          </label>
          <input
            id="doc-title-input"
            type="text"
            value={meta.title}
            onChange={(e) => onChangeMeta({ ...meta, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border/60 bg-surface-secondary px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="doc-author-input" className="text-xs font-semibold text-text-secondary">
            Author / Org
          </label>
          <input
            id="doc-author-input"
            type="text"
            value={meta.author}
            onChange={(e) => onChangeMeta({ ...meta, author: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border/60 bg-surface-secondary px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="theme-select" className="text-xs font-semibold text-text-secondary">
            Theme
          </label>
          <select
            id="theme-select"
            value={meta.theme}
            onChange={(e) => onChangeMeta({ ...meta, theme: e.target.value as ExportTheme })}
            className="mt-1 w-full rounded-lg border border-border/60 bg-surface-secondary px-2.5 py-1.5 text-xs font-medium text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="modern">Modern Sans</option>
            <option value="academic">Academic Serif</option>
            <option value="minimal">Minimal Clean</option>
            <option value="compact">Compact Mono</option>
          </select>
        </div>

        <div>
          <label htmlFor="page-size-select" className="text-xs font-semibold text-text-secondary">
            Page Setup
          </label>
          <div className="mt-1 flex items-center gap-1.5">
            <select
              id="page-size-select"
              value={meta.pageSize}
              onChange={(e) => onChangeMeta({ ...meta, pageSize: e.target.value as PageSize })}
              className="w-1/2 rounded-lg border border-border/60 bg-surface-secondary px-2 py-1.5 text-xs text-text-primary"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>
            <select
              aria-label="Page Orientation"
              value={meta.orientation}
              onChange={(e) =>
                onChangeMeta({ ...meta, orientation: e.target.value as PageOrientation })
              }
              className="w-1/2 rounded-lg border border-border/60 bg-surface-secondary px-2 py-1.5 text-xs text-text-primary"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Toggles and Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-text-secondary">
          <input
            type="checkbox"
            checked={meta.includeCoverPage}
            onChange={(e) => onChangeMeta({ ...meta, includeCoverPage: e.target.checked })}
            className="rounded accent-primary"
          />
          Include Cover Page
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCopyHtml}
            className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-primary transition hover:bg-surface-secondary/80"
          >
            <Icon name={copied ? 'Check' : 'Copy'} className="h-3.5 w-3.5" />
            <span>{copied ? 'Copied' : 'Copy HTML'}</span>
          </button>

          <button
            type="button"
            onClick={onDownloadHtml}
            className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-primary transition hover:bg-surface-secondary/80"
          >
            <Icon name="Download" className="h-3.5 w-3.5" />
            <span>Download HTML</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Icon name="Printer" className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
