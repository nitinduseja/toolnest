/**
 * Client-side HTTP request dispatcher with timing, CORS handling, and response inspection.
 */
import { ApiRequest, ApiResponse } from './types';
import { buildEffectiveUrl } from './curlLogic';

function prepareHeaders(req: ApiRequest): Record<string, string> {
  const headers: Record<string, string> = {};

  req.headers
    .filter((h) => h.enabled && h.key.trim())
    .forEach((h) => {
      headers[h.key.trim()] = h.value;
    });

  if (req.auth.type === 'bearer' && req.auth.bearerToken) {
    headers['Authorization'] = `Bearer ${req.auth.bearerToken.trim()}`;
  } else if (req.auth.type === 'basic' && (req.auth.basicUser || req.auth.basicPassword)) {
    headers['Authorization'] =
      `Basic ${btoa(`${req.auth.basicUser || ''}:${req.auth.basicPassword || ''}`)}`;
  } else if (
    req.auth.type === 'apikey' &&
    req.auth.apiKeyLocation === 'header' &&
    req.auth.apiKeyName
  ) {
    headers[req.auth.apiKeyName] = req.auth.apiKeyValue || '';
  }

  if (req.bodyType === 'json' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

function prepareBody(req: ApiRequest): BodyInit | null {
  if (req.method === 'GET' || req.method === 'HEAD' || req.bodyType === 'none') {
    return null;
  }
  if (req.bodyType === 'json' || req.bodyType === 'raw') {
    return req.bodyContent;
  }
  if (req.bodyType === 'form') {
    const params = new URLSearchParams();
    req.formParams
      .filter((f) => f.enabled && f.key.trim())
      .forEach((f) => params.append(f.key.trim(), f.value));
    return params.toString();
  }
  return null;
}

function parseResponseHeaders(res: Response): Record<string, string> {
  const map: Record<string, string> = {};
  res.headers.forEach((val, key) => {
    map[key] = val;
  });
  return map;
}

export async function executeApiRequest(req: ApiRequest): Promise<ApiResponse> {
  let targetUrl = buildEffectiveUrl(req.url, req.params);
  if (req.auth.type === 'apikey' && req.auth.apiKeyLocation === 'query' && req.auth.apiKeyName) {
    const sep = targetUrl.includes('?') ? '&' : '?';
    targetUrl += `${sep}${encodeURIComponent(req.auth.apiKeyName)}=${encodeURIComponent(req.auth.apiKeyValue || '')}`;
  }

  const headers = prepareHeaders(req);
  const body = prepareBody(req);
  const start = performance.now();

  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });
    const timeMs = Math.round(performance.now() - start);
    const text = await res.text();
    const sizeBytes = new Blob([text]).size;
    let isJson = false;

    try {
      JSON.parse(text);
      isJson = true;
    } catch {
      isJson = false;
    }

    return {
      status: res.status,
      statusText: res.statusText || `${res.status}`,
      timeMs,
      sizeBytes,
      headers: parseResponseHeaders(res),
      body: text,
      isJson,
    };
  } catch (err) {
    const timeMs = Math.round(performance.now() - start);
    const errMsg = err instanceof Error ? err.message : 'Network request failed';
    const isCors =
      errMsg.toLowerCase().includes('failed to fetch') ||
      errMsg.toLowerCase().includes('networkerror');

    return {
      status: 0,
      statusText: isCors ? 'CORS / Network Error' : 'Error',
      timeMs,
      sizeBytes: 0,
      headers: {},
      body: '',
      isJson: false,
      error: errMsg,
      isCorsError: isCors,
    };
  }
}
