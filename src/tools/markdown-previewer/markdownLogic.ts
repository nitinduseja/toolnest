/**
 * Pure domain logic for client-side Markdown rendering and text metrics.
 * Safe zero-dependency GitHub Flavored Markdown (GFM) parser with XSS prevention.
 */

export interface MarkdownStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  readingTimeMinutes: number;
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function calculateMarkdownStats(markdown: string): MarkdownStats {
  const characters = markdown.length;
  const charactersNoSpaces = markdown.replace(/\s/g, '').length;
  const trimmed = markdown.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const lines = markdown ? markdown.split('\n').length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return { characters, charactersNoSpaces, words, lines, readingTimeMinutes };
}

export function renderInlineMarkdown(text: string): string {
  let res = text;
  // Inline code
  res = res.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Images ![alt](url)
  res = res.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="max-w-full rounded" />'
  );
  // Links [text](url)
  res = res.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  // Bold **text**
  res = res.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic *text*
  res = res.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Strikethrough ~~text~~
  res = res.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  return res;
}

function renderTableBlock(lines: string[]): string {
  if (lines.length < 2) return '';
  const headers = lines[0]
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean);
  const dataRows = lines.slice(2).map((row) =>
    row
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean)
  );

  const thHtml = headers.map((h) => `<th>${renderInlineMarkdown(escapeHtml(h))}</th>`).join('');
  const trHtml = dataRows
    .map(
      (cols) =>
        `<tr>${cols.map((c) => `<td>${renderInlineMarkdown(escapeHtml(c))}</td>`).join('')}</tr>`
    )
    .join('');

  return `<table><thead><tr>${thHtml}</tr></thead><tbody>${trHtml}</tbody></table>`;
}

function renderHeadingOrHr(trimmed: string): string | null {
  if (/^(?:---|\*\*\*|___)\s*$/.test(trimmed)) {
    return '<hr />';
  }
  const hMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
  if (hMatch) {
    const level = hMatch[1].length;
    return `<h${level}>${renderInlineMarkdown(escapeHtml(hMatch[2]))}</h${level}>`;
  }
  return null;
}

function renderListItem(trimmed: string): string {
  const taskMatch = trimmed.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
  if (taskMatch) {
    const checked = taskMatch[1].toLowerCase() === 'x';
    const attr = checked ? 'checked disabled' : 'disabled';
    return `<li class="task-item"><input type="checkbox" ${attr} /> ${renderInlineMarkdown(escapeHtml(taskMatch[2]))}</li>`;
  }
  const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
  if (bulletMatch) {
    return `<li>${renderInlineMarkdown(escapeHtml(bulletMatch[1]))}</li>`;
  }
  const numMatch = trimmed.match(/^\d+\.\s+(.*)$/);
  if (numMatch) {
    return `<li>${renderInlineMarkdown(escapeHtml(numMatch[1]))}</li>`;
  }
  return `<li>${renderInlineMarkdown(escapeHtml(trimmed))}</li>`;
}

function processListGroup(lines: string[]): string {
  const isOrdered = /^\d+\./.test(lines[0].trim());
  const tag = isOrdered ? 'ol' : 'ul';
  const items = lines.map(renderListItem).join('');
  return `<${tag}>${items}</${tag}>`;
}

export function renderMarkdownToHtml(markdown: string): string {
  if (!markdown.trim()) return '';

  const lines = markdown.split('\n');
  const output: string[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let listBuffer: string[] = [];
  let tableBuffer: string[] = [];

  const flushBuffers = () => {
    if (listBuffer.length > 0) {
      output.push(processListGroup(listBuffer));
      listBuffer = [];
    }
    if (tableBuffer.length > 0) {
      output.push(renderTableBlock(tableBuffer));
      tableBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    // Code block handling
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        output.push(`<pre><code>${codeBuffer.map(escapeHtml).join('\n')}</code></pre>`);
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushBuffers();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Table handling
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      tableBuffer.push(trimmed);
      continue;
    }

    // List handling
    if (/^([-*]|\d+\.)\s+/.test(trimmed)) {
      listBuffer.push(trimmed);
      continue;
    }

    flushBuffers();

    if (!trimmed) continue;

    // Heading or HR
    const headerOrHr = renderHeadingOrHr(trimmed);
    if (headerOrHr) {
      output.push(headerOrHr);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const bqText = trimmed.replace(/^>\s?/, '');
      output.push(`<blockquote><p>${renderInlineMarkdown(escapeHtml(bqText))}</p></blockquote>`);
      continue;
    }

    // Regular paragraph
    output.push(`<p>${renderInlineMarkdown(escapeHtml(trimmed))}</p>`);
  }

  flushBuffers();
  return output.join('\n');
}

export function getSampleMarkdown(): string {
  return `# Toolnest Markdown Editor

Welcome to the **Toolnest** Markdown Previewer! A fast, responsive, privacy-first editor with live preview.

## Key Features

- **Client-Side Only**: Your content never leaves your browser.
- **GFM Compliant**: Supports headers, formatting, task lists, code, and tables.
- **Word & Character Counters**: Real-time writing statistics.

### Task Checklist

- [x] Fast client-side rendering
- [x] Zero external dependencies
- [ ] Export rendered HTML
- [ ] Download as \`.md\` file

### Table Example

| Feature | Support | Performance |
| :--- | :--- | :--- |
| Live Preview | Full GFM | Instant |
| Local Privacy | 100% | Zero Network |

### Code Example

\`\`\`typescript
interface DeveloperTool {
  name: string;
  isClientSideOnly: boolean;
}

const toolnest: DeveloperTool = {
  name: 'Toolnest',
  isClientSideOnly: true,
};
\`\`\`

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

Explore more developer tools at [Toolnest](https://github.com/nitinduseja/toolnest)!
`;
}
