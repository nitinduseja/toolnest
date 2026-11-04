import React from 'react';
import { ListChecks } from 'lucide-react';
import type { RegexMatch } from './regexLogic';

interface RegexMatchDetailsProps {
  matches: RegexMatch[];
}

export const RegexMatchDetails: React.FC<RegexMatchDetailsProps> = ({ matches }) => {
  return (
    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase text-outline">Match Details</h3>
        </div>
        <span className="text-xs text-outline font-mono">{matches.length} items</span>
      </div>

      {matches.length > 0 ? (
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {matches.map((m, idx) => (
            <div
              key={`${m.match}-${m.index}-${idx}`}
              className="p-2.5 rounded-lg bg-surface border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-outline">#{idx + 1}</span>
                <span className="font-mono font-semibold text-primary px-1.5 py-0.5 rounded bg-primary-container/10">
                  &quot;{m.match}&quot;
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-outline">
                <span>Pos: {m.index}</span>
                <span>Len: {m.length}</span>
                {m.groups && (
                  <span className="text-on-surface">Groups: {JSON.stringify(m.groups)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-outline italic">
          No matches found in the current text string.
        </div>
      )}
    </div>
  );
};
