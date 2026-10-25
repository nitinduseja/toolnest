import { diffLines, diffWords, Change } from 'diff';

export type DiffMode = 'lines' | 'words';

export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export function computeDiff(
  original: string,
  modified: string,
  mode: DiffMode = 'lines'
): DiffPart[] {
  if (!original && !modified) return [];

  const changes: Change[] =
    mode === 'words' ? diffWords(original, modified) : diffLines(original, modified);

  return changes.map((c) => ({
    value: c.value,
    added: Boolean(c.added),
    removed: Boolean(c.removed),
  }));
}
