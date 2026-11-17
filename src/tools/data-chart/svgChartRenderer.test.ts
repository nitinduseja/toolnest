import { describe, it, expect } from 'vitest';
import { generateChartSvg } from './svgChartRenderer';
import { AggregatedPoint, ChartConfig } from './types';

describe('svgChartRenderer', () => {
  const points: AggregatedPoint[] = [
    { label: 'Alpha', value: 100, formattedValue: '100', color: '#6366F1', percent: 25 },
    { label: 'Beta', value: 300, formattedValue: '300', color: '#EC4899', percent: 75 },
  ];

  it('generates valid SVG for bar chart', () => {
    const config: ChartConfig = {
      chartType: 'bar',
      dimension: 'Group',
      metric: 'Value',
      aggregate: 'sum',
      theme: 'indigo',
      title: 'Bar Test',
      showGrid: true,
      showLegend: true,
    };
    const svg = generateChartSvg(points, config);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('Bar Test');
    expect(svg).toContain('<rect');
  });

  it('generates valid SVG for line and area charts', () => {
    const lineConfig: ChartConfig = {
      chartType: 'line',
      dimension: 'Group',
      metric: 'Value',
      aggregate: 'sum',
      theme: 'emerald',
      title: 'Line Test',
      showGrid: true,
      showLegend: true,
    };
    const lineSvg = generateChartSvg(points, lineConfig);
    expect(lineSvg).toContain('<path');
    expect(lineSvg).toContain('<circle');

    const areaSvg = generateChartSvg(points, { ...lineConfig, chartType: 'area' });
    expect(areaSvg).toContain('fill-opacity="0.25"');
  });

  it('generates valid SVG for donut chart', () => {
    const config: ChartConfig = {
      chartType: 'donut',
      dimension: 'Group',
      metric: 'Value',
      aggregate: 'sum',
      theme: 'sunset',
      title: 'Donut Test',
      showGrid: false,
      showLegend: true,
    };
    const svg = generateChartSvg(points, config);
    expect(svg).toContain('<path');
    expect(svg).toContain('Alpha (25%)');
  });

  it('generates light mode SVG with white background and dark text when isDark is false', () => {
    const config: ChartConfig = {
      chartType: 'bar',
      dimension: 'Group',
      metric: 'Value',
      aggregate: 'sum',
      theme: 'indigo',
      title: 'Light Theme Chart',
      showGrid: true,
      showLegend: true,
    };
    const lightSvg = generateChartSvg(points, config, false);
    expect(lightSvg).toContain('fill="#FFFFFF"');
    expect(lightSvg).toContain('fill="#0F172A"');
    expect(lightSvg).toContain('Light Theme Chart');
  });
});
