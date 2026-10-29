import React, { useState, useMemo } from 'react';
import {
  CalendarClock,
  Clock,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { parseCron, getNextRuns, getCronPresets } from './cronLogic';
import { copyToClipboard } from '@/lib/clipboard';

const FIELD_LABELS = [
  { name: 'Minute', range: '0–59', tip: 'Values 0-59, wildcard *, steps */n, ranges a-b' },
  { name: 'Hour', range: '0–23', tip: 'Values 0-23 (24h), wildcard *, steps */n, ranges a-b' },
  { name: 'Day (Month)', range: '1–31', tip: 'Values 1-31, wildcard *, steps */n, ranges a-b' },
  { name: 'Month', range: '1–12 / JAN–DEC', tip: 'Values 1-12 or names JAN-DEC' },
  {
    name: 'Day (Week)',
    range: '0–6 / SUN–SAT',
    tip: 'Values 0-6 (0=Sun) or names SUN-SAT (7=Sun)',
  },
];

const MACROS = [
  { label: '@hourly', expr: '0 * * * *' },
  { label: '@daily', expr: '0 0 * * *' },
  { label: '@weekly', expr: '0 0 * * 0' },
  { label: '@monthly', expr: '0 0 1 * *' },
  { label: '@yearly', expr: '0 0 1 1 *' },
];

export const CronParserTool: React.FC = () => {
  const [expression, setExpression] = useState<string>('0 9 * * 1-5');
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const presets = useMemo(() => getCronPresets(), []);
  const parsed = useMemo(() => parseCron(expression), [expression]);
  const nextRuns = useMemo(() => (parsed.valid ? getNextRuns(parsed, 5) : []), [parsed]);

  const handleCopy = async (text: string, key: string) => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const nextFormatted = nextRuns[0]
    ? `${nextRuns[0].getFullYear()}-${String(nextRuns[0].getMonth() + 1).padStart(2, '0')}-${String(nextRuns[0].getDate()).padStart(2, '0')} ${nextRuns[0].toTimeString().split(' ')[0]}`
    : null;

  return (
    <div className="space-y-6">
      {/* Notice Ribbon & Macro Bar */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Standard POSIX Crontab:</strong> 5-field syntax with instant humanized
            interpretation.
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {MACROS.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => setExpression(m.expr)}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            >
              {m.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setExpression('* * * * *')}
            className="p-1 rounded text-outline hover:text-on-surface transition-colors"
            title="Reset expression"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Cron Input Section */}
      <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-outline uppercase tracking-wider">
            Cron Expression
          </label>
          <button
            type="button"
            onClick={() => handleCopy(expression, 'expr')}
            disabled={!expression}
            className="flex items-center gap-1 text-xs text-outline hover:text-on-surface transition-colors disabled:opacity-40"
          >
            {copiedKey === 'expr' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedKey === 'expr' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="* * * * *"
          className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
        />

        {/* 5 Interactive Field Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {FIELD_LABELS.map((field, idx) => (
            <button
              key={field.name}
              type="button"
              onClick={() => setSelectedField(selectedField === idx ? null : idx)}
              className={`p-2.5 rounded-lg border text-center transition-all ${
                selectedField === idx
                  ? 'bg-primary-container/20 border-primary ring-1 ring-primary'
                  : 'bg-surface-container-lowest/80 border-outline-variant/60 hover:bg-surface-container'
              }`}
            >
              <span className="text-[10px] font-medium text-outline uppercase tracking-wide block truncate">
                {field.name}
              </span>
              <span className="text-sm font-mono font-bold text-primary my-0.5 block truncate">
                {parsed.rawParts[idx] || '—'}
              </span>
              <span className="text-[10px] text-outline font-mono block truncate">
                {field.range}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Field Help Ribbon */}
        {selectedField !== null && (
          <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant/70 text-xs text-on-surface-variant flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              <strong>{FIELD_LABELS[selectedField].name}:</strong> {FIELD_LABELS[selectedField].tip}
            </span>
          </div>
        )}
      </div>

      {/* Humanized Schedule Banner */}
      {parsed.error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{parsed.error}</span>
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-primary-container/15 border border-primary-container/30 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-base sm:text-xl font-bold text-on-surface tracking-tight">
              “{parsed.humanDescription}”
            </p>
            {nextFormatted && (
              <p className="text-xs font-mono text-outline">
                next at <span className="text-on-surface font-semibold">{nextFormatted}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleCopy(parsed.humanDescription, 'desc')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors"
          >
            {copiedKey === 'desc' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedKey === 'desc' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}

      {/* Upcoming Scheduled Runs */}
      {parsed.valid && nextRuns.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <h2 className="text-xs font-semibold text-outline uppercase tracking-wider">
              Upcoming Scheduled Runs (Next 5)
            </h2>
          </div>

          <div className="divide-y divide-outline-variant/60 rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden">
            {nextRuns.map((run, idx) => (
              <div
                key={run.toISOString()}
                className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-surface-container-high font-mono text-[10px] text-outline flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-on-surface">
                    {run.toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <span className="font-mono text-primary font-semibold">
                  {run.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preset Expressions */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider px-1 block">
          Common Cron Presets
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((preset) => (
            <button
              key={preset.expression}
              type="button"
              onClick={() => setExpression(preset.expression)}
              className={`p-3 rounded-xl border text-left transition-all ${
                expression === preset.expression
                  ? 'bg-primary-container/20 border-primary text-on-surface shadow-xs'
                  : 'bg-surface-container-low border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-semibold text-on-surface">{preset.label}</span>
              </div>
              <code className="text-[11px] font-mono text-primary block truncate">
                {preset.expression}
              </code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CronParserTool;
