import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { TimelineStats } from './types';

interface TimelineStatsBarProps {
  stats: TimelineStats;
}

export const TimelineStatsBar: React.FC<TimelineStatsBarProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl">
        <div className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" /> Active Jobs
        </div>
        <div className="text-xl font-bold text-on-surface mt-1">
          {stats.activeJobs}{' '}
          <span className="text-xs font-normal text-outline">/ {stats.totalJobs}</span>
        </div>
      </div>

      <div className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl">
        <div className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-sky-500" /> Runs Next 24h
        </div>
        <div className="text-xl font-bold text-on-surface mt-1">{stats.runs24h}</div>
      </div>

      <div className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl">
        <div className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Runs Next 7 Days
        </div>
        <div className="text-xl font-bold text-on-surface mt-1">{stats.runs7d}</div>
      </div>

      <div className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl">
        <div className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-purple-500" /> Busiest Hour
        </div>
        <div className="text-xl font-bold text-on-surface mt-1">
          {stats.busiestHour !== null ? `${String(stats.busiestHour).padStart(2, '0')}:00` : 'None'}
        </div>
      </div>

      <div className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl">
        <div className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1.5">
          {stats.collisionCount > 0 ? (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          )}
          Collisions
        </div>
        <div
          className={`text-xl font-bold mt-1 ${
            stats.collisionCount > 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {stats.collisionCount === 0 ? '0 (Clean)' : stats.collisionCount}
        </div>
      </div>

      <div className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl">
        <div className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-teal-500" /> Min Interval
        </div>
        <div className="text-xl font-bold text-on-surface mt-1">
          {stats.shortestIntervalMinutes !== null ? `${stats.shortestIntervalMinutes}m` : '—'}
        </div>
      </div>
    </div>
  );
};
