import { describe, it, expect } from 'vitest';
import {
  parseSqlDdl,
  generateTypeScript,
  generateZod,
  generatePrisma,
  mapSqlToTsType,
  mapSqlToZodType,
  mapSqlToPrismaType,
  SQL_PRESETS,
} from './sqlSchemaLogic';

describe('sqlSchemaLogic', () => {
  const sampleDdl = `
    CREATE TABLE users (
      id INT PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      bio TEXT,
      is_admin BOOLEAN NOT NULL,
      created_at TIMESTAMP NOT NULL
    );
  `;

  it('correctly maps SQL types to TypeScript types', () => {
    expect(mapSqlToTsType('VARCHAR(255)')).toBe('string');
    expect(mapSqlToTsType('INT')).toBe('number');
    expect(mapSqlToTsType('BIGINT')).toBe('number');
    expect(mapSqlToTsType('BOOLEAN')).toBe('boolean');
    expect(mapSqlToTsType('TIMESTAMP')).toBe('Date');
    expect(mapSqlToTsType('JSONB')).toBe('Record<string, unknown>');
  });

  it('correctly maps SQL types to Zod schemas', () => {
    expect(mapSqlToZodType('INT', false)).toBe('z.number().int()');
    expect(mapSqlToZodType('VARCHAR(50)', true)).toBe('z.string().nullable()');
    expect(mapSqlToZodType('UUID', false)).toBe('z.string().uuid()');
    expect(mapSqlToZodType('BOOLEAN', false)).toBe('z.boolean()');
  });

  it('correctly maps SQL types to Prisma models', () => {
    expect(mapSqlToPrismaType('INT', false, true)).toBe('Int @id');
    expect(mapSqlToPrismaType('VARCHAR(255)', true, false)).toBe('String?');
    expect(mapSqlToPrismaType('BOOLEAN', false, false)).toBe('Boolean');
    expect(mapSqlToPrismaType('TIMESTAMP', false, false)).toBe('DateTime');
  });

  it('parses single table DDL into structured table representation', () => {
    const tables = parseSqlDdl(sampleDdl);
    expect(tables.length).toBe(1);
    expect(tables[0].name).toBe('users');
    expect(tables[0].columns.length).toBe(5);

    const idCol = tables[0].columns.find((c) => c.name === 'id');
    expect(idCol?.isPrimaryKey).toBe(true);
    expect(idCol?.isNullable).toBe(false);

    const bioCol = tables[0].columns.find((c) => c.name === 'bio');
    expect(bioCol?.isNullable).toBe(true);
  });

  it('generates clean TypeScript interface', () => {
    const tables = parseSqlDdl(sampleDdl);
    const ts = generateTypeScript(tables);
    expect(ts).toContain('export interface Users {');
    expect(ts).toContain('id: number;');
    expect(ts).toContain('username: string;');
    expect(ts).toContain('bio?: string;');
    expect(ts).toContain('is_admin: boolean;');
  });

  it('generates Zod validation schemas', () => {
    const tables = parseSqlDdl(sampleDdl);
    const zod = generateZod(tables);
    expect(zod).toContain("import { z } from 'zod';");
    expect(zod).toContain('export const UsersSchema = z.object({');
    expect(zod).toContain('id: z.number().int(),');
    expect(zod).toContain('bio: z.string().nullable(),');
    expect(zod).toContain('export type Users = z.infer<typeof UsersSchema>;');
  });

  it('generates Prisma schema models', () => {
    const tables = parseSqlDdl(sampleDdl);
    const prisma = generatePrisma(tables);
    expect(prisma).toContain('model Users {');
    expect(prisma).toContain('id Int @id');
    expect(prisma).toContain('username String');
    expect(prisma).toContain('bio String?');
  });

  it('parses presets without errors', () => {
    for (const preset of SQL_PRESETS) {
      const tables = parseSqlDdl(preset.ddl);
      expect(tables.length).toBeGreaterThan(0);
      expect(generateTypeScript(tables)).toBeTruthy();
      expect(generateZod(tables)).toBeTruthy();
      expect(generatePrisma(tables)).toBeTruthy();
    }
  });
});
