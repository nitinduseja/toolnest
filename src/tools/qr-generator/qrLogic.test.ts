import { describe, it, expect } from 'vitest';
import { generateQrDataUrl } from './qrLogic';

describe('QR Code Generator Domain Logic', () => {
  it('generates base64 data URL for URLs and text', async () => {
    const dataUrl = await generateQrDataUrl('https://toolnest.netlify.app');
    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('returns empty string for empty input', async () => {
    const dataUrl = await generateQrDataUrl('');
    expect(dataUrl).toBe('');
  });

  it('rejects overly long inputs (>2000 chars)', async () => {
    const huge = 'a'.repeat(2500);
    await expect(generateQrDataUrl(huge)).rejects.toThrow('Input length exceeds 2000 characters');
  });
});
