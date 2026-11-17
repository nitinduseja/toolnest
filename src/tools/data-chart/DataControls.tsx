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
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant pb-3">
        {/* Chart Type Selector */}
        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg border border-outline-variant">
          {CHART_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChangeConfig({ chartType: id })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                config.chartType === id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-on-surface bg-surface hover:bg-surface-container-high border border-outline-variant rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Sample Data
          </button>
          <div className="absolute right-0 top-full mt-1 w-60 p-1 bg-surface border border-outline-variant rounded-xl shadow-xl hidden group-hover:block z-30">
            {DATA_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onLoadPreset(preset.id)}
                className="w-full text-left p-2 rounded-lg hover:bg-surface-container-high text-xs text-on-surface transition-colors"
              >
                <div className="font-semibold text-on-surface">{preset.name}</div>
                <div className="text-[10px] text-on-surface-variant truncate">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Dimension X-Axis */}
        <div>
          <label
            htmlFor="select-dim"
            className="block text-[11px] font-medium text-on-surface-variant mb-1"
          >
            Dimension (X-Axis)
          </label>
          <select
            id="select-dim"
            value={config.dimension}
            onChange={(e) => onChangeConfig({ dimension: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="block text-[11px] font-medium text-on-surface-variant mb-1"
          >
            Metric (Y-Axis)
          </label>
          <select
            id="select-metric"
            value={config.metric}
            onChange={(e) => onChangeConfig({ metric: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
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
          <label
            htmlFor="select-agg"
            className="block text-[11px] font-medium text-on-surface-variant mb-1"
          >
            Aggregation
          </label>
          <select
            id="select-agg"
            value={config.aggregate}
            onChange={(e) => onChangeConfig({ aggregate: e.target.value as AggregateType })}
            className="w-full px-2.5 py-1.5 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="block text-[11px] font-medium text-on-surface-variant mb-1"
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
                  config.theme === t.id
                    ? 'scale-110 border-primary ring-2 ring-primary/30'
                    : 'border-transparent opacity-70'
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
