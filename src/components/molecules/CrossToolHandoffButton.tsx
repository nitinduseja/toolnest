import React, { useState } from 'react';
import { useInRouterContext, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { sendToTool } from '@/lib/handoff/crossToolHandoff';

export interface HandoffTarget {
  slug?: string;
  toolId?: string;
  label: string;
  format?: string;
  description?: string;
}

export interface CrossToolHandoffButtonProps {
  targets: HandoffTarget[];
  getData: () => string;
  sourceSlug?: string;
  sourceToolId?: string;
  disabled?: boolean;
  className?: string;
}

interface InnerProps extends CrossToolHandoffButtonProps {
  navigate?: ReturnType<typeof useNavigate>;
}

const CrossToolHandoffButtonInner: React.FC<InnerProps> = ({
  targets,
  getData,
  sourceSlug,
  sourceToolId,
  disabled = false,
  className = '',
  navigate,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (targets.length === 0) return null;

  const handleSend = (target: HandoffTarget) => {
    const data = getData();
    if (!data.trim()) return;
    const targetSlug = target.slug || target.toolId || '';
    const srcSlug = sourceSlug || sourceToolId || '';
    sendToTool(navigate, targetSlug, {
      data,
      format: target.format,
      label: target.label,
      sourceToolSlug: srcSlug,
    });
    setDropdownOpen(false);
  };

  if (targets.length === 1) {
    const target = targets[0];
    return (
      <button
        type="button"
        onClick={() => handleSend(target)}
        disabled={disabled}
        title={target.description || `Send data to ${target.label}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/60 transition-colors disabled:opacity-40 cursor-pointer ${className}`}
      >
        <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
        <span>{target.label}</span>
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        disabled={disabled}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/60 transition-colors disabled:opacity-40 cursor-pointer ${className}`}
      >
        <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
        <span>Send to...</span>
        <ChevronDown className="w-3 h-3 text-outline" />
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-surface-container border border-outline-variant shadow-xl z-50 py-1 overflow-hidden">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-outline border-b border-outline-variant/40">
              Transfer to Tool
            </div>
            {targets.map((tgt) => (
              <button
                key={tgt.slug || tgt.toolId}
                type="button"
                onClick={() => handleSend(tgt)}
                className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container-high transition-colors flex flex-col gap-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-semibold text-primary">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{tgt.label}</span>
                </div>
                {tgt.description && (
                  <span className="text-[11px] text-outline line-clamp-1">{tgt.description}</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const RouterAwareHandoffButton: React.FC<CrossToolHandoffButtonProps> = (props) => {
  const navigate = useNavigate();
  return <CrossToolHandoffButtonInner {...props} navigate={navigate} />;
};

export const CrossToolHandoffButton: React.FC<CrossToolHandoffButtonProps> = (props) => {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return <RouterAwareHandoffButton {...props} />;
  }
  return <CrossToolHandoffButtonInner {...props} />;
};
