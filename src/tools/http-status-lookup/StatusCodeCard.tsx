import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { HttpStatusCode } from './statusCodesData';
import { getStatusCategoryBadge, generateCurlSnippet } from './httpLookupLogic';
import { copyToClipboard } from '@/lib/clipboard';

export interface StatusCodeCardProps {
  status: HttpStatusCode;
}

export const StatusCodeCard: React.FC<StatusCodeCardProps> = ({ status }) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);
  const badge = getStatusCategoryBadge(status.category);

  const handleCopyCode = async () => {
    const ok = await copyToClipboard(`${status.code} ${status.name}`);
    if (ok) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1500);
    }
  };

  const handleCopyCurl = async () => {
    const snippet = generateCurlSnippet(status.code);
    const ok = await copyToClipboard(snippet);
    if (ok) {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 1500);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant hover:border-primary/50 transition-colors space-y-3 shadow-2xs">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xl font-bold text-on-surface tracking-tight">
            {status.code}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
          >
            {status.name}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleCopyCurl}
            title="Copy test curl command"
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {copiedCurl ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Terminal className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={handleCopyCode}
            title="Copy status code and name"
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {copiedCode ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      <p className="text-xs font-medium text-on-surface leading-relaxed">{status.summary}</p>
      <p className="text-xs text-on-surface-variant leading-relaxed">{status.description}</p>

      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40 text-[11px] text-outline">
        <span className="flex items-center gap-1 font-mono">
          <ExternalLink className="w-3 h-3 text-primary" />
          {status.rfc}
        </span>
        <span className="font-medium">{status.cachable ? 'Cacheable: Yes' : 'Cacheable: No'}</span>
      </div>
    </div>
  );
};
