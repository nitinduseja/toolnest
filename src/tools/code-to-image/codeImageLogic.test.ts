import { describe, it, expect } from 'vitest';
import { escapeXml, tokenizeLine, tokenizeCode, generateCardSvg } from './codeImageLogic';
import {
  createDefaultConfig,
  getThemeColors,
  getBackgroundDefs,
  CODE_PRESETS,
} from './themeConfig';
import { SyntaxTheme, BackgroundPreset } from './types';

describe('codeImageLogic', () => {
  it('creates valid default configuration', () => {
    const config = createDefaultConfig();
    expect(config.title).toBe('handler.ts');
    expect(config.theme).toBe('dracula');
    expect(config.language).toBe('typescript');
    expect(config.padding).toBeGreaterThan(0);
    expect(config.showLineNumbers).toBe(true);
  });

  it('escapes XML special characters safely', () => {
    expect(escapeXml('<script src="test.js">&\'</script>')).toBe(
      '&lt;script src=&quot;test.js&quot;&gt;&amp;&#39;&lt;/script&gt;'
    );
  });

  it('tokenizes keywords, strings, numbers, and comments', () => {
    const line = 'const count = 42; // number of items';
    const tokens = tokenizeLine(line);
    const types = tokens.map((t) => t.type);

    expect(types).toContain('keyword');
    expect(types).toContain('number');
    expect(types).toContain('operator');
    expect(types).toContain('comment');
  });

  it('tokenizes multi-line code blocks', () => {
    const code = 'function add(a, b) {\n  return a + b;\n}';
    const lines = tokenizeCode(code);
    expect(lines.length).toBe(3);
    expect(lines[0][0].type).toBe('keyword');
  });

  it('provides distinct colors for all supported syntax themes', () => {
    const themes: SyntaxTheme[] = [
      'dracula',
      'one-dark',
      'nord',
      'monokai',
      'github-dark',
      'github-light',
    ];

    themes.forEach((theme) => {
      const colors = getThemeColors(theme);
      expect(colors.background).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(colors.text).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(colors.keyword).toBeDefined();
      expect(colors.string).toBeDefined();
    });
  });

  it('returns valid SVG gradient defs for background presets', () => {
    const presets: BackgroundPreset[] = [
      'sunset',
      'neon',
      'ocean',
      'aurora',
      'midnight',
      'peach',
      'transparent',
    ];
    presets.forEach((preset) => {
      const bg = getBackgroundDefs(preset);
      if (preset === 'transparent') {
        expect(bg.fill).toBe('transparent');
      } else {
        expect(bg.fill).toContain('url(#bg-gradient)');
        expect(bg.defs).toContain('<linearGradient');
      }
    });
  });

  it('generates a valid SVG card with window chrome and text', () => {
    const config = createDefaultConfig();
    const svg = generateCardSvg(config);

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox=');
    expect(svg).toContain('circle cx="20" cy="18"'); // Mac traffic lights
    expect(svg).toContain('handler.ts');
  });

  it('respects showLineNumbers toggle', () => {
    const withNumbers = generateCardSvg({
      ...createDefaultConfig(),
      code: 'console.log("hello");',
      showLineNumbers: true,
    });
    expect(withNumbers).toContain('tspan fill=');
    expect(withNumbers).toContain(' 1  ');

    const withoutNumbers = generateCardSvg({
      ...createDefaultConfig(),
      code: 'console.log("hello");',
      showLineNumbers: false,
    });
    expect(withoutNumbers).not.toContain(' 1  ');
  });

  it('contains curated presets with valid config properties', () => {
    expect(CODE_PRESETS.length).toBeGreaterThanOrEqual(4);
    CODE_PRESETS.forEach((preset) => {
      expect(preset.name).toBeTruthy();
      expect(preset.config.theme).toBeDefined();
    });
  });
});
