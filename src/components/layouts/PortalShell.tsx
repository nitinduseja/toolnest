import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ResponsiveFloatingNav } from '@/components/navigation/ResponsiveFloatingNav';
import { CommandPalette } from '@/features/command-palette/CommandPalette';
import { ShortcutsModal } from '@/features/shortcuts/ShortcutsModal';
import { useGlobalShortcuts } from '@/features/shortcuts/useGlobalShortcuts';
import { usePageTitle } from '@/hooks/usePageTitle';

export const PortalShell: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { shortcutsOpen, setShortcutsOpen } = useGlobalShortcuts();
  usePageTitle();

  return (
    <div className="min-h-screen bg-surface ambient-hero-mesh flex flex-col antialiased selection:bg-primary-container/20 relative">
      <ResponsiveFloatingNav
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 sm:pt-24 pb-28 md:pb-16 px-4 sm:px-6 lg:px-8 transition-all">
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
          <Outlet />
        </Suspense>
      </main>

      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
};
