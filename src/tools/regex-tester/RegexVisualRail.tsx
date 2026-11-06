import React, { useState } from 'react';
import { ArrowRight, Info, Layers } from 'lucide-react';
import { RegexTokenExplanation, RegexTokenType } from './regexVisualizerLogic';

interface RegexVisualRailProps {
  tokens: RegexTokenExplanation[];
}

const TYPE_STYLES: Record<RegexTokenType, { bg: string; text: string; border: string }> = {
  anchor: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
  },
  'character-class': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
  },
  quantifier: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/30',
  },
  group: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/30',
  },
  alternation: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
  },
  escape: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
  },
  literal: {
    bg: 'bg-surface-container',
    text: 'text-on-surface',
    border: 'border-outline-variant',
  },
};

export const RegexVisualRail: React.FC<RegexVisualRailProps> = ({ tokens }) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(tokens[0]?.id || null);

  const selectedToken = tokens.find((t) => t.id === selectedTokenId) || tokens[0];

  if (tokens.length === 0) {
    return (
      <div className="p-6 text-center text-outline text-xs bg-surface-container-low rounded-xl border border-outline-variant/60">
        Enter a regular expression above to visualize its grammatical structure and tokens.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Visual Token Rail */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-primary" /> Visual Syntax Pipeline
          </span>
          <span className="text-[11px] text-outline">Click any token to inspect</span>
        </div>

        {/* Scrollable Flow Rail */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-surface border border-outline-variant/40 overflow-x-auto min-h-[58px]">
          {tokens.map((token, idx) => {
            const style = TYPE_STYLES[token.type] || TYPE_STYLES.literal;
            const isSelected = token.id === selectedToken?.id;
            return (
              <React.Fragment key={token.id}>
                <button
                  type="button"
                  onClick={() => setSelectedTokenId(token.id)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-primary shadow-xs scale-105 ' +
                        style.bg +
                        ' ' +
                        style.text +
                        ' ' +
                        style.border
                      : style.bg +
                        ' ' +
                        style.text +
                        ' ' +
                        style.border +
                        ' hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                >
                  <span className="truncate max-w-[120px]">{token.raw}</span>
                </button>
                {idx < tokens.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-outline/30 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Token Inspector Card */}
      {selectedToken && (
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg font-mono font-extrabold text-sm bg-primary/10 text-primary border border-primary/20">
                {selectedToken.raw}
              </span>
              <div>
                <h4 className="text-xs font-bold text-on-surface">{selectedToken.label}</h4>
                <span className="text-[10px] text-outline uppercase tracking-wider font-semibold">
                  {selectedToken.type}
                </span>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-surface border border-outline-variant/40 text-outline">
              <Info className="w-4 h-4 text-primary" />
            </div>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed bg-surface p-3 rounded-xl border border-outline-variant/40">
            {selectedToken.explanation}
          </p>
        </div>
      )}

      {/* Token Summary Table */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-3 border-b border-outline-variant/40 bg-surface flex items-center justify-between">
          <span className="text-xs font-bold text-on-surface">Token Breakdown Table</span>
          <span className="text-[10px] text-outline font-mono">{tokens.length} total tokens</span>
        </div>
        <div className="divide-y divide-outline-variant/30 max-h-64 overflow-y-auto">
          {tokens.map((t) => {
            const style = TYPE_STYLES[t.type] || TYPE_STYLES.literal;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTokenId(t.id)}
                className={`p-2.5 px-3.5 flex items-center justify-between text-xs cursor-pointer transition-colors hover:bg-surface-container ${
                  t.id === selectedToken?.id ? 'bg-primary/5 font-semibold' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}
                  >
                    {t.raw}
                  </span>
                  <span className="text-on-surface text-[11px]">{t.label}</span>
                </div>
                <span className="text-[10px] text-outline truncate max-w-[200px] sm:max-w-xs">
                  {t.explanation}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
