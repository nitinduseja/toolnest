import React, { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { parseStructuredData, computeStructuralDiff, calculateDiffSummary } from './diffLogic';
import { DiffResultsView } from './DiffResultsView';

const SAMPLE_LEFT_JSON = JSON.stringify(
  {
    name: 'Toolnest Studio',
    version: '2.8.0',
    features: ['workspaces', 'pwa', 'dark-mode'],
    config: {
      port: 3000,
      debug: false,
    },
  },
  null,
  2
);

const SAMPLE_RIGHT_YAML = `name: Toolnest Studio Pro
version: '2.9.0'
features:
  - workspaces
  - pwa
  - dark-mode
  - structural-diff
config:
  port: 8080
  telemetry: false
`;

export const JsonYamlDiffTool: React.FC = () => {
  const [leftFormat, setLeftFormat] = useState<'json' | 'yaml'>('json');
  const [rightFormat, setRightFormat] = useState<'json' | 'yaml'>('yaml');
  const [leftInput, setLeftInput] = useState<string>(SAMPLE_LEFT_JSON);
  const [rightInput, setRightInput] = useState<string>(SAMPLE_RIGHT_YAML);

  const leftParsed = useMemo(
    () => parseStructuredData(leftInput, leftFormat),
    [leftInput, leftFormat]
  );
  const rightParsed = useMemo(
    () => parseStructuredData(rightInput, rightFormat),
    [rightInput, rightFormat]
  );

  const diffEntries = useMemo(() => {
    if (leftParsed.error || rightParsed.error) return [];
    if (!leftParsed.data && !rightParsed.data) return [];
    return computeStructuralDiff(leftParsed.data, rightParsed.data);
  }, [leftParsed, rightParsed]);

  const summary = useMemo(() => calculateDiffSummary(diffEntries), [diffEntries]);

  const handleSwap = () => {
    setLeftInput(rightInput);
    setRightInput(leftInput);
    const tempFmt = leftFormat;
    setLeftFormat(rightFormat);
    setRightFormat(tempFmt);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">
              JSON / YAML Structural Diff &amp; Patch
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Studio Tool
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Compare JSON and YAML data structures semantically, inspect key-level additions, and
            export RFC 6902 patches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
            <span>Swap Panes</span>
          </button>
        </div>
      </div>

      {/* Dual Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Pane (Original) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface">Original (Left)</span>
              <div className="flex items-center rounded-lg bg-surface border border-outline-variant text-[11px]">
                <button
                  type="button"
                  onClick={() => setLeftFormat('json')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${leftFormat === 'json' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-outline'}`}
                >
                  JSON
                </button>
                <button
                  type="button"
                  onClick={() => setLeftFormat('yaml')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${leftFormat === 'yaml' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-outline'}`}
                >
                  YAML
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLeftInput('')}
              className="text-xs text-outline hover:text-red-500 cursor-pointer"
            >
              Clear
            </button>
          </div>

          <textarea
            rows={12}
            value={leftInput}
            onChange={(e) => setLeftInput(e.target.value)}
            placeholder="Paste original JSON or YAML..."
            className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden focus:border-primary"
          />
          {leftParsed.error && (
            <p className="text-[11px] text-red-500 font-mono">
              Left syntax error: {leftParsed.error}
            </p>
          )}
        </div>

        {/* Right Pane (Modified) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface">Modified (Right)</span>
              <div className="flex items-center rounded-lg bg-surface border border-outline-variant text-[11px]">
                <button
                  type="button"
                  onClick={() => setRightFormat('json')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${rightFormat === 'json' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-outline'}`}
                >
                  JSON
                </button>
                <button
                  type="button"
                  onClick={() => setRightFormat('yaml')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${rightFormat === 'yaml' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-outline'}`}
                >
                  YAML
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRightInput('')}
              className="text-xs text-outline hover:text-red-500 cursor-pointer"
            >
              Clear
            </button>
          </div>

          <textarea
            rows={12}
            value={rightInput}
            onChange={(e) => setRightInput(e.target.value)}
            placeholder="Paste modified JSON or YAML..."
            className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden focus:border-primary"
          />
          {rightParsed.error && (
            <p className="text-[11px] text-red-500 font-mono">
              Right syntax error: {rightParsed.error}
            </p>
          )}
        </div>
      </div>

      {/* Structural Diff Results */}
      <DiffResultsView entries={diffEntries} summary={summary} />
    </div>
  );
};

export default JsonYamlDiffTool;
