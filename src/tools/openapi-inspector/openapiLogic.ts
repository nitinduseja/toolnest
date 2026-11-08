import * as yaml from 'js-yaml';
import {
  HttpMethod,
  OpenApiEndpoint,
  OpenApiParameter,
  OpenApiParsedDoc,
  OpenApiPreset,
} from './types';

export function generateMockFromSchema(schema?: Record<string, unknown>): unknown {
  if (!schema) return { message: 'Success' };
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;

  const type = schema.type as string;
  if (type === 'string') {
    const format = schema.format as string;
    if (format === 'email') return 'alex@example.com';
    if (format === 'uuid') return 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
    if (format === 'date-time') return '2026-11-08T12:00:00.000Z';
    if (format === 'uri') return 'https://example.com/asset.png';
    return 'Sample Text';
  }
  if (type === 'integer') return 101;
  if (type === 'number') return 29.99;
  if (type === 'boolean') return true;
  if (type === 'array') {
    return [generateMockFromSchema(schema.items as Record<string, unknown>)];
  }
  if (type === 'object' || schema.properties) {
    const obj: Record<string, unknown> = {};
    const props = (schema.properties || {}) as Record<string, Record<string, unknown>>;
    for (const [key, propSchema] of Object.entries(props)) {
      obj[key] = generateMockFromSchema(propSchema);
    }
    return obj;
  }
  return {};
}

function parseParameters(paramsRaw: unknown[]): OpenApiParameter[] {
  if (!Array.isArray(paramsRaw)) return [];
  return paramsRaw.map((p) => {
    const param = p as Record<string, unknown>;
    const schema = (param.schema || {}) as Record<string, unknown>;
    return {
      name: String(param.name || ''),
      in: (param.in as OpenApiParameter['in']) || 'query',
      required: Boolean(param.required),
      type: (schema.type as string) || (param.type as string) || 'string',
      description: param.description ? String(param.description) : undefined,
    };
  });
}

export function parseOpenApiSpec(rawText: string): OpenApiParsedDoc {
  if (!rawText.trim()) {
    return { valid: false, title: '', version: '', description: '', endpoints: [], tags: [] };
  }

  let doc: Record<string, unknown>;
  try {
    doc = (yaml.load(rawText) || {}) as Record<string, unknown>;
  } catch (err) {
    return {
      valid: false,
      title: '',
      version: '',
      description: '',
      endpoints: [],
      tags: [],
      error: err instanceof Error ? err.message : 'Invalid OpenAPI YAML or JSON syntax.',
    };
  }

  const info = (doc.info || {}) as Record<string, unknown>;
  const paths = (doc.paths || {}) as Record<string, Record<string, unknown>>;
  const endpoints: OpenApiEndpoint[] = [];
  const tagsSet = new Set<string>();

  const validMethods = new Set(['get', 'post', 'put', 'delete', 'patch', 'options']);

  for (const [pathStr, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== 'object') continue;
    for (const [methodStr, opRaw] of Object.entries(pathItem)) {
      if (!validMethods.has(methodStr.toLowerCase())) continue;
      const op = opRaw as Record<string, unknown>;
      const method = methodStr.toUpperCase() as HttpMethod;
      const tags = Array.isArray(op.tags) ? (op.tags as string[]) : ['Default'];
      tags.forEach((t) => tagsSet.add(t));

      const responses = (op.responses || {}) as Record<string, Record<string, unknown>>;
      const successStatus = Object.keys(responses).find((s) => s.startsWith('2')) || '200';
      const successResp = responses[successStatus] || {};
      const content = (successResp.content || {}) as Record<string, Record<string, unknown>>;
      const jsonContent = content['application/json'] || {};

      endpoints.push({
        id: `${method}-${pathStr}`,
        method,
        path: pathStr,
        summary: String(op.summary || op.operationId || `${method} ${pathStr}`),
        description: op.description ? String(op.description) : undefined,
        tags,
        parameters: parseParameters(op.parameters as unknown[]),
        responseStatus: successStatus,
        responseSchema: (jsonContent.schema || {}) as Record<string, unknown>,
      });
    }
  }

  return {
    valid: true,
    title: String(info.title || 'API Specification'),
    version: String(info.version || '1.0.0'),
    description: String(info.description || 'OpenAPI 3.0 REST service definition.'),
    endpoints,
    tags: Array.from(tagsSet),
  };
}

export function generateCurl(
  endpoint: OpenApiEndpoint,
  baseUrl = 'https://api.example.com'
): string {
  let url = `${baseUrl}${endpoint.path}`;
  const queryParams = endpoint.parameters.filter((p) => p.in === 'query');
  if (queryParams.length > 0) {
    const q = queryParams.map((p) => `${p.name}=value`).join('&');
    url += `?${q}`;
  }

  const lines = [`curl -X ${endpoint.method} "${url}"`];
  lines.push('  -H "Accept: application/json"');
  if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
    lines.push('  -H "Content-Type: application/json"');
    lines.push('  -d \'{"sample": "data"}\'');
  }

  return lines.join(' \\\n');
}

export const OPENAPI_PRESETS: OpenApiPreset[] = [
  {
    id: 'petstore',
    name: 'Petstore API (OpenAPI 3.0)',
    description: 'Classic REST resource endpoints for pets and orders',
    spec: `openapi: 3.0.0
info:
  title: Petstore Storefront API
  version: 1.0.0
  description: Sample OpenAPI specification showcasing pets and inventory management.
paths:
  /pets:
    get:
      summary: List all pets
      tags: [Pets]
      parameters:
        - name: limit
          in: query
          required: false
          schema:
            type: integer
      responses:
        '200':
          description: A paged array of pets
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id: { type: integer }
                    name: { type: string }
                    tag: { type: string }
    post:
      summary: Create a pet
      tags: [Pets]
      responses:
        '201':
          description: Pet created
          content:
            application/json:
              schema:
                type: object
                properties:
                  id: { type: integer }
                  name: { type: string }
  /pets/{petId}:
    get:
      summary: Info for a specific pet
      tags: [Pets]
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Expected response to a valid request
          content:
            application/json:
              schema:
                type: object
                properties:
                  id: { type: integer }
                  name: { type: string }`,
  },
  {
    id: 'auth-api',
    name: 'Auth & Profile API',
    description: 'User login, registration, and profile endpoints',
    spec: `openapi: 3.0.0
info:
  title: User Authentication Service
  version: 2.1.0
  description: JWT authentication and profile endpoints.
paths:
  /auth/login:
    post:
      summary: Login user and return JWT
      tags: [Authentication]
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  token: { type: string }
                  expiresIn: { type: integer }
  /users/me:
    get:
      summary: Get current authenticated profile
      tags: [Users]
      responses:
        '200':
          description: User profile
          content:
            application/json:
              schema:
                type: object
                properties:
                  id: { type: string, format: uuid }
                  email: { type: string, format: email }
                  name: { type: string }`,
  },
];
