
import { HighlightToken, SupportedLanguage } from './types';

type TokenType = HighlightToken['type'];

const COMMON = [
  'const let var function return if else for while class new this',
  'import export from default async await try catch finally throw',
  'typeof instanceof in of switch case break continue extends super',
  'delete void yield true false null undefined',
].join(' ').split(' ');

const LANGUAGE_KEYWORDS: Record<SupportedLanguage, Set<string>> = {
  javascript: new Set(COMMON),
  typescript: new Set([
    ...COMMON,
    ...'interface type enum implements public private protected readonly static abstract as keyof infer is never unknown any'.split(' '),
  ]),
  python: new Set('def class return if elif else for while break continue import from as try except finally raise with lambda yield global nonlocal assert pass del in is not and or async await self true false none'.split(' ')),
  php: new Set('function return if else elseif foreach for while class new public private protected static namespace use extends implements try catch finally throw echo print as instanceof true false null'.split(' ')),
  html: new Set(['DOCTYPE', 'true', 'false']),
  css: new Set('important inherit initial unset revert'.split(' ')),
  json: new Set(['true', 'false', 'null']),
  sql: new Set('SELECT FROM WHERE INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE DROP ALTER JOIN INNER LEFT RIGHT OUTER ON AS AND OR NOT NULL IS IN BETWEEN LIKE ORDER BY GROUP HAVING LIMIT OFFSET DISTINCT UNION ALL PRIMARY KEY FOREIGN REFERENCES INDEX DEFAULT COUNT SUM AVG'.split(' ')),
  bash: new Set('if then else elif fi for while do done case esac function in return exit export local readonly unset echo read'.split(' ')),
  rust: new Set('fn let mut pub impl struct enum trait use mod crate self Self super return if else match loop while for in where async await move ref type const static unsafe true false'.split(' ')),
  go: new Set('package import func return if else for range switch case default break continue go defer select chan var const type struct interface map true false nil'.split(' ')),
  text: new Set(),
};

const IDENTIFIER = /[A-Za-z0-9_$]/;
const WORD_START = /[A-Za-z_$]/;
const OPERATOR = /[=+\-*/%&|^<>!:~?]/;

function isTemplateLanguage(language: SupportedLanguage): boolean {
  return language === 'javascript' || language === 'typescript';
}

function isCommentStart(
  char: string,
  next: string,
  language: SupportedLanguage
): boolean {
  const slash = char === '/' && next === '/' &&
    !['python', 'bash', 'sql'].includes(language);
  const hash = char === '#' &&
    ['python', 'bash', 'sql'].includes(language);
  const sql = char === '-' && next === '-' && language === 'sql';

  return slash || hash || sql;
}

function readQuotedString(
  line: string,
  start: number
): number {
  const quote = line[start];
  let escaped = false;
  let index = start + 1;

  while (index < line.length) {
    const char = line[index];

    if (escaped) escaped = false;
    else if (char === '\\') escaped = true;
    else if (char === quote) return index + 1;

    index++;
  }

  return line.length;
}

function readNumber(line: string, start: number): string {
  const match = line.slice(start).match(
    /^(?:0[xX][\da-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?n?)/
  );

  return match?.[0] || line[start];
}

function readWord(line: string, start: number): string {
  let end = start + 1;

  while (end < line.length && IDENTIFIER.test(line[end])) end++;

  return line.slice(start, end);
}

function classifyWord(
  word: string,
  line: string,
  end: number,
  keywords: Set<string>
): TokenType {
  if (keywords.has(word) || keywords.has(word.toLowerCase())) {
    return 'keyword';
  }

  const next = line.slice(end).trimStart()[0];
  if (next === '(') return 'function';

  return /^[A-Z]/.test(word) ? 'type' : 'text';
}

function pushToken(
  tokens: HighlightToken[],
  type: TokenType,
  text: string
): void {
  tokens.push({ type, text });
}

function tokenizeTemplate(
  value: string,
  language: SupportedLanguage
): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const parts = value.split(/(\$\{[\s\S]*?\})/g);

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('${') && part.endsWith('}')) {
      pushToken(tokens, 'operator', '${');
      tokens.push(...tokenizeLine(part.slice(2, -1), language));
      pushToken(tokens, 'operator', '}');
    } else {
      pushToken(tokens, 'string', part);
    }
  }

  return tokens;
}

function tokenizeString(
  line: string,
  index: number,
  language: SupportedLanguage
): HighlightToken[] {
  const end = readQuotedString(line, index);
  const value = line.slice(index, end);

  if (line[index] === '`' && isTemplateLanguage(language)) {
    return tokenizeTemplate(value, language);
  }

  return [{ type: 'string', text: value }];
}

function tokenizeComment(
  line: string,
  index: number,
  language: SupportedLanguage
): HighlightToken[] {
  const char = line[index];
  const next = line[index + 1];

  if (isCommentStart(char, next || '', language)) {
    return [{ type: 'comment', text: line.slice(index) }];
  }

  if (
    ['sql', 'css'].includes(language) &&
    char === '/' && next === '*'
  ) {
    const end = line.indexOf('*/', index + 2);
    const finish = end === -1 ? line.length : end + 2;
    return [{ type: 'comment', text: line.slice(index, finish) }];
  }

  return [];
}

function tokenizeWord(
  line: string,
  index: number,
  keywords: Set<string>
): HighlightToken[] {
  const word = readWord(line, index);
  const type = classifyWord(word, line, index + word.length, keywords);

  return [{ type, text: word }];
}

function tokenizeOperator(line: string, index: number): string {
  let end = index + 1;

  while (end < line.length && OPERATOR.test(line[end])) end++;

  return line.slice(index, end);
}

function tokenizeCharacter(
  line: string,
  index: number,
  language: SupportedLanguage,
  keywords: Set<string>
): { tokens: HighlightToken[]; length: number } {
  const char = line[index];
  const next = line[index + 1] || '';

  if (/\s/.test(char)) {
    let end = index + 1;
    while (end < line.length && /\s/.test(line[end])) end++;
    return {
      tokens: [{ type: 'text', text: line.slice(index, end) }],
      length: end - index,
    };
  }

  const comment = tokenizeComment(line, index, language);
  if (comment.length) {
    return { tokens: comment, length: comment[0].text.length };
  }

  if (char === '"' || char === "'" ||
      (char === '`' && isTemplateLanguage(language))) {
    const tokens = tokenizeString(line, index, language);
    return {
      tokens,
      length: readQuotedString(line, index) - index,
    };
  }

  if (/\d/.test(char)) {
    const number = readNumber(line, index);
    return {
      tokens: [{ type: 'number', text: number }],
      length: number.length,
    };
  }

  if (WORD_START.test(char)) {
    const tokens = tokenizeWord(line, index, keywords);
    return { tokens, length: tokens[0].text.length };
  }

  if (OPERATOR.test(char)) {
    const operator = tokenizeOperator(line, index);
    return {
      tokens: [{ type: 'operator', text: operator }],
      length: operator.length,
    };
  }

  return {
    tokens: [{ type: 'text', text: char }],
    length: 1,
  };
}

export function tokenizeLine(
  line: string,
  language: SupportedLanguage = 'typescript'
): HighlightToken[] {
  if (language === 'text') return [{ type: 'text', text: line }];

  const tokens: HighlightToken[] = [];
  const keywords = LANGUAGE_KEYWORDS[language] || new Set<string>();
  let index = 0;

  while (index < line.length) {
    const result = tokenizeCharacter(line, index, language, keywords);
    tokens.push(...result.tokens);
    index += result.length;
  }

  return tokens.length ? tokens : [{ type: 'text', text: line }];
}

export function tokenizeCode(
  code: string,
  language: SupportedLanguage = 'typescript'
): HighlightToken[][] {
  return code.split('\n').map((line) => tokenizeLine(line, language));
}
