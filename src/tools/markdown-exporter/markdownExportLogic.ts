import DOMPurify from 'dompurify';
import { ExportTheme, DocumentMeta, MarkdownPreset } from './types';

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function parseInline(text: string): string {
  let res = text;
  res = res.replace(/`([^`]+)`/g, '<code>$1</code>');
  res = res.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  res = res.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  res = res.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return res;
}

export function parseMarkdownLine(line: string): string {
  const trimmed = line.trim();
  if (!trimmed) return '<br/>';
  if (trimmed === '---') return '<hr/>';

  const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
  if (headingMatch) {
    const level = headingMatch[1].length;
    return `<h${level}>${parseInline(headingMatch[2])}</h${level}>`;
  }
  if (trimmed.startsWith('> ')) {
    return `<blockquote>${parseInline(trimmed.slice(2))}</blockquote>`;
  }
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return `<li>${parseInline(trimmed.slice(2))}</li>`;
  }
  return `<p>${parseInline(line)}</p>`;
}

export function parseMarkdown(md: string): string {
  const lines = md.split('\n');
  const rendered = lines.map(parseMarkdownLine).join('\n');
  return DOMPurify.sanitize(rendered);
}

export function getThemeCss(theme: ExportTheme): string {
  switch (theme) {
    case 'academic':
      return `body { font-family: "Times New Roman", Times, Georgia, serif; line-height: 1.8; color: #111; } h1, h2, h3 { font-family: Georgia, serif; } blockquote { border-left: 3px solid #666; font-style: italic; }`;
    case 'minimal':
      return `body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #222; } h1, h2, h3 { letter-spacing: -0.02em; } code { background: #eee; }`;
    case 'compact':
      return `body { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; line-height: 1.4; color: #1a1a1a; } h1 { font-size: 1.5rem; } h2 { font-size: 1.25rem; }`;
    default:
      return `body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1f2937; } h1, h2, h3 { color: #111827; } a { color: #4f46e5; } code { background: #f3f4f6; color: #4338ca; }`;
  }
}

function buildCoverHtml(meta: DocumentMeta): string {
  if (!meta.includeCoverPage) return '';
  return `
    <div class="cover-page" style="page-break-after: always; display: flex; flex-direction: column; justify-content: center; min-height: 85vh; text-align: center;">
      <h1 style="font-size: 2.8rem; margin-bottom: 1rem;">${escapeHtml(meta.title)}</h1>
      <p style="font-size: 1.2rem; color: #6b7280; margin-bottom: 0.5rem;">${escapeHtml(meta.author)}</p>
      <p style="font-size: 0.95rem; color: #9ca3af;">${escapeHtml(meta.date)}</p>
    </div>
  `;
}

export function generatePrintDocument(markdown: string, meta: DocumentMeta): string {
  const contentHtml = parseMarkdown(markdown);
  const themeCss = getThemeCss(meta.theme);
  const coverHtml = buildCoverHtml(meta);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(meta.title)}</title>
  <style>
    @page {
      size: ${meta.pageSize} ${meta.orientation};
      margin: 20mm;
    }
    ${themeCss}
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page-break { page-break-after: always; }
    }
    body { margin: 0; padding: 20px; max-width: 800px; margin-inline: auto; background: #fff; }
    h1, h2, h3, h4 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 700; }
    p { margin-bottom: 1em; }
    blockquote { margin: 1em 0; padding-left: 1em; }
    code { padding: 2px 6px; border-radius: 4px; font-size: 0.88em; }
    hr { border: 0; border-top: 1px solid #e5e7eb; margin: 2em 0; }
  </style>
</head>
<body>
  ${coverHtml}
  <main class="document-body">
    ${contentHtml}
  </main>
</body>
</html>`;
}

export const EXPORT_PRESETS: MarkdownPreset[] = [
  {
    id: 'rfc-document',
    name: 'Technical RFC / ADR',
    description: 'System architecture decision record with context, options, and consequences.',
    meta: {
      title: 'RFC 2048: Real-Time Event Bus Architecture',
      author: 'Core Platform Engineering',
      date: '2026-11-09',
      includeCoverPage: true,
      pageSize: 'a4',
      orientation: 'portrait',
      theme: 'modern',
    },
    markdown: `# Context & Problem Statement
Our distributed services require real-time synchronization with guaranteed ordering and replayability.

## Decision Drivers
- Sub-millisecond latency for event broadcasts
- Zero external cloud provider lock-in
- Complete client-side validation and idempotency

## Considered Options
1. WebSockets with Redis Pub/Sub
2. Apache Kafka event streams
3. WebTransport peer data channels

## Decision Outcome
Chosen option: **WebSockets with Redis Pub/Sub** due to minimal operational overhead and proven horizontal scalability.

### Consequences
* Positive: High throughput, easy to test in local developer sandboxes.
* Negative: Requires custom cursor pagination for cold consumers.`,
  },
  {
    id: 'service-invoice',
    name: 'Formal Service Statement',
    description: 'Professional billing statement and project deliverables receipt.',
    meta: {
      title: 'Invoice & Service Statement #INV-2026-104',
      author: 'Acme Digital Labs LLC',
      date: '2026-11-09',
      includeCoverPage: false,
      pageSize: 'a4',
      orientation: 'portrait',
      theme: 'minimal',
    },
    markdown: `# Statement of Work & Invoice
**Invoice ID:** #INV-2026-104  
**Date:** November 9, 2026  
**Client:** Hyperion Technologies Inc.

---

### Deliverables Summary
- Implementation of client-side DNS DoH inspector suite
- Multi-layer CSS gradient and mesh canvas designer
- SQL DDL parsing and Zod schema synthesis engine

### Terms & Payment
Payment is due within 30 days of invoice date via standard ACH or wire transfer.`,
  },
];
