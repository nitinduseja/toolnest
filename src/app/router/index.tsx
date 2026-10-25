import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layouts/AppShell';
import { HomePage } from '@/pages/HomePage';
import { AllToolsPage } from '@/pages/AllToolsPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { RecentPage } from '@/pages/RecentPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ToolRouteWrapper } from './ToolRouteWrapper';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tools', element: <AllToolsPage /> },
      { path: 'tools/:toolSlug', element: <ToolRouteWrapper /> },
      { path: 'categories/:categorySlug', element: <CategoryPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'recent', element: <RecentPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
