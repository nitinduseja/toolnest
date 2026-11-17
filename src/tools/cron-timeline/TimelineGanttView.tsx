import React, { useState } from 'react';
import { Clock, Info } from 'lucide-react';
import { CronJobItem, TimelineRun, ViewHorizon } from './types';

interface TimelineGanttViewProps {
  jobs: CronJobItem[];
  runs: TimelineRun[];
  horizon: ViewHorizon;
  rangeStart: Date;
  rangeEnd: Date;
}

export const TimelineGanttView: React.FC<TimelineGanttViewProps> = ({
  jobs,
  runs,
  horizon,
  rangeStart,
  rangeEnd,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<TimelineRun | null>(null);

  const startMs = rangeStart.getTime();
  const totalMs = Math.max(1, rangeEnd.getTime() - startMs);
  const activeJobs = jobs.filter((j) => j.enabled);

  const hourMarkers =
    horizon === '24h'
      ? Array.from({ length: 25 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
      : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Execution Timeline ({horizon === '24h' ? '24 Hours' : '7 Days'})
        </h3>
        <span className="text-[11px] text-on-surface-variant">
          Showing {runs.length} execution points across {activeJobs.length} active jobs
        </span>
      </div>

      <div className="relative border border-outline-variant rounded-lg bg-surface p-3 overflow-x-auto min-w-[650px]">
        {/* Time Axis Labels */}
        <div className="flex justify-between border-b border-outline-variant pb-2 mb-3 text-[10px] font-mono text-outline">
          {hourMarkers.map((label, idx) => (
            <span key={idx} className="truncate">
              {idx % (horizon === '24h' ? 4 : 1) === 0 ? label : ''}
            </span>
          ))}
        </div>

        {/* Lanes for each job */}
        <div className="space-y-3">
          {activeJobs.map((job) => {
            const jobRuns = runs.filter((r) => r.jobId === job.id);
            return (
              <div key={job.id} className="relative group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: job.color }}
                    />
                    <span className="font-medium text-on-surface">{job.name}</span>
                    <span className="text-[10px] font-mono text-outline">({job.expression})</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    {jobRuns.length} {jobRuns.length === 1 ? 'run' : 'runs'}
                  </span>
                </div>

                {/* Track Bar */}
                <div className="relative h-6 bg-surface-container rounded-md border border-outline-variant/60 w-full overflow-visible">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="border-r border-outline-variant h-full" />
                    ))}
                  </div>

                  {/* Execution Markers */}
                  {jobRuns.map((run, rIdx) => {
                    const offsetPct = Math.min(
                      100,
                      Math.max(0, ((run.timestamp - startMs) / totalMs) * 100)
                    );
                    return (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() => setActiveTooltip(run)}
                        onMouseEnter={() => setActiveTooltip(run)}
                        style={{
                          left: `${offsetPct}%`,
                          backgroundColor: job.color,
                        }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-surface shadow-sm hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                        title={`${run.jobName} at ${run.formattedTime} (${run.relativeTime})`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tooltip Drawer */}
        {activeTooltip && (
          <div className="mt-4 p-2.5 bg-surface-container-high border border-outline-variant rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeTooltip.color }}
              />
              <span className="font-semibold text-on-surface">{activeTooltip.jobName}</span>
              <span className="text-on-surface-variant">•</span>
              <span className="font-mono text-primary font-medium">
                {activeTooltip.formattedDate} {activeTooltip.formattedTime}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-container text-on-surface-variant border border-outline-variant/40">
                {activeTooltip.relativeTime}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTooltip(null)}
              className="text-on-surface-variant hover:text-on-surface text-xs px-2 py-0.5"
            >
              Close
            </button>
          </div>
        )}

        {activeJobs.length === 0 && (
          <div className="py-8 text-center text-xs text-outline">
            <Info className="w-5 h-5 mx-auto mb-1 opacity-40" />
            No active jobs enabled. Enable or add a job above to visualize its timeline.
          </div>
        )}
      </div>
    </div>
  );
};
