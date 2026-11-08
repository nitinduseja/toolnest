import { describe, it, expect } from 'vitest';
import {
  parseOpenApiSpec,
  generateMockFromSchema,
  generateCurl,
  OPENAPI_PRESETS,
} from './openapiLogic';

describe('openapiLogic', () => {
  it('parses Petstore preset YAML into endpoints and tags', () => {
    const preset = OPENAPI_PRESETS[0];
    const doc = parseOpenApiSpec(preset.spec);

    expect(doc.valid).toBe(true);
    expect(doc.title).toBe('Petstore Storefront API');
    expect(doc.version).toBe('1.0.0');
    expect(doc.endpoints.length).toBe(3);
    expect(doc.tags).toContain('Pets');

    const listPets = doc.endpoints.find((e) => e.path === '/pets' && e.method === 'GET');
    expect(listPets).toBeDefined();
    expect(listPets?.parameters.length).toBe(1);
    expect(listPets?.parameters[0].name).toBe('limit');
  });

  it('generates mock JSON data based on schema types and formats', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        count: { type: 'integer' },
        active: { type: 'boolean' },
      },
    };

    const mock = generateMockFromSchema(schema) as Record<string, unknown>;
    expect(mock.email).toBe('alex@example.com');
    expect(mock.id).toContain('-');
    expect(mock.count).toBe(101);
    expect(mock.active).toBe(true);
  });

  it('generates cURL command for endpoint', () => {
    const endpoint = {
      id: 'get-users',
      method: 'GET' as const,
      path: '/api/v1/users',
      summary: 'Get users',
      tags: ['Users'],
      parameters: [{ name: 'page', in: 'query' as const }],
      responseStatus: '200',
    };

    const curl = generateCurl(endpoint, 'https://test.dev');
    expect(curl).toContain('curl -X GET "https://test.dev/api/v1/users?page=value"');
    expect(curl).toContain('-H "Accept: application/json"');
  });

  it('handles empty or malformed yaml gracefully', () => {
    const emptyDoc = parseOpenApiSpec('');
    expect(emptyDoc.valid).toBe(false);

    const badDoc = parseOpenApiSpec('invalid: : : yaml');
    expect(badDoc.valid).toBe(false);
    expect(badDoc.error).toBeDefined();
  });
});
