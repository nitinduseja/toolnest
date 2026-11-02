import React, { useState } from 'react';
import { Sparkles, Plus, Trash2 } from 'lucide-react';
import { BodyType, KeyValueItem } from './types';

export interface BodyEditorProps {
  bodyType: BodyType;
  bodyContent: string;
  formParams: KeyValueItem[];
  onBodyTypeChange: (bt: BodyType) => void;
  onBodyContentChange: (content: string) => void;
  onFormParamsChange: (params: KeyValueItem[]) => void;
}

const BODY_TYPES: { id: BodyType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'json', label: 'JSON' },
  { id: 'form', label: 'Form URL-Encoded' },
  { id: 'raw', label: 'Raw Text / XML' },
];

export const BodyEditor: React.FC<BodyEditorProps> = ({
  bodyType,
  bodyContent,
  formParams,
  onBodyTypeChange,
  onBodyContentChange,
  onFormParamsChange,
}) => {
  const [jsonError, setJsonError] = useState<string | null>(null);

  const formatJson = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(bodyContent);
      onBodyContentChange(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const handleUpdateForm = (id: string, updates: Partial<KeyValueItem>) => {
    onFormParamsChange(formParams.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleAddForm = () => {
    const newItem: KeyValueItem = {
      id: `form_${Date.now()}_${Math.random()}`,
      key: '',
      value: '',
      enabled: true,
    };
    onFormParamsChange([...formParams, newItem]);
  };

  return (
    <div className="space-y-3">
      {/* Type Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {BODY_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onBodyTypeChange(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                bodyType === t.id
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high border-outline-variant text-on-surface'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {bodyType === 'json' && (
          <button
            type="button"
            onClick={formatJson}
            className="flex items-center gap-1 text-primary hover:underline text-xs font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prettify JSON</span>
          </button>
        )}
      </div>

      {bodyType === 'none' && (
        <p className="text-xs text-outline italic py-2">
          No request body will be sent with this request.
        </p>
      )}

      {(bodyType === 'json' || bodyType === 'raw') && (
        <div className="space-y-1.5">
          <textarea
            value={bodyContent}
            onChange={(e) => onBodyContentChange(e.target.value)}
            rows={8}
            placeholder={
              bodyType === 'json'
                ? '{\n  "key": "value"\n}'
                : 'Raw request body (text, XML, GraphQL, etc.)'
            }
            className="w-full p-3 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface focus:border-primary focus:outline-hidden resize-y"
          />
          {jsonError && <p className="text-xs text-red-500 font-semibold">{jsonError}</p>}
        </div>
      )}

      {bodyType === 'form' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-outline">
            <span>FORM FIELDS</span>
            <button
              type="button"
              onClick={handleAddForm}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          </div>
          {formParams.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) => handleUpdateForm(item.id, { enabled: e.target.checked })}
                className="w-4 h-4 rounded border-outline-variant text-primary"
              />
              <input
                type="text"
                value={item.key}
                onChange={(e) => handleUpdateForm(item.id, { key: e.target.value })}
                placeholder="Field Name"
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden"
              />
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleUpdateForm(item.id, { value: e.target.value })}
                placeholder="Field Value"
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => onFormParamsChange(formParams.filter((f) => f.id !== item.id))}
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
