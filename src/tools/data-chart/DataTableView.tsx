import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Download, Copy, Check } from 'lucide-react';
import { DataRow, ColumnMeta } from './types';
import { exportToCsv } from './dataParser';

interface DataTableViewProps {
  data: DataRow[];
  columns: ColumnMeta[];
}

export const DataTableView: React.FC<DataTableViewProps> = ({ data, columns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState<string>('');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [copied, setCopied] = useState(false);

  const columnNames = useMemo(() => columns.map((c) => c.name), [columns]);

  const filteredData = useMemo(() => {
    let result = data;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) =>
          String(val ?? '')
            .toLowerCase()
            .includes(term)
        )
      );
    }
    if (sortCol) {
      result = [...result].sort((a, b) => {
        const valA = a[sortCol];
        const valB = b[sortCol];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        return (valA < valB ? -1 : 1) * (sortAsc ? 1 : -1);
      });
    }
    return result;
  }, [data, searchTerm, sortCol, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pageRows = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (colName: string) => {
    if (sortCol === colName) setSortAsc(!sortAsc);
    else {
      setSortCol(colName);
      setSortAsc(true);
    }
  };

  const handleExportCsv = () => {
    const csv = exportToCsv(filteredData, columnNames);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dataset.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(filteredData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            placeholder="Search records..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyJson}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            Copy JSON
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.name}
                  onClick={() => handleSort(c.name)}
                  className="p-2.5 cursor-pointer hover:text-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{c.name}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {pageRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                {columns.map((c) => (
                  <td key={c.name} className="p-2.5 truncate max-w-[180px]">
                    {row[c.name] === null || row[c.name] === undefined ? (
                      <span className="text-slate-600 font-sans italic">null</span>
                    ) : (
                      String(row[c.name])
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-slate-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>
          Showing {page * pageSize + 1}–{Math.min(filteredData.length, (page + 1) * pageSize)} of{' '}
          {filteredData.length} records
        </span>

        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs text-slate-200"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>

          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
