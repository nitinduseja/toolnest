export interface FormatJsonOptions {
  indent?: number | 'tab';
}

export interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  line?: number;
  column?: number;
  data?: unknown;
}

export function validateJson(raw: string): JsonValidationResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { isValid: true, data: undefined };
  }

  try {
    const data = JSON.parse(trimmed);
    return { isValid: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON';
    const match = message.match(/line (\d+) column (\d+)/i) || message.match(/position (\d+)/i);
    let line: number | undefined;
    let column: number | undefined;

    if (match) {
      if (match[2]) {
        line = parseInt(match[1], 10);
        column = parseInt(match[2], 10);
      } else if (match[1]) {
        const pos = parseInt(match[1], 10);
        const linesUpTo = raw.substring(0, pos).split('\n');
        line = linesUpTo.length;
        column = linesUpTo[linesUpTo.length - 1].length + 1;
      }
    }

    return { isValid: false, error: message, line, column };
  }
}

export function formatJson(raw: string, options?: FormatJsonOptions): string {
  const validation = validateJson(raw);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Syntax error in JSON');
  }
  if (validation.data === undefined) return '';

  const space = options?.indent === 'tab' ? '\t' : (options?.indent ?? 2);
  return JSON.stringify(validation.data, null, space);
}

export function minifyJson(raw: string): string {
  const validation = validateJson(raw);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Syntax error in JSON');
  }
  if (validation.data === undefined) return '';
  return JSON.stringify(validation.data);
}
