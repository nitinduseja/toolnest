import React, { useEffect, useState, ReactNode } from 'react';
import { getStoredItem, setStoredItem, removeStoredItem } from '@/lib/storage';
import { ThemeContext, ThemePreference, ResolvedTheme } from './themeContext';

const STORAGE_KEY = 'toolnest_theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDocument(theme: ResolvedTheme): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preference, setPrefState] = useState<ThemePreference>(() => {
    const stored = getStoredItem<string | null>(STORAGE_KEY, null);
    if (stored === 'light' || stored === 'dark') return stored;
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (preference === 'system') return getSystemTheme();
    return preference;
  });

  const setPreference = (newPref: ThemePreference) => {
    setPrefState(newPref);
    if (newPref === 'system') {
      removeStoredItem(STORAGE_KEY);
      const sys = getSystemTheme();
      setResolvedTheme(sys);
      applyThemeToDocument(sys);
    } else {
      setStoredItem(STORAGE_KEY, newPref);
      setResolvedTheme(newPref);
      applyThemeToDocument(newPref);
    }
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (preference === 'system') {
        const sys = getSystemTheme();
        setResolvedTheme(sys);
        applyThemeToDocument(sys);
      }
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [preference]);

  useEffect(() => {
    const current = preference === 'system' ? getSystemTheme() : preference;
    applyThemeToDocument(current);
  }, [preference]);

  return (
    <ThemeContext.Provider value={{ preference, resolvedTheme, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
};
