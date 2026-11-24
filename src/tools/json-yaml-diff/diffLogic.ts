import * as yaml from 'js-yaml';
import { DiffEntry, JsonPatchOperation, DiffSummary } from './types';

export function parseStructuredData(
  input: string,
  format: 'json' | 'yaml'
): { data: unknown; error?: string } {
  if (!input.trim()) return { data: null };
  try {
    if (format === 'json') {
      return { data: JSON.parse(input) };
    }
    return { data: yaml.load(input) };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Invalid syntax' };
  }
}

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function diffProperties(
  left: Record<string, unknown>,
  right: Record<string, unknown>,
  basePath: string
): DiffEntry[] {
  const diffs: DiffEntry[] = [];
  const allKeys = Array.from(new Set([...Object.keys(left), ...Object.keys(right)]));

  for (const key of allKeys) {
    const curPath = `${basePath}/${key}`;
    if (!(key in right)) {
      diffs.push({ path: curPath, op: 'remove', oldValue: left[key] });
    } else if (!(key in left)) {
      diffs.push({ path: curPath, op: 'add', newValue: right[key] });
    } else {
      diffs.push(...computeStructuralDiff(left[key], right[key], curPath));
    }
  }
  return diffs;
}

export function computeStructuralDiff(left: unknown, right: unknown, basePath = ''): DiffEntry[] {
  if (left === right) return [];

  if (isRecord(left) && isRecord(right)) {
    return diffProperties(left, right, basePath);
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const diffs: DiffEntry[] = [];
    const maxLen = Math.max(left.length, right.length);
    for (let i = 0; i < maxLen; i++) {
      const curPath = `${basePath}/${i}`;
      if (i >= right.length) {
        diffs.push({ path: curPath, op: 'remove', oldValue: left[i] });
      } else if (i >= left.length) {
        diffs.push({ path: curPath, op: 'add', newValue: right[i] });
      } else {
        diffs.push(...computeStructuralDiff(left[i], right[i], curPath));
      }
    }
    return diffs;
  }

  return [{ path: basePath || '/', op: 'replace', oldValue: left, newValue: right }];
}

export function calculateDiffSummary(entries: DiffEntry[]): DiffSummary {
  let added = 0;
  let removed = 0;
  let replaced = 0;

  for (const e of entries) {
    if (e.op === 'add') added++;
    else if (e.op === 'remove') removed++;
    else if (e.op === 'replace') replaced++;
  }

  return { added, removed, replaced, total: entries.length };
}

export function generateJsonPatch(entries: DiffEntry[]): JsonPatchOperation[] {
  return entries.map((e) => {
    if (e.op === 'remove') {
      return { op: 'remove', path: e.path };
    }
    return {
      op: e.op,
      path: e.path,
      value: e.newValue,
    };
  });
}
