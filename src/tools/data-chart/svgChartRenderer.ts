import { AggregatedPoint, ChartConfig } from './types';

interface ChartDims {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const DIMS: ChartDims = {
  width: 800,
  height: 450,
  top: 50,
  right: 40,
  bottom: 60,
  left: 70,
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderGrid(dims: ChartDims, maxVal: number): string {
  const plotW = dims.width - dims.left - dims.right;
  const plotH = dims.height - dims.top - dims.bottom;
  const lines: string[] = [];

  for (let i = 0; i <= 4; i += 1) {
    const y = dims.top + (plotH / 4) * i;
    const val = Math.round(maxVal - (maxVal / 4) * i);
    lines.push(
      `<line x1="${dims.left}" y1="${y}" x2="${dims.left + plotW}" y2="${y}" stroke="#334155" stroke-dasharray="3 3" opacity="0.6" />`
    );
    lines.push(
      `<text x="${dims.left - 10}" y="${y + 4}" fill="#94A3B8" font-size="11" font-family="sans-serif" text-anchor="end">${val.toLocaleString()}</text>`
    );
  }
  return lines.join('\n');
}

function renderBarChart(points: AggregatedPoint[], dims: ChartDims): string {
  const plotW = dims.width - dims.left - dims.right;
  const plotH = dims.height - dims.top - dims.bottom;
  const maxVal = Math.max(1, ...points.map((p) => p.value));
  const barW = Math.max(12, Math.min(60, (plotW / points.length) * 0.65));
  const step = plotW / points.length;

  const elements: string[] = [];
  points.forEach((p, idx) => {
    const barH = (p.value / maxVal) * plotH;
    const x = dims.left + step * idx + (step - barW) / 2;
    const y = dims.top + (plotH - barH);

    elements.push(
      `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${p.color}" opacity="0.9">
        <title>${escapeXml(p.label)}: ${p.formattedValue}</title>
      </rect>`
    );
    elements.push(
      `<text x="${x + barW / 2}" y="${dims.height - dims.bottom + 18}" fill="#94A3B8" font-size="11" font-family="sans-serif" text-anchor="middle">${escapeXml(p.label.slice(0, 10))}</text>`
    );
  });

  return elements.join('\n');
}

function renderLineOrArea(points: AggregatedPoint[], dims: ChartDims, isArea: boolean): string {
  const plotW = dims.width - dims.left - dims.right;
  const plotH = dims.height - dims.top - dims.bottom;
  const maxVal = Math.max(1, ...points.map((p) => p.value));
  const step = points.length > 1 ? plotW / (points.length - 1) : plotW / 2;

  const coords = points.map((p, idx) => ({
    x: dims.left + (points.length === 1 ? plotW / 2 : step * idx),
    y: dims.top + (plotH - (p.value / maxVal) * plotH),
    point: p,
  }));

  const lineD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const elements: string[] = [];

  if (isArea && coords.length > 0) {
    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;
    const baseY = dims.top + plotH;
    const areaD = `${lineD} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
    elements.push(
      `<path d="${areaD}" fill="${points[0]?.color || '#6366F1'}" fill-opacity="0.25" />`
    );
  }

  elements.push(
    `<path d="${lineD}" fill="none" stroke="${points[0]?.color || '#6366F1'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`
  );

  coords.forEach((c) => {
    elements.push(
      `<circle cx="${c.x}" cy="${c.y}" r="4" fill="${c.point.color}" stroke="#0F172A" stroke-width="2">
        <title>${escapeXml(c.point.label)}: ${c.point.formattedValue}</title>
      </circle>`
    );
    elements.push(
      `<text x="${c.x}" y="${dims.height - dims.bottom + 18}" fill="#94A3B8" font-size="11" font-family="sans-serif" text-anchor="middle">${escapeXml(c.point.label.slice(0, 8))}</text>`
    );
  });

  return elements.join('\n');
}

function renderDonutSlice(startAngle: number, endAngle: number, color: string): string {
  const cx = 300;
  const cy = 230;
  const r = 130;
  const ir = 65;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  const ix1 = cx + ir * Math.cos(endAngle);
  const iy1 = cy + ir * Math.sin(endAngle);
  const ix2 = cx + ir * Math.cos(startAngle);
  const iy2 = cy + ir * Math.sin(startAngle);

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${ir} ${ir} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

  return `<path d="${d}" fill="${color}" stroke="#0F172A" stroke-width="2" />`;
}

function renderDonutChart(points: AggregatedPoint[]): string {
  const slices: string[] = [];
  const legend: string[] = [];
  let currentAngle = -Math.PI / 2;

  points.forEach((p, idx) => {
    const sliceAngle = (p.percent / 100) * (2 * Math.PI);
    const endAngle = currentAngle + sliceAngle;
    slices.push(renderDonutSlice(currentAngle, endAngle, p.color));
    currentAngle = endAngle;

    if (idx < 8) {
      const legY = 110 + idx * 26;
      legend.push(
        `<rect x="520" y="${legY}" width="12" height="12" rx="3" fill="${p.color}" />
         <text x="540" y="${legY + 10}" fill="#E2E8F0" font-size="12" font-family="sans-serif">${escapeXml(p.label)} (${p.percent}%)</text>`
      );
    }
  });

  return `<g>${slices.join('\n')}</g><g>${legend.join('\n')}</g>`;
}

export function generateChartSvg(points: AggregatedPoint[], config: ChartConfig): string {
  const maxVal = Math.max(1, ...points.map((p) => p.value));
  const title = escapeXml(config.title || `${config.metric} by ${config.dimension}`);

  let content = '';
  if (config.chartType === 'bar') {
    content = `${config.showGrid ? renderGrid(DIMS, maxVal) : ''}${renderBarChart(points, DIMS)}`;
  } else if (config.chartType === 'line') {
    content = `${config.showGrid ? renderGrid(DIMS, maxVal) : ''}${renderLineOrArea(points, DIMS, false)}`;
  } else if (config.chartType === 'area') {
    content = `${config.showGrid ? renderGrid(DIMS, maxVal) : ''}${renderLineOrArea(points, DIMS, true)}`;
  } else if (config.chartType === 'donut') {
    content = renderDonutChart(points);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${DIMS.width} ${DIMS.height}" width="100%" height="100%">
    <rect width="${DIMS.width}" height="${DIMS.height}" fill="#0F172A" rx="12" />
    <text x="${DIMS.left}" y="32" fill="#F8FAFC" font-size="16" font-weight="bold" font-family="sans-serif">${title}</text>
    ${content}
  </svg>`;
}
