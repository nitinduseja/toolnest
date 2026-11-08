import { FlexConfig, GridConfig, LayoutPreset } from './types';

export function generateFlexCss(config: FlexConfig): string {
  return [
    'display: flex;',
    `flex-direction: ${config.direction};`,
    `justify-content: ${config.justifyContent};`,
    `align-items: ${config.alignItems};`,
    `flex-wrap: ${config.wrap};`,
    `gap: ${config.gap}px;`,
  ].join('\n');
}

export function generateFlexTailwind(config: FlexConfig): string {
  const dirMap = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse',
  };

  const justifyMap = {
    'flex-start': 'justify-start',
    center: 'justify-center',
    'flex-end': 'justify-end',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly',
  };

  const alignMap = {
    stretch: 'items-stretch',
    'flex-start': 'items-start',
    center: 'items-center',
    'flex-end': 'items-end',
    baseline: 'items-baseline',
  };

  const wrapMap = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };

  return [
    'flex',
    dirMap[config.direction],
    justifyMap[config.justifyContent],
    alignMap[config.alignItems],
    wrapMap[config.wrap],
    `gap-[${config.gap}px]`,
  ].join(' ');
}

export function generateGridCss(config: GridConfig): string {
  return [
    'display: grid;',
    `grid-template-columns: repeat(${config.columns}, minmax(0, 1fr));`,
    `gap: ${config.gap}px;`,
    `justify-items: ${config.justifyItems};`,
    `align-items: ${config.alignItems};`,
  ].join('\n');
}

export function generateGridTailwind(config: GridConfig): string {
  const justifyMap = {
    stretch: 'justify-items-stretch',
    start: 'justify-items-start',
    center: 'justify-items-center',
    end: 'justify-items-end',
  };

  const alignMap = {
    stretch: 'items-stretch',
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  };

  return [
    'grid',
    `grid-cols-${config.columns}`,
    justifyMap[config.justifyItems],
    alignMap[config.alignItems],
    `gap-[${config.gap}px]`,
  ].join(' ');
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'centered-hero',
    name: 'Centered Hero Banner',
    description: 'Flex column perfectly centered vertically and horizontally',
    mode: 'flex',
    flex: {
      direction: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      wrap: 'nowrap',
      gap: 16,
    },
    itemsCount: 3,
  },
  {
    id: 'navbar-space-between',
    name: 'Sticky Navigation Bar',
    description: 'Row with elements spaced across ends and vertically centered',
    mode: 'flex',
    flex: {
      direction: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      wrap: 'nowrap',
      gap: 24,
    },
    itemsCount: 3,
  },
  {
    id: 'responsive-card-grid',
    name: '3-Column Card Grid',
    description: 'Evenly spaced 3-column responsive grid layout',
    mode: 'grid',
    grid: {
      columns: 3,
      gap: 16,
      justifyItems: 'stretch',
      alignItems: 'stretch',
    },
    itemsCount: 6,
  },
  {
    id: 'dashboard-grid',
    name: '4-Column Metric Grid',
    description: 'Dashboard KPI metric cards evenly distributed in 4 columns',
    mode: 'grid',
    grid: {
      columns: 4,
      gap: 16,
      justifyItems: 'stretch',
      alignItems: 'stretch',
    },
    itemsCount: 4,
  },
];
