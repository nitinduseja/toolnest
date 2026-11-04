/**
 * Pure domain logic for parsing cURL commands and generating target client code
 * in JavaScript Fetch, Axios, Python Requests, Go net/http, Rust reqwest, PHP cURL, and Java HttpClient.
 */

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
 * Generates JavaScript Fetch code.
 */
export function generateFetchCode(parsed: ParsedCurl): string {
  const { url, method, headers, data, auth } = parsed;
  const mergedHeaders = { ...headers };

  if (auth) {
    const encoded = btoa(`${auth.user}:${auth.pass}`);
    mergedHeaders['Authorization'] = `Basic ${encoded}`;
  }

  const optionsObj: Record<string, unknown> = {
    method,
  };

  if (Object.keys(mergedHeaders).length > 0) {
    optionsObj.headers = mergedHeaders;
  }

  if (data) {
    try {
      JSON.parse(data);
      optionsObj.body = `JSON.stringify(${data})`;
    } catch {
      optionsObj.body = JSON.stringify(data);
    }
  }

  const formattedOptions = JSON.stringify(optionsObj, null, 2).replace(
    /"body": "(JSON\.stringify\(.*\))"/,
    '"body": $1'
  );

  return `const response = await fetch("${url || 'https://api.example.com'}", ${formattedOptions});
const data = await response.json();
console.log(data);`;
}

/**
 * Generates Axios code.
 */
export function generateAxiosCode(parsed: ParsedCurl): string {
  const { url, method, headers, data, auth } = parsed;
  const mergedHeaders = { ...headers };

  const configObj: Record<string, unknown> = {
    method: method.toLowerCase(),
    url: url || 'https://api.example.com',
  };

  if (Object.keys(mergedHeaders).length > 0) {
    configObj.headers = mergedHeaders;
  }

  if (auth) {
    configObj.auth = {
      username: auth.user,
      password: auth.pass,
    };
  }

  if (data) {
    try {
      configObj.data = JSON.parse(data);
    } catch {
      configObj.data = data;
    }
  }

  return `import axios from 'axios';

const response = await axios(${JSON.stringify(configObj, null, 2)});
console.log(response.data);`;
}

/**
 * Generates Python Requests code.
 */
export function generatePythonCode(parsed: ParsedCurl): string {
  const { url, method, headers, data, auth } = parsed;
  const lines: string[] = ['import requests\n'];

  lines.push(`url = "${url || 'https://api.example.com'}"`);

  if (Object.keys(headers).length > 0) {
    lines.push(`headers = ${JSON.stringify(headers, null, 4)}`);
  } else {
    lines.push(`headers = {}`);
  }

  let dataArg = '';
  if (data) {
    try {
      JSON.parse(data);
      lines.push(`payload = ${data}`);
      dataArg = ', json=payload';
    } catch {
      lines.push(`data = ${JSON.stringify(data)}`);
      dataArg = ', data=data';
    }
  }

  let authArg = '';
  if (auth) {
    authArg = `, auth=("${auth.user}", "${auth.pass}")`;
  }

  lines.push(
    `\nresponse = requests.${method.toLowerCase()}(url, headers=headers${dataArg}${authArg})`
  );
  lines.push('print(response.status_code)');
  lines.push('print(response.text)');

  return lines.join('\n');
}

/**
 * Generates Go net/http code.
 */
export function generateGoCode(parsed: ParsedCurl): string {
  const { url, method, headers, data, auth } = parsed;
  const lines: string[] = [
    'package main\n',
    'import (',
    '\t"fmt"',
    '\t"io"',
    '\t"net/http"',
  ];

  if (data) {
    lines.push('\t"strings"');
  }

  lines.push(')\n', 'func main() {');

  if (data) {
    lines.push(`\tpayload := strings.NewReader(${JSON.stringify(data)})`);
    lines.push(
      `\treq, err := http.NewRequest("${method}", "${url || 'https://api.example.com'}", payload)`
    );
  } else {
    lines.push(
      `\treq, err := http.NewRequest("${method}", "${url || 'https://api.example.com'}", nil)`
    );
  }

  lines.push('\tif err != nil {\n\t\tpanic(err)\n\t}');

  for (const [key, val] of Object.entries(headers)) {
    lines.push(`\treq.Header.Add("${key}", "${val}")`);
  }

  if (auth) {
    lines.push(`\treq.SetBasicAuth("${auth.user}", "${auth.pass}")`);
  }

  lines.push('\n\tres, err := http.DefaultClient.Do(req)');
  lines.push('\tif err != nil {\n\t\tpanic(err)\n\t}');
  lines.push('\tdefer res.Body.Close()');
  lines.push('\tbody, _ := io.ReadAll(res.Body)');
  lines.push('\tfmt.Println(string(body))');
  lines.push('}');

  return lines.join('\n');
}

/**
 * Generates Rust reqwest code.
 */
export function generateRustCode(parsed: ParsedCurl): string {
  const { url, method, headers, data, auth } = parsed;
  const lines: string[] = [
    'use reqwest::header::{HeaderMap, HeaderName, HeaderValue};',
    '',
    '#[tokio::main]',
    'async fn main() -> Result<(), Box<dyn std::error.Error>> {',
    '    let client = reqwest::Client::new();',
    '    let mut headers = HeaderMap::new();',
  ];

  for (const [key, val] of Object.entries(headers)) {
    lines.push(
      `    headers.insert("${key}".parse::<HeaderName>()?, "${val}".parse::<HeaderValue>()?);`
    );
  }

  lines.push('');
  lines.push(`    let mut req = client.${method.toLowerCase()}("${url || 'https://api.example.com'}").headers(headers);`);

  if (auth) {
    lines.push(`    req = req.basic_auth("${auth.user}", Some("${auth.pass}"));`);
  }

  if (data) {
    lines.push(`    req = req.body(${JSON.stringify(data)});`);
  }

  lines.push('    let res = req.send().await?;');
  lines.push('    let body = res.text().await?;');
  lines.push('    println!("{}", body);');
  lines.push('    Ok(())');
  lines.push('}');

  return lines.join('\n');
}

/**
 * Generates PHP cURL code.
 */
export function generatePhpCode(parsed: ParsedCurl): string {
  const { url, method, headers, data, auth } = parsed;
  const lines: string[] = ['<?php\n', '$curl = curl_init();\n', '$opts = ['];

  lines.push(`    CURLOPT_URL => "${url || 'https://api.example.com'}",`);
  lines.push('    CURLOPT_RETURNTRANSFER => true,');
  lines.push(`    CURLOPT_CUSTOMREQUEST => "${method}",`);

  const headerList = Object.entries(headers).map(([k, v]) => `"${k}: ${v}"`);
  if (headerList.length > 0) {
    lines.push(`    CURLOPT_HTTPHEADER => [\n        ${headerList.join(',\n        ')}\n    ],`);
  }

  if (data) {
    lines.push(`    CURLOPT_POSTFIELDS => ${JSON.stringify(data)},`);
  }

  if (auth) {
    lines.push(`    CURLOPT_USERPWD => "${auth.user}:${auth.pass}",`);
  }

  lines.push('];\n');
  lines.push('curl_setopt_array($curl, $opts);');
  lines.push('$response = curl_exec($curl);');
  lines.push('$err = curl_error($curl);');
  lines.push('curl_close($curl);\n');
  lines.push('if ($err) {');
  lines.push('    echo "cURL Error #:" . $err;');
  lines.push('} else {');
  lines.push('    echo $response;');
  lines.push('}');

  return lines.join('\n');
}

/**
 * Generates Java 11+ HttpClient code.
 */
export function generateJavaCode(parsed: ParsedCurl): string {
  const { url, method, headers, data, auth } = parsed;
  const lines: string[] = [
    'import java.net.URI;',
    'import java.net.http.HttpClient;',
    'import java.net.http.HttpRequest;',
    'import java.net.http.HttpResponse;',
    'import java.util.Base64;',
    '',
    'public class Main {',
    '    public static void main(String[] args) throws Exception {',
    '        HttpClient client = HttpClient.newHttpClient();',
    '',
    '        HttpRequest.Builder builder = HttpRequest.newBuilder()',
    `            .uri(URI.create("${url || 'https://api.example.com'}"));`,
    '',
  ];

  for (const [key, val] of Object.entries(headers)) {
    lines.push(`        builder.header("${key}", "${val}");`);
  }

  if (auth) {
    lines.push(
      `        String auth = Base64.getEncoder().encodeToString("${auth.user}:${auth.pass}".getBytes());`
    );
    lines.push('        builder.header("Authorization", "Basic " + auth);');
  }

  lines.push('');
  if (data) {
    lines.push(
      `        builder.method("${method}", HttpRequest.BodyPublishers.ofString(${JSON.stringify(data)}));`
    );
  } else {
    lines.push(
      `        builder.method("${method}", HttpRequest.BodyPublishers.noBody());`
    );
  }

  lines.push('');
  lines.push('        HttpRequest request = builder.build();');
  lines.push('        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());');
  lines.push('        System.out.println(response.body());');
  lines.push('    }');
  lines.push('}');

  return lines.join('\n');
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
