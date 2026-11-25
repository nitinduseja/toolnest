import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredSecondarySlug,
  saveStoredSecondarySlug,
  getAvailableSecondaryTools,
  clampSplitRatio,
  getStoredSplitRatio,
  saveStoredSplitRatio,
  calculateSplitRatioFromDrag,
  DEFAULT_SPLIT_RATIO,
  MIN_SPLIT_RATIO,
  MAX_SPLIT_RATIO,
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

  it('clamps split ratios between MIN_SPLIT_RATIO and MAX_SPLIT_RATIO', () => {
    expect(clampSplitRatio(10)).toBe(MIN_SPLIT_RATIO);
    expect(clampSplitRatio(90)).toBe(MAX_SPLIT_RATIO);
    expect(clampSplitRatio(42.6)).toBe(43);
    expect(clampSplitRatio(Number.NaN)).toBe(DEFAULT_SPLIT_RATIO);
  });

  it('persists and retrieves split ratio in localStorage', () => {
    expect(getStoredSplitRatio()).toBe(50);
    saveStoredSplitRatio(65);
    expect(getStoredSplitRatio()).toBe(65);
    saveStoredSplitRatio(10);
    expect(getStoredSplitRatio()).toBe(MIN_SPLIT_RATIO);
  });

  it('calculates split ratio from pointer coordinates', () => {
    expect(calculateSplitRatioFromDrag({ clientX: 600, rectLeft: 100, rectWidth: 1000 })).toBe(50);
    expect(calculateSplitRatioFromDrag({ clientX: 400, rectLeft: 100, rectWidth: 1000 })).toBe(30);
    expect(calculateSplitRatioFromDrag({ clientX: 150, rectLeft: 100, rectWidth: 1000 })).toBe(
      MIN_SPLIT_RATIO
    );
    expect(calculateSplitRatioFromDrag({ clientX: 500, rectLeft: 0, rectWidth: 0 })).toBe(50);
  });
});
