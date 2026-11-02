import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { KeyValueItem } from './types';

export interface HeadersEditorProps {
  headers: KeyValueItem[];
  onChange: (headers: KeyValueItem[]) => void;
}

const COMMON_HEADERS = [
  'Content-Type',
  'Accept',
  'Authorization',
  'User-Agent',
  'Cache-Control',
  'X-Requested-With',
  'X-API-Key',
];

export const HeadersEditor: React.FC<HeadersEditorProps> = ({ headers, onChange }) => {
  const handleUpdate = (id: string, updates: Partial<KeyValueItem>) => {
    onChange(headers.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const handleAdd = (defaultKey: string = '') => {
    const newItem: KeyValueItem = {
      id: `head_${Date.now()}_${Math.random()}`,
      key: defaultKey,
      value: '',
      enabled: true,
    };
    onChange([...headers, newItem]);
  };

  const handleDelete = (id: string) => {
    onChange(headers.filter((h) => h.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-outline">
        <span>REQUEST HEADERS ({headers.filter((h) => h.enabled && h.key).length})</span>
        <button
          type="button"
          onClick={() => handleAdd('')}
          className="flex items-center gap-1 text-primary hover:underline text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Header</span>
        </button>
      </div>

      {/* Quick Header Presets */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-outline">Quick add:</span>
        {COMMON_HEADERS.map((ch) => (
          <button
            key={ch}
            type="button"
            onClick={() => handleAdd(ch)}
            className="px-2 py-0.5 rounded text-[11px] bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface transition-colors"
          >
            +{ch}
          </button>
        ))}
      </div>

      {headers.length === 0 ? (
        <p className="text-xs text-outline italic py-2">No custom request headers configured.</p>
      ) : (
        <div className="space-y-1.5">
          {headers.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) => handleUpdate(item.id, { enabled: e.target.checked })}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
              />
              <input
                type="text"
                value={item.key}
                onChange={(e) => handleUpdate(item.id, { key: e.target.value })}
                placeholder="Header Name"
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden"
              />
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleUpdate(item.id, { value: e.target.value })}
                placeholder="Value"
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
                title="Delete header"
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
