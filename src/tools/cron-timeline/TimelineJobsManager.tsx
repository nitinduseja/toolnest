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
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200">Scheduled Jobs ({jobs.length})</h3>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Job
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="mb-4 p-3 bg-slate-800/80 border border-indigo-500/30 rounded-xl space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label
                htmlFor="new-job-name"
                className="block text-[11px] font-medium text-slate-400 mb-1"
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
                className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="new-job-cron"
                className="block text-[11px] font-medium text-slate-400 mb-1"
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
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="new-job-cmd"
                className="block text-[11px] font-medium text-slate-400 mb-1"
              >
                Command / Script (Optional)
              </label>
              <input
                id="new-job-cmd"
                type="text"
                value={newCmd}
                onChange={(e) => setNewCmd(e.target.value)}
                placeholder="/usr/bin/python task.py"
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
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
                  ? 'bg-slate-800/40 border-slate-700/60'
                  : 'bg-slate-900/30 border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onToggleJob(job.id)}
                  title={job.enabled ? 'Disable Job' : 'Enable Job'}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {job.enabled ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <CircleOff className="w-4 h-4 text-slate-600" />
                  )}
                </button>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: job.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-100">{job.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-indigo-300 border border-slate-700">
                      {job.expression}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    {parsed.valid ? (
                      parsed.humanDescription
                    ) : (
                      <span className="text-rose-400 flex items-center gap-0.5">
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
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
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
