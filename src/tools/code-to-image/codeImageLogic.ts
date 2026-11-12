import { CodeCardConfig, HighlightToken } from './types';
import { getThemeColors, getBackgroundDefs } from './themeConfig';

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const KEYWORD_SET = new Set([
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'class',
  'import',
  'export',
  'from',
  'default',
  'async',
  'await',
  'try',
  'catch',
  'new',
  'typeof',
  'interface',
  'type',
  'def',
  'self',
  'lambda',
  'with',
  'as',
  'in',
  'is',
  'not',
  'and',
  'or',
  'select',
  'where',
  'fn',
  'pub',
  'mut',
  'impl',
  'struct',
  'package',
  'func',
  'go',
  'defer',
  'true',
  'false',
  'null',
]);

export function tokenizeLine(line: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const regex =
    /(\/\/[^\n]*|#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*(?=\s*\()|\b[A-Za-z_$][\w$]*\b)|([=+\-*/%&|^<>!:]+)|(\s+)|([^\s\w]+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    const [full, comment, str, num, word, op] = match;
    if (comment) {
      tokens.push({ type: 'comment', text: full });
    } else if (str) {
      tokens.push({ type: 'string', text: full });
    } else if (num) {
      tokens.push({ type: 'number', text: full });
    } else if (word) {
      const lower = word.toLowerCase();
      if (KEYWORD_SET.has(lower)) {
        tokens.push({ type: 'keyword', text: full });
      } else if (full[0] >= 'A' && full[0] <= 'Z') {
        tokens.push({ type: 'type', text: full });
      } else {
        tokens.push({ type: 'text', text: full });
      }
    } else if (op) {
      tokens.push({ type: 'operator', text: full });
    } else {
      tokens.push({ type: 'text', text: full });
    }
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', text: line }];
}

export function tokenizeCode(code: string): HighlightToken[][] {
  const lines = code.split('\n');
  return lines.map((l) => tokenizeLine(l));
}

export function buildHeaderElements(config: CodeCardConfig, cardWidth: number): string {
  const colors = getThemeColors(config.theme);
  const elements: string[] = [];

  if (config.windowStyle === 'mac') {
    elements.push(
      '<circle cx="20" cy="18" r="5.5" fill="#ff5f56"/>' +
        '<circle cx="38" cy="18" r="5.5" fill="#ffbd2e"/>' +
        '<circle cx="56" cy="18" r="5.5" fill="#27c93f"/>'
    );
  } else if (config.windowStyle === 'windows') {
    const rx = cardWidth - 60;
    elements.push(
      `<line x1="${rx}" y1="18" x2="${rx + 10}" y2="18" stroke="${colors.titleColor}" stroke-width="1.5"/>` +
        `<rect x="${rx + 20}" y="13" width="10" height="10" fill="none" stroke="${colors.titleColor}" stroke-width="1.5"/>` +
        `<path d="M${rx + 40} 13 L${rx + 50} 23 M${rx + 50} 13 L${rx + 40} 23" stroke="${colors.titleColor}" stroke-width="1.5"/>`
    );
  }

  if (config.title && config.windowStyle !== 'none') {
    const titleX = cardWidth / 2;
    elements.push(
      `<text x="${titleX}" y="22" fill="${colors.titleColor}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" text-anchor="middle">${escapeXml(config.title)}</text>`
    );
  }

  return elements.join('');
}

interface CodeMetrics {
  cardWidth: number;
  cardHeight: number;
  totalWidth: number;
  totalHeight: number;
  headerHeight: number;
  lineHeight: number;
  numGutter: number;
}

export function computeCardMetrics(config: CodeCardConfig, lines: HighlightToken[][]): CodeMetrics {
  const charWidth = config.fontSize * 0.6;
  const lineHeight = config.fontSize * 1.5;
  let maxLineLen = 25;
  lines.forEach((l) => {
    const len = l.reduce((acc, t) => acc + t.text.length, 0);
    if (len > maxLineLen) maxLineLen = len;
  });

  const numGutter = config.showLineNumbers ? 42 : 0;
  const cardWidth = Math.max(380, Math.round(maxLineLen * charWidth + numGutter + 48));
  const headerHeight = config.windowStyle !== 'none' ? 36 : 16;
  const cardHeight = Math.round(headerHeight + lines.length * lineHeight + 28);
  const totalWidth = cardWidth + config.padding * 2;
  const totalHeight = cardHeight + config.padding * 2;

  return {
    cardWidth,
    cardHeight,
    totalWidth,
    totalHeight,
    headerHeight,
    lineHeight,
    numGutter,
  };
}

export function renderCodeLines(
  config: CodeCardConfig,
  lines: HighlightToken[][],
  m: CodeMetrics
): string {
  const colors = getThemeColors(config.theme);
  return lines
    .map((lineTokens, lineIdx) => {
      const y = m.headerHeight + (lineIdx + 1) * m.lineHeight;
      let xOffset = 24;
      const parts: string[] = [];

      if (config.showLineNumbers) {
        parts.push(
          `<tspan fill="${colors.lineNumber}" font-weight="500">${String(lineIdx + 1).padStart(2, ' ')}  </tspan>`
        );
        xOffset += m.numGutter;
      }

      lineTokens.forEach((tok) => {
        const col = (colors as unknown as Record<string, string>)[tok.type] || colors.text;
        parts.push(`<tspan fill="${col}">${escapeXml(tok.text)}</tspan>`);
      });

      return `<text x="${xOffset}" y="${y}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="${config.fontSize}">${parts.join('')}</text>`;
    })
    .join('');
}

export function generateCardSvg(config: CodeCardConfig): string {
  const colors = getThemeColors(config.theme);
  const lines = tokenizeCode(config.code);
  const bgData = getBackgroundDefs(config.background);
  const m = computeCardMetrics(config, lines);
  const headerSvg = buildHeaderElements(config, m.cardWidth);
  const codeLinesSvg = renderCodeLines(config, lines, m);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m.totalWidth} ${m.totalHeight}" width="${m.totalWidth}" height="${m.totalHeight}">
  <defs>
    ${bgData.defs}
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="${bgData.fill}"/>
  <g transform="translate(${config.padding}, ${config.padding})" filter="url(#shadow)">
    <rect width="${m.cardWidth}" height="${m.cardHeight}" rx="${config.borderRadius}" fill="${colors.background}"/>
    ${headerSvg}
    ${codeLinesSvg}
  </g>
</svg>`;
}
