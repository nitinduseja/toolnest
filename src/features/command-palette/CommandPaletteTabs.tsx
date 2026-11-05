import React from 'react';

export type PaletteTab = 'all' | 'tools' | 'categories' | 'actions' | 'recent';

interface CommandPaletteTabsProps {
  activeTab: PaletteTab;
  onTabChange: (tab: PaletteTab) => void;
  hasRecent: boolean;
}

const TABS: { id: PaletteTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'tools', label: 'Tools' },
  { id: 'categories', label: 'Categories' },
  { id: 'actions', label: 'Actions' },
];

export const CommandPaletteTabs: React.FC<CommandPaletteTabsProps> = ({
  activeTab,
  onTabChange,
  hasRecent,
}) => {
  const allTabs = hasRecent ? [{ id: 'recent' as PaletteTab, label: 'Recent' }, ...TABS] : TABS;

  return (
    <div className="px-4 sm:px-6 py-2 bg-surface-container-low dark:bg-surface-container-lowest border-b border-outline-variant/40 flex items-center gap-1.5 overflow-x-auto text-xs select-none">
      {allTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            tabIndex={-1}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
