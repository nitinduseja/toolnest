import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { TimelineRun } from './types';

interface TimelineUpcomingListProps {
  runs: TimelineRun[];
  limit?: number;
}

export const TimelineUpcomingList: React.FC<TimelineUpcomingListProps> = ({ runs, limit = 20 }) => {
  const displayedRuns = runs.slice(0, limit);

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-500" />
          Upcoming Execution Stream ({displayedRuns.length})
        </h3>
        <span className="text-[11px] text-on-surface-variant">Chronological execution order</span>
      </div>

      {displayedRuns.length === 0 ? (
        <div className="py-8 text-center text-xs text-outline">
          No upcoming executions in the selected time range.
        </div>
      ) : (
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {displayedRuns.map((run, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-surface border border-outline-variant rounded-lg text-xs hover:border-outline transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: run.color }}
                />
                <span className="font-semibold text-on-surface">{run.jobName}</span>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-on-surface-variant flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-outline" />
                  {run.formattedDate}
                </span>
                <span className="text-primary font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  {run.formattedTime}
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-amber-700 dark:text-amber-300 font-sans text-[10px] border border-outline-variant/40">
                  {run.relativeTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
