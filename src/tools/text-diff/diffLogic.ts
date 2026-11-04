import { diffLines, diffWords, Change } from 'diff';

export type DiffMode = 'lines' | 'words';

export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export interface DiffOptions {
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
}

export interface SideBySideLine {
  left?: {
    lineNum: number;
    text: string;
    type: 'same' | 'removed';
  };
  right?: {
    lineNum: number;
    text: string;
    type: 'same' | 'added';
  };
}

export interface ComputeDiffOptions extends DiffOptions {
  mode?: DiffMode;
}

export function computeDiff(
  original: string,
  modified: string,
  modeOrOptions?: DiffMode | ComputeDiffOptions
): DiffPart[] {
  if (!original && !modified) return [];

  const mode = typeof modeOrOptions === 'string' ? modeOrOptions : (modeOrOptions?.mode ?? 'lines');
  const options = typeof modeOrOptions === 'object' ? modeOrOptions : undefined;

  const changes: Change[] =
    mode === 'words'
      ? diffWords(original, modified, options)
      : diffLines(original, modified, options);

  return changes.map((c) => ({
    value: c.value,
    added: Boolean(c.added),
    removed: Boolean(c.removed),
  }));
}

export function computeSideBySideDiff(
  original: string,
  modified: string,
  options?: DiffOptions
): SideBySideLine[] {
  if (!original && !modified) return [];

  const changes: Change[] = diffLines(original, modified, options);
  const rows: SideBySideLine[] = [];

  let leftLine = 0;
  let rightLine = 0;

  let pendingRemoved: { lineNum: number; text: string }[] = [];
  let pendingAdded: { lineNum: number; text: string }[] = [];

  const flushPending = () => {
    const max = Math.max(pendingRemoved.length, pendingAdded.length);
    for (let i = 0; i < max; i++) {
      const rem = pendingRemoved[i];
      const add = pendingAdded[i];
      rows.push({
        left: rem ? { lineNum: rem.lineNum, text: rem.text, type: 'removed' } : undefined,
        right: add ? { lineNum: add.lineNum, text: add.text, type: 'added' } : undefined,
      });
    }
    pendingRemoved = [];
    pendingAdded = [];
  };

  const splitLines = (str: string) => {
    const lines = str.split('\n');
    if (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }
    return lines;
  };

  for (const change of changes) {
    const lines = splitLines(change.value);

    if (change.removed) {
      for (const line of lines) {
        leftLine++;
        pendingRemoved.push({ lineNum: leftLine, text: line });
      }
    } else if (change.added) {
      for (const line of lines) {
        rightLine++;
        pendingAdded.push({ lineNum: rightLine, text: line });
      }
    } else {
      flushPending();
      for (const line of lines) {
        leftLine++;
        rightLine++;
        rows.push({
          left: { lineNum: leftLine, text: line, type: 'same' },
          right: { lineNum: rightLine, text: line, type: 'same' },
        });
      }
    }
  }

  flushPending();
  return rows;
}
