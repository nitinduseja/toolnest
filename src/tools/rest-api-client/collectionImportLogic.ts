/**
 * Collection importer for Postman Collections v2.1 and OpenAPI 3.0 specifications.
 */
import { ApiRequest, HttpMethod } from './types';
import { parseCurlCommand } from './curlLogic';

interface PostmanItem {
  name?: string;
  request?: {
    method?: string;
    url?: string | { raw?: string };
    header?: Array<{ key: string; value: string }>;
    body?: { raw?: string; mode?: string };
  };
  item?: PostmanItem[];
}

function parsePostmanItem(item: PostmanItem, collectionName?: string): ApiRequest | null {
  if (!item.request) return null;
  const req = item.request;
  const method = (req.method || 'GET').toUpperCase() as HttpMethod;
  const url = typeof req.url === 'string' ? req.url : req.url?.raw || '';
  if (!url) return null;

  const headers = (req.header || []).map((h, i) => ({
    id: `h_postman_${i}`,
    key: h.key,
    value: h.value,
    enabled: true,
  }));

  const bodyContent = req.body?.raw || '';
  const bodyType = bodyContent ? (bodyContent.startsWith('{') ? 'json' : 'raw') : 'none';

  return {
    id: `req_imported_${Date.now()}_${Math.random()}`,
    name: item.name || url,
    collectionName: collectionName || 'Postman Collection',
    method,
    url,
    params: [],
    headers,
    auth: { type: 'none' },
    bodyType,
    bodyContent,
    formParams: [],
  };
}

export function parsePostmanCollection(jsonStr: string): ApiRequest[] {
  const parsed = JSON.parse(jsonStr) as {
    info?: { name?: string };
    item?: PostmanItem[];
  };
  const rootCollectionName = parsed.info?.name || 'Postman Collection';
  const results: ApiRequest[] = [];

  function traverse(items: PostmanItem[] = [], currentFolder?: string) {
    for (const it of items) {
      if (it.request) {
        const req = parsePostmanItem(it, currentFolder || rootCollectionName);
        if (req) results.push(req);
      }
      if (it.item) {
        traverse(it.item, it.name || currentFolder || rootCollectionName);
      }
    }
  }

  traverse(parsed.item || []);
  return results;
}

export function parseOpenApiSpec(jsonStr: string): ApiRequest[] {
  const spec = JSON.parse(jsonStr) as {
    info?: { title?: string };
    servers?: Array<{ url: string }>;
    paths?: Record<string, Record<string, unknown>>;
  };
  const collectionName = spec.info?.title || 'OpenAPI Specification';
  const baseUrl = spec.servers?.[0]?.url || 'https://api.example.com';
  const results: ApiRequest[] = [];

  for (const [path, methods] of Object.entries(spec.paths || {})) {
    for (const [m] of Object.entries(methods)) {
      const upper = m.toUpperCase() as HttpMethod;
      if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(upper)) {
        results.push({
          id: `req_oas_${Date.now()}_${Math.random()}`,
          name: `${upper} ${path}`,
          collectionName,
          method: upper,
          url: `${baseUrl}${path}`,
          params: [],
          headers: [],
          auth: { type: 'none' },
          bodyType: 'none',
          bodyContent: '',
          formParams: [],
        });
      }
    }
  }
  return results;
}

export function autoImportContent(raw: string): {
  single?: Partial<ApiRequest>;
  collection?: ApiRequest[];
} {
  const trimmed = raw.trim();
  if (trimmed.startsWith('curl')) {
    return { single: parseCurlCommand(trimmed) };
  }

  if (trimmed.startsWith('{')) {
    try {
      const json = JSON.parse(trimmed);
      if (json.info?.schema?.includes('postman') || json.item) {
        return { collection: parsePostmanCollection(trimmed) };
      }
      if (json.openapi || json.swagger) {
        return { collection: parseOpenApiSpec(trimmed) };
      }
    } catch {
      // Fall through to single curl parse
    }
  }

  return { single: parseCurlCommand(trimmed) };
}
