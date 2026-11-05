import React from 'react';
import { ShieldCheck, CornerDownLeft } from 'lucide-react';

export const CommandPaletteFooter: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 py-2.5 border-t border-outline-variant/60 bg-surface-container-low dark:bg-surface-container-lowest text-[11px] text-outline flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px] border border-outline-variant/60 text-on-surface-variant">
            ↑
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px] border border-outline-variant/60 text-on-surface-variant">
            ↓
          </kbd>
          <span className="hidden sm:inline ml-0.5">Navigate</span>
        </span>

        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px] border border-outline-variant/60 text-on-surface-variant">
            <CornerDownLeft className="w-2.5 h-2.5" />
          </kbd>
          <span className="hidden sm:inline ml-0.5">Select</span>
        </span>

        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px] border border-outline-variant/60 text-on-surface-variant">
            Esc
          </kbd>
          <span className="hidden sm:inline ml-0.5">Close</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-[10px]">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span className="hidden sm:inline">100% In-Browser Engine</span>
      </div>
    </div>
  );
};
