import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './useTheme';
import { ThemePreference } from './themeContext';

const THEME_OPTIONS: { id: ThemePreference; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
  { id: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
  { id: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
];

export const ThemeToggle: React.FC = () => {
  const { preference, setPreference } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = useCallback(
    (choice: ThemePreference) => {
      setPreference(choice);
      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [setPreference]
  );

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Focus active item when menu opens
  useEffect(() => {
    if (isOpen) {
      const idx = THEME_OPTIONS.findIndex((opt) => opt.id === preference);
      const targetIdx = idx >= 0 ? idx : 0;
      setActiveIndex(targetIdx);
      setTimeout(() => itemsRef.current[targetIdx]?.focus(), 20);
    }
  }, [isOpen, preference]);

  // Keyboard navigation within menu
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (activeIndex + 1) % THEME_OPTIONS.length;
      setActiveIndex(next);
      itemsRef.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (activeIndex - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length;
      setActiveIndex(prev);
      itemsRef.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
      itemsRef.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = THEME_OPTIONS.length - 1;
      setActiveIndex(last);
      itemsRef.current[last]?.focus();
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  const getButtonIcon = () => {
    if (preference === 'system') return <Monitor className="w-4 h-4 text-on-surface-variant" />;
    if (preference === 'dark') return <Moon className="w-4 h-4 text-on-surface-variant" />;
    return <Sun className="w-4 h-4 text-on-surface-variant" />;
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-label={`Toggle theme, current theme: ${preference}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={`Theme: ${preference}`}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
      >
        {getButtonIcon()}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Theme options"
          aria-orientation="vertical"
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 mt-2 w-36 rounded-lg bg-surface-container-low border border-outline-variant shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {THEME_OPTIONS.map((opt, index) => (
            <button
              key={opt.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              type="button"
              role="menuitem"
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => handleSelect(opt.id)}
              className={`w-full px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-surface-container-high focus:bg-surface-container-high focus:outline-none transition-colors ${
                preference === opt.id ? 'text-primary font-semibold' : 'text-on-surface'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
