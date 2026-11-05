import React from 'react';
import { Command } from 'cmdk';
import { Search, Sparkles } from 'lucide-react';

interface CommandPaletteEmptyProps {
  search: string;
  onClearSearch: () => void;
}

export const CommandPaletteEmpty: React.FC<CommandPaletteEmptyProps> = ({
  search,
  onClearSearch,
}) => {
  return (
    <Command.Empty className="py-12 px-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-outline-variant/60 flex items-center justify-center mx-auto text-outline">
        <Search className="w-5 h-5" />
      </div>

      <div className="space-y-1.5 max-w-sm mx-auto">
        <h3 className="text-sm font-semibold text-on-surface">
          No results found for &ldquo;{search}&rdquo;
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Try searching by tool name (e.g., &ldquo;JSON&rdquo;, &ldquo;Regex&rdquo;,
          &ldquo;cURL&rdquo;), or search by keywords like &ldquo;format&rdquo; or
          &ldquo;convert&rdquo;.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2">
        <button
          type="button"
          tabIndex={-1}
          onClick={onClearSearch}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/70 text-xs font-medium text-on-surface transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Clear search & view all</span>
        </button>
      </div>
    </Command.Empty>
  );
};
