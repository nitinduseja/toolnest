import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setHandoffPayload,
  getHandoffPayload,
  clearHandoffPayload,
  sendToTool,
} from './crossToolHandoff';

describe('crossToolHandoff', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores and retrieves handoff payload correctly', () => {
    const payload = setHandoffPayload('csv-json', 'data-chart', {
      data: 'a,b\n1,2',
      format: 'csv',
      label: 'Dataset',
    });

    expect(payload.sourceToolSlug).toBe('csv-json');
    expect(payload.targetToolSlug).toBe('data-chart');
    expect(payload.data).toBe('a,b\n1,2');

    const retrieved = getHandoffPayload('data-chart');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.data).toBe('a,b\n1,2');
    expect(retrieved?.format).toBe('csv');
  });

  it('returns null if targetToolSlug does not match', () => {
    setHandoffPayload('csv-json', 'data-chart', { data: 'sample' });
    const result = getHandoffPayload('json-formatter');
    expect(result).toBeNull();
  });

  it('returns null and clears storage when payload has expired', () => {
    const pastTime = Date.now() - 6 * 60 * 1000; // 6 mins ago
    sessionStorage.setItem(
      'toolnest_cross_tool_handoff',
      JSON.stringify({
        sourceToolSlug: 'source',
        targetToolSlug: 'target',
        data: 'expired data',
        timestamp: pastTime,
      })
    );

    const result = getHandoffPayload('target');
    expect(result).toBeNull();
    expect(sessionStorage.getItem('toolnest_cross_tool_handoff')).toBeNull();
  });

  it('clears handoff payload on clearHandoffPayload', () => {
    setHandoffPayload('source', 'target', { data: 'test' });
    expect(getHandoffPayload('target')).not.toBeNull();

    clearHandoffPayload();
    expect(getHandoffPayload('target')).toBeNull();
  });

  it('sendToTool stores payload and calls navigate with state', () => {
    const navigateMock = vi.fn();
    sendToTool(navigateMock as never, 'data-chart', {
      data: 'col1,col2\n10,20',
      format: 'csv',
      sourceToolSlug: 'csv-json',
    });

    expect(navigateMock).toHaveBeenCalledWith(
      '/tools/data-chart',
      expect.objectContaining({
        state: expect.objectContaining({
          handoff: expect.objectContaining({
            sourceToolSlug: 'csv-json',
            targetToolSlug: 'data-chart',
            data: 'col1,col2\n10,20',
          }),
        }),
      })
    );

    const stored = getHandoffPayload('data-chart');
    expect(stored?.data).toBe('col1,col2\n10,20');
  });
});
