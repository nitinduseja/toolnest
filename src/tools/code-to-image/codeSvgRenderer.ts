import { CodeCardConfig, HighlightToken, CodeMetrics, ThemeColors } from './types';
import { getThemeColors, getBackgroundDefs } from './themeConfig';
import { tokenizeCode } from './codeTokenizer';

const FONT_FAMILY = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

export function sanitizeCardConfig(config: CodeCardConfig): CodeCardConfig {
  const fontSize = Number.isFinite(config.fontSize) && config.fontSize > 0 ? config.fontSize : 14;
  const padding = Number.isFinite(config.padding) && config.padding >= 0 ? config.padding : 32;
  const borderRadius =
    Number.isFinite(config.borderRadius) && config.borderRadius >= 0 ? config.borderRadius : 12;

  return {
    ...config,
    fontSize: Math.min(48, Math.max(8, fontSize)),
    padding: Math.min(128, Math.max(0, padding)),
    borderRadius: Math.min(64, Math.max(0, borderRadius)),
    code: typeof config.code === 'string' ? config.code : '',
    title: typeof config.title === 'string' ? config.title : '',
    showLineNumbers: Boolean(config.showLineNumbers),
  };
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function computeCardMetrics(config: CodeCardConfig, lines: HighlightToken[][]): CodeMetrics {
  const safe = sanitizeCardConfig(config);
  const lineHeight = safe.fontSize * 1.55;
  const numGutter = safe.showLineNumbers ? Math.max(36, String(lines.length).length * 10 + 20) : 0;
  const maxLen = Math.max(
    25,
    ...lines.map((line) => line.reduce((sum, t) => sum + t.text.length, 0))
  );
  const contentWidth = maxLen * (safe.fontSize * 0.62);
  const cardWidth = Math.max(320, Math.ceil(48 + numGutter + contentWidth));
  const headerHeight = safe.windowStyle !== 'none' ? 36 : 16;
  const cardHeight = Math.ceil(headerHeight + 10 + lines.length * lineHeight + 18);

  return {
    cardWidth,
    cardHeight,
    totalWidth: cardWidth + safe.padding * 2,
    totalHeight: cardHeight + safe.padding * 2,
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

function renderWindowsControls(cardWidth: number, color: string): string {
  const x = cardWidth - 60;
  return [
    `<line x1="${x}" y1="18" x2="${x + 10}" y2="18" stroke="${color}" stroke-width="1.5"/>`,
    `<rect x="${x + 20}" y="13" width="10" height="10" fill="none" stroke="${color}" stroke-width="1.5"/>`,
    `<path d="M${x + 40} 13 L${x + 50} 23 M${x + 50} 13 L${x + 40} 23" stroke="${color}" stroke-width="1.5"/>`,
  ].join('');
}

function renderWindowTitle(title: string, cardWidth: number, color: string): string {
  if (!title) return '';
  return `<text x="${cardWidth / 2}" y="22" fill="${color}" font-family="system-ui, sans-serif" font-size="11" font-weight="600" text-anchor="middle">${escapeXml(title)}</text>`;
}

export function buildHeaderElements(config: CodeCardConfig, cardWidth: number): string {
  const colors = getThemeColors(config.theme);
  const controls =
    config.windowStyle === 'mac'
      ? renderMacControls()
      : config.windowStyle === 'windows'
        ? renderWindowsControls(cardWidth, colors.titleColor)
        : '';
  const title =
    config.windowStyle !== 'none'
      ? renderWindowTitle(config.title, cardWidth, colors.titleColor)
      : '';
  return controls + title;
}

export function renderLineNumber(lineNumber: number, config: CodeCardConfig, y: number): string {
  if (!config.showLineNumbers) return '';
  const color = getThemeColors(config.theme).lineNumber;
  return `<text x="24" y="${y}" font-family="${FONT_FAMILY}" font-size="${config.fontSize}" fill="${color}" xml:space="preserve">${lineNumber}</text>`;
}

interface LineContext {
  index: number;
  config: CodeCardConfig;
  metrics: CodeMetrics;
}

function renderSingleLine(tokens: HighlightToken[], ctx: LineContext, colors: ThemeColors): string {
  const { index, config, metrics } = ctx;
  const y = metrics.headerHeight + 10 + (index + 1) * metrics.lineHeight;
  const num = config.showLineNumbers ? renderLineNumber(index + 1, config, y) : '';
  const codeX = 24 + (config.showLineNumbers ? metrics.numGutter : 0);
  const content = tokens
    .map((t) => {
      const color = colors[t.type] || colors.text;
      return `<tspan fill="${escapeXml(color)}">${escapeXml(t.text)}</tspan>`;
    })
    .join('');
  const text = `<text x="${codeX}" y="${y}" font-family="${FONT_FAMILY}" font-size="${config.fontSize}" xml:space="preserve">${content}</text>`;
  return num + text;
}

export function renderCodeLines(
  config: CodeCardConfig,
  lines: HighlightToken[][],
  metrics: CodeMetrics
): string {
  const colors = getThemeColors(config.theme);
  return lines
    .map((tokens, index) => renderSingleLine(tokens, { index, config, metrics }, colors))
    .join('');
}

export function generateCardSvg(config: CodeCardConfig): string {
  const safe = sanitizeCardConfig(config);
  const colors = getThemeColors(safe.theme);
  const lines = tokenizeCode(safe.code, safe.language);
  const bg = getBackgroundDefs(safe.background);
  const metrics = computeCardMetrics(safe, lines);
  const header = buildHeaderElements(safe, metrics.cardWidth);
  const code = renderCodeLines(safe, lines, metrics);

  return `<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 ${metrics.totalWidth} ${metrics.totalHeight}"
    width="${metrics.totalWidth}"
    height="${metrics.totalHeight}">
    <defs>
      ${bg.defs}
      <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow
          dx="0"
          dy="16"
          stdDeviation="20"
          flood-color="#000000"
          flood-opacity="0.45"
        />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="${bg.fill}"/>
    <g transform="translate(${safe.padding}, ${safe.padding})"
       filter="url(#shadow)">
      <rect
        width="${metrics.cardWidth}"
        height="${metrics.cardHeight}"
        rx="${safe.borderRadius}"
        fill="${colors.background}"
      />
      ${header}
      ${code}
    </g>
  </svg>`;
}
