import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { CronJobItem } from './types';
import { parseCrontabInput } from './timelineLogic';

interface ImportCrontabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jobs: Omit<CronJobItem, 'id'>[]) => void;
}

export const ImportCrontabModal: React.FC<ImportCrontabModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleImportSubmit = () => {
    const jobs = parseCrontabInput(content);
    if (jobs.length > 0) {
      onImport(jobs);
      setContent('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-100">Import Crontab</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Paste the output of <code className="text-sky-300 font-mono">crontab -l</code> or any
          standard crontab file below. Lines starting with{' '}
          <code className="text-slate-300 font-mono">#</code> will be used as job titles.
        </p>

        <textarea
          rows={7}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`# Nightly DB Backup\n0 2 * * * /usr/local/bin/backup-db\n\n# Hourly Health Ping\n0 * * * * curl -s https://api.site.com/health`}
          className="w-full p-3 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImportSubmit}
            disabled={!content.trim()}
            className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors"
          >
            Import Jobs
          </button>
        </div>
      </div>
    </div>
  );
};
