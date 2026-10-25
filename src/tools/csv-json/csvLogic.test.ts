import { describe, it, expect } from 'vitest';
import { convertCsvToJson } from './csvLogic';

describe('CSV to JSON Converter Domain Logic', () => {
  it('parses standard RFC 4180 CSV with quotes and commas', () => {
    const csv = `id,name,role\n1,"Doe, John",Engineer\n2,"Jane ""Dev"" Smith",Architect`;
    const res = convertCsvToJson(csv);
    expect(res.rowCount).toBe(2);
    expect(res.errors).toEqual([]);
    const parsed = JSON.parse(res.jsonString);
    expect(parsed[0].name).toBe('Doe, John');
    expect(parsed[1].name).toBe('Jane "Dev" Smith');
  });

  it('handles duplicate headers by deterministically appending suffixes and generating warning', () => {
    const csv = `title,title,desc\nBook 1,Book 2,A novel`;
    const res = convertCsvToJson(csv);
    expect(res.warnings.length).toBe(1);
    expect(res.warnings[0]).toContain('Duplicate column header');
    const parsed = JSON.parse(res.jsonString);
    expect(parsed[0].title).toBe('Book 1');
    expect(parsed[0].title_2).toBe('Book 2');
  });

  it('supports raw array conversion when header is false', () => {
    const csv = `1,2,3\n4,5,6`;
    const res = convertCsvToJson(csv, { hasHeader: false });
    expect(res.rowCount).toBe(2);
    const parsed = JSON.parse(res.jsonString);
    expect(parsed[0]).toEqual(['1', '2', '3']);
  });

  it('handles empty input cleanly', () => {
    const res = convertCsvToJson('');
    expect(res.jsonString).toBe('[]');
    expect(res.rowCount).toBe(0);
  });
});
