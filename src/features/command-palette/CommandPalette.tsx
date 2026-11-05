import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '@/registry/categories';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { useTheme } from '@/features/theme/useTheme';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';
import { CommandPaletteHeader } from './CommandPaletteHeader';
import { CommandPaletteTabs, PaletteTab } from './CommandPaletteTabs';
import { PaletteToolItem, PaletteCategoryItem, PaletteActionItem } from './CommandPaletteItem';
import { CommandPaletteEmpty } from './CommandPaletteEmpty';
import { CommandPaletteFooter } from './CommandPaletteFooter';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  initialQuery = '',
}) => {
  const navigate = useNavigate();
  const { preference, setPreference } = useTheme();
  const { recentToolIds } = useRecentTools();
  const [search, setSearch] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<PaletteTab>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial query and focus input when dialog opens
  useEffect(() => {
    if (open) {
      if (initialQuery) {
        setSearch(initialQuery);
      }
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open, initialQuery]);

  // Global shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const runAction = useCallback(
    (action: () => void) => {
      onOpenChange(false);
      setSearch('');
      setActiveTab('all');
      action();
    },
    [onOpenChange]
  );

  const recentTools = ALL_TOOLS.filter((t) => recentToolIds.includes(t.id));

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command Palette"
      loop={true}
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 p-3 sm:p-4 bg-black/35 dark:bg-black/75 backdrop-blur-xs dark:backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-2xl bg-surface dark:bg-surface-container-lowest backdrop-blur-2xl border border-outline-variant/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-black/5 dark:ring-white/10 animate-in zoom-in-95 duration-150"
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (document.activeElement !== inputRef.current) {
              inputRef.current?.focus();
            }
          }
        }}
      >
        {/* Modern Unified Header with Search Input */}
        <CommandPaletteHeader
          search={search}
          onSearchChange={setSearch}
          onClear={() => {
            setSearch('');
            inputRef.current?.focus();
          }}
          onClose={() => onOpenChange(false)}
          inputRef={inputRef}
        />

        {/* Filter Tabs */}
        <CommandPaletteTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            inputRef.current?.focus();
          }}
          hasRecent={recentTools.length > 0}
        />

        {/* Command Results List */}
        <Command.List className="overflow-y-auto p-2 space-y-2 text-sm max-h-80 sm:max-h-96">
          <CommandPaletteEmpty
            search={search}
            onClearSearch={() => {
              setSearch('');
              inputRef.current?.focus();
            }}
          />

          {/* Recent Tools (shown on 'all' without query, or specifically in 'recent' tab) */}
          {recentTools.length > 0 &&
            (activeTab === 'recent' ||
              (!search && (activeTab === 'all' || activeTab === 'tools'))) && (
              <Command.Group
                heading="Recent Tools"
                className="text-[11px] font-semibold uppercase text-outline px-2 py-1"
              >
                {recentTools.map((tool) => (
                  <PaletteToolItem
                    key={`recent-${tool.id}`}
                    tool={tool}
                    prefix="recent"
                    onSelect={() => runAction(() => navigate(`/tools/${tool.slug}`))}
                  />
                ))}
              </Command.Group>
            )}

          {/* Tools List */}
          {(activeTab === 'all' || activeTab === 'tools') && (
            <Command.Group
              heading="Tools"
              className="text-[11px] font-semibold uppercase text-outline px-2 py-1"
            >
              {ALL_TOOLS.map((tool) => (
                <PaletteToolItem
                  key={tool.id}
                  tool={tool}
                  prefix="tool"
                  onSelect={() => runAction(() => navigate(`/tools/${tool.slug}`))}
                />
              ))}
            </Command.Group>
          )}

          {/* Categories */}
          {(activeTab === 'all' || activeTab === 'categories') && (
            <Command.Group
              heading="Categories"
              className="text-[11px] font-semibold uppercase text-outline px-2 py-1"
            >
              {CATEGORIES.map((cat) => (
                <PaletteCategoryItem
                  key={cat.id}
                  category={cat}
                  onSelect={() => runAction(() => navigate(`/categories/${cat.slug}`))}
                />
              ))}
            </Command.Group>
          )}

          {/* Actions */}
          {(activeTab === 'all' || activeTab === 'actions') && (
            <Command.Group
              heading="Actions"
              className="text-[11px] font-semibold uppercase text-outline px-2 py-1"
            >
              {[
                { label: 'Go to Home', val: 'action: home', fn: () => navigate('/') },
                { label: 'Browse All Tools', val: 'action: tools', fn: () => navigate('/tools') },
                {
                  label: 'Open Favorites',
                  val: 'action: favorites',
                  fn: () => navigate('/favorites'),
                },
                {
                  label: 'View Recent Tools',
                  val: 'action: recent',
                  fn: () => navigate('/recent'),
                },
                {
                  label: 'Settings & Preferences',
                  val: 'action: settings',
                  fn: () => navigate('/settings'),
                },
                {
                  label: 'Toggle Light / Dark Theme',
                  val: 'action: theme toggle',
                  fn: () => setPreference(preference === 'dark' ? 'light' : 'dark'),
                },
              ].map((act) => (
                <PaletteActionItem
                  key={act.val}
                  label={act.label}
                  value={act.val}
                  onSelect={() => runAction(act.fn)}
                />
              ))}
            </Command.Group>
          )}
        </Command.List>

        {/* Modern Tactile Status Footer */}
        <CommandPaletteFooter />
      </div>
    </Command.Dialog>
  );
};
