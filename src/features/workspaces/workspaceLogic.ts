import { ALL_TOOLS } from '@/registry/tool-registry';

export interface WorkspaceSession {
  id: string;
  name: string;
  description: string;
  primaryToolSlug: string;
  secondaryToolSlug?: string;
  isSplit: boolean;
  isPreset?: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'toolnest_custom_workspaces';

export const CURATED_WORKSPACES: WorkspaceSession[] = [
  {
    id: 'preset_api_suite',
    name: 'Full-Stack API Suite',
    description: 'REST API testing client alongside interactive JWT Studio & decoder',
    primaryToolSlug: 'rest-api-client',
    secondaryToolSlug: 'jwt-studio',
    isSplit: true,
    isPreset: true,
    createdAt: 1700000000000,
  },
  {
    id: 'preset_svg_studio',
    name: 'Frontend Graphics Studio',
    description: 'Seamless repeating SVG background generator with instant SVG optimizer',
    primaryToolSlug: 'svg-patterns',
    secondaryToolSlug: 'svg-optimizer',
    isSplit: true,
    isPreset: true,
    createdAt: 1700000000000,
  },
  {
    id: 'preset_schema_model',
    name: 'Schema & Type Modeling',
    description: 'Convert SQL CREATE TABLE statements to TypeScript & Zod while formatting JSON',
    primaryToolSlug: 'sql-to-schema',
    secondaryToolSlug: 'json-to-typescript',
    isSplit: true,
    isPreset: true,
    createdAt: 1700000000000,
  },
  {
    id: 'preset_markdown_pub',
    name: 'Markdown Publishing Studio',
    description: 'Live GitHub-flavored Markdown preview with PDF and printable HTML export',
    primaryToolSlug: 'markdown-previewer',
    secondaryToolSlug: 'markdown-exporter',
    isSplit: true,
    isPreset: true,
    createdAt: 1700000000000,
  },
  {
    id: 'preset_data_analytics',
    name: 'Data Analytics & Chart Studio',
    description: 'Convert CSV to JSON datasets and immediately render SVG charts and statistics',
    primaryToolSlug: 'csv-json',
    secondaryToolSlug: 'data-chart',
    isSplit: true,
    isPreset: true,
    createdAt: 1700000000000,
  },
];

export function getCustomWorkspaces(): WorkspaceSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item && typeof item.id === 'string' && typeof item.primaryToolSlug === 'string'
    );
  } catch {
    return [];
  }
}

export function getAllWorkspaces(): WorkspaceSession[] {
  return [...CURATED_WORKSPACES, ...getCustomWorkspaces()];
}

export function saveCustomWorkspace(params: {
  name: string;
  description?: string;
  primaryToolSlug: string;
  secondaryToolSlug?: string;
  isSplit: boolean;
}): WorkspaceSession {
  const current = getCustomWorkspaces();
  const newWorkspace: WorkspaceSession = {
    id: `custom_ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: params.name.trim() || 'Custom Workspace',
    description: params.description?.trim() || 'Saved multi-tool session',
    primaryToolSlug: params.primaryToolSlug,
    secondaryToolSlug: params.secondaryToolSlug,
    isSplit: params.isSplit,
    isPreset: false,
    createdAt: Date.now(),
  };

  const updated = [newWorkspace, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }

  return newWorkspace;
}

export function deleteCustomWorkspace(id: string): boolean {
  const current = getCustomWorkspaces();
  const filtered = current.filter((w) => w.id !== id);
  if (filtered.length === current.length) return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function buildWorkspacePath(workspace: WorkspaceSession): string {
  const base = `/tools/${workspace.primaryToolSlug}`;
  if (workspace.isSplit && workspace.secondaryToolSlug) {
    return `${base}?split=${encodeURIComponent(workspace.secondaryToolSlug)}`;
  }
  return base;
}

export function isValidToolSlug(slug: string): boolean {
  return ALL_TOOLS.some((t) => t.slug === slug);
}
