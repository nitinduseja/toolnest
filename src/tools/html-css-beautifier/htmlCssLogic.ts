/**
 * Pure domain logic for client-side HTML and CSS formatting, beautification, and minification.
 */

export type CodeLanguage = 'html' | 'css';
export type CodeAction = 'beautify' | 'minify';

/**
 * Minifies standard HTML markup by stripping comments, redundant spaces between tags,
 * and collapsing whitespace.
 */
export function minifyHtml(html: string): string {
  if (!html.trim()) return '';

  return (
    html
      // Remove HTML comments (excluding IE conditional comments if any)
      .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
      // Collapse multi-whitespace
      .replace(/\s+/g, ' ')
      // Remove space between closing and opening tags
      .replace(/>\s+</g, '><')
      // Remove space around self-closing tags
      .replace(/\s+\/>/g, '/>')
      .trim()
  );
}

/**
 * Formats and indents HTML markup with configurable indentation.
 */
export function formatHtml(html: string, indentSize = 2): string {
  if (!html.trim()) return '';

  const indentStr = ' '.repeat(indentSize);
  // Normalize whitespace between tags
  const tokens = html
    .replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/\n/g, ' '))
    .replace(/>\s*</g, '>\n<')
    .split('\n');

  let level = 0;
  const formatted: string[] = [];
  const voidTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
    '!doctype',
  ]);

  for (let line of tokens) {
    line = line.trim();
    if (!line) continue;

    // Is it a closing tag? </tag>
    if (/^<\/[a-zA-Z0-9_-]+>/.test(line)) {
      level = Math.max(0, level - 1);
      formatted.push(`${indentStr.repeat(level)}${line}`);
      continue;
    }

    // Is it a self-closing or void tag? <tag ... /> or <img ...>
    const openingMatch = line.match(/^<([a-zA-Z0-9_!-]+)/);
    const tagName = openingMatch ? openingMatch[1].toLowerCase() : '';
    const isVoid = voidTags.has(tagName) || line.endsWith('/>');

    // Is it an opening tag with immediate closing tag on the same line? <tag>text</tag>
    const isSingleLineTag = /^<([a-zA-Z0-9_-]+)[^>]*>.*<\/\1>$/.test(line);

    formatted.push(`${indentStr.repeat(level)}${line}`);

    if (!isVoid && !isSingleLineTag && /^<[a-zA-Z0-9_-]+/.test(line)) {
      level++;
    }
  }

  return formatted.join('\n');
}

/**
 * Minifies CSS stylesheets by stripping comments, redundant spaces, and newlines.
 */
export function minifyCss(css: string): string {
  if (!css.trim()) return '';

  return (
    css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove space around delimiters
      .replace(/\s*([{}:;,>+~])\s*/g, '$1')
      // Remove trailing semicolons in blocks
      .replace(/;}/g, '}')
      // Collapse duplicate whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Formats and indents CSS rules with configurable indentation.
 */
export function formatCss(css: string, indentSize = 2): string {
  if (!css.trim()) return '';

  const indentStr = ' '.repeat(indentSize);
  // Clean comments and normalize
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, (c) => `\n${c}\n`);

  let formatted = '';
  let level = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];

    if ((char === '"' || char === "'") && cleaned[i - 1] !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (stringChar === char) {
        inString = false;
      }
    }

    if (inString) {
      formatted += char;
      continue;
    }

    if (char === '{') {
      level++;
      formatted = formatted.trimEnd() + ` {\n${indentStr.repeat(level)}`;
    } else if (char === '}') {
      level = Math.max(0, level - 1);
      formatted =
        formatted.trimEnd() + `\n${indentStr.repeat(level)}}\n\n${indentStr.repeat(level)}`;
    } else if (char === ';') {
      formatted += `;\n${indentStr.repeat(level)}`;
    } else {
      formatted += char;
    }
  }

  // Clean redundant blank lines and indentations
  return formatted
    .split('\n')
    .map((l) => (l.trim() ? l : ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
