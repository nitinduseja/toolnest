import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { HeroSection } from './home/HeroSection';
import { FeaturedToolsSection } from './home/FeaturedToolsSection';
import { CategoryMatrixSection } from './home/CategoryMatrixSection';
import { ArchitectureBentoSection } from './home/ArchitectureBentoSection';
import { HomeFooter } from './home/HomeFooter';
import { PortalOutletContext } from '@/components/layouts/PortalShell';

export const HomePage: React.FC = () => {
  const outletContext = useOutletContext<PortalOutletContext | null>();
  const onOpenCommandPalette = outletContext?.onOpenCommandPalette ?? (() => {});
  const onOpenShortcuts = outletContext?.onOpenShortcuts ?? (() => {});

  return (
    <div className="space-y-16 lg:space-y-24">
      <HeroSection onOpenCommandPalette={onOpenCommandPalette} />
      <FeaturedToolsSection />
      <CategoryMatrixSection />
      <ArchitectureBentoSection />
      <HomeFooter onOpenShortcuts={onOpenShortcuts} />
    </div>
  );
};

export default HomePage;
