/**
 * Pure domain logic for parsing, manipulating, and reconstructing URLs and query parameters.
 * Operates purely client-side using standard WHATWG URL and URLSearchParams APIs.
 */

export interface QueryParamItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ParsedUrl {
  href: string;
  protocol: string;
  origin: string;
  hostname: string;
  port: string;
  pathname: string;
  hash: string;
  params: QueryParamItem[];
  isValid: boolean;
  errorMessage?: string;
}

export interface SampleUrl {
  label: string;
  url: string;
}

function extractParams(searchParams: URLSearchParams): QueryParamItem[] {
  const items: QueryParamItem[] = [];
  let counter = 0;
  searchParams.forEach((value, key) => {
    counter += 1;
    items.push({
      id: `param_${counter}_${Date.now()}`,
      key,
      value,
      enabled: true,
    });
  });
  return items;
}

function sanitizeUrlInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function parseUrlString(input: string): ParsedUrl {
  const sanitized = sanitizeUrlInput(input);
  if (!sanitized) {
    return {
      href: '',
      protocol: '',
      origin: '',
      hostname: '',
      port: '',
      pathname: '',
      hash: '',
      params: [],
      isValid: false,
      errorMessage: 'URL input is empty.',
    };
  }

  try {
    const urlObj = new URL(sanitized);
    return {
      href: urlObj.href,
      protocol: urlObj.protocol,
      origin: urlObj.origin === 'null' ? '' : urlObj.origin,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      hash: urlObj.hash,
      params: extractParams(urlObj.searchParams),
      isValid: true,
    };
  } catch (err) {
    return {
      href: sanitized,
      protocol: '',
      origin: '',
      hostname: '',
      port: '',
      pathname: '',
      hash: '',
      params: [],
      isValid: false,
      errorMessage: err instanceof Error ? err.message : 'Invalid URL format.',
    };
  }
}

export function buildUrlString(baseUrlInput: string, params: QueryParamItem[]): string {
  const sanitized = sanitizeUrlInput(baseUrlInput);
  if (!sanitized) return '';

  try {
    const urlObj = new URL(sanitized);
    urlObj.search = '';
    const searchParams = new URLSearchParams();

    for (const p of params) {
      if (p.enabled && p.key.trim()) {
        searchParams.append(p.key.trim(), p.value);
      }
    }

    const qs = searchParams.toString();
    urlObj.search = qs ? `?${qs}` : '';
    return urlObj.toString();
  } catch {
    return baseUrlInput;
  }
}

export function paramsToJson(params: QueryParamItem[]): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};
  for (const p of params) {
    if (!p.enabled || !p.key.trim()) continue;
    const existing = result[p.key];
    if (existing === undefined) {
      result[p.key] = p.value;
    } else if (Array.isArray(existing)) {
      existing.push(p.value);
    } else {
      result[p.key] = [existing, p.value];
    }
  }
  return result;
}

export function getSampleUrls(): SampleUrl[] {
  return [
    {
      label: 'REST API Query',
      url: 'https://api.github.com/repos/facebook/react/issues?state=open&sort=created&direction=desc&per_page=30',
    },
    {
      label: 'OAuth 2.0 Auth Flow',
      url: 'https://auth.example.com/oauth/authorize?client_id=client_98765&redirect_uri=https%3A%2F%2Fmyapp.com%2Fcallback&response_type=code&scope=openid+profile+email&state=xyz123',
    },
    {
      label: 'E-commerce Search',
      url: 'https://shop.example.com:8443/products/search?q=wireless+headphones&category=audio&sort=price_asc&in_stock=true&page=2#catalog',
    },
  ];
}
