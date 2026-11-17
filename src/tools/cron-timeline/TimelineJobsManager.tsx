import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, CircleOff, AlertCircle } from 'lucide-react';
import { CronJobItem } from './types';
import { parseCron } from './cronEngine';
import { JOB_COLORS } from './presets';

interface TimelineJobsManagerProps {
  jobs: CronJobItem[];
  onToggleJob: (id: string) => void;
  onUpdateJob: (id: string, updates: Partial<CronJobItem>) => void;
  onDeleteJob: (id: string) => void;
  onAddJob: (job: Omit<CronJobItem, 'id'>) => void;
}

export const TimelineJobsManager: React.FC<TimelineJobsManagerProps> = ({
  jobs,
  onToggleJob,
  onUpdateJob,
  onDeleteJob,
  onAddJob,
}) => {
  const [newName, setNewName] = useState('');
  const [newExpr, setNewExpr] = useState('0 0 * * *');
  const [newCmd, setNewCmd] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseCron(newExpr);
    if (!parsed.valid || !newName.trim()) return;

    const nextColor = JOB_COLORS[jobs.length % JOB_COLORS.length];
    onAddJob({
      name: newName.trim(),
      expression: newExpr.trim(),
      color: nextColor,
      enabled: true,
      command: newCmd.trim() || undefined,
    });

    setNewName('');
    setNewExpr('0 0 * * *');
    setNewCmd('');
    setIsAdding(false);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-on-surface">Scheduled Jobs ({jobs.length})</h3>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-on-primary bg-primary hover:bg-primary/90 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Job
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="mb-4 p-3 bg-surface border border-primary/30 rounded-xl space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label
                htmlFor="new-job-name"
                className="block text-[11px] font-medium text-on-surface-variant mb-1"
              >
                Job Name
              </label>
              <input
                id="new-job-name"
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Daily Data Sync"
                className="w-full px-2.5 py-1.5 text-xs bg-surface-container border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="new-job-cron"
                className="block text-[11px] font-medium text-on-surface-variant mb-1"
              >
                Cron Expression (5-part)
              </label>
              <input
                id="new-job-cron"
                type="text"
                required
                value={newExpr}
                onChange={(e) => setNewExpr(e.target.value)}
                placeholder="0 0 * * *"
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-surface-container border border-outline-variant rounded-lg text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="new-job-cmd"
                className="block text-[11px] font-medium text-on-surface-variant mb-1"
              >
                Command / Script (Optional)
              </label>
              <input
                id="new-job-cmd"
                type="text"
                value={newCmd}
                onChange={(e) => setNewCmd(e.target.value)}
                placeholder="/usr/bin/python task.py"
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-surface-container border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-xs text-on-surface-variant hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-medium text-on-primary bg-primary hover:bg-primary/90 rounded-lg"
            >
              Save Job
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {jobs.map((job) => {
          const parsed = parseCron(job.expression);
          return (
            <div
              key={job.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border transition-all ${
                job.enabled
                  ? 'bg-surface border-outline-variant/60'
                  : 'bg-surface-container-low/50 border-outline-variant/40 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onToggleJob(job.id)}
                  title={job.enabled ? 'Disable Job' : 'Enable Job'}
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {job.enabled ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <CircleOff className="w-4 h-4 text-outline" />
                  )}
                </button>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: job.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-on-surface">{job.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container text-primary border border-outline-variant">
                      {job.expression}
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                    {parsed.valid ? (
                      parsed.humanDescription
                    ) : (
                      <span className="text-rose-500 flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3" /> Invalid cron expression
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pl-7 sm:pl-0">
                <input
                  type="color"
                  value={job.color}
                  onChange={(e) => onUpdateJob(job.id, { color: e.target.value })}
                  title="Change Job Color"
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <button
                  type="button"
                  onClick={() => onDeleteJob(job.id)}
                  title="Remove Job"
                  className="p-1 text-on-surface-variant hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
