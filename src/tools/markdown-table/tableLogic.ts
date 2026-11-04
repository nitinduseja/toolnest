/**
 * Pure domain logic for generating, formatting, and converting GitHub Flavored Markdown (GFM) tables.
 */

export type ColumnAlignment = 'left' | 'center' | 'right';

export interface MarkdownTableData {
  headers: string[];
  rows: string[][];
  alignments?: ColumnAlignment[];
}

/**
 * Generates an aligned GitHub Flavored Markdown (GFM) table string.
 */
export function generateMarkdownTable(data: MarkdownTableData): string {
  const { headers, rows, alignments = [] } = data;
  if (!headers || headers.length === 0) return '';

  const colCount = headers.length;

  // Calculate maximum column width for clean monospace column alignment
  const colWidths = headers.map((h, colIdx) => {
    let max = Math.max(3, (h || '').trim().length);
    for (const row of rows) {
      const cell = (row[colIdx] || '').trim();
      if (cell.length > max) max = cell.length;
    }
    return max;
  });

  function padCell(text: string, width: number, align: ColumnAlignment): string {
    const trimmed = text.trim();
    if (trimmed.length >= width) return trimmed;
    const diff = width - trimmed.length;

    switch (align) {
      case 'center': {
        const left = Math.floor(diff / 2);
        const right = diff - left;
        return ' '.repeat(left) + trimmed + ' '.repeat(right);
      }
      case 'right':
        return ' '.repeat(diff) + trimmed;
      case 'left':
      default:
        return trimmed + ' '.repeat(diff);
    }
  }

  // Header row
  const headerRow =
    '| ' +
    headers.map((h, i) => padCell(h, colWidths[i], alignments[i] || 'left')).join(' | ') +
    ' |';

  // Delimiter row
  const delimiterRow =
    '| ' +
    headers
      .map((_, i) => {
        const align = alignments[i] || 'left';
        const width = colWidths[i];
        if (align === 'center') {
          return ':' + '-'.repeat(Math.max(1, width - 2)) + ':';
        } else if (align === 'right') {
          return '-'.repeat(Math.max(2, width - 1)) + ':';
        } else {
          return ':' + '-'.repeat(Math.max(2, width - 1));
        }
      })
      .join(' | ') +
    ' |';

  // Body rows
  const bodyRows = rows.map((row) => {
    return (
      '| ' +
      Array.from({ length: colCount })
        .map((_, i) => padCell(row[i] || '', colWidths[i], alignments[i] || 'left'))
        .join(' | ') +
      ' |'
    );
  });

  return [headerRow, delimiterRow, ...bodyRows].join('\n');
}

/**
 * Parses simple CSV or TSV string into tabular headers and rows.
 */
export function parseDelimitedToTable(
  input: string,
  delimiter = ','
): { headers: string[]; rows: string[][] } {
  const lines = input
    .trim()
    .split('\n')
    .filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return { headers: ['Col 1', 'Col 2', 'Col 3'], rows: [['', '', '']] };
  }

  const raw = lines.map((l) => l.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, '')));
  const headers = raw[0].map((h, idx) => h || `Col ${idx + 1}`);
  const colCount = headers.length;

  const rows = raw.slice(1).map((r) => {
    const padded = [...r];
    while (padded.length < colCount) padded.push('');
    return padded.slice(0, colCount);
  });

  return { headers, rows: rows.length > 0 ? rows : [['', '', '']] };
}
