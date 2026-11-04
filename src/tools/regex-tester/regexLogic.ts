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

export interface HighlightSegment {
  text: string;
  isMatch: boolean;
  matchIndex?: number;
}

export interface RegexPreset {
  name: string;
  pattern: string;
  flags: string;
  description: string;
  example: string;
}

export const COMMON_REGEX_PRESETS: RegexPreset[] = [
  {
    name: 'Email Address',
    pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b',
    flags: 'gi',
    description: 'Matches standard RFC-like email addresses',
    example: 'Contact dev@toolnest.org or support@example.com for help.',
  },
  {
    name: 'URL (HTTP / HTTPS)',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)',
    flags: 'gi',
    description: 'Matches standard web URLs including query parameters',
    example: 'Visit https://toolnest.dev or http://localhost:5173/tools today.',
  },
  {
    name: 'IPv4 Address',
    pattern: '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    description: 'Matches valid dotted-decimal IPv4 addresses (0.0.0.0 to 255.255.255.255)',
    example: 'DNS servers at 192.168.1.1 and 8.8.8.8 configured.',
  },
  {
    name: 'ISO 8601 Date',
    pattern: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b',
    flags: 'g',
    description: 'Matches YYYY-MM-DD formatted calendar dates',
    example: 'Created on 2026-11-04 and expires on 2027-01-15.',
  },
  {
    name: 'Hex Color Code',
    pattern: '#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b',
    flags: 'gi',
    description: 'Matches #RGB, #RRGGBB, and #RRGGBBAA hex color codes',
    example: 'Palette contains #635bff, #10b981, and #f4f5f7.',
  },
  {
    name: 'UUID v4',
    pattern: '\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\b',
    flags: 'gi',
    description: 'Matches RFC 4122 compliant version-4 UUID strings',
    example: 'Session ID: a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d confirmed.',
  },
];

export function testRegex(pattern: string, flags: string, testText: string): RegexEvaluationResult {
  if (!pattern) {
    return { isValid: true, matches: [], matchCount: 0 };
  }

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

export function replaceRegex(
  pattern: string,
  flags: string,
  testText: string,
  replacement: string
): { output: string; error?: string } {
  if (!pattern) return { output: testText };
  try {
    const regex = new RegExp(pattern, flags);
    return { output: testText.replace(regex, replacement) };
  } catch (err) {
    return {
      output: testText,
      error: err instanceof Error ? err.message : 'Replacement error',
    };
  }
}

export function getHighlightedSegments(
  testText: string,
  matches: RegexMatch[]
): HighlightSegment[] {
  if (!testText || matches.length === 0) {
    return [{ text: testText, isMatch: false }];
  }

  // Sort matches by index
  const sorted = [...matches].sort((a, b) => a.index - b.index);
  const segments: HighlightSegment[] = [];
  let currentIndex = 0;

  for (let i = 0; i < sorted.length; i++) {
    const m = sorted[i];
    if (m.index < currentIndex) continue; // skip overlapping matches

    if (m.index > currentIndex) {
      segments.push({
        text: testText.slice(currentIndex, m.index),
        isMatch: false,
      });
    }

    segments.push({
      text: testText.slice(m.index, m.index + m.length),
      isMatch: true,
      matchIndex: i + 1,
    });

    currentIndex = m.index + m.length;
  }

  if (currentIndex < testText.length) {
    segments.push({
      text: testText.slice(currentIndex),
      isMatch: false,
    });
  }

  return segments;
}
