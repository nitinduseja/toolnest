/**
 * Pure UTF-8 safe Base64 encoding and decoding algorithms.
 */

export function encodeBase64(text: string): string {
  if (!text) return '';
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decodeBase64(base64: string): string {
  if (!base64.trim()) return '';
  const clean = base64.replace(/\s+/g, '');

  try {
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('Malformed Base64 string or invalid byte sequence.');
  }
}
