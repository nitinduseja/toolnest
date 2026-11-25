import { useState, useEffect, useCallback } from 'react';
import { getStoredItem, setStoredItem } from '@/lib/storage';
import { reorderIds, moveIdByStep } from './favoritesOrderLogic';

export const FAVORITES_STORAGE_KEY = 'toolnest_favorites';
const FAVORITES_SYNC_EVENT = 'toolnest:favorites-updated';

function commitFavoritesUpdate(
  updated: string[],
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>
): void {
  setStoredItem(FAVORITES_STORAGE_KEY, updated);
  setFavorites(updated);
  window.dispatchEvent(new CustomEvent<string[]>(FAVORITES_SYNC_EVENT, { detail: updated }));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() =>
    getStoredItem<string[]>(FAVORITES_STORAGE_KEY, [])
  );

  const toggleFavorite = useCallback((toolId: string) => {
    const current = getStoredItem<string[]>(FAVORITES_STORAGE_KEY, []);
    const updated = current.includes(toolId)
      ? current.filter((id) => id !== toolId)
      : [...current, toolId];
    commitFavoritesUpdate(updated, setFavorites);
  }, []);

  const reorderFavorites = useCallback((sourceId: string, targetId: string) => {
    const current = getStoredItem<string[]>(FAVORITES_STORAGE_KEY, []);
    const updated = reorderIds(current, sourceId, targetId);
    if (updated !== current) {
      commitFavoritesUpdate(updated, setFavorites);
    }
  }, []);

  const moveFavorite = useCallback((toolId: string, direction: 'up' | 'down') => {
    const current = getStoredItem<string[]>(FAVORITES_STORAGE_KEY, []);
    const updated = moveIdByStep(current, toolId, direction === 'up' ? -1 : 1);
    if (updated !== current) {
      commitFavoritesUpdate(updated, setFavorites);
    }
  }, []);

  const setFavoritesList = useCallback((newList: string[]) => {
    commitFavoritesUpdate(newList, setFavorites);
  }, []);

  const clearFavorites = useCallback(() => {
    commitFavoritesUpdate([], setFavorites);
  }, []);

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY) {
        if (!e.newValue) {
          setFavorites([]);
        } else {
          try {
            setFavorites(JSON.parse(e.newValue));
          } catch {
            // ignore parsing error
          }
        }
      }
    };
    const handleLocalSync = (e: Event) => {
      const custom = e as CustomEvent<string[]>;
      if (Array.isArray(custom.detail)) {
        setFavorites(custom.detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener(FAVORITES_SYNC_EVENT, handleLocalSync);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(FAVORITES_SYNC_EVENT, handleLocalSync);
    };
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    reorderFavorites,
    moveFavorite,
    setFavoritesList,
    clearFavorites,
  };
}
