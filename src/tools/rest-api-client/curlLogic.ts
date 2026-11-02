/**
 * cURL command generation and parsing utilities.
 */
import { ApiRequest, HttpMethod, KeyValueItem } from './types';

function buildAuthHeader(req: ApiRequest): string | null {
  const { auth } = req;
  if (auth.type === 'bearer' && auth.bearerToken) {
    return `Authorization: Bearer ${auth.bearerToken.trim()}`;
  }
  if (auth.type === 'basic' && (auth.basicUser || auth.basicPassword)) {
    const creds = btoa(`${auth.basicUser || ''}:${auth.basicPassword || ''}`);
    return `Authorization: Basic ${creds}`;
  }
  if (auth.type === 'apikey' && auth.apiKeyLocation === 'header' && auth.apiKeyName) {
    return `${auth.apiKeyName}: ${auth.apiKeyValue || ''}`;
  }
  return null;
}

export function buildEffectiveUrl(baseUrl: string, params: KeyValueItem[]): string {
  if (!baseUrl.trim()) return '';
  try {
    const parsed = new URL(baseUrl);
    params
      .filter((p) => p.enabled && p.key.trim())
      .forEach((p) => {
        parsed.searchParams.set(p.key.trim(), p.value);
      });
    return parsed.toString();
  } catch {
    return baseUrl;
  }
}

function appendDataClause(req: ApiRequest, parts: string[]): void {
  if (req.method === 'GET' || req.method === 'HEAD' || req.bodyType === 'none') return;

  if (req.bodyType === 'json' && req.bodyContent.trim()) {
    parts.push(`-d '${req.bodyContent.trim().replace(/'/g, "'\\''")}'`);
  } else if (req.bodyType === 'raw' && req.bodyContent) {
    parts.push(`-d '${req.bodyContent.replace(/'/g, "'\\''")}'`);
  } else if (req.bodyType === 'form') {
    req.formParams
      .filter((f) => f.enabled && f.key.trim())
      .forEach((f) => parts.push(`-F '${f.key}=${f.value}'`));
  }
}

export function generateCurlCommand(req: ApiRequest): string {
  const effectiveUrl = buildEffectiveUrl(req.url, req.params);
  const parts: string[] = ['curl'];

  if (req.method !== 'GET') {
    parts.push(`-X ${req.method}`);
  }
  parts.push(`"${effectiveUrl || 'https://api.example.com'}"`);

  req.headers
    .filter((h) => h.enabled && h.key.trim())
    .forEach((h) => parts.push(`-H "${h.key.trim()}: ${h.value}"`));

  const authH = buildAuthHeader(req);
  if (authH) {
    parts.push(`-H "${authH}"`);
  }

  appendDataClause(req, parts);
  return parts.join(' \\\n  ');
}

function extractUrlAndMethod(cleaned: string): { url: string; method: HttpMethod } {
  let method: HttpMethod = 'GET';
  const methodMatch = cleaned.match(/(?:-X|--request)\s+['"]?([A-Z]+)['"]?/i);
  if (methodMatch) {
    method = methodMatch[1].toUpperCase() as HttpMethod;
  }

  const urlRegex = /(?:curl\s+)?(?:['"])(https?:\/\/[^'"]+)['"]|(https?:\/\/[^\s'"]+)/i;
  const match = cleaned.match(urlRegex);
  const url = match ? match[1] || match[2] || '' : '';

  if (method === 'GET' && /(?:-d|--data|--data-raw)\s+/i.test(cleaned)) {
    method = 'POST';
  }
  return { url, method };
}

function extractHeaders(cleaned: string): KeyValueItem[] {
  const headers: KeyValueItem[] = [];
  const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/gi;
  let m: RegExpExecArray | null = headerRegex.exec(cleaned);
  let idx = 0;

  while (m !== null) {
    const raw = m[1];
    const colon = raw.indexOf(':');
    if (colon > -1) {
      const key = raw.slice(0, colon).trim();
      const value = raw.slice(colon + 1).trim();
      headers.push({ id: `h_${idx++}`, key, value, enabled: true });
    }
    m = headerRegex.exec(cleaned);
  }
  return headers;
}

function extractData(cleaned: string): string {
  const dataRegex = /(?:-d|--data|--data-raw|--data-binary)\s+['"](.*?)['"](?:\s+-|\s*$)/is;
  const m = cleaned.match(dataRegex);
  return m ? m[1] : '';
}

export function parseCurlCommand(raw: string): Partial<ApiRequest> {
  const cleaned = raw.replace(/\\\n/g, ' ').replace(/\n/g, ' ').trim();
  const { url, method } = extractUrlAndMethod(cleaned);
  const headers = extractHeaders(cleaned);
  const bodyContent = extractData(cleaned);

  let bodyType: ApiRequest['bodyType'] = 'none';
  if (bodyContent) {
    bodyType = bodyContent.startsWith('{') || bodyContent.startsWith('[') ? 'json' : 'raw';
  }

  return {
    url,
    method,
    headers,
    bodyType,
    bodyContent,
  };
}
