import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  calculateMarkdownStats,
  renderInlineMarkdown,
  renderMarkdownToHtml,
  getSampleMarkdown,
} from './markdownLogic';

describe('markdownLogic', () => {
  describe('escapeHtml', () => {
    it('escapes dangerous HTML characters', () => {
      const unsafe = '<script>alert("xss" & \'hack\')</script>';
      const safe = escapeHtml(unsafe);
      expect(safe).not.toContain('<script>');
      expect(safe).toContain('&lt;script&gt;');
      expect(safe).toContain('&amp;');
      expect(safe).toContain('&quot;');
      expect(safe).toContain('&#039;');
    });
  });

  describe('calculateMarkdownStats', () => {
    it('calculates metrics accurately for sample text', () => {
      const md = 'Hello world\nThis is Toolnest.';
      const stats = calculateMarkdownStats(md);
      expect(stats.words).toBe(5);
      expect(stats.lines).toBe(2);
      expect(stats.characters).toBe(md.length);
      expect(stats.charactersNoSpaces).toBe(25);
      expect(stats.readingTimeMinutes).toBe(1);
    });

    it('handles empty text', () => {
      const stats = calculateMarkdownStats('');
      expect(stats.words).toBe(0);
      expect(stats.lines).toBe(0);
      expect(stats.characters).toBe(0);
    });
  });

  describe('renderInlineMarkdown', () => {
    it('renders bold, italic, strikethrough, and inline code', () => {
      const text = 'This is **bold**, *italic*, ~~striked~~, and `code`.';
      const rendered = renderInlineMarkdown(text);
      expect(rendered).toContain('<strong>bold</strong>');
      expect(rendered).toContain('<em>italic</em>');
      expect(rendered).toContain('<del>striked</del>');
      expect(rendered).toContain('<code>code</code>');
    });

    it('renders links and images', () => {
      const text = '[Toolnest](https://toolnest.dev) and ![Logo](https://toolnest.dev/logo.png)';
      const rendered = renderInlineMarkdown(text);
      expect(rendered).toContain(
        '<a href="https://toolnest.dev" target="_blank" rel="noopener noreferrer">Toolnest</a>'
      );
      expect(rendered).toContain('<img src="https://toolnest.dev/logo.png" alt="Logo"');
    });
  });

  describe('renderMarkdownToHtml', () => {
    it('renders headings from h1 to h3', () => {
      const md = '# Title 1\n## Title 2\n### Title 3';
      const html = renderMarkdownToHtml(md);
      expect(html).toContain('<h1>Title 1</h1>');
      expect(html).toContain('<h2>Title 2</h2>');
      expect(html).toContain('<h3>Title 3</h3>');
    });

    it('renders fenced code blocks', () => {
      const md = '```ts\nconst x: number = 42;\n```';
      const html = renderMarkdownToHtml(md);
      expect(html).toContain('<pre><code>const x: number = 42;</code></pre>');
    });

    it('renders blockquotes', () => {
      const md = '> Notable quote here';
      const html = renderMarkdownToHtml(md);
      expect(html).toContain('<blockquote><p>Notable quote here</p></blockquote>');
    });

    it('renders unordered and task lists', () => {
      const md = '- Item 1\n- [x] Done task\n- [ ] Pending task';
      const html = renderMarkdownToHtml(md);
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>Item 1</li>');
      expect(html).toContain('<input type="checkbox" checked disabled /> Done task');
      expect(html).toContain('<input type="checkbox" disabled /> Pending task');
    });

    it('renders tables', () => {
      const md = '| Name | Role |\n| --- | --- |\n| Alex | Admin |';
      const html = renderMarkdownToHtml(md);
      expect(html).toContain('<table><thead><tr><th>Name</th><th>Role</th></tr></thead>');
      expect(html).toContain('<tbody><tr><td>Alex</td><td>Admin</td></tr></tbody></table>');
    });

    it('prevents XSS injection in raw markdown', () => {
      const md = '# Header\n<img src="x" onerror="alert(1)">';
      const html = renderMarkdownToHtml(md);
      expect(html).not.toContain('<img src="x" onerror');
      expect(html).toContain('&lt;img src=&quot;x&quot;');
    });
  });

  describe('getSampleMarkdown', () => {
    it('returns a comprehensive markdown document', () => {
      const sample = getSampleMarkdown();
      expect(sample).toContain('# Toolnest Markdown Editor');
      const html = renderMarkdownToHtml(sample);
      expect(html).toContain('<h1>Toolnest Markdown Editor</h1>');
      expect(html).toContain('<table>');
      expect(html).toContain('<pre><code>');
    });
  });
});
