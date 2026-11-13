
import { describe, it, expect } from 'vitest';

import {
  escapeXml,
  computeCardMetrics,
} from './codeImageLogic';

import { generateCardSvg } from './svgGenerator';
import { tokenizeCode, tokenizeLine } from './codeTokenizer';

import {
  createDefaultConfig,
  getThemeColors,
  getBackgroundDefs,
  CODE_PRESETS,
} from './themeConfig';

import {
  SyntaxTheme,
  BackgroundPreset,
} from './types';

describe('codeImageLogic', () => {
  it('creates valid default configuration', () => {
    const config = createDefaultConfig();

    expect(config.title).toBe('handler.ts');
    expect(config.theme).toBe('dracula');
    expect(config.language).toBe('typescript');
    expect(config.padding).toBeGreaterThan(0);
    expect(config.showLineNumbers).toBe(true);
  });

  it('escapes XML special characters', () => {
    expect(
      escapeXml('<script src="test.js">&\'</script>')
    ).toBe(
      '&lt;script src=&quot;test.js&quot;&gt;&amp;&#39;&lt;/script&gt;'
    );
  });

  it('highlights TypeScript keywords', () => {
    const tokens = tokenizeLine(
      'const count = 42;',
      'typescript'
    );

    expect(tokens.some((t) => t.type === 'keyword')).toBe(true);
    expect(tokens.some((t) => t.type === 'number')).toBe(true);
    expect(tokens.some((t) => t.type === 'operator')).toBe(true);
  });

  it('highlights Python keywords', () => {
    const tokens = tokenizeLine(
      'def calculate(self):',
      'python'
    );

    expect(tokens[0].type).toBe('keyword');
  });

  it('does not highlight JavaScript words as Python keywords', () => {
    const tokens = tokenizeLine(
      'const value = 10;',
      'python'
    );

    expect(tokens[0].type).toBe('text');
  });

  it('highlights function calls', () => {
    const tokens = tokenizeLine(
      'console.log("hello");',
      'javascript'
    );

    expect(tokens.some((t) => t.type === 'function')).toBe(true);
  });

  it('highlights hexadecimal and scientific numbers', () => {
    const tokens = tokenizeLine(
      'const a = 0xff; const b = 1.5e-5;',
      'javascript'
    );

    const numbers = tokens
      .filter((t) => t.type === 'number')
      .map((t) => t.text);

    expect(numbers).toContain('0xff');
    expect(numbers).toContain('1.5e-5');
  });

  it('supports multiline block comments', () => {
    const lines = tokenizeCode(
      'const a = 1;\n/* comment\nstill comment */\nconst b = 2;',
      'typescript'
    );

    expect(lines[1].some((t) => t.type === 'comment')).toBe(true);
    expect(lines[2].some((t) => t.type === 'comment')).toBe(true);
    expect(lines[3].some((t) => t.type === 'keyword')).toBe(true);
  });

  it('supports template literal interpolation', () => {
    const tokens = tokenizeLine(
      '`Hello ${user.name}`',
      'javascript'
    );

    expect(tokens.some((t) => t.type === 'string')).toBe(true);
    expect(tokens.some((t) => t.text === 'user')).toBe(true);
  });

  it('preserves empty lines', () => {
    const lines = tokenizeCode('const a = 1;\n\nconst b = 2;');

    expect(lines).toHaveLength(3);
  });

  it('provides colors for every supported theme', () => {
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
      expect(colors.headerBg).toBeDefined();
    });
  });

  it('returns valid background definitions', () => {
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

  it('generates a valid SVG card', () => {
    const svg = generateCardSvg(createDefaultConfig());

    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox=');
    expect(svg).toContain('circle cx="20" cy="18"');
    expect(svg).toContain('handler.ts');
  });

  it('escapes malicious code and title content', () => {
    const svg = generateCardSvg({
      ...createDefaultConfig(),
      title: '<script>alert(1)</script>',
      code: '<script>alert("test")</script>',
    });

    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&lt;script&gt;');
  });

  it('respects line number settings', () => {
    const config = createDefaultConfig();

    const withNumbers = generateCardSvg({
      ...config,
      code: 'console.log("hello");',
      showLineNumbers: true,
    });

    expect(withNumbers).toContain('fill=');

    const withoutNumbers = generateCardSvg({
      ...config,
      code: 'console.log("hello");',
      showLineNumbers: false,
    });

    expect(withoutNumbers).not.toContain('font-weight="500"');
  });

  it('calculates wider gutters for large line counts', () => {
    const config = createDefaultConfig();

    const lines = Array.from(
      { length: 120 },
      () => tokenizeLine('const value = 1;')
    );

    const metrics = computeCardMetrics(config, lines);

    expect(metrics.numGutter).toBeGreaterThan(42);
    expect(metrics.cardHeight).toBeGreaterThan(1000);
  });

  it('handles invalid numeric configuration safely', () => {
    const config = {
      ...createDefaultConfig(),
      fontSize: Number.NaN,
      padding: Number.POSITIVE_INFINITY,
      borderRadius: -100,
    };

    const svg = generateCardSvg(config);

    expect(svg).toContain('<svg');
    expect(svg).not.toContain('NaN');
    expect(svg).not.toContain('Infinity');
  });

  it('contains curated presets', () => {
    expect(CODE_PRESETS.length).toBeGreaterThanOrEqual(4);

    CODE_PRESETS.forEach((preset) => {
      expect(preset.name).toBeTruthy();
      expect(preset.config.theme).toBeDefined();
    });
  });
});
