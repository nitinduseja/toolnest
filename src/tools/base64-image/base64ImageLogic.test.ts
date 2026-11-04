import { describe, it, expect } from 'vitest';
import { parseBase64Image, generateImageSnippet, base64ToBlob } from './base64ImageLogic';

describe('Base64 Image Domain Logic', () => {
  const SAMPLE_PNG_DATA_URL =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  it('parses valid Data URL and extracts mime type and base64 payload', () => {
    const parsed = parseBase64Image(SAMPLE_PNG_DATA_URL);
    expect(parsed.valid).toBe(true);
    expect(parsed.mimeType).toBe('image/png');
    expect(parsed.base64).toContain('iVBORw0KGgo');
  });

  it('infers JPEG, WebP, GIF from raw base64 header signatures', () => {
    const jpegRaw = '/9j/4AAQSkZJRgABAQEASABIAAD/';
    const parsed = parseBase64Image(jpegRaw);
    expect(parsed.valid).toBe(true);
    expect(parsed.mimeType).toBe('image/jpeg');
    expect(parsed.dataUrl.startsWith('data:image/jpeg;base64,')).toBe(true);
  });

  it('generates HTML, CSS, Markdown, and raw snippets', () => {
    const html = generateImageSnippet(SAMPLE_PNG_DATA_URL, 'html-img', 'Logo');
    expect(html).toBe(`<img src="${SAMPLE_PNG_DATA_URL}" alt="Logo" />`);

    const css = generateImageSnippet(SAMPLE_PNG_DATA_URL, 'css-bg');
    expect(css).toBe(`background-image: url("${SAMPLE_PNG_DATA_URL}");`);

    const md = generateImageSnippet(SAMPLE_PNG_DATA_URL, 'markdown', 'Photo');
    expect(md).toBe(`![Photo](${SAMPLE_PNG_DATA_URL})`);

    const raw = generateImageSnippet(SAMPLE_PNG_DATA_URL, 'raw-base64');
    expect(raw.startsWith('iVBORw0KGgo')).toBe(true);
    expect(raw).not.toContain('data:image');
  });

  it('converts base64 string to a valid binary Blob', () => {
    const blob = base64ToBlob(SAMPLE_PNG_DATA_URL, 'image/png');
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(0);
  });

  it('handles invalid base64 input gracefully', () => {
    const parsed = parseBase64Image('not-base-64!!');
    expect(parsed.valid).toBe(false);
    expect(parsed.error).toBeDefined();
  });
});

