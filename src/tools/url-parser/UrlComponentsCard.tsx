import React, { useState } from 'react';
import { Copy, Check, Globe } from 'lucide-react';
import { ParsedUrl } from './urlLogic';
import { copyToClipboard } from '@/lib/clipboard';

export interface UrlComponentsCardProps {
  parsed: ParsedUrl;
}

interface ComponentItem {
  label: string;
  value: string;
  fallback?: string;
}

export const UrlComponentsCard: React.FC<UrlComponentsCardProps> = ({ parsed }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (val: string, key: string) => {
    if (!val) return;
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  const components: ComponentItem[] = [
    { label: 'Protocol', value: parsed.protocol },
    { label: 'Hostname', value: parsed.hostname },
    { label: 'Port', value: parsed.port, fallback: 'Default (80/443)' },
    { label: 'Pathname', value: parsed.pathname },
    { label: 'Hash / Fragment', value: parsed.hash, fallback: 'None' },
  ];

  return (
    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-outline uppercase tracking-wider">
        <Globe className="w-4 h-4 text-primary" />
        <span>URL Components</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        {components.map((item) => {
          const displayVal = item.value || item.fallback || '-';
          const canCopy = Boolean(item.value);
          return (
            <div
              key={item.label}
              className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <span className="block text-[10px] text-outline font-semibold uppercase">
                  {item.label}
                </span>
                <span className="font-mono text-on-surface truncate block" title={displayVal}>
                  {displayVal}
                </span>
              </div>
              {canCopy && (
                <button
                  type="button"
                  onClick={() => handleCopy(item.value, item.label)}
                  title={`Copy ${item.label}`}
                  className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
                >
                  {copiedKey === item.label ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
