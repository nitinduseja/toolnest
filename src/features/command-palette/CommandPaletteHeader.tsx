import React from 'react';
import { Command } from 'cmdk';
import { Search, X } from 'lucide-react';

interface CommandPaletteHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const CommandPaletteHeader: React.FC<CommandPaletteHeaderProps> = ({
  search,
  onSearchChange,
  onClear,
  onClose,
  inputRef,
}) => {
  return (
    <div className="relative flex items-center px-4 sm:px-6 h-16 border-b border-outline-variant/60 bg-surface dark:bg-surface-container-lowest backdrop-blur-md">
      <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-3 pointer-events-none">
        <Search className="w-4 h-4" />
      </div>

      <Command.Input
        ref={inputRef}
        value={search}
        onValueChange={onSearchChange}
        placeholder="Type to search..."
        className="w-full bg-transparent text-on-surface placeholder:text-outline/70 text-sm sm:text-base font-medium outline-none"
        autoFocus
      />

      <div className="flex items-center gap-2 shrink-0 ml-3">
        {search && (
          <button
            type="button"
            tabIndex={-1}
            onClick={onClear}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Clear search query"
            title="Clear query"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-surface-container text-outline font-mono text-[10px] border border-outline-variant/70 shadow-2xs">
          ESC
        </kbd>

        <button
          type="button"
          tabIndex={-1}
          onClick={onClose}
          aria-label="Close command palette"
          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-primary hover:bg-surface-container transition-colors sm:hidden"
        >
          Done
        </button>
      </div>
    </div>
  );
};
