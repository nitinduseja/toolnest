import { describe, it, expect } from 'vitest';
import { formatHtml, minifyHtml, formatCss, minifyCss } from './htmlCssLogic';

describe('HTML & CSS Beautifier / Minifier Domain Logic', () => {
  describe('HTML Processing', () => {
    const RAW_HTML =
      '<div class="container"><!-- Comment --><h1>Title</h1><p>Hello <span>world</span>!</p></div>';

    it('formats HTML with hierarchical indentation', () => {
      const formatted = formatHtml(RAW_HTML);
      expect(formatted).toContain('<div class="container">');
      expect(formatted).toContain('  <h1>Title</h1>');
      expect(formatted).toContain('</div>');
    });

    it('minifies HTML by removing comments and unnecessary whitespace', () => {
      const minified = minifyHtml(RAW_HTML);
      expect(minified).not.toContain('<!-- Comment -->');
      expect(minified).toBe(
        '<div class="container"><h1>Title</h1><p>Hello <span>world</span>!</p></div>'
      );
    });

    it('handles self-closing and void tags properly', () => {
      const htmlWithVoid = '<div><img src="pic.jpg" /><input type="text"><br></div>';
      const formatted = formatHtml(htmlWithVoid);
      expect(formatted).toContain('  <img src="pic.jpg" />');
      expect(formatted).toContain('  <input type="text">');
    });
  });

  describe('CSS Processing', () => {
    const RAW_CSS = `/* Card styles */ .card { background-color: #fff; border-radius: 8px; padding: 16px; }`;

    it('formats CSS rules cleanly with curly braces and indentation', () => {
      const formatted = formatCss(RAW_CSS);
      expect(formatted).toContain('.card {');
      expect(formatted).toContain('  background-color: #fff;');
      expect(formatted).toContain('  border-radius: 8px;');
      expect(formatted).toContain('}');
    });

    it('minifies CSS by stripping whitespace and comments', () => {
      const minified = minifyCss(RAW_CSS);
      expect(minified).not.toContain('/* Card styles */');
      expect(minified).toBe('.card{background-color:#fff;border-radius:8px;padding:16px}');
    });
  });
});
