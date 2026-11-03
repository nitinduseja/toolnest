import { describe, it, expect } from 'vitest';
import { buildIcoBinary, IcoImageEntry } from './icoBuilderLogic';
import { generateHtmlSnippet, generateManifestJson } from './faviconLogic';

describe('icoBuilderLogic', () => {
  it('constructs a valid ICO binary header and entries', () => {
    const mockImage1: IcoImageEntry = {
      width: 16,
      height: 16,
      bytes: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), // Mock PNG header
    };
    const mockImage2: IcoImageEntry = {
      width: 32,
      height: 32,
      bytes: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3, 4]),
    };

    const icoBytes = buildIcoBinary([mockImage1, mockImage2]);
    const view = new DataView(icoBytes.buffer);

    // Reserved (0)
    expect(view.getUint16(0, true)).toBe(0);
    // Type 1 = Icon
    expect(view.getUint16(2, true)).toBe(1);
    // Image count = 2
    expect(view.getUint16(4, true)).toBe(2);

    // Entry 1 Width & Height
    expect(view.getUint8(6)).toBe(16);
    expect(view.getUint8(7)).toBe(16);
    expect(view.getUint32(14, true)).toBe(8); // Data size

    // Entry 2 Width & Height
    expect(view.getUint8(22)).toBe(32);
    expect(view.getUint8(23)).toBe(32);
    expect(view.getUint32(30, true)).toBe(12); // Data size
  });
});

describe('faviconLogic', () => {
  it('generates HTML link tags', () => {
    const html = generateHtmlSnippet();
    expect(html).toContain('rel="icon" type="image/x-icon" href="/favicon.ico"');
    expect(html).toContain('rel="apple-touch-icon" sizes="180x180"');
    expect(html).toContain('rel="manifest" href="/site.webmanifest"');
  });

  it('generates valid webmanifest JSON', () => {
    const json = generateManifestJson({
      name: 'Test App',
      shortName: 'Test',
      themeColor: '#6366f1',
      backgroundColor: '#ffffff',
    });
    const parsed = JSON.parse(json);
    expect(parsed.name).toBe('Test App');
    expect(parsed.short_name).toBe('Test');
    expect(parsed.icons).toHaveLength(2);
    expect(parsed.display).toBe('standalone');
  });
});
