import { HighlightToken, SupportedLanguage, TokenType } from './types';

export interface TokenizerState {
  inBlockComment?: boolean;
}

interface CharTokenContext {
  line: string;
  index: number;
  language: SupportedLanguage;
}

interface WordContext {
  line: string;
  end: number;
  language: SupportedLanguage;
}

const COMMON_KW =
  'const let var function return if else for while class new this import export from default async await try catch finally throw typeof instanceof in of switch case break continue extends super delete void yield true false null undefined'.split(
    ' '
  );

const TS_KW = [
  ...COMMON_KW,
  ...'interface type enum implements public private protected readonly static abstract as keyof infer is never unknown any'.split(
    ' '
  ),
];

const PY_KW =
  'def class return if elif else for while break continue import from as try except finally raise with lambda yield global nonlocal assert pass del in is not and or async await self true false none'.split(
    ' '
  );

const PHP_KW =
  'function return if else elseif foreach for while class new public private protected static namespace use extends implements try catch finally throw echo print as instanceof true false null'.split(
    ' '
  );

const SQL_KW =
  'select from where insert into values update set delete create table drop alter join inner left right outer on as and or not null is in between like order by group having limit offset distinct union all primary key foreign references index default count sum avg'.split(
    ' '
  );

const BASH_KW =
  'if then else elif fi for while do done case esac function in return exit export local readonly unset echo read'.split(
    ' '
  );

const RUST_KW =
  'fn let mut pub impl struct enum trait use mod crate self super return if else match loop while for in where async await move ref type const static unsafe true false'.split(
    ' '
  );

const GO_KW =
  'package import func return if else for range switch case default break continue go defer select chan var const type struct interface map true false nil'.split(
    ' '
  );

const LANGUAGE_KEYWORDS: Record<SupportedLanguage, Set<string>> = {
  javascript: new Set(COMMON_KW),
  typescript: new Set(TS_KW),
  python: new Set(PY_KW),
  php: new Set(PHP_KW),
  html: new Set(['doctype', 'true', 'false']),
  css: new Set(['important', 'inherit', 'initial', 'unset', 'revert']),
  json: new Set(['true', 'false', 'null']),
  sql: new Set(SQL_KW),
  bash: new Set(BASH_KW),
  rust: new Set(RUST_KW),
  go: new Set(GO_KW),
  text: new Set(),
};

const BLOCK_COMMENT_LANGS = new Set<SupportedLanguage>([
  'javascript',
  'typescript',
  'php',
  'css',
  'sql',
  'rust',
  'go',
]);

const IDENTIFIER = /[A-Za-z0-9_$]/;
const WORD_START = /[A-Za-z_$]/;
const OPERATOR = /[=+\-*/%&|^<>!:~?]/;

function readQuotedString(line: string, start: number): number {
  const quote = line[start];
  let escaped = false;
  for (let i = start + 1; i < line.length; i++) {
    const char = line[i];
    if (escaped) escaped = false;
    else if (char === '\\') escaped = true;
    else if (char === quote) return i + 1;
  }
  return line.length;
}

function readNumber(line: string, start: number): string {
  const match = line
    .slice(start)
    .match(/^(?:0[xX][\da-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?n?)/);
  return match?.[0] || line[start];
}

function readWord(line: string, start: number): string {
  let end = start + 1;
  while (end < line.length && IDENTIFIER.test(line[end])) end++;
  return line.slice(start, end);
}

function classifyWord(word: string, ctx: WordContext): TokenType {
  const kw = LANGUAGE_KEYWORDS[ctx.language];
  if (kw && (kw.has(word) || kw.has(word.toLowerCase()))) return 'keyword';
  if (ctx.line.slice(ctx.end).trimStart().startsWith('(')) return 'function';
  return /^[A-Z]/.test(word) ? 'type' : 'text';
}

function checkSingleComment(line: string, idx: number, lang: SupportedLanguage): boolean {
  const char = line[idx];
  const next = line[idx + 1] || '';
  if (char === '/' && next === '/') return BLOCK_COMMENT_LANGS.has(lang);
  if (char === '#' && (lang === 'python' || lang === 'bash')) return true;
  return char === '-' && next === '-' && lang === 'sql';
}

function tokenizeTemplate(value: string, lang: SupportedLanguage): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const parts = value.split(/(\$\{[\s\S]*?\})/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('${') && part.endsWith('}')) {
      tokens.push({ type: 'operator', text: '${' });
      tokens.push(...tokenizeLine(part.slice(2, -1), lang));
      tokens.push({ type: 'operator', text: '}' });
    } else {
      tokens.push({ type: 'string', text: part });
    }
  }
  return tokens;
}

function tokenizeCharacter(
  ctx: CharTokenContext,
  state?: TokenizerState
): { tokens: HighlightToken[]; len: number } {
  const { line, index, language } = ctx;
  const char = line[index];
  const next = line[index + 1] || '';

  if (/\s/.test(char)) {
    let end = index + 1;
    while (end < line.length && /\s/.test(line[end])) end++;
    return { tokens: [{ type: 'text', text: line.slice(index, end) }], len: end - index };
  }
  if (char === '/' && next === '*' && BLOCK_COMMENT_LANGS.has(language)) {
    const closeIdx = line.indexOf('*/', index + 2);
    if (closeIdx === -1) {
      if (state) state.inBlockComment = true;
      return { tokens: [{ type: 'comment', text: line.slice(index) }], len: line.length - index };
    }
    return {
      tokens: [{ type: 'comment', text: line.slice(index, closeIdx + 2) }],
      len: closeIdx + 2 - index,
    };
  }
  if (checkSingleComment(line, index, language)) {
    return { tokens: [{ type: 'comment', text: line.slice(index) }], len: line.length - index };
  }
  if (
    char === '"' ||
    char === "'" ||
    (char === '`' && (language === 'javascript' || language === 'typescript'))
  ) {
    const end = readQuotedString(line, index);
    const value = line.slice(index, end);
    const tokens =
      char === '`'
        ? tokenizeTemplate(value, language)
        : [{ type: 'string' as TokenType, text: value }];
    return { tokens, len: end - index };
  }
  if (/\d/.test(char)) {
    const num = readNumber(line, index);
    return { tokens: [{ type: 'number', text: num }], len: num.length };
  }
  if (WORD_START.test(char)) {
    const word = readWord(line, index);
    const type = classifyWord(word, { line, end: index + word.length, language });
    return { tokens: [{ type, text: word }], len: word.length };
  }
  if (OPERATOR.test(char)) {
    let end = index + 1;
    while (end < line.length && OPERATOR.test(line[end])) end++;
    return { tokens: [{ type: 'operator', text: line.slice(index, end) }], len: end - index };
  }
  return { tokens: [{ type: 'text', text: char }], len: 1 };
}

export function tokenizeLine(
  line: string,
  language: SupportedLanguage = 'typescript',
  state?: TokenizerState
): HighlightToken[] {
  if (language === 'text') return [{ type: 'text', text: line }];
  if (line.length === 0) return [{ type: 'text', text: '' }];

  if (state?.inBlockComment) {
    const closeIdx = line.indexOf('*/');
    if (closeIdx === -1) {
      return [{ type: 'comment', text: line }];
    }
    state.inBlockComment = false;
    const commentPart = line.slice(0, closeIdx + 2);
    const rest = tokenizeLine(line.slice(closeIdx + 2), language, state);
    return [{ type: 'comment', text: commentPart }, ...rest];
  }

  const tokens: HighlightToken[] = [];
  for (let index = 0; index < line.length;) {
    const { tokens: chunk, len } = tokenizeCharacter({ line, index, language }, state);
    tokens.push(...chunk);
    index += len;
  }
  return tokens.length ? tokens : [{ type: 'text', text: line }];
}

export function tokenizeCode(
  code: string,
  language: SupportedLanguage = 'typescript'
): HighlightToken[][] {
  const state: TokenizerState = { inBlockComment: false };
  return code.split('\n').map((line) => tokenizeLine(line, language, state));
}
