import React, { useState } from 'react';
import { HeroSection } from './home/HeroSection';
import { FeaturedToolsSection } from './home/FeaturedToolsSection';
import { CategoryMatrixSection } from './home/CategoryMatrixSection';
import { ArchitectureBentoSection } from './home/ArchitectureBentoSection';
import { HomeFooter } from './home/HomeFooter';
import { CommandPalette } from '@/features/command-palette/CommandPalette';
import { ShortcutsModal } from '@/features/shortcuts/ShortcutsModal';

export const HomePage: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  return (
    <div className="space-y-16 lg:space-y-24">
      <HeroSection onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      <FeaturedToolsSection />
      <CategoryMatrixSection />
      <ArchitectureBentoSection />
      <HomeFooter onOpenShortcuts={() => setShortcutsOpen(true)} />

      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
};

export default HomePage;
