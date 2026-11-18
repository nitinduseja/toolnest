import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-react';
import { ColumnAlignment } from './tableLogic';

interface MarkdownTableGridProps {
  headers: string[];
  rows: string[][];
  alignments: ColumnAlignment[];
  onHeaderChange: (index: number, val: string) => void;
  onCellChange: (rowIdx: number, colIdx: number, val: string) => void;
  onToggleAlignment: (colIdx: number) => void;
  onRemoveColumn: (colIdx: number) => void;
  onRemoveRow: (rowIdx: number) => void;
}

export const MarkdownTableGrid: React.FC<MarkdownTableGridProps> = ({
  headers,
  rows,
  alignments,
  onHeaderChange,
  onCellChange,
  onToggleAlignment,
  onRemoveColumn,
  onRemoveRow,
}) => {
  return (
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
                    onChange={(e) => onHeaderChange(colIdx, e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-surface border border-outline-variant font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => onToggleAlignment(colIdx)}
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
                      onClick={() => onRemoveColumn(colIdx)}
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
                    onChange={(e) => onCellChange(rowIdx, colIdx, e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </td>
              ))}
              <td className="p-1 text-center">
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveRow(rowIdx)}
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
  );
};
