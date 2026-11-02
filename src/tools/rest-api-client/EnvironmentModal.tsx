import React, { useState } from 'react';
import { Settings, X, Plus, Trash2 } from 'lucide-react';
import { Environment, KeyValueItem } from './types';

export interface EnvironmentModalProps {
  isOpen: boolean;
  environments: Environment[];
  onClose: () => void;
  onSaveEnvironments: (envs: Environment[]) => void;
}

export const EnvironmentModal: React.FC<EnvironmentModalProps> = ({
  isOpen,
  environments,
  onClose,
  onSaveEnvironments,
}) => {
  const [envs, setEnvs] = useState<Environment[]>(environments);
  const [selectedEnvId, setSelectedEnvId] = useState<string>(environments[0]?.id || '');

  if (!isOpen) return null;

  const activeEnv = envs.find((e) => e.id === selectedEnvId) || envs[0];

  const handleAddEnv = () => {
    const newEnv: Environment = {
      id: `env_${Date.now()}`,
      name: `Environment ${envs.length + 1}`,
      variables: [{ id: `v1`, key: 'baseUrl', value: 'https://api.example.com', enabled: true }],
    };
    const next = [...envs, newEnv];
    setEnvs(next);
    setSelectedEnvId(newEnv.id);
    onSaveEnvironments(next);
  };

  const handleUpdateActiveEnv = (updates: Partial<Environment>) => {
    if (!activeEnv) return;
    const next = envs.map((e) => (e.id === activeEnv.id ? { ...e, ...updates } : e));
    setEnvs(next);
    onSaveEnvironments(next);
  };

  const handleDeleteEnv = (id: string) => {
    const next = envs.filter((e) => e.id !== id);
    setEnvs(next);
    if (selectedEnvId === id && next.length > 0) {
      setSelectedEnvId(next[0].id);
    }
    onSaveEnvironments(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-on-surface">
              Manage Environments & Secrets
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden min-h-[300px]">
          {/* Environments Sidebar */}
          <div className="w-48 border-r border-outline-variant p-3 space-y-2 bg-surface-container-lowest overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-semibold text-outline">
              <span>ENVIRONMENTS</span>
              <button type="button" onClick={handleAddEnv} className="p-1 hover:text-primary">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {envs.map((e) => (
              <div
                key={e.id}
                onClick={() => setSelectedEnvId(e.id)}
                className={`p-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                  selectedEnvId === e.id
                    ? 'bg-primary text-on-primary'
                    : 'hover:bg-surface-container text-on-surface'
                }`}
              >
                <span className="truncate">{e.name}</span>
                {envs.length > 1 && (
                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleDeleteEnv(e.id);
                    }}
                    className="p-0.5 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Variables Table */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeEnv ? (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-outline">
                    Environment Name
                  </label>
                  <input
                    type="text"
                    value={activeEnv.name}
                    onChange={(e) => handleUpdateActiveEnv({ name: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-xs font-semibold text-on-surface focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-outline">
                    Variables ({activeEnv.variables.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newVar: KeyValueItem = {
                        id: `v_${Date.now()}`,
                        key: '',
                        value: '',
                        enabled: true,
                      };
                      handleUpdateActiveEnv({ variables: [...activeEnv.variables, newVar] });
                    }}
                    className="flex items-center gap-1 text-primary text-xs font-medium hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Variable</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {activeEnv.variables.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(e) => {
                          const updated = activeEnv.variables.map((v) =>
                            v.id === item.id ? { ...v, enabled: e.target.checked } : v
                          );
                          handleUpdateActiveEnv({ variables: updated });
                        }}
                        className="w-4 h-4 rounded border-outline-variant text-primary"
                      />
                      <input
                        type="text"
                        value={item.key}
                        onChange={(e) => {
                          const updated = activeEnv.variables.map((v) =>
                            v.id === item.id ? { ...v, key: e.target.value } : v
                          );
                          handleUpdateActiveEnv({ variables: updated });
                        }}
                        placeholder="Variable Name"
                        className="flex-1 px-2 py-1 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface"
                      />
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => {
                          const updated = activeEnv.variables.map((v) =>
                            v.id === item.id ? { ...v, value: e.target.value } : v
                          );
                          handleUpdateActiveEnv({ variables: updated });
                        }}
                        placeholder="Value"
                        className="flex-1 px-2 py-1 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = activeEnv.variables.filter((v) => v.id !== item.id);
                          handleUpdateActiveEnv({ variables: updated });
                        }}
                        className="p-1 hover:text-red-500 text-outline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-outline italic">No environment selected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
