import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredSecondarySlug,
  saveStoredSecondarySlug,
  getAvailableSecondaryTools,
} from './splitViewLogic';

describe('splitViewLogic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to json-formatter if no secondary tool stored', () => {
    expect(getStoredSecondarySlug()).toBe('json-formatter');
  });

  it('persists and retrieves secondary tool slug', () => {
    saveStoredSecondarySlug('rest-api-client');
    expect(getStoredSecondarySlug()).toBe('rest-api-client');
  });

  it('filters out the current tool from available secondary tools', () => {
    const list = getAvailableSecondaryTools('json-formatter');
    expect(list.some((t) => t.id === 'json-formatter')).toBe(false);
    expect(list.length).toBeGreaterThan(10);
  });
});
