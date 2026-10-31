/**
 * Pure domain logic for client-side SQL formatting, case transformation, and minification.
 * Supports standard SQL ANSI syntax with clause indentation and nested subquery balancing.
 */

export type KeywordCase = 'upper' | 'lower' | 'preserve';
export type IndentSize = '2' | '4' | 'tab';

export interface SqlFormatterOptions {
  keywordCase?: KeywordCase;
  indent?: IndentSize;
}

const MAJOR_CLAUSES = [
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
  'CREATE TABLE',
  'ALTER TABLE',
  'DROP TABLE',
  'WITH',
  'UNION ALL',
  'UNION',
];

const SUB_CLAUSES = [
  'LEFT OUTER JOIN',
  'RIGHT OUTER JOIN',
  'FULL OUTER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'INNER JOIN',
  'CROSS JOIN',
  'JOIN',
  'ON',
  'AND',
  'OR',
];

const ALL_KEYWORDS = [
  ...MAJOR_CLAUSES,
  ...SUB_CLAUSES,
  'AS',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'DISTINCT',
  'IN',
  'NOT IN',
  'EXISTS',
  'BETWEEN',
  'LIKE',
  'NOT LIKE',
  'IS NULL',
  'IS NOT NULL',
  'ASC',
  'DESC',
  'BY',
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
];

function getIndentString(indent: IndentSize, depth: number): string {
  const unit = indent === 'tab' ? '\t' : ' '.repeat(Number(indent));
  return unit.repeat(Math.max(0, depth));
}

function applyKeywordCase(word: string, kCase: KeywordCase): string {
  if (kCase === 'upper') return word.toUpperCase();
  if (kCase === 'lower') return word.toLowerCase();
  return word;
}

interface Token {
  type: 'keyword' | 'string' | 'comment' | 'symbol' | 'word';
  value: string;
}

function extractStringOrComment(sql: string, i: number): { token: Token; next: number } | null {
  const char = sql[i];
  if (char === "'" || char === '"' || char === '`') {
    let j = i + 1;
    while (j < sql.length && sql[j] !== char) {
      if (sql[j] === '\\') j += 1;
      j += 1;
    }
    return { token: { type: 'string', value: sql.substring(i, j + 1) }, next: j + 1 };
  }
  if (sql.startsWith('--', i)) {
    const end = sql.indexOf('\n', i);
    const j = end === -1 ? sql.length : end;
    return { token: { type: 'comment', value: sql.substring(i, j) }, next: j };
  }
  if (sql.startsWith('/*', i)) {
    const end = sql.indexOf('*/', i);
    const j = end === -1 ? sql.length : end + 2;
    return { token: { type: 'comment', value: sql.substring(i, j) }, next: j };
  }
  return null;
}

export function tokenizeSql(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < sql.length) {
    if (/\s/.test(sql[i])) {
      i += 1;
      continue;
    }
    const sc = extractStringOrComment(sql, i);
    if (sc) {
      tokens.push(sc.token);
      i = sc.next;
      continue;
    }
    if ('(),;'.includes(sql[i])) {
      tokens.push({ type: 'symbol', value: sql[i] });
      i += 1;
      continue;
    }
    let j = i;
    while (
      j < sql.length &&
      !/[\s(),;'"`]/.test(sql[j]) &&
      !sql.startsWith('--', j) &&
      !sql.startsWith('/*', j)
    ) {
      j += 1;
    }
    const rawWord = sql.substring(i, j);
    const isKw = ALL_KEYWORDS.some((kw) => kw.split(/\s+/).includes(rawWord.toUpperCase()));
    tokens.push({ type: isKw ? 'keyword' : 'word', value: rawWord });
    i = j;
  }
  return tokens;
}

function transformTokensCase(tokens: Token[], kCase: KeywordCase): Token[] {
  return tokens.map((t) => {
    if (t.type === 'keyword') {
      return { ...t, value: applyKeywordCase(t.value, kCase) };
    }
    return t;
  });
}

function isClauseMatch(tokens: Token[], idx: number, clauses: string[]): string | null {
  for (const clause of clauses) {
    const parts = clause.split(/\s+/);
    let match = true;
    for (let p = 0; p < parts.length; p += 1) {
      if (!tokens[idx + p] || tokens[idx + p].value.toUpperCase() !== parts[p].toUpperCase()) {
        match = false;
        break;
      }
    }
    if (match) return clause;
  }
  return null;
}

export function formatSql(sql: string, options: SqlFormatterOptions = {}): string {
  const trimmed = sql.trim();
  if (!trimmed) return '';

  const kCase = options.keywordCase || 'upper';
  const indent = options.indent || '2';
  const tokens = transformTokensCase(tokenizeSql(trimmed), kCase);

  let result = '';
  let depth = 0;
  let idx = 0;

  while (idx < tokens.length) {
    const tok = tokens[idx];
    const majorMatch = isClauseMatch(tokens, idx, MAJOR_CLAUSES);
    const subMatch = isClauseMatch(tokens, idx, SUB_CLAUSES);

    if (majorMatch) {
      const partsCount = majorMatch.split(/\s+/).length;
      const clauseText = tokens
        .slice(idx, idx + partsCount)
        .map((t) => t.value)
        .join(' ');
      if (result.length > 0 && !result.endsWith('\n')) result += '\n';
      result += `${getIndentString(indent, depth)}${clauseText}\n${getIndentString(indent, depth + 1)}`;
      idx += partsCount;
      continue;
    }

    if (subMatch) {
      const partsCount = subMatch.split(/\s+/).length;
      const clauseText = tokens
        .slice(idx, idx + partsCount)
        .map((t) => t.value)
        .join(' ');
      if (result.length > 0 && !result.endsWith('\n')) result += '\n';
      result += `${getIndentString(indent, depth + 1)}${clauseText} `;
      idx += partsCount;
      continue;
    }

    if (tok.value === '(') {
      depth += 1;
      result += ' (';
      idx += 1;
      continue;
    }

    if (tok.value === ')') {
      depth = Math.max(0, depth - 1);
      result += ')';
      idx += 1;
      continue;
    }

    if (tok.value === ',') {
      result += `,\n${getIndentString(indent, depth + 1)}`;
      idx += 1;
      continue;
    }

    if (tok.value === ';') {
      result += ';\n';
      idx += 1;
      continue;
    }

    const needsSpace =
      result.length > 0 && !result.endsWith('\n') && !result.endsWith(' ') && !result.endsWith('(');
    result += (needsSpace ? ' ' : '') + tok.value;
    idx += 1;
  }

  return result.trim();
}

export function minifySql(sql: string): string {
  const tokens = tokenizeSql(sql);
  let res = '';
  for (const t of tokens) {
    if (t.type === 'comment') continue;
    if (t.value === '(' || t.value === ')' || t.value === ',' || t.value === ';') {
      res = res.trimEnd() + t.value;
    } else {
      res += (res.length > 0 && !res.endsWith('(') ? ' ' : '') + t.value;
    }
  }
  return res.trim();
}

export function getSampleSql(): string {
  return `SELECT u.id, u.name, u.email, count(o.id) as total_orders, sum(o.amount) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND u.created_at >= '2026-01-01' GROUP BY u.id, u.name, u.email HAVING count(o.id) > 2 ORDER BY total_spent DESC LIMIT 25;`;
}
