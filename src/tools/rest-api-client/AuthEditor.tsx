import React from 'react';
import { KeyRound, Shield } from 'lucide-react';
import { AuthConfig, AuthType } from './types';

export interface AuthEditorProps {
  auth: AuthConfig;
  onChange: (auth: AuthConfig) => void;
}

const AUTH_TYPES: { id: AuthType; label: string }[] = [
  { id: 'none', label: 'No Auth' },
  { id: 'bearer', label: 'Bearer Token' },
  { id: 'basic', label: 'Basic Auth' },
  { id: 'apikey', label: 'API Key' },
];

export const AuthEditor: React.FC<AuthEditorProps> = ({ auth, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Auth Type Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {AUTH_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange({ ...auth, type: t.id })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              auth.type === t.id
                ? 'bg-primary text-on-primary border-primary shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high border-outline-variant text-on-surface'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* None */}
      {auth.type === 'none' && (
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 flex items-center gap-2 text-xs text-outline">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>This request does not include any authorization credentials.</span>
        </div>
      )}

      {/* Bearer */}
      {auth.type === 'bearer' && (
        <div className="space-y-2 max-w-md">
          <label className="block text-xs font-semibold text-outline">Token</label>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container border border-outline-variant">
            <KeyRound className="w-4 h-4 text-primary shrink-0" />
            <input
              type="text"
              value={auth.bearerToken || ''}
              onChange={(e) => onChange({ ...auth, bearerToken: e.target.value })}
              placeholder="e.g. eyJhbGciOiJIUzI1NiIs..."
              className="w-full bg-transparent text-xs font-mono text-on-surface focus:outline-hidden"
            />
          </div>
          <p className="text-[11px] text-outline">
            Appends an &quot;Authorization: Bearer &lt;token&gt;&quot; header.
          </p>
        </div>
      )}

      {/* Basic */}
      {auth.type === 'basic' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-outline">Username</label>
            <input
              type="text"
              value={auth.basicUser || ''}
              onChange={(e) => onChange({ ...auth, basicUser: e.target.value })}
              placeholder="admin"
              className="w-full p-2 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-outline">Password</label>
            <input
              type="password"
              value={auth.basicPassword || ''}
              onChange={(e) => onChange({ ...auth, basicPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full p-2 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden"
            />
          </div>
        </div>
      )}

      {/* API Key */}
      {auth.type === 'apikey' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-outline">Key Name</label>
            <input
              type="text"
              value={auth.apiKeyName || ''}
              onChange={(e) => onChange({ ...auth, apiKeyName: e.target.value })}
              placeholder="X-API-Key"
              className="w-full p-2 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-outline">Value</label>
            <input
              type="text"
              value={auth.apiKeyValue || ''}
              onChange={(e) => onChange({ ...auth, apiKeyValue: e.target.value })}
              placeholder="secret_key_..."
              className="w-full p-2 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-outline">Add To</label>
            <select
              value={auth.apiKeyLocation || 'header'}
              onChange={(e) =>
                onChange({ ...auth, apiKeyLocation: e.target.value as 'header' | 'query' })
              }
              className="w-full p-2 rounded-lg bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-hidden"
            >
              <option value="header">Header</option>
              <option value="query">Query Parameter</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
