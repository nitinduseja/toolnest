import { describe, it, expect } from 'vitest';
import { inferColumns, computeColumnStats, aggregateData } from './statsEngine';
import { DataRow, ChartConfig } from './types';

describe('statsEngine', () => {
  const sampleData: DataRow[] = [
    { Category: 'Tech', Sales: 100, Units: 5 },
    { Category: 'Tech', Sales: 200, Units: 10 },
    { Category: 'Retail', Sales: 300, Units: 15 },
    { Category: 'Retail', Sales: 400, Units: 20 },
  ];

  it('infers column types correctly (string, number, boolean)', () => {
    const cols = inferColumns([
      { name: 'Item', price: 99.9, inStock: true },
      { name: 'Widget', price: 10.0, inStock: false },
    ]);
    const nameCol = cols.find((c) => c.name === 'name');
    const priceCol = cols.find((c) => c.name === 'price');
    const stockCol = cols.find((c) => c.name === 'inStock');

    expect(nameCol?.type).toBe('string');
    expect(priceCol?.type).toBe('number');
    expect(stockCol?.type).toBe('boolean');
  });

  it('computes accurate numeric summary statistics', () => {
    const stats = computeColumnStats(sampleData, 'Sales');
    expect(stats).not.toBeNull();
    expect(stats?.count).toBe(4);
    expect(stats?.min).toBe(100);
    expect(stats?.max).toBe(400);
    expect(stats?.sum).toBe(1000);
    expect(stats?.mean).toBe(250);
    expect(stats?.median).toBe(250);
    expect(stats?.stdDev).toBeGreaterThan(0);
  });

  it('aggregates data by dimension with sum function', () => {
    const config: ChartConfig = {
      chartType: 'bar',
      dimension: 'Category',
      metric: 'Sales',
      aggregate: 'sum',
      theme: 'indigo',
      title: 'Sales by Category',
      showGrid: true,
      showLegend: true,
    };
    const points = aggregateData(sampleData, config);
    expect(points.length).toBe(2);

    const tech = points.find((p) => p.label === 'Tech');
    const retail = points.find((p) => p.label === 'Retail');
    expect(tech?.value).toBe(300); // 100 + 200
    expect(retail?.value).toBe(700); // 300 + 400
    expect(tech?.percent).toBe(30); // 300 / 1000 * 100
    expect(retail?.percent).toBe(70); // 700 / 1000 * 100
  });

  it('aggregates data with avg and count functions', () => {
    const baseConfig: ChartConfig = {
      chartType: 'bar',
      dimension: 'Category',
      metric: 'Sales',
      aggregate: 'avg',
      theme: 'emerald',
      title: 'Avg Sales',
      showGrid: true,
      showLegend: true,
    };
    const avgPoints = aggregateData(sampleData, baseConfig);
    const techAvg = avgPoints.find((p) => p.label === 'Tech');
    expect(techAvg?.value).toBe(150); // (100 + 200) / 2

    const countPoints = aggregateData(sampleData, { ...baseConfig, aggregate: 'count' });
    const techCount = countPoints.find((p) => p.label === 'Tech');
    expect(techCount?.value).toBe(2);
  });
});
