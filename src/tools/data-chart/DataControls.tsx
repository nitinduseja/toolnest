import React from 'react';
import { BarChart2, TrendingUp, PieChart, Sparkles } from 'lucide-react';
import { ChartConfig, ChartType, AggregateType, ColorTheme, ColumnMeta } from './types';
import { DATA_PRESETS } from './presets';

interface DataControlsProps {
  config: ChartConfig;
  columns: ColumnMeta[];
  onChangeConfig: (updates: Partial<ChartConfig>) => void;
  onLoadPreset: (presetId: string) => void;
}

const CHART_TYPES: {
  id: ChartType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'bar', label: 'Bar', icon: BarChart2 },
  { id: 'line', label: 'Line', icon: TrendingUp },
  { id: 'area', label: 'Area', icon: TrendingUp },
  { id: 'donut', label: 'Donut', icon: PieChart },
];

const AGGREGATES: { id: AggregateType; label: string }[] = [
  { id: 'sum', label: 'Sum' },
  { id: 'avg', label: 'Average' },
  { id: 'count', label: 'Count' },
  { id: 'min', label: 'Min' },
  { id: 'max', label: 'Max' },
];

const THEMES: { id: ColorTheme; label: string; color: string }[] = [
  { id: 'indigo', label: 'Indigo', color: '#6366F1' },
  { id: 'emerald', label: 'Emerald', color: '#10B981' },
  { id: 'amber', label: 'Amber', color: '#F59E0B' },
  { id: 'sunset', label: 'Sunset', color: '#F43F5E' },
  { id: 'cyber', label: 'Cyber', color: '#06B6D4' },
];

export const DataControls: React.FC<DataControlsProps> = ({
  config,
  columns,
  onChangeConfig,
  onLoadPreset,
}) => {
  const numericColumns = columns.filter((c) => c.type === 'number');

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        {/* Chart Type Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {CHART_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChangeConfig({ chartType: id })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                config.chartType === id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Presets Dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Sample Data
          </button>
          <div className="absolute right-0 top-full mt-1 w-60 p-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl hidden group-hover:block z-30">
            {DATA_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onLoadPreset(preset.id)}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-700 text-xs text-slate-200 transition-colors"
              >
                <div className="font-semibold text-slate-100">{preset.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Dimension X-Axis */}
        <div>
          <label htmlFor="select-dim" className="block text-[11px] font-medium text-slate-400 mb-1">
            Dimension (X-Axis)
          </label>
          <select
            id="select-dim"
            value={config.dimension}
            onChange={(e) => onChangeConfig({ dimension: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {columns.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>
        </div>

        {/* Metric Y-Axis */}
        <div>
          <label
            htmlFor="select-metric"
            className="block text-[11px] font-medium text-slate-400 mb-1"
          >
            Metric (Y-Axis)
          </label>
          <select
            id="select-metric"
            value={config.metric}
            onChange={(e) => onChangeConfig({ metric: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {numericColumns.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
            {numericColumns.length === 0 && <option value="">No numeric columns found</option>}
          </select>
        </div>

        {/* Aggregate Function */}
        <div>
          <label htmlFor="select-agg" className="block text-[11px] font-medium text-slate-400 mb-1">
            Aggregation
          </label>
          <select
            id="select-agg"
            value={config.aggregate}
            onChange={(e) => onChangeConfig({ aggregate: e.target.value as AggregateType })}
            className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {AGGREGATES.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Palette */}
        <div>
          <label
            htmlFor="select-theme"
            className="block text-[11px] font-medium text-slate-400 mb-1"
          >
            Palette Theme
          </label>
          <div className="flex items-center gap-1.5 mt-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onChangeConfig({ theme: t.id })}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  config.theme === t.id ? 'scale-110 border-white' : 'border-transparent opacity-70'
                }`}
                style={{ backgroundColor: t.color }}
                title={t.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
