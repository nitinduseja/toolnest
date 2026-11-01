import { describe, it, expect } from 'vitest';
import {
  parseUrlString,
  buildUrlString,
  paramsToJson,
  getSampleUrls,
  QueryParamItem,
} from './urlLogic';

describe('urlLogic', () => {
  describe('parseUrlString', () => {
    it('parses full URL with port, path, query, and hash', () => {
      const url = 'https://api.example.com:8443/v1/search?query=react&page=1&limit=25#section2';
      const parsed = parseUrlString(url);

      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('https:');
      expect(parsed.hostname).toBe('api.example.com');
      expect(parsed.port).toBe('8443');
      expect(parsed.pathname).toBe('/v1/search');
      expect(parsed.hash).toBe('#section2');
      expect(parsed.params.length).toBe(3);
      expect(parsed.params[0].key).toBe('query');
      expect(parsed.params[0].value).toBe('react');
    });

    it('gracefully handles URLs missing protocol by prepending https', () => {
      const parsed = parseUrlString('example.com/test?foo=bar');
      expect(parsed.isValid).toBe(true);
      expect(parsed.protocol).toBe('https:');
      expect(parsed.hostname).toBe('example.com');
      expect(parsed.pathname).toBe('/test');
      expect(parsed.params[0].key).toBe('foo');
      expect(parsed.params[0].value).toBe('bar');
    });

    it('returns error for empty or invalid input', () => {
      const empty = parseUrlString('');
      expect(empty.isValid).toBe(false);
      expect(empty.errorMessage).toBe('URL input is empty.');

      const invalid = parseUrlString('http://');
      expect(invalid.isValid).toBe(false);
    });

    it('extracts repeated query parameters correctly', () => {
      const parsed = parseUrlString('https://api.test/items?tag=frontend&tag=backend');
      expect(parsed.params.length).toBe(2);
      expect(parsed.params[0].value).toBe('frontend');
      expect(parsed.params[1].value).toBe('backend');
    });
  });

  describe('buildUrlString', () => {
    const params: QueryParamItem[] = [
      { id: '1', key: 'q', value: 'developer tools', enabled: true },
      { id: '2', key: 'sort', value: 'desc', enabled: false },
      { id: '3', key: 'limit', value: '50', enabled: true },
    ];

    it('builds URL omitting disabled parameters', () => {
      const built = buildUrlString('https://example.com/search', params);
      expect(built).toContain('q=developer+tools');
      expect(built).toContain('limit=50');
      expect(built).not.toContain('sort=desc');
    });

    it('clears query string when all params are disabled', () => {
      const disabledParams = params.map((p) => ({ ...p, enabled: false }));
      const built = buildUrlString('https://example.com/search?old=1', disabledParams);
      expect(built).toBe('https://example.com/search');
    });

    it('handles empty base url gracefully', () => {
      expect(buildUrlString('', params)).toBe('');
    });
  });

  describe('paramsToJson', () => {
    it('serializes single and multi-value params to JSON object', () => {
      const params: QueryParamItem[] = [
        { id: '1', key: 'filter', value: 'active', enabled: true },
        { id: '2', key: 'role', value: 'admin', enabled: true },
        { id: '3', key: 'role', value: 'editor', enabled: true },
        { id: '4', key: 'disabled_key', value: 'val', enabled: false },
      ];
      const json = paramsToJson(params);
      expect(json.filter).toBe('active');
      expect(Array.isArray(json.role)).toBe(true);
      expect(json.role).toEqual(['admin', 'editor']);
      expect(json.disabled_key).toBeUndefined();
    });
  });

  describe('getSampleUrls', () => {
    it('returns sample URLs that parse successfully', () => {
      const samples = getSampleUrls();
      expect(samples.length).toBeGreaterThanOrEqual(3);
      for (const sample of samples) {
        const parsed = parseUrlString(sample.url);
        expect(parsed.isValid).toBe(true);
        expect(parsed.params.length).toBeGreaterThan(0);
      }
    });
  });
});
