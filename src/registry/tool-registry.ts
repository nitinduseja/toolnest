import { ToolDefinition } from './types';
import { CORE_TOOLS } from './core-tools';
import { EXPANDED_TOOLS } from './expanded-tools';
import { validateRegistry as validateTools } from './validation';

export const ALL_TOOLS: ToolDefinition[] = [...CORE_TOOLS, ...EXPANDED_TOOLS];

export const TOOL_MAP = new Map(ALL_TOOLS.map((tool) => [tool.id, tool]));
export const TOOL_SLUG_MAP = new Map(ALL_TOOLS.map((tool) => [tool.slug, tool]));

/**
 * Validates registry integrity. Throws if duplicate IDs/slugs or invalid categories exist.
 */
export function validateRegistry(): { valid: boolean; errors: string[] } {
  return validateTools(ALL_TOOLS);
}
