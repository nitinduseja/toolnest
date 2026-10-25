import { useState, useEffect, useCallback } from 'react';
import { getStoredItem, setStoredItem } from '@/lib/storage';

const FAVORITES_STORAGE_KEY = 'toolnest_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() =>
    getStoredItem<string[]>(FAVORITES_STORAGE_KEY, [])
  );

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];
      setStoredItem(FAVORITES_STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue));
        } catch {
          // ignore parsing error
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { favorites, toggleFavorite, isFavorite };
}
