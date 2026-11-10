import React from 'react';
import { SecurityAudit } from './types';
import { Icon } from '@/components/atoms/Icon';

interface SecurityAuditBadgeProps {
  audit: SecurityAudit;
}

export const SecurityAuditBadge: React.FC<SecurityAuditBadgeProps> = ({ audit }) => {
  const gradeColor =
    audit.grade === 'A+' || audit.grade === 'A'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
      : audit.grade === 'B'
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
        : 'border-red-500/40 bg-red-500/10 text-red-500';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-surface-primary/60 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl border font-mono text-xl font-black ${gradeColor}`}
          >
            {audit.grade}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary">
                Security Score: {audit.score}/100
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
              {audit.warnings.length === 0
                ? 'Excellent security posture. No high-risk configuration detected.'
                : `${audit.warnings.length} security recommendation${audit.warnings.length > 1 ? 's' : ''} found.`}
            </p>
          </div>
        </div>
      </div>

      {audit.warnings.length > 0 && (
        <div className="flex flex-col gap-1.5 border-t border-border/40 pt-3">
          {audit.warnings.map((w, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-amber-500">
              <Icon name="Shield" className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
