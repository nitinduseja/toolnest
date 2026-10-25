import React, { useState, useMemo } from 'react';
import { AlertTriangle, Check, ListChecks } from 'lucide-react';
import { testRegex } from './regexLogic';

export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testText, setTestText] = useState(
    'Contact our engineering team at dev@toolnest.org or security@toolnest.io for inquiries.'
  );

  const activeFlags = useMemo(() => {
    let f = '';
    if (flags.g) f += 'g';
    if (flags.i) f += 'i';
    if (flags.m) f += 'm';
    if (flags.s) f += 's';
    return f;
  }, [flags]);

  const result = useMemo(() => {
    return testRegex(pattern, activeFlags, testText);
  }, [pattern, activeFlags, testText]);

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  return (
    <div className="space-y-4">
      {/* Pattern Input Bar */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <label className="text-xs font-semibold uppercase text-outline block">
          Regular Expression
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <span className="absolute left-3.5 font-mono text-outline select-none">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="w-full h-10 pl-7 pr-3 rounded-lg bg-surface border border-outline-variant font-mono text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
            <span className="absolute right-3.5 font-mono text-outline select-none">
              /{activeFlags}
            </span>
          </div>

          {/* Flag Toggles */}
          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-lg border border-outline-variant/40">
            {(['g', 'i', 'm', 's'] as const).map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                className={`px-2 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                  flags[flag]
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title={`Flag: ${flag}`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>

        {/* Validation or Error Indicator */}
        {!result.isValid ? (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{result.error}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-500">
            <Check className="w-4 h-4 shrink-0" />
            <span>
              Valid pattern • {result.matchCount} match{result.matchCount !== 1 ? 'es' : ''} found
            </span>
          </div>
        )}
      </div>

      {/* Test String Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-outline px-1">
          <span className="font-medium">Test Text String</span>
          <button
            type="button"
            onClick={() => setTestText('')}
            className="hover:text-red-500 transition-colors"
          >
            Clear Text
          </button>
        </div>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Type or paste test string here..."
          className="w-full h-44 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
        />
      </div>

      {/* Match Details Breakdown */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-semibold uppercase text-outline">Match Details</h3>
          </div>
          <span className="text-xs text-outline font-mono">{result.matches.length} items</span>
        </div>

        {result.matches.length > 0 ? (
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {result.matches.map((m, idx) => (
              <div
                key={`${m.match}-${m.index}-${idx}`}
                className="p-2.5 rounded-lg bg-surface border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-outline">#{idx + 1}</span>
                  <span className="font-mono font-semibold text-primary px-1.5 py-0.5 rounded bg-primary-container/10">
                    &quot;{m.match}&quot;
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-outline">
                  <span>Pos: {m.index}</span>
                  <span>Len: {m.length}</span>
                  {m.groups && (
                    <span className="text-on-surface">Groups: {JSON.stringify(m.groups)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-outline italic">
            No matches found in the current text string.
          </div>
        )}
      </div>
    </div>
  );
};

export default RegexTesterTool;
