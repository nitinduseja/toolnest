import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Copy, Check, Download, Upload, Sparkles } from 'lucide-react';
import { generateMarkdownTable, parseDelimitedToTable, ColumnAlignment } from './tableLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';
import { CrossToolHandoffButton } from '@/components/molecules/CrossToolHandoffButton';
import { useToolHandoff } from '@/lib/handoff/crossToolHandoff';
import { CsvImportModal } from './CsvImportModal';
import { MarkdownTableGrid } from './MarkdownTableGrid';

const HANDOFF_TARGETS = [
  {
    toolId: 'markdown-previewer',
    label: 'Preview in Markdown',
    description: 'Render and preview table in Markdown viewer',
  },
  {
    toolId: 'markdown-exporter',
    label: 'Export Printable Document',
    description: 'Typeset to PDF or printable HTML document',
  },
];

export const MarkdownTableTool: React.FC = () => {
  const [headers, setHeaders] = useState<string[]>(['Feature', 'Toolnest', 'Cloud Alternative']);
  const [rows, setRows] = useState<string[][]>([
    ['Offline Capable', 'Yes (100% PWA)', 'No'],
    ['Zero Telemetry', 'Guaranteed Local', 'Logs to Cloud'],
    ['Memory Security', 'Client-Side Sandbox', 'Server Stored'],
  ]);
  const [alignments, setAlignments] = useState<ColumnAlignment[]>(['left', 'center', 'right']);
  const [copied, setCopied] = useState<boolean>(false);
  const [csvModalOpen, setCsvModalOpen] = useState<boolean>(false);

  useToolHandoff('markdown-table', (payload) => {
    if (!payload) return;
    const { headers: newHeaders, rows: newRows } = parseDelimitedToTable(payload);
    if (newHeaders.length > 0 && newRows.length > 0) {
      setHeaders(newHeaders);
      setRows(newRows);
      setAlignments(Array(newHeaders.length).fill('left'));
    }
  });

  const markdownOutput = useMemo(() => {
    return generateMarkdownTable({ headers, rows, alignments });
  }, [headers, rows, alignments]);

  const handleHeaderChange = (index: number, val: string) => {
    const updated = [...headers];
    updated[index] = val;
    setHeaders(updated);
  };

  const handleCellChange = (rowIdx: number, colIdx: number, val: string) => {
    const updated = rows.map((r, i) => {
      if (i !== rowIdx) return r;
      const newRow = [...r];
      newRow[colIdx] = val;
      return newRow;
    });
    setRows(updated);
  };

  const addColumn = () => {
    const newIdx = headers.length + 1;
    setHeaders([...headers, `Col ${newIdx}`]);
    setAlignments([...alignments, 'left']);
    setRows(rows.map((r) => [...r, '']));
  };

  const removeColumn = (colIdx: number) => {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, i) => i !== colIdx));
    setAlignments(alignments.filter((_, i) => i !== colIdx));
    setRows(rows.map((r) => r.filter((_, i) => i !== colIdx)));
  };

  const addRow = () => {
    setRows([...rows, Array(headers.length).fill('')]);
  };

  const removeRow = (rowIdx: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== rowIdx));
  };

  const toggleAlignment = (colIdx: number) => {
    const nextAlign: Record<ColumnAlignment, ColumnAlignment> = {
      left: 'center',
      center: 'right',
      right: 'left',
    };
    const updated = [...alignments];
    updated[colIdx] = nextAlign[updated[colIdx] || 'left'];
    setAlignments(updated);
  };

  const handleCopy = async () => {
    if (!markdownOutput) return;
    const ok = await copyToClipboard(markdownOutput);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!markdownOutput) return;
    downloadFile(markdownOutput, { filename: 'table.md', mimeType: 'text/markdown' });
  };

  const handleImportCsv = useCallback((csvText: string) => {
    const { headers: newHeaders, rows: newRows } = parseDelimitedToTable(csvText);
    setHeaders(newHeaders);
    setRows(newRows);
    setAlignments(Array(newHeaders.length).fill('left'));
  }, []);

  return (
    <div className="space-y-4">
      <CsvImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImport={handleImportCsv}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
          <button
            type="button"
            onClick={addColumn}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Column</span>
          </button>
          <div className="h-4 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={() => setCsvModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <CrossToolHandoffButton
            sourceToolId="markdown-table"
            targets={HANDOFF_TARGETS}
            getData={() => markdownOutput}
            disabled={!markdownOutput}
          />
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title="Download table.md"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <MarkdownTableGrid
        headers={headers}
        rows={rows}
        alignments={alignments}
        onHeaderChange={handleHeaderChange}
        onCellChange={handleCellChange}
        onToggleAlignment={toggleAlignment}
        onRemoveColumn={removeColumn}
        onRemoveRow={removeRow}
      />

      {/* Generated Markdown Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-outline px-1">
          <span className="font-medium text-on-surface">Generated GFM Markdown Table</span>
          <span className="font-mono text-[11px]">{markdownOutput.length} characters</span>
        </div>
        <textarea
          readOnly
          value={markdownOutput}
          className="w-full h-44 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface focus:outline-none resize-y"
        />
      </div>

      <div className="flex items-center gap-2 text-[11px] text-outline px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>
          Generates standard GitHub Flavored Markdown (GFM) tables with automatic monospace
          alignment padding.
        </span>
      </div>
    </div>
  );
};

export default MarkdownTableTool;
