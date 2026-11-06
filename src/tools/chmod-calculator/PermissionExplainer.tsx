import React from 'react';
import { Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ChmodState } from './types';
import { auditPermissions } from './chmodLogic';

interface PermissionExplainerProps {
  state: ChmodState;
}

export const PermissionExplainer: React.FC<PermissionExplainerProps> = ({ state }) => {
  const audit = auditPermissions(state);

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          Permission Breakdown & Security Audit
        </h3>
        {audit.warnings.length > 0 ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {audit.warnings.length} Security Notice
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Safe Profile
          </span>
        )}
      </div>

      {/* Role Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {audit.explanations.map(({ role, description, canRead, canWrite, canExecute }) => (
          <div
            key={role}
            className="bg-surface border border-outline-variant/40 rounded-xl p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">{role}</span>
              <div className="flex items-center gap-1">
                <span
                  title={canRead ? 'Read granted' : 'Read denied'}
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    canRead ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline/50'
                  }`}
                >
                  R
                </span>
                <span
                  title={canWrite ? 'Write granted' : 'Write denied'}
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    canWrite
                      ? 'bg-indigo-500/10 text-indigo-500'
                      : 'bg-surface-container text-outline/50'
                  }`}
                >
                  W
                </span>
                <span
                  title={canExecute ? 'Execute granted' : 'Execute denied'}
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    canExecute
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-surface-container text-outline/50'
                  }`}
                >
                  X
                </span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      {/* Security Warnings & Recommendations */}
      {audit.warnings.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Security Advisories</span>
          </div>
          <ul className="space-y-1 text-xs text-on-surface-variant list-disc pl-5">
            {audit.warnings.map((warn) => (
              <li key={warn}>{warn}</li>
            ))}
          </ul>
          {audit.recommendations.length > 0 && (
            <div className="pt-1.5 border-t border-amber-500/20 text-xs text-on-surface">
              <span className="font-semibold text-primary">Recommendation: </span>
              {audit.recommendations.join(' ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
