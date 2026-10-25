export type UrlMode = 'component' | 'full';

export function encodeUrl(raw: string, mode: UrlMode = 'component'): string {
  if (!raw) return '';
  return mode === 'component' ? encodeURIComponent(raw) : encodeURI(raw);
}

export function decodeUrl(encoded: string, mode: UrlMode = 'component'): string {
  if (!encoded) return '';
  try {
    return mode === 'component' ? decodeURIComponent(encoded) : decodeURI(encoded);
  } catch {
    throw new Error('Malformed percent-encoded URI string.');
  }
}
