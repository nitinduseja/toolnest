import { useEffect, useCallback } from 'react';

export interface HandoffPayload {
  sourceToolSlug: string;
  targetToolSlug: string;
  data: string;
  format?: string;
  label?: string;
  timestamp: number;
}

export interface SendToToolOptions {
  data: string;
  format?: string;
  label?: string;
}

const STORAGE_KEY = 'toolnest_cross_tool_handoff';
const EVENT_NAME = 'toolnest:handoff';
const EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export function setHandoffPayload(
  sourceToolSlug: string,
  targetToolSlug: string,
  options: SendToToolOptions
): HandoffPayload {
  const payload: HandoffPayload = {
    sourceToolSlug,
    targetToolSlug,
    data: options.data,
    format: options.format,
    label: options.label,
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Graceful fallback if storage is disabled or quota exceeded
  }

  return payload;
}

export function getHandoffPayload(targetToolSlug: string): HandoffPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const payload = JSON.parse(raw) as HandoffPayload;
    if (payload.targetToolSlug !== targetToolSlug) return null;

    if (Date.now() - payload.timestamp > EXPIRY_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function clearHandoffPayload(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore error
  }
}

export interface SendToToolOptions {
  data: string;
  format?: string;
  label?: string;
  sourceToolSlug?: string;
}

export function sendToTool(
  navigate: ((path: string, options?: { state?: unknown }) => void) | undefined,
  targetToolSlug: string,
  options: SendToToolOptions
): HandoffPayload {
  const sourceSlug = options.sourceToolSlug || 'unknown';
  const payload = setHandoffPayload(sourceSlug, targetToolSlug, options);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }));
  }

  if (typeof navigate === 'function') {
    navigate(`/tools/${targetToolSlug}`, { state: { handoff: payload } });
  } else if (typeof window !== 'undefined' && window.location) {
    window.location.hash = `/tools/${targetToolSlug}`;
  }

  return payload;
}

export function useToolHandoff(
  toolSlug: string,
  onConsume?: (data: string, payload: HandoffPayload) => void
): { incomingData: string | null; payload: HandoffPayload | null } {
  const handleConsume = useCallback(
    (payload: HandoffPayload) => {
      if (payload.targetToolSlug === toolSlug && payload.data) {
        if (onConsume) {
          onConsume(payload.data, payload);
        }
        clearHandoffPayload();
      }
    },
    [toolSlug, onConsume]
  );

  // Check storage on mount
  useEffect(() => {
    const stored = getHandoffPayload(toolSlug);
    if (stored) {
      handleConsume(stored);
    }
  }, [toolSlug, handleConsume]);

  // Listen to in-memory events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const listener = (e: Event) => {
      const customEvent = e as CustomEvent<HandoffPayload>;
      if (customEvent.detail) {
        handleConsume(customEvent.detail);
      }
    };

    window.addEventListener(EVENT_NAME, listener);
    return () => window.removeEventListener(EVENT_NAME, listener);
  }, [handleConsume]);

  const current = getHandoffPayload(toolSlug);
  return {
    incomingData: current?.data ?? null,
    payload: current ?? null,
  };
}
