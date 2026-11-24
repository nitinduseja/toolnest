import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePwa } from './pwaManager';

describe('pwaManager and usePwa hook', () => {
  it('returns initial online status based on navigator.onLine', () => {
    const { result } = renderHook(() => usePwa());
    expect(typeof result.current.isOnline).toBe('boolean');
    expect(result.current.isOnline).toBe(true);
  });

  it('updates online status when online and offline events fire', () => {
    const { result } = renderHook(() => usePwa());

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.isOnline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.isOnline).toBe(true);
  });

  it('provides promptInstall returning false when no deferredPrompt is active', async () => {
    const { result } = renderHook(() => usePwa());
    let res = false;
    await act(async () => {
      res = await result.current.promptInstall();
    });
    expect(res).toBe(false);
  });

  it('provides applyUpdate callback without crashing', () => {
    const { result } = renderHook(() => usePwa());
    expect(() => {
      act(() => {
        result.current.applyUpdate();
      });
    }).not.toThrow();
  });
});
