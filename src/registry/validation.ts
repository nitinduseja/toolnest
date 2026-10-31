import { ToolDefinition } from './types';
import { CATEGORIES } from './categories';

export function validateRegistry(tools: ToolDefinition[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const validCategoryIds = new Set(CATEGORIES.map((c) => c.id));

  for (const tool of tools) {
    if (seenIds.has(tool.id)) {
      errors.push(`Duplicate tool id: "${tool.id}"`);
    }
    seenIds.add(tool.id);

    if (seenSlugs.has(tool.slug)) {
      errors.push(`Duplicate tool slug: "${tool.slug}"`);
    }
    seenSlugs.add(tool.slug);

    if (!validCategoryIds.has(tool.category)) {
      errors.push(`Tool "${tool.id}" references invalid category: "${tool.category}"`);
    }

    if (!tool.name || !tool.description || !tool.iconName) {
      errors.push(`Tool "${tool.id}" is missing required metadata.`);
    }
  }

  return { valid: errors.length === 0, errors };
}
