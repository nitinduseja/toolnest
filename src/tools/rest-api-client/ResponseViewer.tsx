import React, { useState } from 'react';
import {
  Copy,
  Download,
  Check,
  AlertTriangle,
  Clock,
  HardDrive,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ApiResponse } from './types';
import { copyToClipboard } from '@/lib/clipboard';

export interface ResponseViewerProps {
  response: ApiResponse | null;
  isLoading: boolean;
}

function getStatusBadgeColor(status: number): string {
  if (status >= 200 && status < 300)
    return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
  if (status >= 300 && status < 400) return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
  if (status >= 400 && status < 500) return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
  return 'bg-red-500/10 text-red-600 border-red-500/30';
}

function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response, isLoading }) => {
  const [tab, setTab] = useState<'pretty' | 'raw' | 'headers' | 'tests'>('pretty');
  const [copied, setCopied] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col items-center justify-center min-h-[220px] text-center space-y-2">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-on-surface">Sending HTTP request...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col items-center justify-center min-h-[220px] text-center text-outline text-xs">
        <Eye className="w-8 h-8 mb-2 opacity-50" />
        <p className="font-semibold">No response yet</p>
        <p className="text-[11px]">
          Configure your request above and click &quot;Send&quot; to inspect response status and
          data.
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    const ok = await copyToClipboard(response.body);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownload = () => {
    const ext = response.isJson ? 'json' : 'txt';
    const blob = new Blob([response.body], {
      type: response.isJson ? 'application/json' : 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const passedTests = (response.assertionResults || []).filter((r) => r.passed).length;
  const totalTests = response.assertionResults?.length || 0;

  return (
    <div className="rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden space-y-3 p-4">
      {/* Response Status Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-outline-variant">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${getStatusBadgeColor(response.status)}`}
          >
            {response.status ? `${response.status} ${response.statusText}` : response.statusText}
          </span>
          <span className="flex items-center gap-1 text-xs text-outline font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{response.timeMs} ms</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-outline font-mono">
            <HardDrive className="w-3.5 h-3.5" />
            <span>{formatByteSize(response.sizeBytes)}</span>
          </span>
          {totalTests > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                passedTests === totalTests
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                  : 'bg-red-500/10 text-red-600 border-red-500/30'
              }`}
            >
              Tests: {passedTests}/{totalTests} passed
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs text-on-surface"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs text-on-surface"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* CORS Notice */}
      {response.isCorsError && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Browser CORS / Cross-Origin Restriction</p>
            <p className="text-[11px] text-on-surface-variant">
              The target server did not return a permissive{' '}
              <code className="font-mono">Access-Control-Allow-Origin</code> header. Browsers block
              client-side scripts from reading cross-origin responses unless the server allows it.
            </p>
          </div>
        </div>
      )}

      {/* Response Navigation */}
      <div className="flex items-center gap-2 text-xs border-b border-outline-variant/60 pb-2 overflow-x-auto flex-nowrap sm:flex-wrap">
        <button
          type="button"
          onClick={() => setTab('pretty')}
          className={`font-semibold pb-1 border-b-2 transition-colors shrink-0 cursor-pointer ${
            tab === 'pretty'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Body (Formatted)
        </button>
        <button
          type="button"
          onClick={() => setTab('raw')}
          className={`font-semibold pb-1 border-b-2 transition-colors shrink-0 cursor-pointer ${
            tab === 'raw'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Raw Body
        </button>
        <button
          type="button"
          onClick={() => setTab('headers')}
          className={`font-semibold pb-1 border-b-2 transition-colors shrink-0 cursor-pointer ${
            tab === 'headers'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Headers ({Object.keys(response.headers).length})
        </button>
        {totalTests > 0 && (
          <button
            type="button"
            onClick={() => setTab('tests')}
            className={`font-semibold pb-1 border-b-2 transition-colors shrink-0 cursor-pointer ${
              tab === 'tests'
                ? 'border-primary text-primary'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            Test Results ({passedTests}/{totalTests})
          </button>
        )}
      </div>

      {/* Body Content */}
      {tab === 'pretty' && (
        <pre className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface overflow-auto max-h-[400px] leading-relaxed">
          {response.isJson
            ? JSON.stringify(JSON.parse(response.body), null, 2)
            : response.body || response.error || 'Empty response'}
        </pre>
      )}

      {tab === 'raw' && (
        <pre className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface overflow-auto max-h-[400px] whitespace-pre-wrap">
          {response.body || response.error || 'Empty response'}
        </pre>
      )}

      {tab === 'headers' && (
        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant overflow-auto max-h-[300px]">
          {Object.entries(response.headers).length === 0 ? (
            <p className="text-xs text-outline italic">No response headers captured.</p>
          ) : (
            <div className="space-y-1">
              {Object.entries(response.headers).map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2 text-xs font-mono py-1 border-b border-outline-variant/30 last:border-0"
                >
                  <span className="font-semibold text-primary sm:w-44 shrink-0 break-all">
                    {k}:
                  </span>
                  <span className="text-on-surface-variant break-all">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'tests' && response.assertionResults && (
        <div className="space-y-2 p-1">
          {response.assertionResults.map((t) => (
            <div
              key={t.id}
              className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                t.passed
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600'
                  : 'bg-red-500/5 border-red-500/20 text-red-600'
              }`}
            >
              <div className="flex items-center gap-2">
                {t.passed ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0" />
                )}
                <span className="font-medium">{t.label}</span>
              </div>
              {t.actual && <span className="font-mono text-[11px] opacity-80">{t.actual}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
