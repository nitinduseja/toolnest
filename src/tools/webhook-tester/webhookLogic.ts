import { WebhookProvider, WebhookSignatureResult } from './types';

async function computeHmac(payload: string, secret: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', key, enc.encode(payload));
}

export async function signHmacHex(payload: string, secret: string): Promise<string> {
  const buf = await computeHmac(payload, secret);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function signHmacBase64(payload: string, secret: string): Promise<string> {
  const buf = await computeHmac(payload, secret);
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export interface SignOptions {
  provider: WebhookProvider;
  payload: string;
  secret: string;
  timestamp?: number;
}

export async function generateProviderSignature(
  opts: SignOptions
): Promise<WebhookSignatureResult> {
  const { provider, payload, secret, timestamp = Math.floor(Date.now() / 1000) } = opts;

  if (provider === 'github') {
    const hex = await signHmacHex(payload, secret);
    return {
      signature: hex,
      headerName: 'X-Hub-Signature-256',
      headerValue: `sha256=${hex}`,
    };
  }

  if (provider === 'stripe') {
    const signedPayload = `${timestamp}.${payload}`;
    const hex = await signHmacHex(signedPayload, secret);
    return {
      signature: hex,
      headerName: 'Stripe-Signature',
      headerValue: `t=${timestamp},v1=${hex}`,
      timestamp,
    };
  }

  if (provider === 'shopify') {
    const b64 = await signHmacBase64(payload, secret);
    return {
      signature: b64,
      headerName: 'X-Shopify-Hmac-Sha256',
      headerValue: b64,
    };
  }

  if (provider === 'slack') {
    const signedPayload = `v0:${timestamp}:${payload}`;
    const hex = await signHmacHex(signedPayload, secret);
    return {
      signature: hex,
      headerName: 'X-Slack-Signature',
      headerValue: `v0=${hex}`,
      timestamp,
    };
  }

  const hex = await signHmacHex(payload, secret);
  return {
    signature: hex,
    headerName: 'X-Signature-256',
    headerValue: hex,
  };
}

export function generateCurlCommand(
  url: string,
  headers: Record<string, string>,
  payload: string
): string {
  const headerFlags = Object.entries(headers)
    .map(([k, v]) => `  -H "${k}: ${v}" \\`)
    .join('\n');

  const escapedPayload = payload.replace(/"/g, '\\"');
  return `curl -X POST "${url}" \\\n${headerFlags}\n  -d "${escapedPayload}"`;
}
