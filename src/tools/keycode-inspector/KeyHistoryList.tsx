import React from 'react';
import { History, Trash2 } from 'lucide-react';
import { KeyEventRecord } from './types';
import { getKeyDisplay } from './keycodeLogic';

interface KeyHistoryListProps {
  history: KeyEventRecord[];
  activeId?: string;
  onSelect: (item: KeyEventRecord) => void;
  onClear: () => void;
}

export const KeyHistoryList: React.FC<KeyHistoryListProps> = ({
  history,
  activeId,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-wider">
          <History className="w-3.5 h-3.5 text-primary" />
          <span>Recent Key Events ({history.length})</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-outline hover:text-error flex items-center gap-1 transition-colors"
          title="Clear history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
        {history.map((item) => {
          const isActive = item.id === activeId;
          const display = getKeyDisplay(item.key);
          const hasModifiers = item.ctrlKey || item.altKey || item.shiftKey || item.metaKey;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/60 text-on-surface'
              }`}
            >
              {hasModifiers && (
                <span className="text-[10px] opacity-75 font-sans font-semibold">
                  {[
                    item.ctrlKey && 'Ctrl',
                    item.altKey && 'Alt',
                    item.shiftKey && 'Shift',
                    item.metaKey && 'Cmd',
                  ]
                    .filter(Boolean)
                    .join('+')}
                  +
                </span>
              )}
              <span className="font-bold">{display}</span>
              <span
                className={`text-[10px] px-1 py-0.2 rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-outline'
                }`}
              >
                {item.keyCode}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
