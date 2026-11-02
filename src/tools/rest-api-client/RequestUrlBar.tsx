import React from 'react';
import {
  Send,
  Code,
  ShieldCheck,
  Upload,
  History,
  Loader2,
  Sparkles,
  Settings,
} from 'lucide-react';
import { HttpMethod, ApiRequest, Environment } from './types';
import { SAMPLE_REQUESTS } from './sampleRequests';

export interface RequestUrlBarProps {
  method: HttpMethod;
  url: string;
  isLoading: boolean;
  environments: Environment[];
  activeEnvId: string;
  onMethodChange: (m: HttpMethod) => void;
  onUrlChange: (u: string) => void;
  onSend: () => void;
  onOpenCodeSnippet: () => void;
  onOpenWebhookSigner: () => void;
  onOpenImport: () => void;
  onOpenHistory: () => void;
  onSelectSample: (req: ApiRequest) => void;
  onSelectEnv: (id: string) => void;
  onOpenEnvModal: () => void;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  POST: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  PUT: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  PATCH: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  DELETE: 'bg-red-500/10 text-red-600 border-red-500/30',
  HEAD: 'bg-slate-500/10 text-slate-600 border-slate-500/30',
  OPTIONS: 'bg-teal-500/10 text-teal-600 border-teal-500/30',
};

export const RequestUrlBar: React.FC<RequestUrlBarProps> = ({
  method,
  url,
  isLoading,
  environments,
  activeEnvId,
  onMethodChange,
  onUrlChange,
  onSend,
  onOpenCodeSnippet,
  onOpenWebhookSigner,
  onOpenImport,
  onOpenHistory,
  onSelectSample,
  onSelectEnv,
  onOpenEnvModal,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !isLoading)) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="space-y-3">
      {/* Top action row */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant font-medium transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              History<span className="hidden sm:inline"> & Collections</span>
            </span>
          </button>
          <button
            type="button"
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant font-medium transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Import</span>
          </button>
          <button
            type="button"
            onClick={onOpenCodeSnippet}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant font-medium transition-colors cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              Code<span className="hidden sm:inline"> Snippet</span>
            </span>
          </button>
          <button
            type="button"
            onClick={onOpenWebhookSigner}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant font-medium transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              <span className="hidden sm:inline">Sign </span>Webhook
            </span>
          </button>
        </div>

        {/* Environment & Sample Dropdown */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-start">
          {/* Environment dropdown */}
          <div className="flex items-center gap-1 flex-1 sm:flex-initial">
            <select
              value={activeEnvId}
              onChange={(e) => onSelectEnv(e.target.value)}
              className="text-xs bg-surface-container border border-outline-variant rounded-lg px-2 py-1.5 text-on-surface focus:outline-hidden w-full sm:w-auto"
            >
              <option value="">No Environment</option>
              {environments.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onOpenEnvModal}
              title="Manage environments"
              className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer shrink-0"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 flex-1 sm:flex-initial">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            <select
              defaultValue=""
              onChange={(e) => {
                const sample = SAMPLE_REQUESTS.find((s) => s.id === e.target.value);
                if (sample) onSelectSample(sample.req);
                e.target.value = '';
              }}
              className="text-xs bg-surface-container border border-outline-variant rounded-lg px-2 py-1.5 text-on-surface focus:outline-hidden w-full sm:w-auto"
            >
              <option value="" disabled>
                Samples...
              </option>
              {SAMPLE_REQUESTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-xl bg-surface-container-low border border-outline-variant shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <select
            value={method}
            onChange={(e) => onMethodChange(e.target.value as HttpMethod)}
            className={`font-mono font-bold text-xs uppercase px-2.5 sm:px-3 py-2 rounded-lg border focus:outline-hidden cursor-pointer shrink-0 ${METHOD_COLORS[method]}`}
          >
            {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as HttpMethod[]).map(
              (m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              )
            )}
          </select>

          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://api.example.com/v1/resource or {{baseUrl}}/posts"
            className="flex-1 bg-transparent px-2 py-2 text-xs font-mono text-on-surface focus:outline-hidden min-w-0"
          />
        </div>

        <button
          type="button"
          onClick={onSend}
          disabled={isLoading || !url.trim()}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold shadow-xs disabled:opacity-40 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
