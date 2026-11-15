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
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          Upcoming Execution Stream ({displayedRuns.length})
        </h3>
        <span className="text-[11px] text-slate-400">Chronological execution order</span>
      </div>

      {displayedRuns.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No upcoming executions in the selected time range.
        </div>
      ) : (
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {displayedRuns.map((run, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-800/40 border border-slate-800 rounded-lg text-xs hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: run.color }}
                />
                <span className="font-semibold text-slate-100">{run.jobName}</span>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {run.formattedDate}
                </span>
                <span className="text-indigo-300 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  {run.formattedTime}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-sans text-[10px]">
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
