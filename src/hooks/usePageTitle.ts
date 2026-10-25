import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TOOL_SLUG_MAP } from '@/registry/tool-registry';
import { CATEGORIES } from '@/registry/categories';

export const APP_NAME = 'Toolnest';
export const HOME_TITLE = 'Toolnest | Useful tools. One workspace.';

export function getPageTitle(pathname: string): string {
  if (pathname === '/') {
    return HOME_TITLE;
  }

  if (pathname === '/tools') {
    return `All Tools | ${APP_NAME}`;
  }

  if (pathname.startsWith('/tools/')) {
    const slug = pathname.replace('/tools/', '').split('/')[0];
    const tool = TOOL_SLUG_MAP.get(slug);
    return tool ? `${tool.name} | ${APP_NAME}` : `Tool Not Found | ${APP_NAME}`;
  }

  if (pathname.startsWith('/categories/')) {
    const slug = pathname.replace('/categories/', '').split('/')[0];
    const cat = CATEGORIES.find((c) => c.slug === slug);
    return cat ? `${cat.name} | ${APP_NAME}` : `Category Not Found | ${APP_NAME}`;
  }

  if (pathname === '/favorites') {
    return `Starred Favorites | ${APP_NAME}`;
  }

  if (pathname === '/recent') {
    return `Recent History | ${APP_NAME}`;
  }

  if (pathname === '/settings') {
    return `Settings & Preferences | ${APP_NAME}`;
  }

  return `Page Not Found | ${APP_NAME}`;
}

export function usePageTitle(): void {
  const location = useLocation();

  useEffect(() => {
    const title = getPageTitle(location.pathname);
    document.title = title;
  }, [location.pathname]);
}
