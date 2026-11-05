import React, { useState, Suspense, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { ResponsiveFloatingNav } from '@/components/navigation/ResponsiveFloatingNav';
import { CommandPalette } from '@/features/command-palette/CommandPalette';
import { ShortcutsModal } from '@/features/shortcuts/ShortcutsModal';
import { useGlobalShortcuts } from '@/features/shortcuts/useGlobalShortcuts';
import { usePageTitle } from '@/hooks/usePageTitle';

export interface PortalOutletContext {
  onOpenCommandPalette: (initialQuery?: string) => void;
  onOpenShortcuts: () => void;
}

export const PortalShell: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [paletteInitialQuery, setPaletteInitialQuery] = useState('');
  const { shortcutsOpen, setShortcutsOpen } = useGlobalShortcuts();
  usePageTitle();

  const handleOpenCommandPalette = useCallback((initialQuery = '') => {
    setPaletteInitialQuery(initialQuery);
    setCommandPaletteOpen(true);
  }, []);

  const handleOpenShortcuts = useCallback(() => {
    setShortcutsOpen(true);
  }, [setShortcutsOpen]);

  const outletContext: PortalOutletContext = {
    onOpenCommandPalette: handleOpenCommandPalette,
    onOpenShortcuts: handleOpenShortcuts,
  };

  return (
    <div className="min-h-screen bg-surface ambient-hero-mesh flex flex-col antialiased selection:bg-primary-container/20 relative">
      <ResponsiveFloatingNav
        onOpenCommandPalette={() => handleOpenCommandPalette('')}
        onOpenShortcuts={handleOpenShortcuts}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto pt-4 sm:pt-6 md:pt-20 lg:pt-24 pb-28 md:pb-16 px-4 sm:px-6 lg:px-8 transition-all">
        <Suspense
          fallback={
            <div className="w-full min-h-[50vh] flex items-center justify-center text-outline">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono">Loading workspace...</span>
              </div>
            </div>
          }
        >
          <Outlet context={outletContext} />
        </Suspense>
      </main>

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        initialQuery={paletteInitialQuery}
      />
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
};
