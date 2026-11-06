import { diffLines, diffWords, createPatch, Change } from 'diff';

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

export interface WordDiffSegment {
  text: string;
  changed: boolean;
}

export interface SideBySideLine {
  left?: {
    lineNum: number;
    text: string;
    type: 'same' | 'removed';
    words?: WordDiffSegment[];
  };
  right?: {
    lineNum: number;
    text: string;
    type: 'same' | 'added';
    words?: WordDiffSegment[];
  };
  isFoldMarker?: boolean;
  foldedCount?: number;
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

export function computeInlineWordDiff(
  leftText: string,
  rightText: string
): { leftWords: WordDiffSegment[]; rightWords: WordDiffSegment[] } {
  if (!leftText || !rightText) {
    return {
      leftWords: [{ text: leftText, changed: Boolean(leftText) }],
      rightWords: [{ text: rightText, changed: Boolean(rightText) }],
    };
  }

  const wordChanges = diffWords(leftText, rightText);
  const leftWords: WordDiffSegment[] = [];
  const rightWords: WordDiffSegment[] = [];

  for (const part of wordChanges) {
    if (part.removed) {
      leftWords.push({ text: part.value, changed: true });
    } else if (part.added) {
      rightWords.push({ text: part.value, changed: true });
    } else {
      leftWords.push({ text: part.value, changed: false });
      rightWords.push({ text: part.value, changed: false });
    }
  }

  return { leftWords, rightWords };
}

export function computeSideBySideDiff(
  original: string,
  modified: string,
  options?: DiffOptions & { enableWordDiff?: boolean }
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

      let leftWords: WordDiffSegment[] | undefined;
      let rightWords: WordDiffSegment[] | undefined;

      if (options?.enableWordDiff && rem && add) {
        const inlined = computeInlineWordDiff(rem.text, add.text);
        leftWords = inlined.leftWords;
        rightWords = inlined.rightWords;
      }

      rows.push({
        left: rem
          ? { lineNum: rem.lineNum, text: rem.text, type: 'removed', words: leftWords }
          : undefined,
        right: add
          ? { lineNum: add.lineNum, text: add.text, type: 'added', words: rightWords }
          : undefined,
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

export function generateUnifiedPatch(
  original: string,
  modified: string,
  fileName = 'file.txt'
): string {
  return createPatch(fileName, original, modified, 'original', 'modified');
}

export function collapseUnchangedRows(rows: SideBySideLine[], contextSize = 3): SideBySideLine[] {
  const result: SideBySideLine[] = [];
  let i = 0;

  while (i < rows.length) {
    if (rows[i].left?.type === 'same' && rows[i].right?.type === 'same') {
      let runEnd = i;
      while (
        runEnd < rows.length &&
        rows[runEnd].left?.type === 'same' &&
        rows[runEnd].right?.type === 'same'
      ) {
        runEnd++;
      }
      const count = runEnd - i;

      if (count > contextSize * 2 + 1) {
        for (let j = 0; j < contextSize; j++) {
          result.push(rows[i + j]);
        }
        const foldedCount = count - contextSize * 2;
        result.push({
          isFoldMarker: true,
          foldedCount,
        });
        for (let j = runEnd - contextSize; j < runEnd; j++) {
          result.push(rows[j]);
        }
      } else {
        for (let j = i; j < runEnd; j++) {
          result.push(rows[j]);
        }
      }
      i = runEnd;
    } else {
      result.push(rows[i]);
      i++;
    }
  }

  return result;
}
