import { describe, it, expect } from 'vitest';
import {
  generateFieldValue,
  generateMockDataset,
  exportToJson,
  exportToCsv,
  getPresetSchemas,
  FieldConfig,
} from './mockDataLogic';

describe('mockDataLogic', () => {
  describe('generateFieldValue', () => {
    it('generates valid values for core types', () => {
      expect(generateFieldValue('id_int', 0)).toBe(1);
      expect(generateFieldValue('id_uuid', 0)).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
      expect(typeof generateFieldValue('full_name', 1)).toBe('string');
      expect(generateFieldValue('email', 1)).toContain('@example.com');
      expect(generateFieldValue('phone', 0)).toContain('+1 (555)');
      expect(typeof generateFieldValue('boolean', 0)).toBe('boolean');
      expect(typeof generateFieldValue('price', 0)).toBe('number');
      expect(typeof generateFieldValue('date', 0)).toBe('string');
    });
  });

  describe('generateMockDataset', () => {
    const fields: FieldConfig[] = [
      { id: '1', name: 'id', type: 'id_int' },
      { id: '2', name: 'user_email', type: 'email' },
      { id: '3', name: 'active', type: 'boolean' },
    ];

    it('generates exact number of records requested', () => {
      const rows = generateMockDataset(fields, 5);
      expect(rows.length).toBe(5);
      expect(rows[0]).toHaveProperty('id', 1);
      expect(rows[0]).toHaveProperty('user_email');
      expect(rows[0]).toHaveProperty('active', true);
    });

    it('clamps count between 1 and 500', () => {
      expect(generateMockDataset(fields, 0).length).toBe(1);
      expect(generateMockDataset(fields, 600).length).toBe(500);
    });

    it('regenerates different dataset when seed changes', () => {
      const dataset1 = generateMockDataset(fields, 5, 0);
      const dataset2 = generateMockDataset(fields, 5, 1);
      expect(dataset1[0].user_email).not.toEqual(dataset2[0].user_email);
      expect(dataset1[0].id).not.toEqual(dataset2[0].id);
    });
  });

  describe('exportToJson', () => {
    it('serializes dataset to valid JSON array string', () => {
      const dataset = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const jsonStr = exportToJson(dataset);
      expect(JSON.parse(jsonStr)).toEqual(dataset);
    });
  });

  describe('exportToCsv', () => {
    it('exports dataset to CSV with escaping for commas and quotes', () => {
      const dataset = [
        { id: 1, title: 'Engineer, Lead', note: 'Said "Hello"' },
        { id: 2, title: 'Designer', note: 'Standard' },
      ];
      const csvStr = exportToCsv(dataset);
      const lines = csvStr.split('\n');

      expect(lines[0]).toBe('id,title,note');
      expect(lines[1]).toContain('"Engineer, Lead"');
      expect(lines[1]).toContain('"Said ""Hello"""');
      expect(lines[2]).toBe('2,Designer,Standard');
    });

    it('returns empty string for empty dataset', () => {
      expect(exportToCsv([])).toBe('');
    });
  });

  describe('getPresetSchemas', () => {
    it('returns available preset templates with fields', () => {
      const presets = getPresetSchemas();
      expect(presets.length).toBeGreaterThanOrEqual(3);
      for (const preset of presets) {
        expect(preset.fields.length).toBeGreaterThan(0);
        const data = generateMockDataset(preset.fields, 2);
        expect(data.length).toBe(2);
      }
    });
  });
});
