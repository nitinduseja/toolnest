/**
 * Pure Web Crypto SHA-256 hashing logic.
 */

export async function computeSha256(text: string): Promise<string> {
  if (!text) return '';

  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API is unavailable. Secure context (HTTPS or localhost) required.');
  }

  const encoded = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
