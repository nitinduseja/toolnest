import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

export interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  category: string;
  items: { keys: string[]; description: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    category: 'General & Navigation',
    items: [
      { keys: ['⌘', 'K'], description: 'Open Command Palette & Tool Finder' },
      { keys: ['?'], description: 'Open this Keyboard Shortcuts cheat sheet' },
      { keys: ['Ctrl', '/'], description: 'Alternative shortcut for cheat sheet' },
      { keys: ['Esc'], description: 'Close any active modal or drawer' },
    ],
  },
  {
    category: 'Quick Page Jumps',
    items: [
      { keys: ['G', 'then', 'H'], description: 'Go to Home Workspace' },
      { keys: ['G', 'then', 'A'], description: 'Go to All Tools Directory' },
      { keys: ['G', 'then', 'F'], description: 'Go to Favorited Tools' },
      { keys: ['G', 'then', 'R'], description: 'Go to Recent Tools' },
      { keys: ['G', 'then', 'S'], description: 'Go to Settings' },
    ],
  },
  {
    category: 'Dual Tool Workspace',
    items: [
      { keys: ['Alt', 'S'], description: 'Toggle Dual Tool Split View' },
      { keys: ['⌘', 'Click'], description: 'Open tool in split pane' },
    ],
  },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-surface-container border border-outline-variant shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-on-surface">Keyboard Shortcuts</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container-high text-outline hover:text-on-surface cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Groups */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.category} className="space-y-2">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block">
                {group.category}
              </span>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <div
                    key={item.description}
                    className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-between text-xs"
                  >
                    <span className="text-on-surface">{item.description}</span>
                    <div className="flex items-center gap-1 shrink-0 font-mono">
                      {item.keys.map((k) => (
                        <kbd
                          key={k}
                          className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant text-[11px] text-on-surface font-semibold shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-low border-t border-outline-variant text-center text-[11px] text-outline">
          Tip: Press{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high border text-on-surface">
            ?
          </kbd>{' '}
          anywhere outside text fields to reopen this menu.
        </div>
      </div>
    </div>
  );
};
