
import {
  CodeCardConfig,
  HighlightToken,
} from './types';

import { getThemeColors } from './themeConfig';

export interface CodeMetrics {
  cardWidth: number;
  cardHeight: number;
  totalWidth: number;
  totalHeight: number;
  headerHeight: number;
  lineHeight: number;
  numGutter: number;
}

const FONT_FAMILY =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getMaximumLineLength(lines: HighlightToken[][]): number {
  return Math.max(
    25,
    ...lines.map((line) =>
      line.reduce((total, token) => total + token.text.length, 0)
    )
  );
}

function getNumberGutter(
  config: CodeCardConfig,
  lineCount: number
): number {
  if (!config.showLineNumbers) return 0;

  return Math.max(36, String(lineCount).length * 10 + 20);
}

function getCardWidth(
  config: CodeCardConfig,
  lines: HighlightToken[][],
  gutter: number
): number {
  const characterWidth = config.fontSize * 0.62;
  const contentWidth = getMaximumLineLength(lines) * characterWidth;

  return Math.max(320, Math.ceil(48 + gutter + contentWidth));
}

export function computeCardMetrics(
  config: CodeCardConfig,
  lines: HighlightToken[][]
): CodeMetrics {
  const lineHeight = config.fontSize * 1.55;
  const numGutter = getNumberGutter(config, lines.length);
  const cardWidth = getCardWidth(config, lines, numGutter);
  const headerHeight = config.windowStyle !== 'none' ? 36 : 16;
  const cardHeight = Math.ceil(
    headerHeight + 10 + lines.length * lineHeight + 18
  );

  return {
    cardWidth,
    cardHeight,
    totalWidth: cardWidth + config.padding * 2,
    totalHeight: cardHeight + config.padding * 2,
    headerHeight,
    lineHeight,
    numGutter,
  };
}

function renderMacControls(): string {
  return [
    '<circle cx="20" cy="18" r="5.5" fill="#ff5f56"/>',
    '<circle cx="38" cy="18" r="5.5" fill="#ffbd2e"/>',
    '<circle cx="56" cy="18" r="5.5" fill="#27c93f"/>',
  ].join('');
}

function renderWindowsControls(
  cardWidth: number,
  color: string
): string {
  const x = cardWidth - 60;

  return [
    `<line x1="${x}" y1="18" x2="${x + 10}" y2="18" stroke="${color}" stroke-width="1.5"/>`,
    `<rect x="${x + 20}" y="13" width="10" height="10" fill="none" stroke="${color}" stroke-width="1.5"/>`,
    `<path d="M${x + 40} 13 L${x + 50} 23 M${x + 50} 13 L${x + 40} 23" stroke="${color}" stroke-width="1.5"/>`,
  ].join('');
}

function renderWindowTitle(
  config: CodeCardConfig,
  cardWidth: number,
  color: string
): string {
  if (!config.title || config.windowStyle === 'none') return '';

  return `<text x="${cardWidth / 2}" y="22" fill="${color}" font-family="system-ui, sans-serif" font-size="11" font-weight="600" text-anchor="middle">${escapeXml(config.title)}</text>`;
}

export function buildHeaderElements(
  config: CodeCardConfig,
  cardWidth: number
): string {
  const colors = getThemeColors(config.theme);
  const controls = config.windowStyle === 'mac'
    ? renderMacControls()
    : config.windowStyle === 'windows'
      ? renderWindowsControls(cardWidth, colors.titleColor)
      : '';

  return controls + renderWindowTitle(
    config,
    cardWidth,
    colors.titleColor
  );
}

function renderLineNumber(
  lineNumber: number,
  config: CodeCardConfig,
  color: string,
  y: number
): string {
  if (!config.showLineNumbers) return '';

  return `<text x="24" y="${y}" font-family="${FONT_FAMILY}" font-size="${config.fontSize}" fill="${color}" xml:space="preserve">${lineNumber}</text>`;
}

function renderToken(token: HighlightToken, config: CodeCardConfig): string {
  const colors = getThemeColors(config.theme);
  const color = colors[token.type] || colors.text;

  return `<tspan fill="${escapeXml(color)}">${escapeXml(token.text)}</tspan>`;
}

function renderCodeText(
  tokens: HighlightToken[],
  config: CodeCardConfig,
  x: number,
  y: number
): string {
  const content = tokens
    .map((token) => renderToken(token, config))
    .join('');

  return `<text x="${x}" y="${y}" font-family="${FONT_FAMILY}" font-size="${config.fontSize}" xml:space="preserve">${content}</text>`;
}

function renderSingleCodeLine(
  tokens: HighlightToken[],
  index: number,
  config: CodeCardConfig,
  metrics: CodeMetrics
): string {
  const y = metrics.headerHeight + 10 + (index + 1) * metrics.lineHeight;
  const codeX = 24 + metrics.numGutter;
  const colors = getThemeColors(config.theme);

  const number = renderLineNumber(index + 1, config, colors.lineNumber, y);
  const code = renderCodeText(tokens, config, codeX, y);

  return number + code;
}

export function renderCodeLines(
  config: CodeCardConfig,
  lines: HighlightToken[][],
  metrics: CodeMetrics
): string {
  return lines
    .map((tokens, index) =>
      renderSingleCodeLine(tokens, index, config, metrics)
    )
    .join('');
}
