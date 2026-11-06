import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

interface RegexReplacePanelProps {
  testText: string;
  onTestTextChange: (text: string) => void;
  replacement: string;
  onReplacementChange: (text: string) => void;
  replacedOutput: string;
}

export const RegexReplacePanel: React.FC<RegexReplacePanelProps> = ({
  testText,
  onTestTextChange,
  replacement,
  onReplacementChange,
  replacedOutput,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReplacement = async () => {
    if (!replacedOutput) return;
    const ok = await copyToClipboard(replacedOutput);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-outline px-1 block">Test Text Input</label>
          <textarea
            value={testText}
            onChange={(e) => onTestTextChange(e.target.value)}
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
            onChange={(e) => onReplacementChange(e.target.value)}
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
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy Result'}</span>
          </button>
        </div>
        <pre className="p-3 rounded-lg bg-surface font-mono text-xs overflow-x-auto whitespace-pre-wrap text-on-surface">
          {replacedOutput}
        </pre>
      </div>
    </div>
  );
};
