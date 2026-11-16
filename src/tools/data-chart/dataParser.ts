import { DataRow, DataValue } from './types';

export function detectDelimiter(text: string): string {
  const firstLine = text.split('\n')[0] || '';
  const counts = {
    ',': (firstLine.match(/,/g) || []).length,
    '\t': (firstLine.match(/\t/g) || []).length,
    ';': (firstLine.match(/;/g) || []).length,
    '|': (firstLine.match(/\|/g) || []).length,
  };
  let best = ',';
  let max = 0;
  for (const [delim, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      best = delim;
    }
  }
  return best;
}

function parseValue(raw: string): DataValue {
  const val = raw.trim();
  if (val === '' || val.toLowerCase() === 'null') return null;
  if (val.toLowerCase() === 'true') return true;
  if (val.toLowerCase() === 'false') return false;
  if (!isNaN(Number(val)) && !isNaN(parseFloat(val))) {
    return Number(val);
  }
  return val;
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

export function parseCsv(text: string): DataRow[] {
  const clean = text.replace(/^\uFEFF/, '').trim();
  if (!clean) return [];
  const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCsvLine(lines[0], delimiter).map((h) => h.trim());
  const rows: DataRow[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i], delimiter);
    const row: DataRow = {};
    headers.forEach((header, idx) => {
      row[header] = parseValue(values[idx] ?? '');
    });
    rows.push(row);
  }

  return rows;
}

export function parseJson(text: string): DataRow[] {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === 'object' && item !== null);
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return [parsed];
    }
    return [];
  } catch {
    return [];
  }
}

export function parseData(input: string): DataRow[] {
  const trimmed = input.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    const jsonResult = parseJson(trimmed);
    if (jsonResult.length > 0) return jsonResult;
  }
  return parseCsv(trimmed);
}

export function exportToCsv(data: DataRow[], columns: string[]): string {
  if (data.length === 0 || columns.length === 0) return '';
  const headerLine = columns.map((c) => `"${c.replace(/"/g, '""')}"`).join(',');
  const rowLines = data.map((row) =>
    columns
      .map((col) => {
        const val = row[col];
        if (val === null || val === undefined) return '';
        const str = String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(',')
  );
  return [headerLine, ...rowLines].join('\n');
}
