import React from 'react';
import {
  Shield,
  ShieldAlert,
  Check,
  User,
  Users,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ChmodState, PermissionRole, PermissionAction } from './types';
import { calculateRoleOctal } from './chmodLogic';

interface PermissionMatrixProps {
  state: ChmodState;
  onChange: (newState: ChmodState) => void;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ state, onChange }) => {
  const [showSpecial, setShowSpecial] = React.useState(false);

  const toggleAction = (role: PermissionRole, action: PermissionAction) => {
    onChange({
      ...state,
      [role]: {
        ...state[role],
        [action]: !state[role][action],
      },
    });
  };

  const setRoleAll = (role: PermissionRole, val: boolean) => {
    onChange({
      ...state,
      [role]: { read: val, write: val, execute: val },
    });
  };

  const toggleSpecial = (key: 'setuid' | 'setgid' | 'sticky') => {
    onChange({
      ...state,
      special: {
        ...state.special,
        [key]: !state.special[key],
      },
    });
  };

  const roles: Array<{
    key: PermissionRole;
    label: string;
    icon: React.ReactNode;
    symbol: string;
  }> = [
    {
      key: 'owner',
      label: 'Owner (User)',
      icon: <User className="w-4 h-4 text-primary" />,
      symbol: 'u',
    },
    {
      key: 'group',
      label: 'Group',
      icon: <Users className="w-4 h-4 text-indigo-500" />,
      symbol: 'g',
    },
    {
      key: 'others',
      label: 'Others (Public)',
      icon: <Globe className="w-4 h-4 text-amber-500" />,
      symbol: 'o',
    },
  ];

  const actions: Array<{ key: PermissionAction; label: string; val: number; symbol: string }> = [
    { key: 'read', label: 'Read (r)', val: 4, symbol: 'r' },
    { key: 'write', label: 'Write (w)', val: 2, symbol: 'w' },
    { key: 'execute', label: 'Execute (x)', val: 1, symbol: 'x' },
  ];

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Permission Matrix
        </h3>
        <button
          type="button"
          onClick={() => onChange({ ...state, isDirectory: !state.isDirectory })}
          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
            state.isDirectory
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'bg-surface-container border-outline-variant text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {state.isDirectory ? '📁 Directory (d)' : '📄 File (-)'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {roles.map(({ key, label, icon, symbol }) => {
          const roleOctal = calculateRoleOctal(state[key]);
          return (
            <div
              key={key}
              className="bg-surface border border-outline-variant/50 rounded-xl p-3.5 space-y-3 transition-colors hover:border-outline-variant"
            >
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  {icon}
                  <div>
                    <span className="text-xs font-bold text-on-surface">{label}</span>
                    <span className="ml-1 text-[10px] font-mono text-outline">({symbol})</span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center font-mono font-bold text-sm text-primary">
                  {roleOctal}
                </div>
              </div>

              <div className="space-y-1.5">
                {actions.map(({ key: actionKey, label: actionLabel, val }) => {
                  const checked = state[key][actionKey];
                  return (
                    <label
                      key={actionKey}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs font-medium transition-all ${
                        checked
                          ? 'bg-primary/10 text-on-surface border border-primary/20'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-colors ${
                            checked ? 'bg-primary text-white' : 'border border-outline-variant'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span>{actionLabel}</span>
                      </span>
                      <span className="font-mono text-[10px] text-outline">+{val}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAction(key, actionKey)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setRoleAll(key, true)}
                  className="text-primary hover:underline font-medium"
                >
                  All
                </button>
                <span className="text-outline/40">•</span>
                <button
                  type="button"
                  onClick={() => setRoleAll(key, false)}
                  className="text-on-surface-variant hover:underline font-medium"
                >
                  None
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Special Permissions Toggle */}
      <div className="pt-2 border-t border-outline-variant/40">
        <button
          type="button"
          onClick={() => setShowSpecial(!showSpecial)}
          className="text-xs font-medium text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors"
        >
          {showSpecial ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          Special Linux Permissions (Setuid, Setgid, Sticky Bit)
        </button>

        {showSpecial && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-1">
            {[
              {
                key: 'setuid' as const,
                title: 'SetUID (4000)',
                desc: 'Runs file with owner permissions',
                checked: state.special.setuid,
              },
              {
                key: 'setgid' as const,
                title: 'SetGID (2000)',
                desc: 'Runs with group privileges or inherits group',
                checked: state.special.setgid,
              },
              {
                key: 'sticky' as const,
                title: 'Sticky Bit (1000)',
                desc: 'Only file owners can delete (e.g. /tmp)',
                checked: state.special.sticky,
              },
            ].map(({ key, title, desc, checked }) => (
              <label
                key={key}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  checked
                    ? 'bg-primary/10 border-primary/30 text-on-surface'
                    : 'bg-surface border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    {key === 'setuid' && checked && (
                      <ShieldAlert className="w-3 h-3 text-red-500" />
                    )}
                    {title}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSpecial(key)}
                    className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                </div>
                <p className="text-[11px] text-outline mt-1 leading-snug">{desc}</p>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
