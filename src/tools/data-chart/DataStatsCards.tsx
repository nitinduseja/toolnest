import React from 'react';
import { Calculator, TrendingUp, Layers, Hash } from 'lucide-react';
import { ColumnStats } from './types';

interface DataStatsCardsProps {
  metricName: string;
  stats: ColumnStats | null;
}

export const DataStatsCards: React.FC<DataStatsCardsProps> = ({ metricName, stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
          <Hash className="w-3 h-3 text-indigo-400" /> Count ({metricName})
        </div>
        <div className="text-base font-bold text-slate-100 mt-1">{stats.count}</div>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
          <Calculator className="w-3 h-3 text-sky-400" /> Sum
        </div>
        <div
          className="text-base font-bold text-slate-100 mt-1 truncate"
          title={stats.sum.toLocaleString()}
        >
          {stats.sum.toLocaleString()}
        </div>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-400" /> Mean (Avg)
        </div>
        <div
          className="text-base font-bold text-slate-100 mt-1 truncate"
          title={stats.mean.toLocaleString()}
        >
          {stats.mean.toLocaleString()}
        </div>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
          <Layers className="w-3 h-3 text-purple-400" /> Median
        </div>
        <div
          className="text-base font-bold text-slate-100 mt-1 truncate"
          title={stats.median.toLocaleString()}
        >
          {stats.median.toLocaleString()}
        </div>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="text-[10px] font-medium text-slate-400">Min</div>
        <div
          className="text-base font-bold text-slate-100 mt-1 truncate"
          title={stats.min.toLocaleString()}
        >
          {stats.min.toLocaleString()}
        </div>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="text-[10px] font-medium text-slate-400">Max</div>
        <div
          className="text-base font-bold text-slate-100 mt-1 truncate"
          title={stats.max.toLocaleString()}
        >
          {stats.max.toLocaleString()}
        </div>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl col-span-2 sm:col-span-1">
        <div className="text-[10px] font-medium text-slate-400">Std Dev (σ)</div>
        <div
          className="text-base font-bold text-slate-100 mt-1 truncate"
          title={stats.stdDev.toLocaleString()}
        >
          {stats.stdDev.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
