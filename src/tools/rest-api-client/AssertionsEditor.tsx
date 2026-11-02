import React from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { AssertionRule, AssertionType } from './types';

export interface AssertionsEditorProps {
  assertions: AssertionRule[];
  onChange: (assertions: AssertionRule[]) => void;
}

const PRESETS: { type: AssertionType; label: string; defaultVal?: string }[] = [
  { type: 'status-200', label: 'Status is 200' },
  { type: 'status-2xx', label: 'Status is 2xx' },
  { type: 'time-under', label: 'Time < 500ms', defaultVal: '500' },
  { type: 'is-json', label: 'Is Valid JSON' },
  { type: 'body-contains', label: 'Body contains...', defaultVal: 'id' },
];

export const AssertionsEditor: React.FC<AssertionsEditorProps> = ({ assertions, onChange }) => {
  const handleAddPreset = (type: AssertionType, defaultVal?: string) => {
    const newRule: AssertionRule = {
      id: `rule_${Date.now()}_${Math.random()}`,
      type,
      targetValue: defaultVal,
      enabled: true,
    };
    onChange([...assertions, newRule]);
  };

  const handleUpdate = (id: string, updates: Partial<AssertionRule>) => {
    onChange(assertions.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const handleDelete = (id: string) => {
    onChange(assertions.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-outline">
        <span>RESPONSE ASSERTIONS / TESTS ({assertions.filter((a) => a.enabled).length})</span>
      </div>

      {/* Quick Add Presets */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-outline">Add test:</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => handleAddPreset(p.type, p.defaultVal)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface transition-colors"
          >
            <Plus className="w-3 h-3 text-primary" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {assertions.length === 0 ? (
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 flex items-center gap-2 text-xs text-outline">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Add tests above to automatically assert status codes, response time, and payload values.
          </span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {assertions.map((rule) => (
            <div key={rule.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={(e) => handleUpdate(rule.id, { enabled: e.target.checked })}
                className="w-4 h-4 rounded border-outline-variant text-primary"
              />
              <span className="text-xs font-semibold text-on-surface px-2 py-1 rounded bg-surface-container w-44 shrink-0 truncate">
                {PRESETS.find((p) => p.type === rule.type)?.label || rule.type}
              </span>
              {(rule.type === 'time-under' || rule.type === 'body-contains') && (
                <input
                  type="text"
                  value={rule.targetValue || ''}
                  onChange={(e) => handleUpdate(rule.id, { targetValue: e.target.value })}
                  placeholder={
                    rule.type === 'time-under' ? 'Max milliseconds' : 'Substring to match'
                  }
                  className="flex-1 px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden"
                />
              )}
              <button
                type="button"
                onClick={() => handleDelete(rule.id)}
                className="p-1.5 rounded-lg text-outline hover:text-red-500"
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
