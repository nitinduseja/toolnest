import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { KeyValueItem } from './types';

export interface QueryParamsEditorProps {
  params: KeyValueItem[];
  onChange: (params: KeyValueItem[]) => void;
}

export const QueryParamsEditor: React.FC<QueryParamsEditorProps> = ({ params, onChange }) => {
  const handleUpdate = (id: string, updates: Partial<KeyValueItem>) => {
    onChange(params.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const handleAdd = () => {
    const newItem: KeyValueItem = {
      id: `param_${Date.now()}_${Math.random()}`,
      key: '',
      value: '',
      enabled: true,
    };
    onChange([...params, newItem]);
  };

  const handleDelete = (id: string) => {
    onChange(params.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-outline">
        <span>QUERY PARAMETERS ({params.filter((p) => p.enabled && p.key).length})</span>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-primary hover:underline text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Parameter</span>
        </button>
      </div>

      {params.length === 0 ? (
        <p className="text-xs text-outline italic py-2">
          No query parameters added. Click &quot;Add Parameter&quot; to append URL query keys.
        </p>
      ) : (
        <div className="space-y-1.5">
          {params.map((item) => (
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
                placeholder="Key"
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
                title="Delete parameter"
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
