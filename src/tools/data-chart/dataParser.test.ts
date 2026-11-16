import { describe, it, expect } from 'vitest';
import { parseCsv, parseJson, parseData, detectDelimiter, exportToCsv } from './dataParser';

describe('dataParser', () => {
  it('detects comma, tab, and semicolon delimiters accurately', () => {
    expect(detectDelimiter('a,b,c\n1,2,3')).toBe(',');
    expect(detectDelimiter('a\tb\tc\n1\t2\t3')).toBe('\t');
    expect(detectDelimiter('a;b;c\n1;2;3')).toBe(';');
  });

  it('parses standard RFC 4180 CSV with quotes and commas', () => {
    const csv = `Name,Role,"Salary, USD",Active
Alice,Developer,85000,true
Bob,"Product, Lead",95000,false`;
    const rows = parseCsv(csv);

    expect(rows.length).toBe(2);
    expect(rows[0].Name).toBe('Alice');
    expect(rows[0].Active).toBe(true);
    expect(rows[0]['Salary, USD']).toBe(85000);
    expect(rows[1].Role).toBe('Product, Lead');
  });

  it('parses JSON arrays of objects cleanly', () => {
    const json = JSON.stringify([
      { month: 'Jan', revenue: 1000 },
      { month: 'Feb', revenue: 1500 },
    ]);
    const rows = parseJson(json);
    expect(rows.length).toBe(2);
    expect(rows[0].month).toBe('Jan');
    expect(rows[0].revenue).toBe(1000);
  });

  it('handles invalid or empty inputs gracefully', () => {
    expect(parseCsv('')).toEqual([]);
    expect(parseJson('invalid json')).toEqual([]);
    expect(parseData('')).toEqual([]);
  });

  it('exports data rows back to valid CSV format', () => {
    const data = [{ name: 'Alpha', value: 100 }];
    const csv = exportToCsv(data, ['name', 'value']);
    expect(csv).toContain('"name","value"');
    expect(csv).toContain('"Alpha","100"');
  });
});
