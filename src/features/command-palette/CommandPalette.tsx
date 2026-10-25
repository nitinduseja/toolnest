import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/atoms/Icon';
import { CATEGORIES } from '@/registry/categories';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { useTheme } from '@/features/theme/useTheme';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaletteTab = 'all' | 'tools' | 'categories' | 'actions';

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { preference, setPreference } = useTheme();
  const { recentToolIds } = useRecentTools();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<PaletteTab>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

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

  // Visual selection style
  const itemClass =
    'flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-100 ' +
    'text-on-surface hover:bg-surface-container-high ' +
    'aria-selected:bg-primary-container aria-selected:text-on-primary-container aria-selected:font-semibold aria-selected:shadow-sm ' +
    'data-[selected=true]:bg-primary-container data-[selected=true]:text-on-primary-container data-[selected=true]:font-semibold data-[selected=true]:shadow-sm';

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command Palette"
      loop={true}
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-2xl bg-surface-container-low border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (document.activeElement !== inputRef.current) {
              inputRef.current?.focus();
            }
          }
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-surface-container-lowest border-b border-outline-variant/60 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight text-on-surface">
              Command Palette
            </h2>
            <p className="text-[11px] text-on-surface-variant truncate">
              Search tools, categories, and actions
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-container text-outline font-mono text-[10px] border border-outline-variant/50">
              ESC
            </kbd>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onOpenChange(false)}
              aria-label="Close command palette"
              className="p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <Icon name="X" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input Row */}
        <div className="relative flex items-center px-4 border-b border-outline-variant/60 h-11 bg-surface-container-low">
          <Icon
            name="Search"
            className="w-4 h-4 text-outline mr-2.5 shrink-0 pointer-events-none"
          />
          <Command.Input
            ref={inputRef}
            value={search}
            onValueChange={setSearch}
            placeholder="Type to search..."
            className="w-full bg-transparent text-on-surface placeholder:text-outline text-xs sm:text-sm outline-none"
            autoFocus
          />
          {search && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                setSearch('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Clear search query"
            >
              <Icon name="X" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs Strip */}
        <div className="px-3 py-1.5 bg-surface-container-lowest/50 border-b border-outline-variant/40 flex items-center gap-1 overflow-x-auto text-xs select-none">
          {(['all', 'tools', 'categories', 'actions'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              tabIndex={-1}
              onClick={() => {
                setActiveTab(tab);
                inputRef.current?.focus();
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-2xs'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Command Results List */}
        <Command.List className="overflow-y-auto p-2 space-y-2 text-sm max-h-80 sm:max-h-96">
          <Command.Empty className="py-8 text-center text-on-surface-variant text-xs sm:text-sm">
            No results found for &ldquo;{search}&rdquo;.
          </Command.Empty>

          {/* Recent Tools */}
          {recentTools.length > 0 && !search && (activeTab === 'all' || activeTab === 'tools') && (
            <Command.Group
              heading="Recent Tools"
              className="text-[11px] font-semibold uppercase text-outline px-2 py-1"
            >
              {recentTools.map((tool) => (
                <Command.Item
                  key={`recent-${tool.id}`}
                  value={`recent: ${tool.name} ${tool.keywords.join(' ')}`}
                  onSelect={() => runAction(() => navigate(`/tools/${tool.slug}`))}
                  className={itemClass}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name={tool.iconName} className="w-4 h-4 shrink-0" />
                    <span className="text-xs sm:text-sm">{tool.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container/50 opacity-80">
                    {tool.category}
                  </span>
                </Command.Item>
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
                <Command.Item
                  key={tool.id}
                  value={`tool: ${tool.name} ${tool.keywords.join(' ')}`}
                  onSelect={() => runAction(() => navigate(`/tools/${tool.slug}`))}
                  className={itemClass}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name={tool.iconName} className="w-4 h-4 shrink-0" />
                    <span className="text-xs sm:text-sm">{tool.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container/50 opacity-80">
                      {tool.category}
                    </span>
                    <Icon name="ArrowRight" className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  </div>
                </Command.Item>
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
                <Command.Item
                  key={cat.id}
                  value={`category: ${cat.name}`}
                  onSelect={() => runAction(() => navigate(`/categories/${cat.slug}`))}
                  className={itemClass}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name={cat.iconName} className="w-4 h-4 shrink-0" />
                    <span className="text-xs sm:text-sm">{cat.name}</span>
                  </div>
                  <Icon name="ChevronRight" className="w-3.5 h-3.5 opacity-70 shrink-0" />
                </Command.Item>
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
                <Command.Item
                  key={act.val}
                  value={act.val}
                  onSelect={() => runAction(act.fn)}
                  className={itemClass}
                >
                  <span className="text-xs sm:text-sm">{act.label}</span>
                  <Icon name="ArrowRight" className="w-3.5 h-3.5 opacity-70 shrink-0" />
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>

        {/* Modal Footer */}
        <div className="px-4 py-2 border-t border-outline-variant/60 bg-surface-container-lowest text-[11px] text-outline flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="font-mono text-[10px]">100% In-Browser</span>
        </div>
      </div>
    </Command.Dialog>
  );
};
