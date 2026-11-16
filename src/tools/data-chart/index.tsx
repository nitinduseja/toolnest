import { useState, useMemo } from 'react';
import { BarChart2, Table, Upload } from 'lucide-react';
import { DataRow, ChartConfig } from './types';
import { parseData } from './dataParser';
import { inferColumns, computeColumnStats, aggregateData } from './statsEngine';
import { DATA_PRESETS } from './presets';
import { DataControls } from './DataControls';
import { DataPreviewStage } from './DataPreviewStage';
import { DataStatsCards } from './DataStatsCards';
import { DataTableView } from './DataTableView';
import { DataImportModal } from './DataImportModal';

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

  const handleImport = (rawText: string) => {
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
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Data Pivot & Chart Visualizer
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {data.length} records
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive CSV & JSON tabular explorer, column analytics, and pure SVG chart
              generator.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveView('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'chart'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
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
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Data Table
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            Import Data
          </button>
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
