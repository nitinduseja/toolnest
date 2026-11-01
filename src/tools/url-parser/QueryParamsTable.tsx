import React, { useState } from 'react';
import { Plus, Trash2, Check, FileJson, Sliders } from 'lucide-react';
import { QueryParamItem, paramsToJson } from './urlLogic';
import { copyToClipboard } from '@/lib/clipboard';

export interface QueryParamsTableProps {
  params: QueryParamItem[];
  onChange: (params: QueryParamItem[]) => void;
}

export const QueryParamsTable: React.FC<QueryParamsTableProps> = ({ params, onChange }) => {
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const handleToggle = (id: string) => {
    onChange(params.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const handleUpdate = (id: string, field: 'key' | 'value', val: string) => {
    onChange(params.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  const handleRemove = (id: string) => {
    onChange(params.filter((p) => p.id !== id));
  };

  const handleAdd = () => {
    const newId = `param_${Date.now()}`;
    onChange([...params, { id: newId, key: '', value: '', enabled: true }]);
  };

  const handleCopyJson = async () => {
    const json = paramsToJson(params);
    const ok = await copyToClipboard(JSON.stringify(json, null, 2));
    if (ok) {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">
            Query Parameters ({params.filter((p) => p.enabled).length}/{params.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyJson}
            disabled={params.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors disabled:opacity-40"
          >
            {copiedJson ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <FileJson className="w-3.5 h-3.5" />
            )}
            <span>Copy JSON</span>
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Param</span>
          </button>
        </div>
      </div>

      {params.length === 0 ? (
        <div className="p-6 text-center rounded-xl bg-surface-container-lowest border border-dashed border-outline-variant text-xs text-outline">
          No query parameters detected. Click &quot;Add Param&quot; or paste a URL with query
          arguments.
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {params.map((p) => (
            <div
              key={p.id}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-2 text-xs ${
                p.enabled
                  ? 'bg-surface-container-lowest border-outline-variant/60'
                  : 'bg-surface-container-lowest/40 border-outline-variant/30 opacity-60'
              }`}
            >
              <input
                type="checkbox"
                checked={p.enabled}
                onChange={() => handleToggle(p.id)}
                title={p.enabled ? 'Disable parameter' : 'Enable parameter'}
                className="rounded accent-primary cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={p.key}
                placeholder="Key"
                onChange={(e) => handleUpdate(p.id, 'key', e.target.value)}
                className="w-1/3 min-w-[80px] p-1.5 rounded-md bg-surface-container border border-outline-variant/50 font-mono text-on-surface focus:outline-hidden focus:border-primary"
              />
              <span className="text-outline font-mono">=</span>
              <input
                type="text"
                value={p.value}
                placeholder="Value"
                onChange={(e) => handleUpdate(p.id, 'value', e.target.value)}
                className="flex-1 p-1.5 rounded-md bg-surface-container border border-outline-variant/50 font-mono text-on-surface focus:outline-hidden focus:border-primary"
              />
              <button
                type="button"
                onClick={() => handleRemove(p.id)}
                title="Remove parameter"
                className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
