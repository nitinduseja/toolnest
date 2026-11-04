import { describe, it, expect } from 'vitest';
import { convertCsvToJson, convertJsonToCsv } from './csvLogic';

describe('CSV ↔ JSON Converter Domain Logic', () => {
  describe('CSV to JSON', () => {
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

    it('supports custom delimiter such as semicolon or tab', () => {
      const tsv = `id\tname\tage\n1\tAlice\t30\n2\tBob\t25`;
      const res = convertCsvToJson(tsv, { delimiter: '\t' });
      expect(res.rowCount).toBe(2);
      const parsed = JSON.parse(res.jsonString);
      expect(parsed[0].name).toBe('Alice');
      expect(parsed[1].name).toBe('Bob');
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

  describe('JSON to CSV', () => {
    it('converts array of objects to standard CSV', () => {
      const json = JSON.stringify([
        { id: 1, name: 'Alice', city: 'NYC' },
        { id: 2, name: 'Bob', city: 'London' },
      ]);
      const res = convertJsonToCsv(json);
      expect(res.rowCount).toBe(2);
      expect(res.errors).toEqual([]);
      expect(res.csvString).toContain('id,name,city');
      expect(res.csvString).toContain('1,Alice,NYC');
    });

    it('converts single object into a single row CSV', () => {
      const json = JSON.stringify({ key: 'value', number: 42 });
      const res = convertJsonToCsv(json);
      expect(res.rowCount).toBe(1);
      expect(res.csvString).toContain('key,number');
      expect(res.csvString).toContain('value,42');
    });

    it('supports semicolon, tab, and pipe delimiters in CSV output', () => {
      const json = JSON.stringify([{ a: '1', b: '2' }]);
      const res = convertJsonToCsv(json, { delimiter: ';' });
      expect(res.csvString).toBe('a;b\r\n1;2');
    });

    it('returns error when JSON syntax is invalid', () => {
      const res = convertJsonToCsv('{ broken json: ');
      expect(res.errors.length).toBeGreaterThan(0);
      expect(res.errors[0]).toContain('JSON syntax error');
    });
  });
});
