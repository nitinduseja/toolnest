import { ToolDefinition } from '@/registry/types';
import { ALL_TOOLS } from '@/registry/tool-registry';

const SECONDARY_TOOL_KEY = 'toolnest_split_secondary';

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
