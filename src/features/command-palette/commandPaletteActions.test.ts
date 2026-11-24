import { describe, it, expect, vi } from 'vitest';
import { buildQuickActions } from './commandPaletteActions';

describe('commandPaletteActions', () => {
  it('builds full list of actions including navigation, workspace, and clipboard tools', () => {
    const navigate = vi.fn();
    const setPreference = vi.fn();
    const clearRecentTools = vi.fn();

    const actions = buildQuickActions({
      navigate,
      preference: 'dark',
      setPreference,
      clearRecentTools,
    });

    expect(actions.length).toBeGreaterThanOrEqual(10);
    const labels = actions.map((a) => a.label);
    expect(labels).toContain('Go to Home');
    expect(labels).toContain('Copy New UUIDv4');
    expect(labels).toContain('Launch Full-Stack API Suite');
    expect(labels).toContain('Clear Recent Tools History');
    expect(labels).toContain('Toggle Light / Dark Theme');
  });

  it('triggers navigation and theme toggling actions correctly', () => {
    const navigate = vi.fn();
    const setPreference = vi.fn();
    const clearRecentTools = vi.fn();

    const actions = buildQuickActions({
      navigate,
      preference: 'dark',
      setPreference,
      clearRecentTools,
    });

    const homeAction = actions.find((a) => a.label === 'Go to Home');
    homeAction?.fn();
    expect(navigate).toHaveBeenCalledWith('/');

    const themeAction = actions.find((a) => a.label === 'Toggle Light / Dark Theme');
    themeAction?.fn();
    expect(setPreference).toHaveBeenCalledWith('light');

    const clearAction = actions.find((a) => a.label === 'Clear Recent Tools History');
    clearAction?.fn();
    expect(clearRecentTools).toHaveBeenCalled();

    const workspaceAction = actions.find((a) => a.label === 'Launch Full-Stack API Suite');
    workspaceAction?.fn();
    expect(navigate).toHaveBeenCalledWith('/tools/rest-api-client?split=fullstack-api');
  });

  it('copies UUIDv4 to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    const actions = buildQuickActions({
      navigate: vi.fn(),
      preference: 'light',
      setPreference: vi.fn(),
      clearRecentTools: vi.fn(),
    });

    const uuidAction = actions.find((a) => a.label === 'Copy New UUIDv4');
    await uuidAction?.fn();
    expect(writeText).toHaveBeenCalled();
    const written = writeText.mock.calls[0][0];
    expect(typeof written).toBe('string');
    expect(written).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});
