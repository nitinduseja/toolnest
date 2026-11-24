import { describe, it, expect } from 'vitest';
import {
  signHmacHex,
  signHmacBase64,
  generateProviderSignature,
  generateCurlCommand,
} from './webhookLogic';

describe('webhookLogic', () => {
  const secret = 'whsec_test_secret_123';
  const payload = JSON.stringify({ event: 'ping', test: true });

  it('computes HMAC-SHA256 hex digest', async () => {
    const hex = await signHmacHex('hello world', 'secret');
    expect(hex).toHaveLength(64);
    expect(typeof hex).toBe('string');
  });

  it('computes HMAC-SHA256 base64 digest', async () => {
    const b64 = await signHmacBase64('hello world', 'secret');
    expect(typeof b64).toBe('string');
    expect(b64.length).toBeGreaterThan(10);
  });

  it('formats GitHub signature with sha256= prefix', async () => {
    const res = await generateProviderSignature({
      provider: 'github',
      payload,
      secret,
    });
    expect(res.headerName).toBe('X-Hub-Signature-256');
    expect(res.headerValue.startsWith('sha256=')).toBe(true);
  });

  it('formats Stripe signature with timestamp and v1 prefix', async () => {
    const timestamp = 1732468800;
    const res = await generateProviderSignature({
      provider: 'stripe',
      payload,
      secret,
      timestamp,
    });
    expect(res.headerName).toBe('Stripe-Signature');
    expect(res.headerValue.startsWith(`t=${timestamp},v1=`)).toBe(true);
  });

  it('formats Shopify signature as pure base64', async () => {
    const res = await generateProviderSignature({
      provider: 'shopify',
      payload,
      secret,
    });
    expect(res.headerName).toBe('X-Shopify-Hmac-Sha256');
    expect(res.headerValue).toBe(res.signature);
  });

  it('formats Slack signature with v0= prefix', async () => {
    const timestamp = 1732468800;
    const res = await generateProviderSignature({
      provider: 'slack',
      payload,
      secret,
      timestamp,
    });
    expect(res.headerName).toBe('X-Slack-Signature');
    expect(res.headerValue.startsWith('v0=')).toBe(true);
  });

  it('generates cURL command', () => {
    const curl = generateCurlCommand(
      'https://api.example.com/webhook',
      {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': 'sha256=abcdef',
      },
      '{"hello": "world"}'
    );
    expect(curl).toContain('curl -X POST "https://api.example.com/webhook"');
    expect(curl).toContain('-H "Content-Type: application/json"');
    expect(curl).toContain('-H "X-Hub-Signature-256: sha256=abcdef"');
  });
});
