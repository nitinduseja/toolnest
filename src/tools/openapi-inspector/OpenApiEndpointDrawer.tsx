import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode } from 'lucide-react';
import { OpenApiEndpoint } from './types';
import { generateMockFromSchema, generateCurl } from './openapiLogic';
import { copyToClipboard } from '@/lib/clipboard';

interface OpenApiEndpointDrawerProps {
  endpoint: OpenApiEndpoint;
}

export const OpenApiEndpointDrawer: React.FC<OpenApiEndpointDrawerProps> = ({ endpoint }) => {
  const [copiedMock, setCopiedMock] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const mockData = generateMockFromSchema(endpoint.responseSchema);
  const curlCmd = generateCurl(endpoint);

  const handleCopyMock = async () => {
    const ok = await copyToClipboard(JSON.stringify(mockData, null, 2));
    if (ok) {
      setCopiedMock(true);
      setTimeout(() => setCopiedMock(false), 2000);
    }
  };

  const handleCopyCurl = async () => {
    const ok = await copyToClipboard(curlCmd);
    if (ok) {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-5">
      {/* Header Info */}
      <div className="space-y-1.5 pb-3 border-b border-outline-variant/40">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-primary/10 text-primary border border-primary/20">
            {endpoint.method}
          </span>
          <h3 className="font-mono text-sm font-bold text-on-surface break-all">{endpoint.path}</h3>
        </div>
        <p className="text-xs text-outline">{endpoint.summary}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {endpoint.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/40 text-outline"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Parameters Table */}
      {endpoint.parameters.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Parameters ({endpoint.parameters.length})
          </span>
          <div className="overflow-x-auto rounded-xl border border-outline-variant/60 bg-surface-container">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-outline-variant/40 text-[10px] uppercase font-semibold text-outline">
                  <th className="p-2.5">Name</th>
                  <th className="p-2.5">In</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 font-mono">
                {endpoint.parameters.map((p) => (
                  <tr key={p.name}>
                    <td className="p-2.5 font-bold text-on-surface">{p.name}</td>
                    <td className="p-2.5 text-outline">{p.in}</td>
                    <td className="p-2.5 text-primary">{p.type}</td>
                    <td className="p-2.5">
                      {p.required ? (
                        <span className="text-error font-bold text-[10px]">YES</span>
                      ) : (
                        <span className="text-outline text-[10px]">optional</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generated Mock Response */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface uppercase tracking-wider">
            <FileCode className="w-3.5 h-3.5 text-primary" />
            <span>Mock Response JSON ({endpoint.responseStatus})</span>
          </div>
          <button
            type="button"
            onClick={handleCopyMock}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface transition-all"
          >
            {copiedMock ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>{copiedMock ? 'Copied' : 'Copy Mock'}</span>
          </button>
        </div>
        <pre className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 font-mono text-xs text-on-surface overflow-x-auto max-h-48 leading-relaxed">
          {JSON.stringify(mockData, null, 2)}
        </pre>
      </div>

      {/* Generated cURL command */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>Ready-to-use cURL</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCurl}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface transition-all"
          >
            {copiedCurl ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
          </button>
        </div>
        <pre className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 font-mono text-xs text-on-surface overflow-x-auto leading-relaxed">
          {curlCmd}
        </pre>
      </div>
    </div>
  );
};
