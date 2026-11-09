import React, { useState, useMemo } from 'react';
import { DocumentMeta, MarkdownPreset } from './types';
import { generatePrintDocument, EXPORT_PRESETS } from './markdownExportLogic';
import { MarkdownExportToolbar } from './MarkdownExportToolbar';
import { Icon } from '@/components/atoms/Icon';

const INITIAL_PRESET = EXPORT_PRESETS[0];

export const MarkdownExporter: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(INITIAL_PRESET.markdown);
  const [meta, setMeta] = useState<DocumentMeta>({
    title: INITIAL_PRESET.meta.title || 'Untitled Document',
    author: INITIAL_PRESET.meta.author || 'Anonymous',
    date: INITIAL_PRESET.meta.date || new Date().toISOString().split('T')[0],
    includeCoverPage: INITIAL_PRESET.meta.includeCoverPage ?? false,
    includeHeaderFooter: true,
    pageSize: INITIAL_PRESET.meta.pageSize || 'a4',
    orientation: INITIAL_PRESET.meta.orientation || 'portrait',
    theme: INITIAL_PRESET.meta.theme || 'modern',
  });
  const [copied, setCopied] = useState(false);

  const fullHtml = useMemo(() => generatePrintDocument(markdown, meta), [markdown, meta]);

  const wordsCount = useMemo(() => {
    const trimmed = markdown.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [markdown]);

  const handleSelectPreset = (preset: MarkdownPreset) => {
    setMarkdown(preset.markdown);
    setMeta((prev) => ({
      ...prev,
      ...preset.meta,
      date: preset.meta.date || prev.date,
    }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.title.toLowerCase().replace(/\s+/g, '-') || 'document'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = async () => {
    await navigator.clipboard.writeText(fullHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon name="Printer" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Markdown to PDF & Printable HTML Exporter
            </h1>
            <p className="text-xs text-text-secondary sm:text-sm">
              Typeset professional documents, architecture RFCs, and formal statements with
              dedicated print stylesheets and offline export.
            </p>
          </div>
        </div>
      </div>

      {/* Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-surface-primary/60 p-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Document Templates:
        </span>
        {EXPORT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className="rounded-lg border border-border/60 bg-surface-secondary/60 px-3 py-1 text-xs font-medium text-text-primary transition hover:border-primary/50 hover:bg-surface-secondary"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Configuration Toolbar */}
      <MarkdownExportToolbar
        meta={meta}
        onChangeMeta={setMeta}
        onPrint={handlePrint}
        onDownloadHtml={handleDownloadHtml}
        onCopyHtml={handleCopyHtml}
        copied={copied}
      />

      {/* Split Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Editor Pane */}
        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="markdown-source-input"
              className="text-xs font-semibold uppercase tracking-wider text-text-tertiary"
            >
              Markdown Source
            </label>
            <span className="text-xs text-text-tertiary">
              {wordsCount} words · {markdown.length} chars
            </span>
          </div>
          <textarea
            id="markdown-source-input"
            rows={18}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
            className="w-full resize-y rounded-lg border border-border/60 bg-surface-secondary/70 p-3 font-mono text-xs text-text-primary focus:border-primary focus:outline-none"
          />
        </div>

        {/* Live Printable Preview Pane */}
        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Print Sheet Preview ({meta.pageSize.toUpperCase()} · {meta.theme})
            </span>
            <span className="text-xs text-text-tertiary">Live Render</span>
          </div>
          <div className="h-[23.5rem] overflow-auto rounded-lg border border-border/60 bg-white p-6 text-black shadow-inner">
            <iframe
              title="Print Document Preview"
              srcDoc={fullHtml}
              className="h-full w-full border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownExporter;
