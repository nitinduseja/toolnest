
import {
  CodeCardConfig,
  HighlightToken,
} from './types';

import {
  getThemeColors,
} from './themeConfig';

import { escapeXml } from './codeImageLogic';

interface CodeMetrics {
  cardWidth: number;
  cardHeight: number;
  totalWidth: number;
  totalHeight: number;
  headerHeight: number;
  lineHeight: number;
  numGutter: number;
}

interface CardDimensions {
  width: number;
  height: number;
  lineHeight: number;
  headerHeight: number;
  gutter: number;
}

interface LinePosition {
  y: number;
  value: number;
}

function calculateLineWidth(
  lines: HighlightToken[][],
  fontSize: number
): number {
  const maxLength = Math.max(
    25,
    ...lines.map((line) =>
      line.reduce((total, token) => total + token.text.length, 0)
    )
  );

  return Math.ceil(maxLength * fontSize * 0.62);
}

function calculateGutter(
  config: CodeCardConfig,
  lines: HighlightToken[][]
): number {
  if (!config.showLineNumbers) return 0;

  return Math.max(
    36,
    String(lines.length).length * 10 + 20
  );
}

function calculateDimensions(
  config: CodeCardConfig,
  lines: HighlightToken[][]
): CardDimensions {
  const lineHeight = config.fontSize * 1.55;
  const headerHeight = config.windowStyle !== 'none' ? 36 : 16;
  const gutter = calculateGutter(config, lines);

  const width = Math.max(
    320,
    48 + gutter + calculateLineWidth(lines, config.fontSize)
  );

  const height = Math.ceil(
    headerHeight + 10 + lines.length * lineHeight + 18
  );

  return {
    width,
    height,
    lineHeight,
    headerHeight,
    gutter,
  };
}

export function computeCardMetrics(
  config: CodeCardConfig,
  lines: HighlightToken[][]
): CodeMetrics {
  const dimensions = calculateDimensions(config, lines);

  return {
    cardWidth: dimensions.width,
    cardHeight: dimensions.height,
    totalWidth: dimensions.width + config.padding * 2,
    totalHeight: dimensions.height + config.padding * 2,
    headerHeight: dimensions.headerHeight,
    lineHeight: dimensions.lineHeight,
    numGutter: dimensions.gutter,
  };
}

export function buildHeaderElements(
  config: CodeCardConfig,
  cardWidth: number
): string {
  const colors = getThemeColors(config.theme);
  const elements: string[] = [];

  if (config.windowStyle === 'mac') {
    elements.push(
      '<circle cx="20" cy="18" r="5.5" fill="#ff5f56"/>' +
      '<circle cx="38" cy="18" r="5.5" fill="#ffbd2e"/>' +
      '<circle cx="56" cy="18" r="5.5" fill="#27c93f"/>'
    );
  }

  if (config.windowStyle === 'windows') {
    elements.push(
      buildWindowsControls(cardWidth, colors.titleColor)
    );
  }

  if (config.title && config.windowStyle !== 'none') {
    elements.push(
      buildWindowTitle(config.title, cardWidth, colors.titleColor)
    );
  }

  return elements.join('');
}

function buildWindowsControls(
  cardWidth: number,
  color: string
): string {
  const x = cardWidth - 60;

  return (
    `<line x1="${x}" y1="18" x2="${x + 10}" y2="18" stroke="${color}" stroke-width="1.5"/>` +
    `<rect x="${x + 20}" y="13" width="10" height="10" fill="none" stroke="${color}" stroke-width="1.5"/>` +
    `<path d="M${x + 40} 13 L${x + 50} 23 M${x + 50} 13 L${x + 40} 23" stroke="${color}" stroke-width="1.5"/>`
  );
}

function buildWindowTitle(
  title: string,
  cardWidth: number,
  color: string
): string {
  return (
    `<text x="${cardWidth / 2}" y="22" fill="${color}" ` +
    `font-family="system-ui, sans-serif" font-size="11" ` +
    `font-weight="600" text-anchor="middle">` +
    `${escapeXml(title)}</text>`
  );
}

function renderLineNumber(
  position: LinePosition,
  fontSize: number,
  color: string
): string {
  return `
    <text
      x="24"
      y="${position.y}"
      font-family="ui-monospace, monospace"
      font-size="${fontSize}"
      fill="${color}"
    >${position.value}</text>
  `;
}

function renderCodeTokens(
  tokens: HighlightToken[],
  colors: ReturnType<typeof getThemeColors>
): string {
  return tokens.map((token) => {
    const color = colors[token.type] || colors.text;

    return `<tspan fill="${escapeXml(color)}">${escapeXml(token.text)}</tspan>`;
  }).join('');
}

function renderCodeText(
  content: string,
  x: number,
  y: number,
  fontSize: number
): string {
  return `
    <text
      x="${x}"
      y="${y}"
      font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
      font-size="${fontSize}"
      xml:space="preserve"
    >${content}</text>
  `;
}

export function renderCodeLines(
  config: CodeCardConfig,
  lines: HighlightToken[][],
  metrics: CodeMetrics
): string {
  const colors = getThemeColors(config.theme);

  return lines.map((tokens, index) => {
    const y = metrics.headerHeight + 10 + (index + 1) * metrics.lineHeight;

    const lineNumber = renderLineNumber(
      { y, value: index + 1 },
      config.fontSize,
      colors.lineNumber
    );

    const codeX = 24 + (
      config.showLineNumbers ? metrics.numGutter : 0
    );

    const code = renderCodeText(
      renderCodeTokens(tokens, colors),
      codeX,
      y,
      config.fontSize
    );

    return (config.showLineNumbers ? lineNumber : '') + code;
  }).join('');
}
