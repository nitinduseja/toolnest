import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FieldConfig, FIELD_TYPE_OPTIONS, FieldType } from './mockDataLogic';

interface SchemaEditorProps {
  fields: FieldConfig[];
  onAddField: () => void;
  onRemoveField: (id: string) => void;
  onUpdateField: (id: string, updates: Partial<FieldConfig>) => void;
}

export const SchemaEditor: React.FC<SchemaEditorProps> = ({
  fields,
  onAddField,
  onRemoveField,
  onUpdateField,
}) => {
  return (
    <div className="space-y-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-outline uppercase tracking-wider">
          Schema Fields ({fields.length})
        </h2>
        <button
          type="button"
          onClick={onAddField}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Field</span>
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60"
          >
            <input
              type="text"
              value={field.name}
              onChange={(e) => onUpdateField(field.id, { name: e.target.value })}
              placeholder="Field name"
              className="flex-1 min-w-0 h-8 px-2.5 rounded-md bg-surface-container-low border border-outline-variant text-xs text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />

            <select
              value={field.type}
              onChange={(e) => onUpdateField(field.id, { type: e.target.value as FieldType })}
              className="h-8 px-2.5 rounded-md bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {FIELD_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onRemoveField(field.id)}
              disabled={fields.length <= 1}
              className="p-1.5 rounded-md text-outline hover:text-red-400 hover:bg-surface-container transition-colors disabled:opacity-30"
              title="Remove Field"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
