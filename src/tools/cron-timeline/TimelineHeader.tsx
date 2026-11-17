import React, { useState } from 'react';
import { Clock, Calendar, Upload, Copy, Check, Sparkles } from 'lucide-react';
import { ViewHorizon } from './types';
import { TIMEZONE_OPTIONS, PRESET_SUITES } from './presets';

interface TimelineHeaderProps {
  timezone: string;
  onTimezoneChange: (tz: string) => void;
  horizon: ViewHorizon;
  onHorizonChange: (h: ViewHorizon) => void;
  onLoadPreset: (presetId: string) => void;
  onOpenImportModal: () => void;
  onCopyCrontab: () => void;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  timezone,
  onTimezoneChange,
  horizon,
  onHorizonChange,
  onLoadPreset,
  onOpenImportModal,
  onCopyCrontab,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyCrontab();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-surface-container-low border border-outline-variant/60 rounded-xl">
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor="cron-tz-select"
          className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant"
        >
          <Clock className="w-3.5 h-3.5 text-primary" />
          Timezone:
        </label>
        <select
          id="cron-tz-select"
          value={timezone}
          onChange={(e) => onTimezoneChange(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {TIMEZONE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} ({opt.offsetLabel})
            </option>
          ))}
        </select>

        <div className="flex items-center bg-surface-container border border-outline-variant rounded-lg p-0.5 text-xs ml-2">
          <button
            type="button"
            onClick={() => onHorizonChange('24h')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              horizon === '24h'
                ? 'bg-primary text-on-primary font-medium shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Clock className="w-3 h-3" /> 24 Hours
          </button>
          <button
            type="button"
            onClick={() => onHorizonChange('7d')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              horizon === '7d'
                ? 'bg-primary text-on-primary font-medium shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Calendar className="w-3 h-3" /> 7 Days
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-on-surface bg-surface hover:bg-surface-container-high border border-outline-variant rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Preset Suites
          </button>
          <div className="absolute right-0 top-full mt-1 w-64 p-1.5 bg-surface border border-outline-variant rounded-xl shadow-xl backdrop-blur-md hidden group-hover:block z-30">
            {PRESET_SUITES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onLoadPreset(preset.id)}
                className="w-full text-left p-2 rounded-lg hover:bg-surface-container-high text-xs text-on-surface transition-colors"
              >
                <div className="font-semibold text-on-surface">{preset.name}</div>
                <div className="text-[11px] text-on-surface-variant truncate">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenImportModal}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-on-surface bg-surface hover:bg-surface-container-high border border-outline-variant rounded-lg transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-sky-500" />
          Import Crontab
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-on-primary bg-primary hover:bg-primary/90 border border-transparent rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Export Crontab
            </>
          )}
        </button>
      </div>
    </div>
  );
};
