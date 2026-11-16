export type DataValue = string | number | boolean | null;

export type DataRow = Record<string, DataValue>;

export type ColumnType = 'number' | 'string' | 'date' | 'boolean';

export interface ColumnMeta {
  name: string;
  type: ColumnType;
  count: number;
  nullCount: number;
}

export type ChartType = 'bar' | 'line' | 'area' | 'donut';

export type AggregateType = 'sum' | 'avg' | 'count' | 'min' | 'max';

export type ColorTheme = 'indigo' | 'emerald' | 'amber' | 'sunset' | 'cyber';

export interface ChartConfig {
  chartType: ChartType;
  dimension: string;
  metric: string;
  aggregate: AggregateType;
  theme: ColorTheme;
  title: string;
  showGrid: boolean;
  showLegend: boolean;
}

export interface AggregatedPoint {
  label: string;
  value: number;
  formattedValue: string;
  color: string;
  percent: number;
}

export interface ColumnStats {
  count: number;
  min: number;
  max: number;
  sum: number;
  mean: number;
  median: number;
  stdDev: number;
}

export interface DataPreset {
  id: string;
  name: string;
  description: string;
  rawCsv: string;
  defaultDimension: string;
  defaultMetric: string;
  defaultType: ChartType;
}
