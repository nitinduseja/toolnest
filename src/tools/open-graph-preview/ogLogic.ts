import { MetaTagsConfig, MetaLengthScore, OgPreset } from './types';

export function calculateTitleScore(title: string): MetaLengthScore {
  const length = (title || '').trim().length;
  if (length === 0) {
    return {
      length: 0,
      min: 30,
      max: 60,
      status: 'too-short',
      recommendation: 'Add a title (30–60 characters recommended for search engines)',
    };
  }
  if (length < 30) {
    return {
      length,
      min: 30,
      max: 60,
      status: 'too-short',
      recommendation: 'Title is a bit short. Aim for 30–60 characters.',
    };
  }
  if (length > 60) {
    return {
      length,
      min: 30,
      max: 60,
      status: 'too-long',
      recommendation: 'Title exceeds 60 characters and may be truncated on SERPs.',
    };
  }
  return {
    length,
    min: 30,
    max: 60,
    status: 'optimal',
    recommendation: 'Optimal length! Fits standard desktop and mobile SERPs.',
  };
}

export function calculateDescriptionScore(description: string): MetaLengthScore {
  const length = (description || '').trim().length;
  if (length === 0) {
    return {
      length: 0,
      min: 50,
      max: 160,
      status: 'too-short',
      recommendation: 'Add a description (50–160 characters recommended).',
    };
  }
  if (length < 50) {
    return {
      length,
      min: 50,
      max: 160,
      status: 'too-short',
      recommendation: 'Description is too short for optimal search snippets.',
    };
  }
  if (length > 160) {
    return {
      length,
      min: 50,
      max: 160,
      status: 'too-long',
      recommendation: 'Description exceeds 160 characters and may be clipped in Google snippets.',
    };
  }
  return {
    length,
    min: 50,
    max: 160,
    status: 'optimal',
    recommendation: 'Optimal length! Perfect for social previews & SERP snippets.',
  };
}

export function generateMetaHtml(config: MetaTagsConfig, includeJsonLd = true): string {
  const lines: string[] = [
    '<!-- Primary Meta Tags -->',
    `<title>${config.title || 'Your Page Title'}</title>`,
    `<meta name="title" content="${config.title || ''}" />`,
    `<meta name="description" content="${config.description || ''}" />`,
  ];

  if (config.author) lines.push(`<meta name="author" content="${config.author}" />`);
  if (config.robots) lines.push(`<meta name="robots" content="${config.robots}" />`);
  if (config.themeColor) lines.push(`<meta name="theme-color" content="${config.themeColor}" />`);
  if (config.url) lines.push(`<link rel="canonical" href="${config.url}" />`);

  lines.push('', '<!-- Open Graph / Facebook / LinkedIn / Discord -->');
  lines.push(`<meta property="og:type" content="${config.contentType || 'website'}" />`);
  if (config.url) lines.push(`<meta property="og:url" content="${config.url}" />`);
  lines.push(`<meta property="og:title" content="${config.title || ''}" />`);
  lines.push(`<meta property="og:description" content="${config.description || ''}" />`);
  if (config.image) lines.push(`<meta property="og:image" content="${config.image}" />`);
  if (config.siteName) lines.push(`<meta property="og:site_name" content="${config.siteName}" />`);
  if (config.locale) lines.push(`<meta property="og:locale" content="${config.locale}" />`);

  lines.push('', '<!-- Twitter / X -->');
  lines.push(
    `<meta property="twitter:card" content="${config.twitterCard || 'summary_large_image'}" />`
  );
  if (config.url) lines.push(`<meta property="twitter:url" content="${config.url}" />`);
  lines.push(`<meta property="twitter:title" content="${config.title || ''}" />`);
  lines.push(`<meta property="twitter:description" content="${config.description || ''}" />`);
  if (config.image) lines.push(`<meta property="twitter:image" content="${config.image}" />`);
  if (config.twitterHandle) {
    const handle = config.twitterHandle.startsWith('@')
      ? config.twitterHandle
      : `@${config.twitterHandle}`;
    lines.push(`<meta property="twitter:creator" content="${handle}" />`);
    lines.push(`<meta property="twitter:site" content="${handle}" />`);
  }

  if (includeJsonLd) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': config.contentType === 'article' ? 'Article' : 'WebPage',
      name: config.title,
      description: config.description,
      url: config.url || undefined,
      image: config.image || undefined,
    };
    lines.push('', '<!-- JSON-LD Structured Data -->');
    lines.push('<script type="application/ld+json">');
    lines.push(JSON.stringify(jsonLd, null, 2));
    lines.push('</script>');
  }

  return lines.join('\n');
}

export const OG_PRESETS: OgPreset[] = [
  {
    id: 'saas-landing',
    name: 'SaaS Homepage',
    description: 'High-converting title, summary image, and product branding',
    config: {
      title: 'Toolnest — Useful tools. One workspace.',
      description:
        'Privacy-first, client-side developer toolbox with 35+ formatters, converters, and inspectors. Zero cloud uploads.',
      url: 'https://toolnest.dev',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop',
      siteName: 'Toolnest',
      twitterHandle: '@toolnest',
      twitterCard: 'summary_large_image',
      contentType: 'website',
      locale: 'en_US',
      robots: 'index, follow',
      themeColor: '#635BFF',
      author: 'Toolnest Team',
    },
  },
  {
    id: 'tech-article',
    name: 'Technical Blog Post',
    description: 'Optimized for technical articles with author credit and publication tags',
    config: {
      title: 'Demystifying Web Workers and Client-Side Cryptography in 2026',
      description:
        'A deep-dive into running zero-latency hashing, PDF synthesis, and background OCR directly inside browser threads without server compute.',
      url: 'https://toolnest.dev/blog/client-side-crypto',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
      siteName: 'Toolnest Engineering',
      twitterHandle: '@dev_engineer',
      twitterCard: 'summary_large_image',
      contentType: 'article',
      locale: 'en_US',
      robots: 'index, follow',
      themeColor: '#0f172a',
      author: 'Alex Rivera',
    },
  },
  {
    id: 'portfolio',
    name: 'Developer Portfolio',
    description: 'Clean personal brand card with developer handle and summary badge',
    config: {
      title: 'Sarah Chen — Senior Full-Stack Engineer & Open Source Builder',
      description:
        'Building high-performance client-side web tools, TypeScript compilers, and accessible design systems.',
      url: 'https://sarahchen.dev',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&h=630&fit=crop',
      siteName: 'Sarah Chen Portfolio',
      twitterHandle: '@sarahchen_dev',
      twitterCard: 'summary',
      contentType: 'profile',
      locale: 'en_US',
      robots: 'index, follow',
      themeColor: '#6366f1',
      author: 'Sarah Chen',
    },
  },
];
