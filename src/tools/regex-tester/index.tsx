import React, { useState, useMemo } from 'react';
import { AlertTriangle, Check, ListChecks, Sparkles, Replace, Eye, Copy } from 'lucide-react';
import {
  testRegex,
  replaceRegex,
  getHighlightedSegments,
  COMMON_REGEX_PRESETS,
} from './regexLogic';
import { copyToClipboard } from '@/lib/clipboard';

export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState(
    '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b'
  );
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testText, setTestText] = useState(
    'Contact our engineering team at dev@toolnest.org or security@toolnest.io for inquiries.'
  );
  const [activeTab, setActiveTab] = useState<'match' | 'replace'>('match');
  const [replacement, setReplacement] = useState('[REDACTED]');
  const [copied, setCopied] = useState(false);

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

  const highlightedSegments = useMemo(() => {
    return getHighlightedSegments(testText, result.matches);
  }, [testText, result.matches]);

  const replacementResult = useMemo(() => {
    return replaceRegex(pattern, activeFlags, testText, replacement);
  }, [pattern, activeFlags, testText, replacement]);

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleApplyPreset = (presetName: string) => {
    const preset = COMMON_REGEX_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;
    setPattern(preset.pattern);
    setTestText(preset.example);
    setFlags({
      g: preset.flags.includes('g'),
      i: preset.flags.includes('i'),
      m: preset.flags.includes('m'),
      s: preset.flags.includes('s'),
    });
  };

  const handleCopyReplacement = async () => {
    if (!replacementResult.output) return;
    const ok = await copyToClipboard(replacementResult.output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Pattern Input & Presets Bar */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-semibold uppercase text-outline block">
            Regular Expression
          </label>
          {/* Preset Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-on-surface-variant font-medium">Presets:</span>
            <select
              onChange={(e) => {
                if (e.target.value) handleApplyPreset(e.target.value);
              }}
              defaultValue=""
              className="px-2 py-1 rounded bg-surface border border-outline-variant text-xs text-on-surface cursor-pointer"
            >
              <option value="" disabled>
                Select standard pattern...
              </option>
              {COMMON_REGEX_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

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
                className={`px-2 py-1 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
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

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('match')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'match'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Match & In-Place Highlighting</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('replace')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'replace'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <Replace className="w-3.5 h-3.5" />
          <span>Substitution / Replace Mode</span>
        </button>
      </div>

      {activeTab === 'match' ? (
        /* Match Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Test Text Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-outline px-1">
              <span className="font-medium">Test Text String</span>
              <button
                type="button"
                onClick={() => setTestText('')}
                className="hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear Text
              </button>
            </div>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Type or paste test string here..."
              className="w-full h-56 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
            />
          </div>

          {/* In-Place Visual Highlighting Stage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-outline px-1">
              <span className="font-medium">In-Place Highlighted Preview</span>
              <span className="font-mono text-[11px]">{result.matchCount} matches</span>
            </div>
            <div className="w-full h-56 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
              {highlightedSegments.map((seg, idx) =>
                seg.isMatch ? (
                  <mark
                    key={idx}
                    className="bg-amber-400/35 text-on-surface border-b-2 border-amber-500 rounded-xs px-0.5"
                    title={`Match #${seg.matchIndex}`}
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={idx}>{seg.text}</span>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Replace / Substitution Mode */
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-outline px-1 block">Test Text Input</label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Type test string..."
                className="w-full h-40 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface focus:outline-none resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-outline px-1 block">
                Replacement Pattern ($1, $&amp;, etc.)
              </label>
              <input
                type="text"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder="Replacement string..."
                className="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant font-mono text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
              <div className="text-[11px] text-outline font-mono pt-1">
                Supports $&amp; (full match), $1-$9 (capture groups), $$ (literal $).
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface">Replaced Output</span>
              <button
                type="button"
                onClick={handleCopyReplacement}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface border border-outline-variant hover:bg-surface-container text-xs text-on-surface font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-surface font-mono text-xs overflow-x-auto whitespace-pre-wrap text-on-surface">
              {replacementResult.output}
            </pre>
          </div>
        </div>
      )}

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
