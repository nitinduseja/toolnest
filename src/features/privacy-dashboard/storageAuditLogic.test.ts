import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatBytes,
  describeStorageKey,
  inspectLocalStorage,
  purgeStorageKey,
  runStorageAudit,
} from './storageAuditLogic';

describe('storageAuditLogic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('formats byte values cleanly into B, KB, and MB', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(1024 * 1024 * 1.5)).toBe('1.50 MB');
  });

  it('maps known Toolnest keys to readable labels and categories', () => {
    expect(describeStorageKey('toolnest_favorites')).toEqual({
      label: 'Pinned Favorites Order',
      category: 'navigation',
    });
    expect(describeStorageKey('toolnest_split_ratio')).toEqual({
      label: 'Split Pane Ratio (%)',
      category: 'workspaces',
    });
    expect(describeStorageKey('custom_key')).toEqual({
      label: 'custom_key',
      category: 'other',
    });
  });

  it('inspects localStorage keys, counts array entries, and purges individual keys', () => {
    localStorage.setItem(
      'toolnest_favorites',
      JSON.stringify(['json-formatter', 'uuid-generator'])
    );
    localStorage.setItem('toolnest_theme', 'dark');

    const { entries, totalBytes } = inspectLocalStorage();
    expect(entries).toHaveLength(2);
    expect(totalBytes).toBeGreaterThan(0);

    const favEntry = entries.find((e) => e.key === 'toolnest_favorites');
    expect(favEntry?.itemCount).toBe(2);

    purgeStorageKey('toolnest_favorites');
    const afterPurge = inspectLocalStorage();
    expect(afterPurge.entries).toHaveLength(1);
  });

  it('compiles a full storage audit report safely in test environment', async () => {
    localStorage.setItem('toolnest_split_ratio', '60');
    const report = await runStorageAudit();
    expect(report.totalLocalBytes).toBeGreaterThan(0);
    expect(report.localKeys.some((k) => k.key === 'toolnest_split_ratio')).toBe(true);
    expect(report.indexedDb.scannerDocuments).toBe(0);
  });
});
