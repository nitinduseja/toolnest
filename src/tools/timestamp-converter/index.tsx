import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, RefreshCw, AlertTriangle, Globe } from 'lucide-react';
import { parseTimestamp, parseIsoDate, TimestampUnit } from './timestampLogic';
import { copyToClipboard } from '@/lib/clipboard';

export const TimestampConverterTool: React.FC = () => {
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [inputVal, setInputVal] = useState(String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<TimestampUnit>('seconds');
  const [isoInput, setIsoInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live epoch clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const parsedFromTimestamp = parseTimestamp(inputVal, unit);

  const handleSetNow = () => {
    const now = Date.now();
    setInputVal(unit === 'seconds' ? String(Math.floor(now / 1000)) : String(now));
  };

  const handleIsoChange = (val: string) => {
    setIsoInput(val);
    const res = parseIsoDate(val);
    if (res.isValid) {
      setInputVal(unit === 'seconds' ? String(res.seconds) : String(res.milliseconds));
    }
  };

  const handleCopy = async (val: string, key: string) => {
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Current Epoch Banner */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase text-outline">
              Current Unix Epoch
            </div>
            <div className="font-mono text-base font-bold text-on-surface">{currentEpoch}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSetNow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container-high text-xs font-medium text-on-surface border border-outline-variant/60 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Current Time</span>
        </button>
      </div>

      {/* Epoch to Human Date Section */}
      <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface">
          Convert Unix Timestamp → Human Date
        </h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. 1700000000"
              className="w-full h-10 px-3.5 rounded-xl bg-surface border border-outline-variant font-mono text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>

          <div className="flex bg-surface-container p-0.5 rounded-xl border border-outline-variant/40">
            <button
              type="button"
              onClick={() => setUnit('seconds')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                unit === 'seconds'
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Seconds (10 digits)
            </button>
            <button
              type="button"
              onClick={() => setUnit('milliseconds')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                unit === 'milliseconds'
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Milliseconds (13 digits)
            </button>
          </div>
        </div>

        {!parsedFromTimestamp.isValid ? (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{parsedFromTimestamp.error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-surface border border-outline-variant space-y-1">
              <div className="text-[10px] uppercase font-mono text-outline">ISO 8601 (UTC)</div>
              <div className="font-mono text-xs text-on-surface truncate">
                {parsedFromTimestamp.iso}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(parsedFromTimestamp.iso, 'iso')}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 pt-1"
              >
                {copiedKey === 'iso' ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedKey === 'iso' ? 'Copied' : 'Copy ISO'}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-outline-variant space-y-1">
              <div className="text-[10px] uppercase font-mono text-outline">UTC Standard Time</div>
              <div className="font-mono text-xs text-on-surface truncate">
                {parsedFromTimestamp.utc}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(parsedFromTimestamp.utc, 'utc')}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 pt-1"
              >
                {copiedKey === 'utc' ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedKey === 'utc' ? 'Copied' : 'Copy UTC'}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-outline-variant space-y-1">
              <div className="text-[10px] uppercase font-mono text-outline">Local Browser Time</div>
              <div className="font-mono text-xs text-on-surface truncate">
                {parsedFromTimestamp.local}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(parsedFromTimestamp.local, 'local')}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 pt-1"
              >
                {copiedKey === 'local' ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedKey === 'local' ? 'Copied' : 'Copy Local'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ISO / Date to Epoch Section */}
      <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface">
            Convert Date String → Unix Timestamp
          </h3>
        </div>
        <input
          type="text"
          value={isoInput}
          onChange={(e) => handleIsoChange(e.target.value)}
          placeholder="e.g. 2026-10-25T12:00:00Z or Oct 25, 2026 12:00:00"
          className="w-full h-10 px-3.5 rounded-xl bg-surface border border-outline-variant font-mono text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
        />
        <div className="text-xs text-outline">
          Accepts ISO 8601 strings, UTC format, or standard date strings. Updates timestamp above
          automatically.
        </div>
      </div>
    </div>
  );
};

export default TimestampConverterTool;
