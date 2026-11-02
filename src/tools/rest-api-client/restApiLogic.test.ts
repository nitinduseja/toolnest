import { describe, it, expect } from 'vitest';
import { generateCurlCommand, parseCurlCommand, buildEffectiveUrl } from './curlLogic';
import { substituteVariables, resolveRequestEnvironment } from './environmentLogic';
import { generateWebhookSignature, computeHmacSha256 } from './webhookLogic';
import { evaluateAssertions } from './assertionLogic';
import { parsePostmanCollection, parseOpenApiSpec } from './collectionImportLogic';
import { generateCodeSnippet } from './codeGenLogic';
import { ApiRequest, Environment, ApiResponse } from './types';

describe('restApiLogic', () => {
  describe('buildEffectiveUrl', () => {
    it('appends enabled query parameters to URL', () => {
      const url = 'https://api.example.com/v1/users';
      const params = [
        { id: '1', key: 'page', value: '2', enabled: true },
        { id: '2', key: 'limit', value: '20', enabled: true },
        { id: '3', key: 'search', value: 'admin', enabled: false },
      ];
      const effective = buildEffectiveUrl(url, params);
      expect(effective).toBe('https://api.example.com/v1/users?page=2&limit=20');
    });

    it('returns empty string if base URL is empty', () => {
      expect(buildEffectiveUrl('', [])).toBe('');
    });
  });

  describe('generateCurlCommand', () => {
    it('generates basic GET curl command', () => {
      const req: ApiRequest = {
        id: '1',
        method: 'GET',
        url: 'https://api.example.com/posts',
        params: [],
        headers: [{ id: 'h1', key: 'Accept', value: 'application/json', enabled: true }],
        auth: { type: 'none' },
        bodyType: 'none',
        bodyContent: '',
        formParams: [],
      };
      const curl = generateCurlCommand(req);
      expect(curl).toContain('curl');
      expect(curl).toContain('"https://api.example.com/posts"');
      expect(curl).toContain('-H "Accept: application/json"');
    });

    it('generates POST curl command with Bearer token and JSON body', () => {
      const req: ApiRequest = {
        id: '2',
        method: 'POST',
        url: 'https://api.example.com/login',
        params: [],
        headers: [{ id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true }],
        auth: { type: 'bearer', bearerToken: 'secret_token_123' },
        bodyType: 'json',
        bodyContent: '{"user":"test"}',
        formParams: [],
      };
      const curl = generateCurlCommand(req);
      expect(curl).toContain('-X POST');
      expect(curl).toContain('-H "Authorization: Bearer secret_token_123"');
      expect(curl).toContain('-d \'{"user":"test"}\'');
    });

    it('parses cURL command into an ApiRequest object', () => {
      const curl =
        'curl -X POST "https://api.example.com/users" -H "Content-Type: application/json" -d \'{"name":"Alice"}\'';
      const parsed = parseCurlCommand(curl);
      expect(parsed.method).toBe('POST');
      expect(parsed.url).toBe('https://api.example.com/users');
      expect(parsed.headers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: 'Content-Type', value: 'application/json' }),
        ])
      );
      expect(parsed.bodyContent).toBe('{"name":"Alice"}');
    });
  });

  describe('environmentLogic', () => {
    it('substitutes environment variables in text', () => {
      const env: Environment = {
        id: 'env_1',
        name: 'Staging',
        variables: [
          { id: 'v1', key: 'baseUrl', value: 'https://staging.api.com', enabled: true },
          { id: 'v2', key: 'token', value: 'xyz123', enabled: true },
        ],
      };
      const result = substituteVariables('{{baseUrl}}/users?auth={{token}}', env);
      expect(result).toBe('https://staging.api.com/users?auth=xyz123');
    });

    it('generates dynamic variables like $uuid and $timestamp', () => {
      const res = substituteVariables('test-{{$uuid}}-{{$timestamp}}', null);
      expect(res).not.toContain('{{$uuid}}');
      expect(res).not.toContain('{{$timestamp}}');
      expect(res.startsWith('test-')).toBe(true);
    });

    it('resolves environment across full ApiRequest object', () => {
      const env: Environment = {
        id: 'env_1',
        name: 'Dev',
        variables: [{ id: 'v1', key: 'host', value: 'localhost:8000', enabled: true }],
      };
      const req: ApiRequest = {
        id: '1',
        method: 'GET',
        url: 'http://{{host}}/api',
        params: [],
        headers: [],
        auth: { type: 'none' },
        bodyType: 'none',
        bodyContent: '',
        formParams: [],
      };
      const resolved = resolveRequestEnvironment(req, env);
      expect(resolved.url).toBe('http://localhost:8000/api');
    });
  });

  describe('webhookLogic', () => {
    it('computes HMAC-SHA256 signature', async () => {
      const hex = await computeHmacSha256('secret_key', 'hello_world', 'hex');
      expect(hex).toHaveLength(64);
      expect(typeof hex).toBe('string');
    });

    it('generates GitHub format signature with X-Hub-Signature-256 header', async () => {
      const res = await generateWebhookSignature('github', 'my_secret', '{"action":"opened"}');
      expect(res.headerName).toBe('X-Hub-Signature-256');
      expect(res.headerValue.startsWith('sha256=')).toBe(true);
    });
  });

  describe('assertionLogic', () => {
    it('evaluates status and response time assertions', () => {
      const res: ApiResponse = {
        status: 200,
        statusText: 'OK',
        timeMs: 140,
        sizeBytes: 50,
        headers: {},
        body: '{"id": 42}',
        isJson: true,
      };
      const results = evaluateAssertions(
        [
          { id: '1', type: 'status-200', enabled: true },
          { id: '2', type: 'time-under', targetValue: '200', enabled: true },
          { id: '3', type: 'body-contains', targetValue: '42', enabled: true },
        ],
        res
      );
      expect(results).toHaveLength(3);
      expect(results.every((r) => r.passed)).toBe(true);
    });
  });

  describe('collectionImportLogic', () => {
    it('parses Postman Collection v2 JSON into requests', () => {
      const postmanJson = JSON.stringify({
        info: {
          name: 'Sample Collection',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        },
        item: [
          {
            name: 'Get Users',
            request: {
              method: 'GET',
              url: 'https://api.example.com/users',
              header: [{ key: 'Accept', value: 'application/json' }],
            },
          },
        ],
      });

      const parsed = parsePostmanCollection(postmanJson);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('Get Users');
      expect(parsed[0].method).toBe('GET');
      expect(parsed[0].url).toBe('https://api.example.com/users');
    });

    it('parses OpenAPI 3.0 specification into requests', () => {
      const openApiJson = JSON.stringify({
        openapi: '3.0.0',
        servers: [{ url: 'https://petstore.swagger.io/v2' }],
        paths: {
          '/pets': {
            get: { summary: 'List pets' },
            post: { summary: 'Create pet' },
          },
        },
      });

      const parsed = parseOpenApiSpec(openApiJson);
      expect(parsed).toHaveLength(2);
      expect(parsed.some((r) => r.method === 'GET')).toBe(true);
      expect(parsed.some((r) => r.method === 'POST')).toBe(true);
    });
  });

  describe('codeGenLogic', () => {
    it('generates JavaScript Fetch code snippet', () => {
      const req: ApiRequest = {
        id: '1',
        method: 'POST',
        url: 'https://api.example.com/v1/auth',
        params: [],
        headers: [{ id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true }],
        auth: { type: 'none' },
        bodyType: 'json',
        bodyContent: '{"user":"test"}',
        formParams: [],
      };
      const code = generateCodeSnippet(req, 'javascript-fetch');
      expect(code).toContain('fetch("https://api.example.com/v1/auth"');
      expect(code).toContain('method: "POST"');
    });

    it('generates Python Requests code snippet', () => {
      const req: ApiRequest = {
        id: '2',
        method: 'GET',
        url: 'https://api.example.com/posts',
        params: [],
        headers: [],
        auth: { type: 'none' },
        bodyType: 'none',
        bodyContent: '',
        formParams: [],
      };
      const code = generateCodeSnippet(req, 'python-requests');
      expect(code).toContain('import requests');
      expect(code).toContain('requests.get("https://api.example.com/posts")');
    });
  });
});
