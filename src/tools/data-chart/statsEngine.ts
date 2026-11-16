import {
  DataRow,
  ColumnMeta,
  ColumnType,
  ColumnStats,
  ChartConfig,
  AggregatedPoint,
} from './types';
import { THEME_PALETTES } from './presets';

function inferType(values: unknown[]): ColumnType {
  const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '');
  if (nonNull.length === 0) return 'string';

  const isAllNum = nonNull.every((v) => typeof v === 'number');
  if (isAllNum) return 'number';

  const isAllBool = nonNull.every((v) => typeof v === 'boolean');
  if (isAllBool) return 'boolean';

  return 'string';
}

export function inferColumns(data: DataRow[]): ColumnMeta[] {
  if (data.length === 0) return [];
  const keys = Array.from(new Set(data.flatMap((row) => Object.keys(row))));

  return keys.map((key) => {
    const values = data.map((row) => row[key]);
    const nullCount = values.filter((v) => v === null || v === undefined || v === '').length;
    return {
      name: key,
      type: inferType(values),
      count: data.length,
      nullCount,
    };
  });
}

function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function computeColumnStats(data: DataRow[], column: string): ColumnStats | null {
  const numbers = data
    .map((row) => row[column])
    .filter((v): v is number => typeof v === 'number' && !isNaN(v));

  if (numbers.length === 0) return null;

  const count = numbers.length;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / count;
  const median = calculateMedian(numbers);

  const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count;
  const stdDev = Math.sqrt(variance);

  return {
    count,
    min,
    max,
    sum: Math.round(sum * 100) / 100,
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
  };
}

function computeAggregate(vals: number[], type: string): number {
  if (vals.length === 0) return 0;
  if (type === 'count') return vals.length;
  if (type === 'min') return Math.min(...vals);
  if (type === 'max') return Math.max(...vals);
  const sum = vals.reduce((a, b) => a + b, 0);
  if (type === 'avg') return sum / vals.length;
  return sum; // default sum
}

export function aggregateData(data: DataRow[], config: ChartConfig): AggregatedPoint[] {
  if (data.length === 0 || !config.dimension || !config.metric) return [];

  const groups = new Map<string, number[]>();
  data.forEach((row) => {
    const rawDim = row[config.dimension];
    const dim = rawDim === null || rawDim === undefined ? 'Unknown' : String(rawDim);
    const rawVal = row[config.metric];
    const num = typeof rawVal === 'number' ? rawVal : parseFloat(String(rawVal || 0)) || 0;

    const list = groups.get(dim) ?? [];
    list.push(num);
    groups.set(dim, list);
  });

  const palette = THEME_PALETTES[config.theme] || THEME_PALETTES.indigo;
  const points: AggregatedPoint[] = [];
  let totalSum = 0;

  let colorIdx = 0;
  groups.forEach((vals, label) => {
    const val = Math.round(computeAggregate(vals, config.aggregate) * 100) / 100;
    totalSum += Math.max(0, val);
    points.push({
      label,
      value: val,
      formattedValue: val.toLocaleString(),
      color: palette[colorIdx % palette.length],
      percent: 0,
    });
    colorIdx += 1;
  });

  points.forEach((p) => {
    p.percent = totalSum > 0 ? Math.round((Math.max(0, p.value) / totalSum) * 1000) / 10 : 0;
  });

  return points;
}
