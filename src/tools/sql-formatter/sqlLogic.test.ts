import { describe, it, expect } from 'vitest';
import { tokenizeSql, formatSql, minifySql, getSampleSql } from './sqlLogic';

describe('sqlLogic', () => {
  describe('tokenizeSql', () => {
    it('tokenizes keywords, identifiers, strings, and symbols', () => {
      const sql = "SELECT id, name FROM users WHERE role = 'admin';";
      const tokens = tokenizeSql(sql);
      expect(tokens.length).toBeGreaterThan(5);
      expect(tokens[0]).toEqual({ type: 'keyword', value: 'SELECT' });
      expect(tokens.some((t) => t.type === 'string' && t.value === "'admin'")).toBe(true);
      expect(tokens.some((t) => t.type === 'symbol' && t.value === ';')).toBe(true);
    });

    it('preserves single-line and multi-line comments', () => {
      const sql = 'SELECT 1; -- inline comment\n/* block comment */ SELECT 2;';
      const tokens = tokenizeSql(sql);
      const comments = tokens.filter((t) => t.type === 'comment');
      expect(comments.length).toBe(2);
      expect(comments[0].value).toContain('-- inline comment');
      expect(comments[1].value).toContain('/* block comment */');
    });

    it('handles escaped quotes inside strings', () => {
      const sql = "SELECT 'It\\'s a test' AS note;";
      const tokens = tokenizeSql(sql);
      const strToken = tokens.find((t) => t.type === 'string');
      expect(strToken?.value).toBe("'It\\'s a test'");
    });
  });

  describe('formatSql', () => {
    it('formats basic SELECT query with clauses on separate lines', () => {
      const raw = 'select id, name, email from users where active = 1 order by name asc limit 10;';
      const formatted = formatSql(raw, { keywordCase: 'upper', indent: '2' });

      expect(formatted).toContain('SELECT');
      expect(formatted).toContain('FROM');
      expect(formatted).toContain('WHERE');
      expect(formatted).toContain('ORDER BY');
      expect(formatted).toContain('LIMIT');
      expect(formatted.split('\n').length).toBeGreaterThan(4);
    });

    it('supports lowercase keyword case option', () => {
      const raw = 'SELECT id FROM users;';
      const formatted = formatSql(raw, { keywordCase: 'lower' });
      expect(formatted).toContain('select');
      expect(formatted).toContain('from');
    });

    it('supports 4 spaces indent option', () => {
      const raw = 'SELECT id, name FROM users;';
      const formatted = formatSql(raw, { indent: '4' });
      expect(formatted).toContain('    ');
    });

    it('handles empty or whitespace-only inputs', () => {
      expect(formatSql('')).toBe('');
      expect(formatSql('   ')).toBe('');
    });

    it('formats subqueries inside parentheses', () => {
      const raw = 'SELECT * FROM (SELECT id FROM users) u;';
      const formatted = formatSql(raw);
      expect(formatted).toContain('(');
      expect(formatted).toContain(')');
    });
  });

  describe('minifySql', () => {
    it('collapses whitespace and strips comments', () => {
      const raw = `
        SELECT
          u.id, -- user id
          u.name
        FROM users u
        WHERE u.active = 1;
      `;
      const minified = minifySql(raw);
      expect(minified).not.toContain('-- user id');
      expect(minified).not.toContain('\n');
      expect(minified).toBe('SELECT u.id, u.name FROM users u WHERE u.active = 1;');
    });
  });

  describe('getSampleSql', () => {
    it('returns a sample query that formats successfully', () => {
      const sample = getSampleSql();
      const formatted = formatSql(sample);
      expect(formatted).toContain('SELECT');
      expect(formatted).toContain('LEFT JOIN');
      expect(formatted).toContain('GROUP BY');
      expect(formatted).toContain('HAVING');
    });
  });
});
