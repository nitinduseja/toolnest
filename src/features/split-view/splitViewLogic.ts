import { ToolDefinition } from '@/registry/types';
import { ALL_TOOLS } from '@/registry/tool-registry';

const SECONDARY_TOOL_KEY = 'toolnest_split_secondary';
const SPLIT_RATIO_KEY = 'toolnest_split_ratio';

export const MIN_SPLIT_RATIO = 25;
export const MAX_SPLIT_RATIO = 75;
export const DEFAULT_SPLIT_RATIO = 50;

export function getStoredSecondarySlug(): string {
  try {
    const val = localStorage.getItem(SECONDARY_TOOL_KEY);
    if (val && ALL_TOOLS.some((t) => t.slug === val)) return val;
  } catch {
    // LocalStorage unavailable
  }
  return 'json-formatter';
}

export function saveStoredSecondarySlug(slug: string): void {
  try {
    localStorage.setItem(SECONDARY_TOOL_KEY, slug);
  } catch {
    // LocalStorage unavailable
  }
}

export function getAvailableSecondaryTools(currentToolId: string): ToolDefinition[] {
  return ALL_TOOLS.filter((t) => t.id !== currentToolId);
}

export function clampSplitRatio(ratio: number): number {
  if (!Number.isFinite(ratio)) return DEFAULT_SPLIT_RATIO;
  return Math.round(Math.min(MAX_SPLIT_RATIO, Math.max(MIN_SPLIT_RATIO, ratio)));
}

export function getStoredSplitRatio(): number {
  try {
    const raw = localStorage.getItem(SPLIT_RATIO_KEY);
    if (raw !== null) {
      return clampSplitRatio(Number(raw));
    }
  } catch {
    // LocalStorage unavailable
  }
  return DEFAULT_SPLIT_RATIO;
}

export function saveStoredSplitRatio(ratio: number): void {
  try {
    localStorage.setItem(SPLIT_RATIO_KEY, String(clampSplitRatio(ratio)));
  } catch {
    // LocalStorage unavailable
  }
}

export interface DragRatioParams {
  clientX: number;
  rectLeft: number;
  rectWidth: number;
}

export function calculateSplitRatioFromDrag(params: DragRatioParams): number {
  const { clientX, rectLeft, rectWidth } = params;
  if (rectWidth <= 0) return DEFAULT_SPLIT_RATIO;
  const pct = ((clientX - rectLeft) / rectWidth) * 100;
  return clampSplitRatio(pct);
}
