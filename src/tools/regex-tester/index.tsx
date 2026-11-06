import React, { useState, useMemo } from 'react';
import { AlertTriangle, Check, Sparkles, Replace, Eye, Layers } from 'lucide-react';
import {
  testRegex,
  replaceRegex,
  getHighlightedSegments,
  COMMON_REGEX_PRESETS,
} from './regexLogic';
import { explainRegexPattern } from './regexVisualizerLogic';
import { RegexMatchDetails } from './RegexMatchDetails';
import { RegexVisualRail } from './RegexVisualRail';
import { RegexCheatSheet } from './RegexCheatSheet';
import { RegexReplacePanel } from './RegexReplacePanel';

type ActiveTab = 'match' | 'visualizer' | 'replace';

export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testText, setTestText] = useState(
    'Contact our engineering team at dev@toolnest.org or security@toolnest.io for inquiries.'
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('match');
  const [replacement, setReplacement] = useState('[REDACTED]');

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

  const tokens = useMemo(() => {
    return explainRegexPattern(pattern);
  }, [pattern]);

  const highlightedSegments = useMemo(() => {
    return getHighlightedSegments(testText, result.matches);
  }, [testText, result.matches]);

  const replacementResult = useMemo(() => {
    return replaceRegex(pattern, testText, {
      flags: activeFlags,
      replacement,
    });
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

  const handleInsertToken = (token: string) => {
    setPattern((prev) => prev + token);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-12">
      {/* Pattern Input & Presets Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-semibold uppercase text-outline block">
            Regular Expression
          </label>
          {/* Preset Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-on-surface-variant font-medium">Presets:</span>
            <select
              onChange={(e) => e.target.value && handleApplyPreset(e.target.value)}
              defaultValue=""
              className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface cursor-pointer"
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
              className="w-full h-10 pl-7 pr-3 rounded-xl bg-surface border border-outline-variant font-mono text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <span className="absolute right-3.5 font-mono text-outline select-none">
              /{activeFlags}
            </span>
          </div>

          {/* Flag Toggles */}
          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-xl border border-outline-variant/40">
            {(['g', 'i', 'm', 's'] as const).map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  flags[flag]
                    ? 'bg-primary text-white shadow-xs'
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
          <div className="flex items-center gap-2 text-xs text-red-500 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{result.error}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <Check className="w-4 h-4 shrink-0" />
            <span>
              Valid pattern • {result.matchCount} match{result.matchCount !== 1 ? 'es' : ''} found
            </span>
          </div>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('match')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'match'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Match & In-Place Highlighting</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visualizer')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'visualizer'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Syntax Visualizer & Pipeline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('replace')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'replace'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <Replace className="w-3.5 h-3.5" />
          <span>Substitution / Replace</span>
        </button>
      </div>

      {/* Mode Panels */}
      {activeTab === 'match' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                className="w-full h-56 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              />
            </div>

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
          <RegexMatchDetails matches={result.matches} />
        </div>
      )}

      {activeTab === 'visualizer' && <RegexVisualRail tokens={tokens} />}

      {activeTab === 'replace' && (
        <RegexReplacePanel
          testText={testText}
          onTestTextChange={setTestText}
          replacement={replacement}
          onReplacementChange={setReplacement}
          replacedOutput={replacementResult.output}
        />
      )}

      {/* Regex Quick Reference & Cheat Sheet Drawer */}
      <RegexCheatSheet onInsertToken={handleInsertToken} />
    </div>
  );
};

export default RegexTesterTool;
