import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Sparkles,
} from 'lucide-react';
import {
  generateMarkdownTable,
  parseDelimitedToTable,
  ColumnAlignment,
} from './tableLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

export const MarkdownTableTool: React.FC = () => {
  const [headers, setHeaders] = useState<string[]>([
    'Feature',
    'Toolnest',
    'Cloud Alternative',
  ]);
  const [rows, setRows] = useState<string[][]>([
    ['Offline Capable', 'Yes (100% PWA)', 'No'],
    ['Zero Telemetry', 'Guaranteed Local', 'Logs to Cloud'],
    ['Memory Security', 'Client-Side Sandbox', 'Server Stored'],
  ]);
  const [alignments, setAlignments] = useState<ColumnAlignment[]>([
    'left',
    'center',
    'right',
  ]);
  const [copied, setCopied] = useState<boolean>(false);
  const [csvModalOpen, setCsvModalOpen] = useState<boolean>(false);
  const [csvText, setCsvText] = useState<string>('');

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

  const handleImportCsv = () => {
    if (!csvText.trim()) return;
    const { headers: newHeaders, rows: newRows } = parseDelimitedToTable(csvText);
    setHeaders(newHeaders);
    setRows(newRows);
    setAlignments(Array(newHeaders.length).fill('left'));
    setCsvModalOpen(false);
    setCsvText('');
  };

  return (
    <div className="space-y-4">
      {/* Import Modal */}
      {csvModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container-low border border-outline-variant rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <span className="font-bold text-sm text-on-surface">Import CSV / Delimited Data</span>
              <button
                type="button"
                onClick={() => setCsvModalOpen(false)}
                className="text-outline hover:text-on-surface text-xs"
              >
                Cancel
              </button>
            </div>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Paste comma or tab delimited rows here..."
              className="w-full h-40 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCsvModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportCsv}
                className="px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-opacity"
              >
                Import to Grid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
          <button
            type="button"
            onClick={addColumn}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Column</span>
          </button>
          <div className="h-4 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={() => setCsvModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Download table.md"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Spreadsheet Grid */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-low overflow-x-auto p-4 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-outline px-1">
          Visual Table Grid ({rows.length} rows × {headers.length} cols)
        </div>

        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="w-8 text-center text-outline font-mono">#</th>
              {headers.map((h, colIdx) => (
                <th key={colIdx} className="p-1.5 min-w-[140px]">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-surface border border-outline-variant font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => toggleAlignment(colIdx)}
                      className="p-1.5 rounded-md hover:bg-surface-container text-outline hover:text-primary transition-colors shrink-0"
                      title={`Alignment: ${alignments[colIdx] || 'left'} (click to cycle)`}
                    >
                      {alignments[colIdx] === 'center' ? (
                        <AlignCenter className="w-3.5 h-3.5" />
                      ) : alignments[colIdx] === 'right' ? (
                        <AlignRight className="w-3.5 h-3.5" />
                      ) : (
                        <AlignLeft className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {headers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColumn(colIdx)}
                        className="p-1 rounded-md text-outline hover:text-red-400 hover:bg-surface-container shrink-0"
                        title="Delete column"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-surface-container/40 transition-colors">
                <td className="text-center font-mono text-[11px] text-outline select-none">
                  {rowIdx + 1}
                </td>
                {headers.map((_, colIdx) => (
                  <td key={colIdx} className="p-1.5">
                    <input
                      type="text"
                      value={row[colIdx] || ''}
                      onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </td>
                ))}
                <td className="p-1 text-center">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(rowIdx)}
                      className="p-1 rounded text-outline hover:text-red-400 hover:bg-surface-container"
                      title="Delete row"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          Generates standard GitHub Flavored Markdown (GFM) tables with automatic monospace alignment padding.
        </span>
      </div>
    </div>
  );
};

export default MarkdownTableTool;

