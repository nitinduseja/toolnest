import { describe, it, expect } from 'vitest';
import {
  generateQrDataUrl,
  generateQrSvg,
  buildWifiPayload,
  buildVCardPayload,
  buildEmailPayload,
} from './qrLogic';

describe('QR Code Generator Domain Logic', () => {
  it('generates base64 PNG data URL for URLs and text', async () => {
    const dataUrl = await generateQrDataUrl('https://toolnest.netlify.app');
    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('generates clean SVG vector string', async () => {
    const svg = await generateQrSvg('https://toolnest.netlify.app');
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('</svg>');
    expect(svg).toContain('viewBox');
  });

  it('returns empty string for empty input', async () => {
    const dataUrl = await generateQrDataUrl('');
    expect(dataUrl).toBe('');
    const svg = await generateQrSvg('');
    expect(svg).toBe('');
  });

  it('supports custom error correction level', async () => {
    const dataUrlH = await generateQrDataUrl('High ECC', { errorCorrectionLevel: 'H' });
    expect(dataUrlH.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('builds Wi-Fi network payload correctly', () => {
    const payload = buildWifiPayload({
      ssid: 'Home_WiFi',
      password: 'SecretPassword123',
      encryption: 'WPA',
    });
    expect(payload).toBe('WIFI:S:Home_WiFi;T:WPA;P:SecretPassword123;H:false;;');
  });

  it('builds vCard 3.0 payload correctly', () => {
    const payload = buildVCardPayload({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    });
    expect(payload).toContain('BEGIN:VCARD');
    expect(payload).toContain('FN:John Doe');
    expect(payload).toContain('EMAIL:john@example.com');
    expect(payload).toContain('TEL;TYPE=CELL:+1234567890');
    expect(payload).toContain('END:VCARD');
  });

  it('builds email payload with subject and body', () => {
    const payload = buildEmailPayload('contact@toolnest.dev', 'Feedback', 'Hello there');
    expect(payload).toContain('mailto:contact@toolnest.dev?');
    expect(payload).toContain('subject=Feedback');
  });

  it('rejects overly long inputs (>2500 chars)', async () => {
    const huge = 'a'.repeat(3000);
    await expect(generateQrDataUrl(huge)).rejects.toThrow('Input length exceeds 2500 characters');
  });
});
