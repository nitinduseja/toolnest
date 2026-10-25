import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { CommandPalette } from '@/features/command-palette/CommandPalette';
import { usePageTitle } from '@/hooks/usePageTitle';

export const AppShell: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  usePageTitle();

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased selection:bg-primary-container/20">
      <Header onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <Sidebar />

      <main className="flex-1 sm:pl-16 lg:pl-60 pt-14 pb-28 sm:pb-8 transition-all">
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

      <BottomNav />

      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  );
};
