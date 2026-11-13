import { CodeCardConfig } from './types';
import {
  getThemeColors,
  getBackgroundDefs,
} from './themeConfig';
import { tokenizeCode } from './codeTokenizer';
import {
  computeCardMetrics,
  buildHeaderElements,
  renderCodeLines,
} from './codeSvgRenderer';

export function generateCardSvg(
  config: CodeCardConfig
): string {
  const colors = getThemeColors(config.theme);
  const lines = tokenizeCode(config.code, config.language);
  const background = getBackgroundDefs(config.background);
  const metrics = computeCardMetrics(config, lines);

  const header = buildHeaderElements(config, metrics.cardWidth);
  const code = renderCodeLines(config, lines, metrics);

  return `<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 ${metrics.totalWidth} ${metrics.totalHeight}"
    width="${metrics.totalWidth}"
    height="${metrics.totalHeight}">
    <defs>
      ${background.defs}
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
    <rect width="100%" height="100%" fill="${background.fill}"/>
    <g transform="translate(${config.padding}, ${config.padding})"
       filter="url(#shadow)">
      <rect
        width="${metrics.cardWidth}"
        height="${metrics.cardHeight}"
        rx="${config.borderRadius}"
        fill="${colors.background}"
      />
      ${header}
      ${code}
    </g>
  </svg>`;
}