import { describe, it, expect, beforeEach } from 'vitest';
import {
  CURATED_WORKSPACES,
  getCustomWorkspaces,
  getAllWorkspaces,
  saveCustomWorkspace,
  deleteCustomWorkspace,
  buildWorkspacePath,
  isValidToolSlug,
} from './workspaceLogic';

describe('workspaceLogic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides 5 curated preset workspaces with valid tool slugs', () => {
    expect(CURATED_WORKSPACES.length).toBe(5);
    CURATED_WORKSPACES.forEach((ws) => {
      expect(ws.isPreset).toBe(true);
      expect(isValidToolSlug(ws.primaryToolSlug)).toBe(true);
      if (ws.secondaryToolSlug) {
        expect(isValidToolSlug(ws.secondaryToolSlug)).toBe(true);
      }
    });
  });

  it('saves and retrieves custom workspaces in localStorage', () => {
    expect(getCustomWorkspaces()).toEqual([]);

    const created = saveCustomWorkspace({
      name: 'My Dev Workspace',
      description: 'Testing REST API & Hash Generator',
      primaryToolSlug: 'rest-api-client',
      secondaryToolSlug: 'hash-generator',
      isSplit: true,
    });

    expect(created.id).toContain('custom_ws_');
    expect(created.name).toBe('My Dev Workspace');

    const customList = getCustomWorkspaces();
    expect(customList.length).toBe(1);
    expect(customList[0].id).toBe(created.id);

    const all = getAllWorkspaces();
    expect(all.length).toBe(CURATED_WORKSPACES.length + 1);
  });

  it('deletes a custom workspace by id', () => {
    const ws1 = saveCustomWorkspace({
      name: 'Workspace 1',
      primaryToolSlug: 'csv-json',
      isSplit: false,
    });
    const ws2 = saveCustomWorkspace({
      name: 'Workspace 2',
      primaryToolSlug: 'data-chart',
      isSplit: false,
    });

    expect(getCustomWorkspaces().length).toBe(2);

    const deleted = deleteCustomWorkspace(ws1.id);
    expect(deleted).toBe(true);

    const remaining = getCustomWorkspaces();
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(ws2.id);
  });

  it('builds workspace URLs with query params for split view', () => {
    const singlePath = buildWorkspacePath({
      id: 'test_single',
      name: 'Single',
      description: 'Single tool',
      primaryToolSlug: 'json-formatter',
      isSplit: false,
      createdAt: 0,
    });
    expect(singlePath).toBe('/tools/json-formatter');

    const splitPath = buildWorkspacePath({
      id: 'test_split',
      name: 'Split',
      description: 'Split tools',
      primaryToolSlug: 'svg-patterns',
      secondaryToolSlug: 'svg-optimizer',
      isSplit: true,
      createdAt: 0,
    });
    expect(splitPath).toBe('/tools/svg-patterns?split=svg-optimizer');
  });
});
