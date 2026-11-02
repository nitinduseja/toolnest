/**
 * Cryptographic HMAC signature engine for simulating and verifying Webhooks.
 */

export type WebhookProvider = 'github' | 'stripe' | 'shopify' | 'slack' | 'custom';

export interface WebhookSignatureResult {
  headerName: string;
  headerValue: string;
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function computeHmacSha256(
  secret: string,
  payload: string,
  format: 'hex' | 'base64' = 'hex'
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return format === 'base64' ? bufferToBase64(signature) : bufferToHex(signature);
}

export async function generateWebhookSignature(
  provider: WebhookProvider,
  secret: string,
  payload: string
): Promise<WebhookSignatureResult> {
  if (provider === 'github') {
    const hex = await computeHmacSha256(secret, payload, 'hex');
    return { headerName: 'X-Hub-Signature-256', headerValue: `sha256=${hex}` };
  }

  if (provider === 'stripe') {
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payload}`;
    const hex = await computeHmacSha256(secret, signedPayload, 'hex');
    return { headerName: 'Stripe-Signature', headerValue: `t=${timestamp},v1=${hex}` };
  }

  if (provider === 'shopify') {
    const b64 = await computeHmacSha256(secret, payload, 'base64');
    return { headerName: 'X-Shopify-Hmac-Sha256', headerValue: b64 };
  }

  if (provider === 'slack') {
    const timestamp = Math.floor(Date.now() / 1000);
    const sigBasestring = `v0:${timestamp}:${payload}`;
    const hex = await computeHmacSha256(secret, sigBasestring, 'hex');
    return { headerName: 'X-Slack-Signature', headerValue: `v0=${hex}` };
  }

  const hex = await computeHmacSha256(secret, payload, 'hex');
  return { headerName: 'X-Signature-SHA256', headerValue: hex };
}
