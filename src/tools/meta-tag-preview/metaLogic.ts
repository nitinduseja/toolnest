import { MetaTagConfig } from './types';

export const DEFAULT_META_CONFIG: MetaTagConfig = {
  title: 'Toolnest — Modern Privacy-First Developer Toolbox',
  description:
    '60+ offline-ready client-side utilities including code formatters, converters, crypto hashers, and studio designers with zero external tracking.',
  url: 'https://toolnest.dev',
  imageUrl: 'https://toolnest.dev/og-preview.png',
  siteName: 'Toolnest',
  twitterHandle: '@toolnestdev',
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
  themeColor: '#6366f1',
};

export function calculateLengthStatus(
  text: string,
  minOptimal: number,
  maxOptimal: number
): { len: number; isOptimal: boolean; isTooLong: boolean; isTooShort: boolean } {
  const len = text.trim().length;
  return {
    len,
    isOptimal: len >= minOptimal && len <= maxOptimal,
    isTooLong: len > maxOptimal,
    isTooShort: len < minOptimal,
  };
}

export function extractHostname(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    return parsed.hostname;
  } catch {
    return 'example.com';
  }
}

export function generateMetaHtml(cfg: MetaTagConfig): string {
  const lines: string[] = [
    '<!-- Primary Meta Tags -->',
    `<title>${cfg.title}</title>`,
    `<meta name="title" content="${cfg.title}" />`,
    `<meta name="description" content="${cfg.description}" />`,
    `<meta name="robots" content="${cfg.robots}" />`,
    `<meta name="theme-color" content="${cfg.themeColor}" />`,
    `<link rel="canonical" href="${cfg.url}" />`,
    '',
    '<!-- Open Graph / Facebook -->',
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${cfg.url}" />`,
    `<meta property="og:title" content="${cfg.title}" />`,
    `<meta property="og:description" content="${cfg.description}" />`,
    `<meta property="og:image" content="${cfg.imageUrl}" />`,
    `<meta property="og:site_name" content="${cfg.siteName}" />`,
    '',
    '<!-- Twitter Card -->',
    `<meta name="twitter:card" content="${cfg.twitterCard}" />`,
    `<meta name="twitter:url" content="${cfg.url}" />`,
    `<meta name="twitter:title" content="${cfg.title}" />`,
    `<meta name="twitter:description" content="${cfg.description}" />`,
    `<meta name="twitter:image" content="${cfg.imageUrl}" />`,
  ];

  if (cfg.twitterHandle) {
    lines.push(`<meta name="twitter:creator" content="${cfg.twitterHandle}" />`);
  }

  return lines.join('\n');
}
