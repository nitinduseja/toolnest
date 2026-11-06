import React, { useState } from 'react';
import { BookOpen, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const CHEAT_SHEET_CATEGORIES = [
  {
    category: 'Character Classes',
    items: [
      { token: '\\d', desc: 'Any digit [0-9]' },
      { token: '\\D', desc: 'Any non-digit [^0-9]' },
      { token: '\\w', desc: 'Word character [a-zA-Z0-9_]' },
      { token: '\\W', desc: 'Non-word character' },
      { token: '\\s', desc: 'Whitespace (spaces, tabs, newlines)' },
      { token: '.', desc: 'Any character except newline' },
    ],
  },
  {
    category: 'Quantifiers',
    items: [
      { token: '+', desc: '1 or more times (greedy)' },
      { token: '*', desc: '0 or more times (greedy)' },
      { token: '?', desc: '0 or 1 time (optional)' },
      { token: '{n,m}', desc: 'Between n and m times' },
      { token: '+?', desc: '1 or more times (lazy / shortest)' },
    ],
  },
  {
    category: 'Anchors & Groups',
    items: [
      { token: '^', desc: 'Start of line or string' },
      { token: '$', desc: 'End of line or string' },
      { token: '\\b', desc: 'Word boundary' },
      { token: '(...)', desc: 'Capturing group' },
      { token: '(?:...)', desc: 'Non-capturing group' },
      { token: '(?=...)', desc: 'Positive lookahead' },
    ],
  },
];

interface RegexCheatSheetProps {
  onInsertToken: (token: string) => void;
}

export const RegexCheatSheet: React.FC<RegexCheatSheetProps> = ({ onInsertToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopy = (token: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 flex items-center justify-between text-left hover:bg-surface-container transition-colors"
      >
        <span className="text-xs font-bold text-on-surface flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" /> Regex Quick Reference & Cheat Sheet
        </span>
        <span className="text-outline">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {isOpen && (
        <div className="p-4 pt-1 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-outline-variant/40 bg-surface">
          {CHEAT_SHEET_CATEGORIES.map(({ category, items }) => (
            <div key={category} className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                {category}
              </span>
              <div className="space-y-1">
                {items.map(({ token, desc }) => (
                  <div
                    key={token}
                    onClick={() => onInsertToken(token)}
                    className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-xs cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-primary text-[11px] bg-primary/10 px-1 rounded">
                        {token}
                      </code>
                      <span className="text-[11px] text-on-surface-variant truncate max-w-[130px]">
                        {desc}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(token, e)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-outline hover:text-on-surface transition-opacity"
                      title="Copy token"
                    >
                      {copiedToken === token ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
