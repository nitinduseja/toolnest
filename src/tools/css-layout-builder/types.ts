export type LayoutMode = 'flex' | 'grid';

export interface FlexConfig {
  direction: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent:
    'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';
  wrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap: number;
}

export interface GridConfig {
  columns: number;
  gap: number;
  justifyItems: 'stretch' | 'start' | 'center' | 'end';
  alignItems: 'stretch' | 'start' | 'center' | 'end';
}

export interface LayoutItem {
  id: string;
  label: string;
  flexGrow?: number;
  flexShrink?: number;
  colSpan?: number;
}

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  mode: LayoutMode;
  flex?: FlexConfig;
  grid?: GridConfig;
  itemsCount: number;
}
