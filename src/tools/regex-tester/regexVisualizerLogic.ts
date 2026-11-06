export type RegexTokenType =
  'anchor' | 'character-class' | 'quantifier' | 'group' | 'alternation' | 'escape' | 'literal';

export interface RegexTokenExplanation {
  id: string;
  raw: string;
  type: RegexTokenType;
  label: string;
  explanation: string;
  example?: string;
}

export function explainRegexPattern(pattern: string): RegexTokenExplanation[] {
  if (!pattern) return [];

  const tokens: RegexTokenExplanation[] = [];
  let i = 0;
  const len = pattern.length;

  while (i < len) {
    const char = pattern[i];
    const nextChar = pattern[i + 1];

    // 1. Escaped characters & Built-in Character Classes
    if (char === '\\') {
      const escapeSequence = pattern.slice(i, i + 2);
      tokens.push(parseEscapeToken(escapeSequence, tokens.length));
      i += 2;
      continue;
    }

    // 2. Character Sets [abc] or [^abc]
    if (char === '[') {
      let closeIdx = pattern.indexOf(']', i + 1);
      while (closeIdx !== -1 && pattern[closeIdx - 1] === '\\') {
        closeIdx = pattern.indexOf(']', closeIdx + 1);
      }
      if (closeIdx !== -1) {
        const raw = pattern.slice(i, closeIdx + 1);
        tokens.push(parseSetToken(raw, tokens.length));
        i = closeIdx + 1;
        continue;
      }
    }

    // 3. Groups (capturing, non-capturing, lookaround)
    if (char === '(') {
      const groupToken = parseGroupStart(pattern, i, tokens.length);
      tokens.push(groupToken.token);
      i += groupToken.consumed;
      continue;
    }

    if (char === ')') {
      tokens.push({
        id: `token-${tokens.length}`,
        raw: ')',
        type: 'group',
        label: 'End Group',
        explanation: 'Closes the current group scope.',
      });
      i++;
      continue;
    }

    // 4. Quantifiers +, *, ?, {n,m}
    if (char === '+' || char === '*' || char === '?') {
      const isLazy = nextChar === '?';
      const raw = isLazy ? char + '?' : char;
      tokens.push(parseSimpleQuantifier(raw, tokens.length));
      i += isLazy ? 2 : 1;
      continue;
    }

    if (char === '{') {
      const closeIdx = pattern.indexOf('}', i);
      if (closeIdx !== -1) {
        const raw = pattern.slice(i, closeIdx + 1);
        tokens.push(parseRangeQuantifier(raw, tokens.length));
        i = closeIdx + 1;
        continue;
      }
    }

    // 5. Anchors ^ and $
    if (char === '^' || char === '$') {
      tokens.push({
        id: `token-${tokens.length}`,
        raw: char,
        type: 'anchor',
        label: char === '^' ? 'Start Anchor' : 'End Anchor',
        explanation:
          char === '^'
            ? 'Matches the beginning of the string or beginning of a line (with multiline flag).'
            : 'Matches the end of the string or end of a line (with multiline flag).',
      });
      i++;
      continue;
    }

    // 6. Alternation |
    if (char === '|') {
      tokens.push({
        id: `token-${tokens.length}`,
        raw: '|',
        type: 'alternation',
        label: 'OR / Alternation',
        explanation: 'Matches either the expression before or the expression after.',
      });
      i++;
      continue;
    }

    // 7. Dot wildcard
    if (char === '.') {
      tokens.push({
        id: `token-${tokens.length}`,
        raw: '.',
        type: 'character-class',
        label: 'Any Character (Wildcard)',
        explanation:
          'Matches any single character except line terminators (or any character if dotAll is active).',
      });
      i++;
      continue;
    }

    // 8. Literals (aggregate continuous literal runs)
    let literalRun = char;
    while (
      i + 1 < len &&
      !['\\', '[', '(', ')', '+', '*', '?', '{', '^', '$', '|', '.'].includes(pattern[i + 1])
    ) {
      i++;
      literalRun += pattern[i];
    }

    tokens.push({
      id: `token-${tokens.length}`,
      raw: literalRun,
      type: 'literal',
      label: `Literal "${literalRun}"`,
      explanation: `Matches the exact character sequence "${literalRun}".`,
    });
    i++;
  }

  return tokens;
}

function parseEscapeToken(seq: string, index: number): RegexTokenExplanation {
  const escapes: Record<string, { label: string; explanation: string }> = {
    '\\d': { label: 'Digit [0-9]', explanation: 'Matches any ASCII decimal digit (0 through 9).' },
    '\\D': {
      label: 'Non-Digit [^0-9]',
      explanation: 'Matches any character that is not a decimal digit.',
    },
    '\\w': {
      label: 'Word Character',
      explanation: 'Matches any ASCII word character [a-zA-Z0-9_].',
    },
    '\\W': {
      label: 'Non-Word Character',
      explanation: 'Matches any character that is not an ASCII word character.',
    },
    '\\s': { label: 'Whitespace', explanation: 'Matches spaces, tabs, newlines, and form feeds.' },
    '\\S': {
      label: 'Non-Whitespace',
      explanation: 'Matches any character that is not whitespace.',
    },
    '\\b': {
      label: 'Word Boundary',
      explanation: 'Matches at a word boundary (between word and non-word characters).',
    },
    '\\B': {
      label: 'Non-Word Boundary',
      explanation: 'Matches where a word boundary does not occur.',
    },
  };

  const known = escapes[seq];
  if (known) {
    return {
      id: `token-${index}`,
      raw: seq,
      type: seq.toLowerCase() === '\\b' ? 'anchor' : 'character-class',
      label: known.label,
      explanation: known.explanation,
    };
  }

  return {
    id: `token-${index}`,
    raw: seq,
    type: 'escape',
    label: `Escaped "${seq[1] || ''}"`,
    explanation: `Matches the literal character "${seq[1] || ''}" by escaping its special regex meaning.`,
  };
}

function parseSetToken(raw: string, index: number): RegexTokenExplanation {
  const isNegated = raw.startsWith('[^');
  const inner = isNegated ? raw.slice(2, -1) : raw.slice(1, -1);
  return {
    id: `token-${index}`,
    raw,
    type: 'character-class',
    label: isNegated ? `Negated Set [^...]` : `Character Set [...]`,
    explanation: isNegated
      ? `Matches any character NOT in the set: "${inner}".`
      : `Matches any single character present in the set: "${inner}".`,
  };
}

function parseGroupStart(
  pattern: string,
  i: number,
  index: number
): { token: RegexTokenExplanation; consumed: number } {
  const sub = pattern.slice(i, i + 4);
  if (sub.startsWith('(?:')) {
    return {
      token: {
        id: `token-${index}`,
        raw: '(?:',
        type: 'group',
        label: 'Non-Capturing Group',
        explanation: 'Groups expressions without creating a numbered backreference.',
      },
      consumed: 3,
    };
  }
  if (sub.startsWith('(?=')) {
    return {
      token: {
        id: `token-${index}`,
        raw: '(?=',
        type: 'group',
        label: 'Positive Lookahead',
        explanation:
          'Asserts that the given expression immediately follows, without consuming characters.',
      },
      consumed: 3,
    };
  }
  if (sub.startsWith('(?!')) {
    return {
      token: {
        id: `token-${index}`,
        raw: '(?!',
        type: 'group',
        label: 'Negative Lookahead',
        explanation:
          'Asserts that the given expression does NOT follow, without consuming characters.',
      },
      consumed: 3,
    };
  }

  return {
    token: {
      id: `token-${index}`,
      raw: '(',
      type: 'group',
      label: 'Capturing Group',
      explanation:
        'Groups sub-expressions and stores the match in a numbered capturing group ($1, $2, etc.).',
    },
    consumed: 1,
  };
}

function parseSimpleQuantifier(raw: string, index: number): RegexTokenExplanation {
  const quantifiers: Record<string, { label: string; explanation: string }> = {
    '+': {
      label: 'One or More (+)',
      explanation: 'Matches 1 or more occurrences of the preceding token (greedy).',
    },
    '+?': {
      label: 'One or More (Lazy)',
      explanation: 'Matches 1 or more occurrences of the preceding token (lazy / shortest match).',
    },
    '*': {
      label: 'Zero or More (*)',
      explanation: 'Matches 0 or more occurrences of the preceding token (greedy).',
    },
    '*?': {
      label: 'Zero or More (Lazy)',
      explanation: 'Matches 0 or more occurrences of the preceding token (lazy / shortest match).',
    },
    '?': {
      label: 'Optional (?)',
      explanation: 'Matches 0 or 1 occurrence of the preceding token (greedy).',
    },
    '??': {
      label: 'Optional (Lazy)',
      explanation: 'Matches 0 or 1 occurrence of the preceding token (prefers 0 occurrences).',
    },
  };

  const known = quantifiers[raw];
  return {
    id: `token-${index}`,
    raw,
    type: 'quantifier',
    label: known?.label || 'Quantifier',
    explanation: known?.explanation || 'Specifies the number of occurrences.',
  };
}

function parseRangeQuantifier(raw: string, index: number): RegexTokenExplanation {
  const content = raw.slice(1, -1);
  return {
    id: `token-${index}`,
    raw,
    type: 'quantifier',
    label: `Repetition {${content}}`,
    explanation: `Matches the preceding token within range: ${content} times.`,
  };
}
