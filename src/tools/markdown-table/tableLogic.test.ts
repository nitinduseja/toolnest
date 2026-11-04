import { describe, it, expect } from 'vitest';
import { generateMarkdownTable, parseDelimitedToTable } from './tableLogic';

describe('Markdown Table Generator Domain Logic', () => {
  it('generates a clean aligned GFM markdown table', () => {
    const table = generateMarkdownTable({
      headers: ['Name', 'Role', 'Status'],
      rows: [
        ['Ada Lovelace', 'Analyst', 'Active'],
        ['Alan Turing', 'Cryptanalyst', 'Offline'],
      ],
      alignments: ['left', 'center', 'right'],
    });

    expect(table).toContain('| Name         |     Role     |  Status |');
    expect(table).toContain('| :----------- | :----------: | ------: |');
    expect(table).toContain('| Ada Lovelace |   Analyst    |  Active |');
    expect(table).toContain('| Alan Turing  | Cryptanalyst | Offline |');
  });

  it('parses CSV input into headers and rows', () => {
    const csv = `id,fruit,price\n1,Apple,$1.50\n2,Banana,$0.80`;
    const res = parseDelimitedToTable(csv);
    expect(res.headers).toEqual(['id', 'fruit', 'price']);
    expect(res.rows.length).toBe(2);
    expect(res.rows[0]).toEqual(['1', 'Apple', '$1.50']);
  });

  it('handles empty data gracefully', () => {
    const res = generateMarkdownTable({ headers: [], rows: [] });
    expect(res).toBe('');
  });
});

