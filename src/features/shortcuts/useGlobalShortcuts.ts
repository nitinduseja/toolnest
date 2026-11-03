import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function isInputField(element: EventTarget | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  const tag = element.tagName.toLowerCase();
  return (
    tag === 'input' || tag === 'textarea' || tag === 'select' || Boolean(element.isContentEditable)
  );
}

export function useGlobalShortcuts(): {
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
} {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const navigate = useNavigate();
  const lastKeyRef = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputField(e.target)) return;

      // ? or Ctrl+/ for shortcuts modal
      if (e.key === '?' || (e.ctrlKey && e.key === '/')) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
        return;
      }

      // Two-key chord navigation: 'g' then key
      if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey) {
        lastKeyRef.current = 'g';
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          lastKeyRef.current = null;
        }, 1000);
        return;
      }

      if (lastKeyRef.current === 'g') {
        const k = e.key.toLowerCase();
        lastKeyRef.current = null;
        if (k === 'h') {
          e.preventDefault();
          navigate('/');
        } else if (k === 'a') {
          e.preventDefault();
          navigate('/tools');
        } else if (k === 'f') {
          e.preventDefault();
          navigate('/favorites');
        } else if (k === 'r') {
          e.preventDefault();
          navigate('/recent');
        } else if (k === 's') {
          e.preventDefault();
          navigate('/settings');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return { shortcutsOpen, setShortcutsOpen };
}
