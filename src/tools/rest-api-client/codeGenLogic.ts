/**
 * Multi-language HTTP client code snippet generator.
 */
import { ApiRequest } from './types';
import { buildEffectiveUrl, generateCurlCommand } from './curlLogic';

export type SnippetLanguage =
  | 'javascript-fetch'
  | 'javascript-axios'
  | 'python-requests'
  | 'python-httpx'
  | 'go-http'
  | 'php-curl'
  | 'rust-reqwest'
  | 'curl';

function getActiveHeaders(req: ApiRequest): Record<string, string> {
  const map: Record<string, string> = {};
  req.headers
    .filter((h) => h.enabled && h.key.trim())
    .forEach((h) => {
      map[h.key.trim()] = h.value;
    });

  if (req.auth.type === 'bearer' && req.auth.bearerToken) {
    map['Authorization'] = `Bearer ${req.auth.bearerToken.trim()}`;
  } else if (req.auth.type === 'basic' && (req.auth.basicUser || req.auth.basicPassword)) {
    map['Authorization'] =
      `Basic ${btoa(`${req.auth.basicUser || ''}:${req.auth.basicPassword || ''}`)}`;
  } else if (
    req.auth.type === 'apikey' &&
    req.auth.apiKeyLocation === 'header' &&
    req.auth.apiKeyName
  ) {
    map[req.auth.apiKeyName] = req.auth.apiKeyValue || '';
  }

  if (req.bodyType === 'json' && !map['Content-Type']) {
    map['Content-Type'] = 'application/json';
  }
  return map;
}

function generateFetchSnippet(
  req: ApiRequest,
  url: string,
  headers: Record<string, string>
): string {
  const options: Record<string, unknown> = { method: req.method };
  if (Object.keys(headers).length > 0) options.headers = headers;

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.bodyType !== 'none') {
    if (req.bodyType === 'json') {
      try {
        options.body = JSON.parse(req.bodyContent);
      } catch {
        options.body = req.bodyContent;
      }
    } else {
      options.body = req.bodyContent;
    }
  }

  const optStr = JSON.stringify(options, null, 2).replace(/"([^"]+)":/g, '$1:');
  return `const response = await fetch("${url}", ${optStr});\nconst data = await response.json();\nconsole.log(data);`;
}

function generateAxiosSnippet(
  req: ApiRequest,
  url: string,
  headers: Record<string, string>
): string {
  const m = req.method.toLowerCase();
  const hStr =
    Object.keys(headers).length > 0 ? `, {\n  headers: ${JSON.stringify(headers, null, 2)}\n}` : '';

  if (req.method === 'GET' || req.method === 'HEAD' || req.bodyType === 'none') {
    return `import axios from 'axios';\n\nconst response = await axios.${m}("${url}"${hStr});\nconsole.log(response.data);`;
  }
  const body =
    req.bodyType === 'json' && req.bodyContent ? req.bodyContent : `"${req.bodyContent || ''}"`;
  return `import axios from 'axios';\n\nconst response = await axios.${m}("${url}", ${body}${hStr});\nconsole.log(response.data);`;
}

function generatePythonSnippet(
  req: ApiRequest,
  url: string,
  headers: Record<string, string>
): string {
  const lines: string[] = ['import requests', ''];
  const m = req.method.toLowerCase();
  let args = `"${url}"`;

  if (Object.keys(headers).length > 0) {
    lines.push(`headers = ${JSON.stringify(headers, null, 4)}`);
    args += ', headers=headers';
  }
  if (req.method !== 'GET' && req.bodyType === 'json' && req.bodyContent) {
    lines.push(`payload = ${req.bodyContent}`);
    args += ', json=payload';
  } else if (req.method !== 'GET' && req.bodyContent) {
    lines.push(`data = """${req.bodyContent}"""`);
    args += ', data=data';
  }

  lines.push(`response = requests.${m}(${args})`);
  lines.push('print(response.status_code)');
  lines.push('print(response.text)');
  return lines.join('\n');
}

function generateGoSnippet(req: ApiRequest, url: string): string {
  return `package main

import (
\t"fmt"
\t"io"
\t"net/http"
)

func main() {
\treq, err := http.NewRequest("${req.method}", "${url}", nil)
\tif err != nil {
\t\tpanic(err)
\t}

\tres, err := http.DefaultClient.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer res.Body.Close()

\tbody, _ := io.ReadAll(res.Body)
\tfmt.Println(string(body))
}`;
}

export function generateCodeSnippet(req: ApiRequest, lang: SnippetLanguage): string {
  if (lang === 'curl') {
    return generateCurlCommand(req);
  }
  const url = buildEffectiveUrl(req.url, req.params);
  const headers = getActiveHeaders(req);

  switch (lang) {
    case 'javascript-fetch':
      return generateFetchSnippet(req, url, headers);
    case 'javascript-axios':
      return generateAxiosSnippet(req, url, headers);
    case 'python-requests':
    case 'python-httpx':
      return generatePythonSnippet(req, url, headers);
    case 'go-http':
      return generateGoSnippet(req, url);
    default:
      return generateFetchSnippet(req, url, headers);
  }
}
