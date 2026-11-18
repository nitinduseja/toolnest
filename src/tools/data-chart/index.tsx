import { useState, useMemo, useCallback } from 'react';
import { BarChart2, Table, Upload } from 'lucide-react';
import { DataRow, ChartConfig } from './types';
import { parseData, exportToCsv } from './dataParser';
import { inferColumns, computeColumnStats, aggregateData } from './statsEngine';
import { DATA_PRESETS } from './presets';
import { DataControls } from './DataControls';
import { DataPreviewStage } from './DataPreviewStage';
import { DataStatsCards } from './DataStatsCards';
import { DataTableView } from './DataTableView';
import { DataImportModal } from './DataImportModal';
import { useToolHandoff } from '@/lib/handoff/crossToolHandoff';
import { CrossToolHandoffButton } from '@/components/molecules/CrossToolHandoffButton';

export default function DataChartTool() {
  const [data, setData] = useState<DataRow[]>(() => parseData(DATA_PRESETS[0].rawCsv));
  const [config, setConfig] = useState<ChartConfig>({
    chartType: 'bar',
    dimension: DATA_PRESETS[0].defaultDimension,
    metric: DATA_PRESETS[0].defaultMetric,
    aggregate: 'sum',
    theme: 'indigo',
    title: 'SaaS Monthly Performance',
    showGrid: true,
    showLegend: true,
  });
  const [activeView, setActiveView] = useState<'chart' | 'table'>('chart');
  const [isImportOpen, setIsImportOpen] = useState(false);

  const columns = useMemo(() => inferColumns(data), [data]);
  const points = useMemo(() => aggregateData(data, config), [data, config]);
  const stats = useMemo(() => computeColumnStats(data, config.metric), [data, config.metric]);

  const handleUpdateConfig = (updates: Partial<ChartConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = DATA_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const parsed = parseData(preset.rawCsv);
    setData(parsed);
    setConfig((prev) => ({
      ...prev,
      chartType: preset.defaultType,
      dimension: preset.defaultDimension,
      metric: preset.defaultMetric,
      title: preset.name,
    }));
  };

  const handleImport = useCallback((rawText: string) => {
    const parsed = parseData(rawText);
    if (parsed.length > 0) {
      setData(parsed);
      const cols = inferColumns(parsed);
      const numCol = cols.find((c) => c.type === 'number')?.name || '';
      const dimCol = cols.find((c) => c.name !== numCol)?.name || cols[0]?.name || '';
      setConfig((prev) => ({
        ...prev,
        dimension: dimCol,
        metric: numCol,
        title: 'Custom Dataset',
      }));
    }
  }, []);

  useToolHandoff('data-chart', handleImport);

  const getExportData = useCallback(() => {
    const colNames = columns.map((c) => c.name);
    return exportToCsv(data, colNames);
  }, [data, columns]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface-container-low border border-outline-variant/60 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              Data Pivot & Chart Visualizer
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {data.length} records
              </span>
            </h2>
            <p className="text-xs text-on-surface-variant">
              Interactive CSV & JSON tabular explorer, column analytics, and pure SVG chart
              generator.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="flex items-center bg-surface-container border border-outline-variant rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveView('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'chart'
                  ? 'bg-primary text-on-primary font-medium shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Chart View
            </button>
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'table'
                  ? 'bg-primary text-on-primary font-medium shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Data Table
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-on-surface bg-surface hover:bg-surface-container-high border border-outline-variant rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-sky-500" />
            Import Data
          </button>

          <CrossToolHandoffButton
            targets={[{ slug: 'csv-json', label: 'Open in CSV/JSON' }]}
            getData={getExportData}
            sourceSlug="data-chart"
            disabled={data.length === 0}
          />
        </div>
      </div>

      {/* Summary statistics row */}
      <DataStatsCards metricName={config.metric} stats={stats} />

      {/* Main View Area */}
      {activeView === 'chart' ? (
        <div className="space-y-6">
          <DataControls
            config={config}
            columns={columns}
            onChangeConfig={handleUpdateConfig}
            onLoadPreset={handleLoadPreset}
          />
          <DataPreviewStage points={points} config={config} />
        </div>
      ) : (
        <DataTableView data={data} columns={columns} />
      )}

      {/* Import Modal */}
      <DataImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
