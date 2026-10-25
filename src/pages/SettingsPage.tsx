import React, { useState, useRef } from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Shield,
  Trash2,
  CheckCircle2,
  Download,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from '@/features/theme/useTheme';
import { ThemePreference } from '@/features/theme/themeContext';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';
import { GithubIcon } from '@/components/atoms/GithubIcon';
import { downloadFile } from '@/lib/downloads';

export const SettingsPage: React.FC = () => {
  const { preference, setPreference } = useTheme();
  const { favorites, toggleFavorite } = useFavorites();
  const { recentToolIds, clearRecentTools } = useRecentTools();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleClearAllStorage = () => {
    if (window.confirm('Reset all Toolnest preferences and local history?')) {
      clearRecentTools();
      favorites.forEach((id) => toggleFavorite(id));
      setPreference('system');
      setImportStatus('All local storage reset successfully.');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  const handleExportBackup = () => {
    const backup = {
      app: 'Toolnest',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      theme: preference,
      favorites,
      recentToolIds,
    };
    downloadFile(JSON.stringify(backup, null, 2), {
      filename: `toolnest-backup-${new Date().toISOString().slice(0, 10)}.json`,
      mimeType: 'application/json',
    });
    setImportStatus('Backup exported successfully.');
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    file
      .text()
      .then((raw) => {
        const data = JSON.parse(raw);
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid JSON format.');
        }

        if (Array.isArray(data.favorites)) {
          // Sync favorites
          favorites.forEach((id) => {
            if (!data.favorites.includes(id)) toggleFavorite(id);
          });
          data.favorites.forEach((id: string) => {
            if (!favorites.includes(id)) toggleFavorite(id);
          });
        }

        if (data.theme === 'light' || data.theme === 'dark' || data.theme === 'system') {
          setPreference(data.theme);
        }

        setImportError(null);
        setImportStatus('Backup preferences imported successfully.');
        setTimeout(() => setImportStatus(null), 3500);
      })
      .catch((err: unknown) => {
        setImportStatus(null);
        setImportError(err instanceof Error ? err.message : 'Failed to import backup file.');
        setTimeout(() => setImportError(null), 4000);
      });
  };

  const themeOptions: { id: ThemePreference; label: string; icon: React.ReactNode }[] = [
    { id: 'system', label: 'System Theme', icon: <Monitor className="w-4 h-4" /> },
    { id: 'light', label: 'Light Mode', icon: <Sun className="w-4 h-4" /> },
    { id: 'dark', label: 'Dark Mode', icon: <Moon className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <input
        ref={importInputRef}
        type="file"
        accept=".json"
        onChange={handleImportBackup}
        className="hidden"
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          Settings &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Configure appearance, view privacy specifications, and manage local browser state.
        </p>
      </div>

      {/* Notifications */}
      {importStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-500 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}
      {importError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{importError}</span>
        </div>
      )}

      {/* Theme Preference */}
      <section className="p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface">
          Appearance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPreference(opt.id)}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                preference === opt.id
                  ? 'border-primary bg-primary-container/10 text-primary font-semibold'
                  : 'border-outline-variant bg-surface hover:bg-surface-container text-on-surface'
              }`}
            >
              {opt.icon}
              <span className="text-xs">{opt.label}</span>
              {preference === opt.id && <CheckCircle2 className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>
      </section>

      {/* Privacy Guarantee */}
      <section className="p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-emerald-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface">
            Zero-Telemetry &amp; Privacy Guarantee
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Toolnest is deliberately built without servers, databases, or remote telemetry. Inputs
          entered into any tool (such as passwords, tokens, hashes, JSON strings, or CSV files) are
          computed strictly inside your browser&#39;s local memory and never sent over the network.
        </p>
        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          <span className="px-2.5 py-1 rounded bg-surface text-on-surface font-mono text-[11px] border border-outline-variant">
            No Remote APIs
          </span>
          <span className="px-2.5 py-1 rounded bg-surface text-on-surface font-mono text-[11px] border border-outline-variant">
            No Third-Party Analytics
          </span>
          <span className="px-2.5 py-1 rounded bg-surface text-on-surface font-mono text-[11px] border border-outline-variant">
            100% In-Memory Computations
          </span>
        </div>
      </section>

      {/* Local Data Storage Management */}
      <section className="p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface">
          Local Storage &amp; Backup
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <div className="font-medium text-on-surface">Browser State</div>
            <div className="text-on-surface-variant">
              Favorites ({favorites.length}) • Recent history items ({recentToolIds.length})
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container text-on-surface font-medium transition-colors"
              title="Download JSON backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container text-on-surface font-medium transition-colors"
              title="Restore from JSON backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Backup</span>
            </button>
            <button
              type="button"
              onClick={handleClearAllStorage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-500 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </section>

      {/* About & Version Information */}
      <section className="p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface">
          About Toolnest
        </h2>
        <div className="text-xs sm:text-sm text-on-surface-variant space-y-2">
          <p>Version 1.0.0 • MIT Open Source License</p>
          <p>Deployable as a static client-side SPA on Netlify.</p>
        </div>
        <div className="pt-2">
          <a
            href="https://github.com/nitinduseja/toolnest"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container text-xs font-medium text-on-surface transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>View Source on GitHub</span>
          </a>
        </div>
      </section>
    </div>
  );
};
