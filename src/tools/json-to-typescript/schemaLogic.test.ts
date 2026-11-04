import { describe, it, expect } from 'vitest';
import { generateTypeScript, generateZodSchema } from './schemaLogic';

describe('JSON to TypeScript & Zod Generator Domain Logic', () => {
  const SAMPLE_USER = JSON.stringify({
    id: 1,
    name: 'Ada Lovelace',
    isActive: true,
    skills: ['algorithms', 'math'],
    address: {
      street: '123 Main St',
      zip: '90210',
    },
  });

  describe('TypeScript Generation', () => {
    it('generates standard TypeScript interface with primitives and nested objects', () => {
      const res = generateTypeScript(SAMPLE_USER, { rootName: 'User' });
      expect(res.error).toBeUndefined();
      expect(res.code).toContain('export interface User');
      expect(res.code).toContain('id: number;');
      expect(res.code).toContain('name: string;');
      expect(res.code).toContain('isActive: boolean;');
      expect(res.code).toContain('skills: string[];');
      expect(res.code).toContain('address: UserAddress;');
      expect(res.code).toContain('export interface UserAddress');
      expect(res.code).toContain('street: string;');
    });

    it('generates type aliases when outputFormat is type', () => {
      const res = generateTypeScript(SAMPLE_USER, { rootName: 'User', outputFormat: 'type' });
      expect(res.code).toContain('export type User =');
      expect(res.code).toContain('export type UserAddress =');
    });

    it('handles special characters in object keys with quotation', () => {
      const special = JSON.stringify({ 'x-api-key': 'secret-123', 'full name': 'John' });
      const res = generateTypeScript(special, { rootName: 'Config' });
      expect(res.code).toContain('"x-api-key": string;');
      expect(res.code).toContain('"full name": string;');
    });

    it('returns error when JSON syntax is invalid', () => {
      const res = generateTypeScript('{ bad: ');
      expect(res.error).toBeDefined();
      expect(res.error).toContain('Invalid JSON');
    });
  });

  describe('Zod Schema Generation', () => {
    it('generates valid Zod schema and inferred type definition', () => {
      const res = generateZodSchema(SAMPLE_USER, { rootName: 'User' });
      expect(res.error).toBeUndefined();
      expect(res.code).toContain("import { z } from 'zod';");
      expect(res.code).toContain('export const UserSchema = z.object({');
      expect(res.code).toContain('id: z.number(),');
      expect(res.code).toContain('name: z.string(),');
      expect(res.code).toContain('isActive: z.boolean(),');
      expect(res.code).toContain('skills: z.array(z.string()),');
      expect(res.code).toContain('export type User = z.infer<typeof UserSchema>;');
    });

    it('handles empty input gracefully', () => {
      const res = generateZodSchema('');
      expect(res.code).toBe('');
      expect(res.error).toBeUndefined();
    });
  });
});
