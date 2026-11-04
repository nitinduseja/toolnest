import React, { useState } from 'react';
import { DesktopFloatingNav } from './DesktopFloatingNav';
import { TabletFloatingNav } from './TabletFloatingNav';
import { MobileFloatingNav } from './MobileFloatingNav';
import { CategoryQuickSheet } from './CategoryQuickSheet';

interface ResponsiveFloatingNavProps {
  onOpenCommandPalette: () => void;
  onOpenShortcuts: () => void;
}

export const ResponsiveFloatingNav: React.FC<ResponsiveFloatingNavProps> = ({
  onOpenCommandPalette,
  onOpenShortcuts,
}) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <>
      <DesktopFloatingNav
        onOpenCommandPalette={onOpenCommandPalette}
        onOpenCategories={() => setCategoriesOpen(true)}
        onOpenShortcuts={onOpenShortcuts}
      />

      <TabletFloatingNav
        onOpenCommandPalette={onOpenCommandPalette}
        onOpenCategories={() => setCategoriesOpen(true)}
        onOpenShortcuts={onOpenShortcuts}
      />

      <MobileFloatingNav
        onOpenCommandPalette={onOpenCommandPalette}
        onOpenCategories={() => setCategoriesOpen(true)}
      />

      <CategoryQuickSheet isOpen={categoriesOpen} onClose={() => setCategoriesOpen(false)} />
    </>
  );
};
