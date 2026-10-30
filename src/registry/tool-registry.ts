import React from 'react';
import { ToolDefinition } from './types';
import { CATEGORIES } from './categories';

export const ALL_TOOLS: ToolDefinition[] = [
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description:
      'Prettify, validate, minify, and inspect JSON payloads client-side with zero network transmission.',
    category: 'developer-tools',
    iconName: 'Braces',
    keywords: [
      'json',
      'format',
      'prettify',
      'minify',
      'validate',
      'rfc 8259',
      'beautify',
      'linter',
    ],
    component: React.lazy(() => import('@/tools/json-formatter')),
    tags: ['Developer Tools', 'Formatter', 'Validator'],
    isOfflineReady: true,
    privacyNote: 'Evaluated locally via native JSON parser. Never transmitted.',
    badge: 'RFC 8259',
  },
  {
    id: 'base64',
    slug: 'base64',
    name: 'Base64 Encoder / Decoder',
    description:
      'Encode and decode UTF-8 text strings to and from Base64 representation in your browser.',
    category: 'encoders-decoders',
    iconName: 'Binary',
    keywords: ['base64', 'encode', 'decode', 'binary', 'utf8', 'ascii', 'atob', 'btoa'],
    component: React.lazy(() => import('@/tools/base64')),
    tags: ['Encoders', 'Encoding', 'Unicode'],
    isOfflineReady: true,
    privacyNote: 'Processed via TextEncoder/TextDecoder in browser memory.',
    badge: 'UTF-8 Safe',
  },
  {
    id: 'url-encoder',
    slug: 'url-encoder',
    name: 'URL Encoder / Decoder',
    description: 'Encode URI components and query strings or decode percent-encoded URLs safely.',
    category: 'encoders-decoders',
    iconName: 'Link',
    keywords: ['url', 'uri', 'encode', 'decode', 'percent', 'query', 'escape', 'unescape'],
    component: React.lazy(() => import('@/tools/url-encoder')),
    tags: ['Web', 'Encoding', 'URL'],
    isOfflineReady: true,
    privacyNote: 'Converted in-browser using encodeURIComponent and decodeURIComponent.',
    badge: 'RFC 3986',
  },
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate cryptographically secure v4 UUIDs individually or in bulk batches.',
    category: 'learning-generators',
    iconName: 'Fingerprint',
    keywords: ['uuid', 'guid', 'v4', 'random', 'crypto', 'generator', 'unique', 'identifier'],
    component: React.lazy(() => import('@/tools/uuid-generator')),
    tags: ['Generators', 'Security', 'UUID'],
    isOfflineReady: true,
    privacyNote: 'Generated via crypto.randomUUID() using CSPRNG.',
    badge: 'CSPRNG v4',
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'SHA-256 Hash Generator',
    description: 'Compute cryptographic SHA-256 digests from text using the native Web Crypto API.',
    category: 'security-cryptography',
    iconName: 'Hash',
    keywords: ['hash', 'sha256', 'sha-2', 'crypto', 'digest', 'checksum', 'security'],
    component: React.lazy(() => import('@/tools/hash-generator')),
    tags: ['Security', 'Hashing', 'Cryptography'],
    isOfflineReady: true,
    privacyNote: 'Calculated using crypto.subtle.digest(). Zero external requests.',
    badge: 'Web Crypto',
  },
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Decoder & Inspector',
    description:
      'Decode, inspect, and debug JSON Web Tokens (JWT) headers, payloads, and expiration claims securely client-side.',
    category: 'security-cryptography',
    iconName: 'KeyRound',
    keywords: ['jwt', 'token', 'decode', 'json web token', 'claims', 'auth', 'bearer', 'rfc 7519'],
    component: React.lazy(() => import('@/tools/jwt-decoder')),
    tags: ['Security', 'JWT', 'Authentication'],
    isOfflineReady: true,
    privacyNote: 'Decoded locally in browser memory. Never transmitted over the wire.',
    badge: 'RFC 7519',
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    name: 'Regex Tester',
    description:
      'Test, debug, and explain regular expressions with flags and capture group inspection.',
    category: 'developer-tools',
    iconName: 'Regex',
    keywords: ['regex', 'regexp', 'regular expression', 'pattern', 'test', 'match', 'flags'],
    component: React.lazy(() => import('@/tools/regex-tester')),
    tags: ['Developer Tools', 'Regex', 'Pattern'],
    isOfflineReady: true,
    privacyNote: 'Evaluated locally using browser JavaScript RegExp engine.',
    badge: 'Client Engine',
  },
  {
    id: 'text-diff',
    slug: 'text-diff',
    name: 'Text Diff Checker',
    description:
      'Compare two text snippets side-by-side or inline to inspect additions and deletions.',
    category: 'text-writing',
    iconName: 'GitCompare',
    keywords: ['diff', 'compare', 'difference', 'text', 'merge', 'git', 'changes'],
    component: React.lazy(() => import('@/tools/text-diff')),
    tags: ['Text', 'Diff', 'Comparison'],
    isOfflineReady: true,
    privacyNote: 'Diff computed locally with no network calls or persistence.',
    badge: 'Myers Diff',
  },
  {
    id: 'markdown-previewer',
    slug: 'markdown-previewer',
    name: 'Markdown Previewer & Editor',
    description:
      'Write and preview GitHub Flavored Markdown (GFM) in real-time with live text metrics and HTML export.',
    category: 'text-writing',
    iconName: 'FileEdit',
    keywords: ['markdown', 'editor', 'preview', 'gfm', 'html', 'export', 'notes', 'writer'],
    component: React.lazy(() => import('@/tools/markdown-previewer')),
    tags: ['Text', 'Markdown', 'Editor'],
    isOfflineReady: true,
    privacyNote: 'Rendered locally in browser memory. Zero external server calls.',
    badge: 'GFM Live',
  },
  {
    id: 'timestamp-converter',
    slug: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    description:
      'Convert between Unix epoch timestamps (seconds and milliseconds), ISO 8601, and human dates.',
    category: 'date-time',
    iconName: 'Clock',
    keywords: ['timestamp', 'epoch', 'unix', 'time', 'date', 'iso8601', 'utc', 'timezone'],
    component: React.lazy(() => import('@/tools/timestamp-converter')),
    tags: ['Date', 'Time', 'Converter'],
    isOfflineReady: true,
    privacyNote: 'Converted via browser Date and Intl APIs.',
    badge: 'Epoch / ISO',
  },
  {
    id: 'cron-parser',
    slug: 'cron-parser',
    name: 'Cron Expression Parser & Humanizer',
    description:
      'Translate standard 5-part cron schedules into plain English, view upcoming runs, and explore common presets.',
    category: 'date-time',
    iconName: 'CalendarClock',
    keywords: ['cron', 'crontab', 'schedule', 'parser', 'humanize', 'timer', 'interval', 'job'],
    component: React.lazy(() => import('@/tools/cron-parser')),
    tags: ['Date', 'Time', 'Automation', 'Cron'],
    isOfflineReady: true,
    privacyNote: 'Evaluated locally via deterministic cron parsing. Zero server requests.',
    badge: 'POSIX 5-Part',
  },
  {
    id: 'color-converter',
    slug: 'color-converter',
    name: 'Color Converter & Contrast Checker',
    description:
      'Convert between HEX, RGB, and HSL formats with real-time preview and WCAG contrast check.',
    category: 'design-colors',
    iconName: 'Palette',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'contrast', 'wcag', 'palette', 'converter'],
    component: React.lazy(() => import('@/tools/color-converter')),
    tags: ['Design', 'Color', 'Accessibility'],
    isOfflineReady: true,
    privacyNote: 'Calculated in browser memory using standard color space formulas.',
    badge: 'WCAG 2.2',
  },
  {
    id: 'glassmorphism-generator',
    slug: 'glassmorphism-generator',
    name: 'CSS Glassmorphism & Box-Shadow Generator',
    description:
      'Design frosted glass UI components with backdrop blur, border opacity, and elevation shadow controls.',
    category: 'design-colors',
    iconName: 'SlidersHorizontal',
    keywords: [
      'glassmorphism',
      'glass',
      'blur',
      'backdrop',
      'shadow',
      'box-shadow',
      'css',
      'tailwind',
      'ui',
      'generator',
    ],
    component: React.lazy(() => import('@/tools/glassmorphism-generator')),
    tags: ['Design', 'CSS', 'Glassmorphism', 'Shadow'],
    isOfflineReady: true,
    privacyNote: 'Computed in browser memory. Pure CSS output generated locally.',
    badge: 'CSS & Tailwind',
  },
  {
    id: 'qr-generator',
    slug: 'qr-generator',
    name: 'QR Code Generator',
    description:
      'Generate high-resolution QR codes locally for text and URLs with PNG download support.',
    category: 'image-media',
    iconName: 'QrCode',
    keywords: ['qr', 'qrcode', 'barcode', 'generator', 'png', 'download', 'image'],
    component: React.lazy(() => import('@/tools/qr-generator')),
    tags: ['Image', 'Media', 'Generator'],
    isOfflineReady: true,
    privacyNote: 'Rendered directly into HTML5 canvas locally. Zero third-party APIs.',
    badge: 'Client Canvas',
  },
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Unit Converter',
    description:
      'Convert between length, mass, temperature, and data storage units (decimal and binary).',
    category: 'math-converters',
    iconName: 'Calculator',
    keywords: ['unit', 'converter', 'metric', 'imperial', 'length', 'mass', 'temperature', 'bytes'],
    component: React.lazy(() => import('@/tools/unit-converter')),
    tags: ['Math', 'Converter', 'Units'],
    isOfflineReady: true,
    privacyNote: 'Calculated purely with deterministic mathematical formulas.',
    badge: 'Exact Math',
  },
  {
    id: 'csv-json',
    slug: 'csv-json',
    name: 'CSV to JSON Converter',
    description:
      'Parse RFC 4180 CSV strings with quotes and line endings into structured, formatted JSON.',
    category: 'data-files',
    iconName: 'Table',
    keywords: ['csv', 'json', 'converter', 'parse', 'table', 'data', 'export', 'rfc 4180'],
    component: React.lazy(() => import('@/tools/csv-json')),
    tags: ['Data', 'Files', 'Converter'],
    isOfflineReady: true,
    privacyNote: 'Parsed completely inside browser memory using RFC 4180 parsing.',
    badge: 'RFC 4180',
  },
];

export const TOOL_MAP = new Map(ALL_TOOLS.map((tool) => [tool.id, tool]));
export const TOOL_SLUG_MAP = new Map(ALL_TOOLS.map((tool) => [tool.slug, tool]));

/**
 * Validates registry integrity. Throws if duplicate IDs/slugs or invalid categories exist.
 */
export function validateRegistry(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const validCategoryIds = new Set(CATEGORIES.map((c) => c.id));

  for (const tool of ALL_TOOLS) {
    if (seenIds.has(tool.id)) {
      errors.push(`Duplicate tool id: "${tool.id}"`);
    }
    seenIds.add(tool.id);

    if (seenSlugs.has(tool.slug)) {
      errors.push(`Duplicate tool slug: "${tool.slug}"`);
    }
    seenSlugs.add(tool.slug);

    if (!validCategoryIds.has(tool.category)) {
      errors.push(`Tool "${tool.id}" references invalid category: "${tool.category}"`);
    }

    if (!tool.name || !tool.description || !tool.iconName) {
      errors.push(`Tool "${tool.id}" is missing required metadata.`);
    }
  }

  return { valid: errors.length === 0, errors };
}
