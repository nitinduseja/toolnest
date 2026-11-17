import React from 'react';
import { AlertTriangle, CheckCircle2, Flame, Layers } from 'lucide-react';
import { DensitySlot, CollisionEvent } from './types';

interface TimelineHeatmapViewProps {
  density: DensitySlot[];
  collisions: CollisionEvent[];
}

export const TimelineHeatmapView: React.FC<TimelineHeatmapViewProps> = ({
  density,
  collisions,
}) => {
  const maxCount = Math.max(1, ...density.map((d) => d.count));

  const getHeatColor = (count: number) => {
    if (count === 0) return 'bg-surface-container text-outline border-outline-variant/60';
    const ratio = count / maxCount;
    if (ratio < 0.25)
      return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60';
    if (ratio < 0.5)
      return 'bg-indigo-200 dark:bg-indigo-900/70 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700/60';
    if (ratio < 0.75) return 'bg-indigo-600 text-white border-indigo-500';
    return 'bg-amber-600 text-white border-amber-400 font-bold';
  };

  return (
    <div className="space-y-4">
      {/* 24-Hour Density Heatmap */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            24-Hour Load Heatmap (Hourly Execution Density)
          </h3>
          <span className="text-[11px] text-on-surface-variant">Peak hour: {maxCount} runs</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
          {density.map((slot) => (
            <div
              key={slot.hour}
              className={`p-2 rounded-lg border text-center transition-all ${getHeatColor(
                slot.count
              )}`}
              title={`Hour ${String(slot.hour).padStart(2, '0')}:00 - ${slot.count} executions`}
            >
              <div className="text-[10px] font-mono opacity-70">
                {String(slot.hour).padStart(2, '0')}h
              </div>
              <div className="text-sm font-bold">{slot.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Collision & Concurrency Analysis */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            {collisions.length > 0 ? (
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
            Simultaneous Collision Analysis ({collisions.length})
          </h3>
          <span className="text-[11px] text-on-surface-variant">
            {collisions.length === 0
              ? 'No overlapping execution times detected'
              : 'Jobs firing at the exact same minute'}
          </span>
        </div>

        {collisions.length === 0 ? (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            All active cron jobs fire at distinct minutes. No simultaneous server load spikes
            detected.
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {collisions.map((col, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-200 font-mono font-bold">
                    {col.timeString}
                  </span>
                  <span className="text-on-surface-variant font-medium">({col.dateString})</span>
                  <span className="text-rose-600 dark:text-rose-300 font-semibold">
                    {col.jobs.length} simultaneous jobs:
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {col.jobs.map((j) => (
                    <span
                      key={j.jobId}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white flex items-center gap-1"
                      style={{ backgroundColor: j.color }}
                    >
                      <Layers className="w-2.5 h-2.5" />
                      {j.jobName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
