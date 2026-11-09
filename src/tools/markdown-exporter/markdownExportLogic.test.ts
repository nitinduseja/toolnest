import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  parseInline,
  parseMarkdown,
  getThemeCss,
  generatePrintDocument,
  EXPORT_PRESETS,
} from './markdownExportLogic';
import { DocumentMeta } from './types';

describe('markdownExportLogic', () => {
  it('escapes unsafe HTML characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('parses inline markdown tokens', () => {
    expect(parseInline('**bold**')).toBe('<strong>bold</strong>');
    expect(parseInline('*italic*')).toBe('<em>italic</em>');
    expect(parseInline('`code`')).toBe('<code>code</code>');
    expect(parseInline('[link](https://example.com)')).toBe(
      '<a href="https://example.com">link</a>'
    );
  });

  it('parses markdown headings and blockquotes', () => {
    const md = '# Title\n## Subtitle\n> A quote';
    const html = parseMarkdown(md);
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<h2>Subtitle</h2>');
    expect(html).toContain('<blockquote>A quote</blockquote>');
  });

  it('returns valid theme CSS styles', () => {
    expect(getThemeCss('modern')).toContain('ui-sans-serif');
    expect(getThemeCss('academic')).toContain('Times New Roman');
    expect(getThemeCss('minimal')).toContain('-apple-system');
    expect(getThemeCss('compact')).toContain('ui-monospace');
  });

  it('generates complete printable HTML document with cover page', () => {
    const meta: DocumentMeta = {
      title: 'Quarterly Report',
      author: 'Jane Doe',
      date: '2026-11-09',
      includeCoverPage: true,
      includeHeaderFooter: true,
      pageSize: 'a4',
      orientation: 'portrait',
      theme: 'modern',
    };
    const html = generatePrintDocument('# Hello World', meta);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Quarterly Report');
    expect(html).toContain('Jane Doe');
    expect(html).toContain('cover-page');
    expect(html).toContain('<h1>Hello World</h1>');
  });

  it('omits cover page when includeCoverPage is false', () => {
    const meta: DocumentMeta = {
      title: 'Simple Note',
      author: 'John',
      date: '2026-11-09',
      includeCoverPage: false,
      includeHeaderFooter: false,
      pageSize: 'letter',
      orientation: 'portrait',
      theme: 'minimal',
    };
    const html = generatePrintDocument('Direct note content', meta);
    expect(html).not.toContain('class="cover-page"');
    expect(html).toContain('Direct note content');
  });

  it('renders all presets into valid documents', () => {
    for (const preset of EXPORT_PRESETS) {
      const fullMeta: DocumentMeta = {
        title: preset.meta.title || 'Untitled',
        author: preset.meta.author || 'Anonymous',
        date: preset.meta.date || '2026-11-09',
        includeCoverPage: preset.meta.includeCoverPage ?? false,
        includeHeaderFooter: true,
        pageSize: preset.meta.pageSize || 'a4',
        orientation: preset.meta.orientation || 'portrait',
        theme: preset.meta.theme || 'modern',
      };
      const doc = generatePrintDocument(preset.markdown, fullMeta);
      expect(doc).toContain(escapeHtml(fullMeta.title));
      expect(doc).toContain('<!DOCTYPE html>');
    }
  });
});
