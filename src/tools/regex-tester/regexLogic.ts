export interface RegexMatch {
  match: string;
  index: number;
  length: number;
  groups?: Record<string, string>;
}

export interface RegexEvaluationResult {
  isValid: boolean;
  error?: string;
  matches: RegexMatch[];
  matchCount: number;
}

export function testRegex(pattern: string, flags: string, testText: string): RegexEvaluationResult {
  if (!pattern) {
    return { isValid: true, matches: [], matchCount: 0 };
  }

  // Ensure pattern length is bounded for security
  if (pattern.length > 500) {
    return {
      isValid: false,
      error: 'Pattern exceeds maximum length of 500 characters',
      matches: [],
      matchCount: 0,
    };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (err: unknown) {
    return {
      isValid: false,
      error: err instanceof Error ? err.message : 'Invalid Regular Expression',
      matches: [],
      matchCount: 0,
    };
  }

  const matches: RegexMatch[] = [];
  const MAX_MATCHES = 500;

  if (flags.includes('g')) {
    let m: RegExpExecArray | null;
    let iterations = 0;
    while ((m = regex.exec(testText)) !== null && iterations < MAX_MATCHES) {
      iterations++;
      matches.push({
        match: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.groups ? { ...m.groups } : undefined,
      });

      // Prevent infinite loops on zero-length matches
      if (m[0].length === 0) {
        regex.lastIndex++;
      }
    }
  } else {
    const m = regex.exec(testText);
    if (m) {
      matches.push({
        match: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.groups ? { ...m.groups } : undefined,
      });
    }
  }

  return {
    isValid: true,
    matches,
    matchCount: matches.length,
  };
}
