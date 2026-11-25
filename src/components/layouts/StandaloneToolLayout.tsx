import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToolDefinition } from '@/registry/types';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { StandaloneToolHeader } from './StandaloneToolHeader';
import { SplitPaneContainer } from '@/features/split-view/SplitPaneContainer';
import {
  getStoredSecondarySlug,
  saveStoredSecondarySlug,
} from '@/features/split-view/splitViewLogic';
import { useRecentTools } from '@/features/recent-tools/useRecentTools';
import { CommandPalette } from '@/features/command-palette/CommandPalette';
import { ShortcutsModal } from '@/features/shortcuts/ShortcutsModal';
import { WorkspaceModal } from '@/features/workspaces/WorkspaceModal';
import { useGlobalShortcuts } from '@/features/shortcuts/useGlobalShortcuts';
import { usePageTitle } from '@/hooks/usePageTitle';

interface StandaloneToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export const StandaloneToolLayout: React.FC<StandaloneToolLayoutProps> = ({ tool, children }) => {
  usePageTitle();
  const [searchParams] = useSearchParams();
  const { addRecentTool } = useRecentTools();
  const [isSplit, setIsSplit] = useState(false);
  const [secondarySlug, setSecondarySlug] = useState<string>(getStoredSecondarySlug);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const { shortcutsOpen, setShortcutsOpen } = useGlobalShortcuts();

  const splitParam = searchParams.get('split');
  useEffect(() => {
    if (splitParam && ALL_TOOLS.some((t) => t.slug === splitParam)) {
      setIsSplit(true);
      setSecondarySlug(splitParam);
      saveStoredSecondarySlug(splitParam);
    }
  }, [splitParam]);

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
        onOpenWorkspaces={() => setWorkspaceModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8">
        {isSplit ? (
          <SplitPaneContainer
            currentToolId={tool.id}
            secondarySlug={secondarySlug}
            onSelectSlug={(slug) => {
              setSecondarySlug(slug);
              saveStoredSecondarySlug(slug);
            }}
            onClose={() => setIsSplit(false)}
          >
            {children}
          </SplitPaneContainer>
        ) : (
          <div className="w-full max-w-6xl mx-auto">{children}</div>
        )}
      </main>

      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <WorkspaceModal
        isOpen={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
        currentToolSlug={tool.slug}
        currentSecondarySlug={secondarySlug}
        isSplit={isSplit}
      />
    </div>
  );
};
