import React from 'react';
import type { SideBySideLine } from './diffLogic';

interface SideBySideDiffTableProps {
  rows: SideBySideLine[];
}

export const SideBySideDiffTable: React.FC<SideBySideDiffTableProps> = ({ rows }) => {
  return (
    <div className="border border-outline-variant rounded-lg overflow-x-auto bg-surface font-mono text-xs">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-container text-outline text-[11px] border-b border-outline-variant">
            <th className="w-12 py-1 px-2 text-right border-r border-outline-variant font-normal">
              #
            </th>
            <th className="py-1 px-3 text-left w-1/2 border-r border-outline-variant">Original</th>
            <th className="w-12 py-1 px-2 text-right border-r border-outline-variant font-normal">
              #
            </th>
            <th className="py-1 px-3 text-left w-1/2">Modified</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, idx) => {
              const isRemoved = row.left?.type === 'removed';
              const isAdded = row.right?.type === 'added';
              const leftBg = isRemoved ? 'bg-red-500/15 text-red-500 dark:text-red-400' : '';
              const rightBg = isAdded
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : '';

              return (
                <tr
                  key={idx}
                  className="border-b border-outline-variant/30 hover:bg-surface-container/50"
                >
                  {/* Left Line Num */}
                  <td className="py-0.5 px-2 text-right select-none text-outline border-r border-outline-variant/50 text-[11px] bg-surface-container-low/40">
                    {row.left?.lineNum ?? ''}
                  </td>
                  {/* Left Text */}
                  <td
                    className={`py-0.5 px-3 border-r border-outline-variant/50 whitespace-pre font-mono ${leftBg}`}
                  >
                    {row.left?.text ?? ''}
                  </td>
                  {/* Right Line Num */}
                  <td className="py-0.5 px-2 text-right select-none text-outline border-r border-outline-variant/50 text-[11px] bg-surface-container-low/40">
                    {row.right?.lineNum ?? ''}
                  </td>
                  {/* Right Text */}
                  <td className={`py-0.5 px-3 whitespace-pre font-mono ${rightBg}`}>
                    {row.right?.text ?? ''}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="py-8 text-center text-outline italic">
                Enter text above to inspect differences...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
