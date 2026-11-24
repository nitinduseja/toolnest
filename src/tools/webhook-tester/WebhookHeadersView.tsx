import React, { useState } from 'react';
import { Copy, Check, Terminal, ShieldCheck } from 'lucide-react';
import { WebhookSignatureResult } from './types';
import { generateCurlCommand } from './webhookLogic';
import { copyToClipboard } from '@/lib/clipboard';

interface WebhookHeadersViewProps {
  signatureResult: WebhookSignatureResult | null;
  targetUrl: string;
  payload: string;
}

export const WebhookHeadersView: React.FC<WebhookHeadersViewProps> = ({
  signatureResult,
  targetUrl,
  payload,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!signatureResult) return null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [signatureResult.headerName]: signatureResult.headerValue,
  };
  if (signatureResult.timestamp) {
    headers['X-Timestamp'] = String(signatureResult.timestamp);
  }

  const curlCommand = generateCurlCommand(
    targetUrl || 'https://your-api.com/webhook',
    headers,
    payload
  );

  const handleCopy = async (text: string, key: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
            Computed Signature &amp; HTTP Headers
          </h3>
        </div>
      </div>

      {/* Headers Table */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-container-high/60 text-outline border-b border-outline-variant text-[11px]">
            <tr>
              <th className="py-2 px-3">Header Name</th>
              <th className="py-2 px-3">Header Value</th>
              <th className="py-2 px-3 text-right">Copy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {Object.entries(headers).map(([key, value]) => (
              <tr key={key} className="hover:bg-surface-container/30 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-primary">{key}</td>
                <td className="py-2.5 px-3 text-on-surface max-w-sm truncate text-[11px]">
                  {value}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleCopy(value, key)}
                    className="p-1 rounded text-outline hover:text-primary transition-colors cursor-pointer"
                  >
                    {copiedKey === key ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* cURL Command Stage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-outline font-semibold">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>Ready-to-run cURL Command</span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(curlCommand, 'curl')}
            className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
          >
            {copiedKey === 'curl' ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>{copiedKey === 'curl' ? 'Copied' : 'Copy cURL'}</span>
          </button>
        </div>
        <pre className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-[11px] text-on-surface overflow-x-auto max-h-48">
          <code>{curlCommand}</code>
        </pre>
      </div>
    </div>
  );
};
