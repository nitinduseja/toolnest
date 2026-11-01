import React, { useState } from 'react';
import { Copy, Check, ShieldAlert } from 'lucide-react';
import { HttpHeaderInfo } from './headersData';
import { copyToClipboard } from '@/lib/clipboard';

export interface HeaderCardProps {
  header: HttpHeaderInfo;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({ header }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(`${header.name}: ${header.example}`);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant hover:border-primary/50 transition-colors space-y-3 shadow-2xs">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-bold text-on-surface break-all">
              {header.name}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-surface-container text-on-surface-variant border border-outline-variant/40">
              {header.direction}
            </span>
          </div>
          <span className="inline-block text-[11px] font-medium text-primary capitalize">
            {header.category.replace('-', ' ')}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          title="Copy header and example value"
          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <p className="text-xs font-medium text-on-surface leading-relaxed">{header.summary}</p>
      <p className="text-xs text-on-surface-variant leading-relaxed">{header.description}</p>

      <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/50">
        <span className="block text-[10px] font-semibold text-outline uppercase tracking-wider mb-0.5">
          Example Value
        </span>
        <code className="font-mono text-xs text-on-surface break-all select-all block">
          {header.example}
        </code>
      </div>

      <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between text-[11px] text-outline">
        <span className="font-mono">{header.rfc}</span>
        <span className="flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-primary" />
          Standard
        </span>
      </div>
    </div>
  );
};
