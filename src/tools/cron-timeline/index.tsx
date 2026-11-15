import { useState, useMemo } from 'react';
import { Clock, Flame, ListOrdered } from 'lucide-react';
import { CronJobItem, ViewHorizon } from './types';
import { PRESET_SUITES } from './presets';
import {
  generateJobRuns,
  detectCollisions,
  calculateHourlyDensity,
  calculateTimelineStats,
  exportCrontabFormat,
} from './timelineLogic';
import { TimelineHeader } from './TimelineHeader';
import { TimelineStatsBar } from './TimelineStatsBar';
import { TimelineJobsManager } from './TimelineJobsManager';
import { TimelineGanttView } from './TimelineGanttView';
import { TimelineHeatmapView } from './TimelineHeatmapView';
import { TimelineUpcomingList } from './TimelineUpcomingList';
import { ImportCrontabModal } from './ImportCrontabModal';

type ActiveTab = 'timeline' | 'density' | 'upcoming';

export default function CronTimelineTool() {
  const [jobs, setJobs] = useState<CronJobItem[]>(() =>
    PRESET_SUITES[0].jobs.map((j, i) => ({ ...j, id: `job-${i + 1}` }))
  );
  const [timezone, setTimezone] = useState<string>('UTC');
  const [horizon, setHorizon] = useState<ViewHorizon>('24h');
  const [activeTab, setActiveTab] = useState<ActiveTab>('timeline');
  const [isImportOpen, setIsImportOpen] = useState(false);

  const now = useMemo(() => new Date(), []);
  const range24h = useMemo(
    () => ({
      start: now,
      end: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    }),
    [now]
  );

  const range7d = useMemo(
    () => ({
      start: now,
      end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    }),
    [now]
  );

  const activeRange = horizon === '24h' ? range24h : range7d;

  const runs24h = useMemo(
    () => generateJobRuns(jobs, range24h, timezone),
    [jobs, range24h, timezone]
  );

  const runs7d = useMemo(() => generateJobRuns(jobs, range7d, timezone), [jobs, range7d, timezone]);

  const currentRuns = horizon === '24h' ? runs24h : runs7d;

  const jobMap = useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs]);
  const collisions = useMemo(() => detectCollisions(runs24h, jobMap), [runs24h, jobMap]);
  const density = useMemo(() => calculateHourlyDensity(runs24h), [runs24h]);

  const stats = useMemo(
    () => calculateTimelineStats({ jobs, runs24h, runs7d, collisions }),
    [jobs, runs24h, runs7d, collisions]
  );

  const handleToggleJob = (id: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, enabled: !j.enabled } : j)));
  };

  const handleUpdateJob = (id: string, updates: Partial<CronJobItem>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
  };

  const handleDeleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleAddJob = (job: Omit<CronJobItem, 'id'>) => {
    const id = `job-${Date.now()}`;
    setJobs((prev) => [...prev, { ...job, id }]);
  };

  const handleLoadPreset = (presetId: string) => {
    const target = PRESET_SUITES.find((p) => p.id === presetId);
    if (!target) return;
    setJobs(target.jobs.map((j, i) => ({ ...j, id: `job-${Date.now()}-${i}` })));
  };

  const handleImport = (importedJobs: Omit<CronJobItem, 'id'>[]) => {
    const newItems = importedJobs.map((j, i) => ({ ...j, id: `job-${Date.now()}-${i}` }));
    setJobs((prev) => [...prev, ...newItems]);
  };

  const handleCopyCrontab = () => {
    navigator.clipboard.writeText(exportCrontabFormat(jobs));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <TimelineHeader
        timezone={timezone}
        onTimezoneChange={setTimezone}
        horizon={horizon}
        onHorizonChange={setHorizon}
        onLoadPreset={handleLoadPreset}
        onOpenImportModal={() => setIsImportOpen(true)}
        onCopyCrontab={handleCopyCrontab}
      />

      <TimelineStatsBar stats={stats} />

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`pb-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'timeline'
              ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" /> Timeline Gantt
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('density')}
          className={`pb-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'density'
              ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" /> Load Heatmap & Collisions ({collisions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`pb-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'upcoming'
              ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-4 h-4" /> Upcoming Stream
        </button>
      </div>

      {activeTab === 'timeline' && (
        <TimelineGanttView
          jobs={jobs}
          runs={currentRuns}
          horizon={horizon}
          rangeStart={activeRange.start}
          rangeEnd={activeRange.end}
        />
      )}

      {activeTab === 'density' && <TimelineHeatmapView density={density} collisions={collisions} />}

      {activeTab === 'upcoming' && <TimelineUpcomingList runs={currentRuns} limit={30} />}

      <TimelineJobsManager
        jobs={jobs}
        onToggleJob={handleToggleJob}
        onUpdateJob={handleUpdateJob}
        onDeleteJob={handleDeleteJob}
        onAddJob={handleAddJob}
      />

      <ImportCrontabModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
