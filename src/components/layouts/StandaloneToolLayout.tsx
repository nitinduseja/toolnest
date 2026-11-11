import React, { useEffect, useState } from 'react';
import { ToolDefinition } from '@/registry/types';
import { StandaloneToolHeader } from './StandaloneToolHeader';
import { SecondaryToolPane } from '@/features/split-view/SecondaryToolPane';
import {
  getStoredSecondarySlug,
  saveStoredSecondarySlug,
} from '@/features/split-view/splitViewLogic';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';
import { CommandPalette } from '@/features/command-palette/CommandPalette';
import { ShortcutsModal } from '@/features/shortcuts/ShortcutsModal';
import { useGlobalShortcuts } from '@/features/shortcuts/useGlobalShortcuts';
import { usePageTitle } from '@/hooks/usePageTitle';

interface StandaloneToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export const StandaloneToolLayout: React.FC<StandaloneToolLayoutProps> = ({ tool, children }) => {
  usePageTitle();
  const { addRecentTool } = useRecentTools();
  const [isSplit, setIsSplit] = useState(false);
  const [secondarySlug, setSecondarySlug] = useState<string>(getStoredSecondarySlug);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { shortcutsOpen, setShortcutsOpen } = useGlobalShortcuts();

  useEffect(() => {
    addRecentTool(tool.id);
  }, [tool.id, addRecentTool]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSplit((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-surface text-on-surface antialiased">
      <StandaloneToolHeader
        tool={tool}
        isSplit={isSplit}
        onToggleSplit={() => setIsSplit((prev) => !prev)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8">
        {isSplit ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full items-start max-w-[1750px] mx-auto">
            <div className="min-w-0 flex-1">{children}</div>
            <SecondaryToolPane
              currentToolId={tool.id}
              selectedSlug={secondarySlug}
              onSelectSlug={(slug) => {
                setSecondarySlug(slug);
                saveStoredSecondarySlug(slug);
              }}
              onClose={() => setIsSplit(false)}
            />
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto">{children}</div>
        )}
      </main>

      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
};
