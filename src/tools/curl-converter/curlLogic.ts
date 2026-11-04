/**
 * Pure domain logic for parsing cURL commands and generating target client code
 * in JavaScript Fetch, Axios, Python Requests, Go net/http, Rust reqwest, PHP cURL, and Java HttpClient.
 */

import {
  generateFetchCode,
  generateAxiosCode,
  generatePythonCode,
  generateGoCode,
  generateRustCode,
  generatePhpCode,
  generateJavaCode,
} from './curlGenerators';

export {
  generateFetchCode,
  generateAxiosCode,
  generatePythonCode,
  generateGoCode,
  generateRustCode,
  generatePhpCode,
  generateJavaCode,
};

export interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: string;
  auth?: { user: string; pass: string };
}

export type TargetLanguage = 'fetch' | 'axios' | 'python' | 'go' | 'rust' | 'php' | 'java';

/**
 * Tokenizes a command line string respecting single and double quotes.
 */
function tokenizeCommand(cmd: string): string[] {
  // Join multi-line commands escaping backslashes at end of line
  const cleaned = cmd.replace(/\\\r?\n/g, ' ').trim();
  const tokens: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (/\s/.test(char) && !inSingleQuote && !inDoubleQuote) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Parses a cURL command into structured HTTP request metadata.
 */
export function parseCurl(curlCmd: string): ParsedCurl {
  const tokens = tokenizeCommand(curlCmd);
  let method = 'GET';
  let url = '';
  const headers: Record<string, string> = {};
  let data: string | undefined;
  let auth: { user: string; pass: string } | undefined;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === 'curl') continue;

    if (token === '-X' || token === '--request') {
      if (tokens[i + 1]) {
        method = tokens[++i].toUpperCase();
      }
    } else if (token === '-H' || token === '--header') {
      if (tokens[i + 1]) {
        const headerStr = tokens[++i];
        const colonIdx = headerStr.indexOf(':');
        if (colonIdx !== -1) {
          const key = headerStr.slice(0, colonIdx).trim();
          const val = headerStr.slice(colonIdx + 1).trim();
          headers[key] = val;
        }
      }
    } else if (
      token === '-d' ||
      token === '--data' ||
      token === '--data-raw' ||
      token === '--data-binary'
    ) {
      if (tokens[i + 1]) {
        data = tokens[++i];
        if (method === 'GET') {
          method = 'POST';
        }
      }
    } else if (token === '-u' || token === '--user') {
      if (tokens[i + 1]) {
        const authStr = tokens[++i];
        const [user, pass = ''] = authStr.split(':');
        auth = { user, pass };
      }
    } else if (!token.startsWith('-') && !url) {
      url = token.replace(/^['"]|['"]$/g, '');
    }
  }

  return { url, method, headers, data, auth };
}

/**
 * Master converter for cURL commands into selected target language.
 */
export function convertCurl(
  curlCmd: string,
  target: TargetLanguage
): { code: string; error?: string } {
  const trimmed = curlCmd.trim();
  if (!trimmed) {
    return { code: '' };
  }

  try {
    const parsed = parseCurl(trimmed);
    if (!parsed.url) {
      return { code: '', error: 'Could not detect request URL in cURL command.' };
    }

    switch (target) {
      case 'axios':
        return { code: generateAxiosCode(parsed) };
      case 'python':
        return { code: generatePythonCode(parsed) };
      case 'go':
        return { code: generateGoCode(parsed) };
      case 'rust':
        return { code: generateRustCode(parsed) };
      case 'php':
        return { code: generatePhpCode(parsed) };
      case 'java':
        return { code: generateJavaCode(parsed) };
      case 'fetch':
      default:
        return { code: generateFetchCode(parsed) };
    }
  } catch (err) {
    return {
      code: '',
      error: err instanceof Error ? err.message : 'Failed to parse cURL command',
    };
  }
}
