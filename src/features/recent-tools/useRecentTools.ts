import { useState, useEffect, useCallback } from 'react';
import { getStoredItem, setStoredItem, removeStoredItem } from '@/lib/storage';

const RECENT_TOOLS_KEY = 'toolnest_recent_tools';
const MAX_RECENT_ITEMS = 12;

export function useRecentTools() {
  const [recentToolIds, setRecentToolIds] = useState<string[]>(() =>
    getStoredItem<string[]>(RECENT_TOOLS_KEY, [])
  );

  const addRecentTool = useCallback((toolId: string) => {
    setRecentToolIds((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, MAX_RECENT_ITEMS);
      setStoredItem(RECENT_TOOLS_KEY, updated);
      return updated;
    });
  }, []);

  const removeRecentTool = useCallback((toolId: string) => {
    setRecentToolIds((prev) => {
      const updated = prev.filter((id) => id !== toolId);
      setStoredItem(RECENT_TOOLS_KEY, updated);
      return updated;
    });
  }, []);

  const clearRecentTools = useCallback(() => {
    removeStoredItem(RECENT_TOOLS_KEY);
    setRecentToolIds([]);
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === RECENT_TOOLS_KEY && e.newValue) {
        try {
          setRecentToolIds(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { recentToolIds, addRecentTool, removeRecentTool, clearRecentTools };
}
