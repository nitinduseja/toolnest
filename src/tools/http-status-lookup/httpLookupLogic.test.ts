import { describe, it, expect } from 'vitest';
import {
  filterStatusCodes,
  filterHttpHeaders,
  getStatusCategoryBadge,
  generateCurlSnippet,
} from './httpLookupLogic';

describe('httpLookupLogic', () => {
  describe('filterStatusCodes', () => {
    it('returns all status codes when query is empty and category is all', () => {
      const all = filterStatusCodes('', 'all');
      expect(all.length).toBeGreaterThanOrEqual(30);
    });

    it('filters accurately by numeric status code', () => {
      const results = filterStatusCodes('404', 'all');
      expect(results.some((r) => r.code === 404 && r.name === 'Not Found')).toBe(true);
    });

    it('filters by status name and text query case-insensitively', () => {
      const teapot = filterStatusCodes('teapot', 'all');
      expect(teapot.length).toBe(1);
      expect(teapot[0].code).toBe(418);

      const unauthorized = filterStatusCodes('UNAUTHORIZED', 'all');
      expect(unauthorized.length).toBe(1);
      expect(unauthorized[0].code).toBe(401);
    });

    it('filters strictly by status category', () => {
      const errors2xx = filterStatusCodes('', '2xx');
      expect(errors2xx.every((r) => r.category === '2xx')).toBe(true);

      const errors5xx = filterStatusCodes('gateway', '5xx');
      expect(errors5xx.every((r) => r.category === '5xx')).toBe(true);
      expect(errors5xx.length).toBeGreaterThanOrEqual(2); // Bad Gateway & Gateway Timeout
    });
  });

  describe('filterHttpHeaders', () => {
    it('returns all headers when query is empty and category is all', () => {
      const all = filterHttpHeaders('', 'all');
      expect(all.length).toBeGreaterThanOrEqual(12);
    });

    it('filters headers by name and keywords', () => {
      const csp = filterHttpHeaders('security-policy', 'all');
      expect(csp.length).toBe(1);
      expect(csp[0].name).toBe('Content-Security-Policy');

      const cors = filterHttpHeaders('', 'cors');
      expect(cors.every((h) => h.category === 'cors')).toBe(true);
      expect(cors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('getStatusCategoryBadge', () => {
    it('returns valid styling and labels for each category', () => {
      expect(getStatusCategoryBadge('1xx').label).toBe('Informational');
      expect(getStatusCategoryBadge('2xx').label).toBe('Success');
      expect(getStatusCategoryBadge('3xx').label).toBe('Redirection');
      expect(getStatusCategoryBadge('4xx').label).toBe('Client Error');
      expect(getStatusCategoryBadge('5xx').label).toBe('Server Error');
    });
  });

  describe('generateCurlSnippet', () => {
    it('formats a valid test curl command', () => {
      expect(generateCurlSnippet(404)).toBe('curl -i -X GET https://httpbin.org/status/404');
    });
  });
});
