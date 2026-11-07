import { UaParsedResult, UaPreset } from './types';

export function detectBot(ua: string): { isBot: boolean; botDetails?: string } {
  const botPatterns = [
    { name: 'Googlebot', regex: /Googlebot\/(\d+(?:\.\d+)?)/i },
    { name: 'Bingbot', regex: /bingbot\/(\d+(?:\.\d+)?)/i },
    { name: 'DuckDuckBot', regex: /DuckDuckBot\/(\d+(?:\.\d+)?)/i },
    { name: 'Baiduspider', regex: /Baiduspider(?:\/|\+)(\d+(?:\.\d+)?)/i },
    { name: 'YandexBot', regex: /YandexBot\/(\d+(?:\.\d+)?)/i },
    { name: 'Twitterbot', regex: /Twitterbot\/(\d+(?:\.\d+)?)/i },
    { name: 'facebookexternalhit', regex: /facebookexternalhit\/(\d+(?:\.\d+)?)/i },
    { name: 'Generic Crawler / Bot', regex: /(bot|crawler|spider|slurp|crawling)/i },
  ];

  for (const p of botPatterns) {
    const match = ua.match(p.regex);
    if (match) {
      return {
        isBot: true,
        botDetails: match[1] ? `${p.name} v${match[1]}` : p.name,
      };
    }
  }

  return { isBot: false };
}

export function detectBrowser(ua: string): { name: string; version: string; major: string } {
  const browserRules = [
    { name: 'Edge', regex: /(?:Edg|Edge|EdgA|EdgiOS)\/(\d+(\.\d+)?)/ },
    { name: 'Samsung Internet', regex: /SamsungBrowser\/(\d+(\.\d+)?)/ },
    { name: 'Opera', regex: /(?:OPR|Opera)\/(\d+(\.\d+)?)/ },
    { name: 'Firefox', regex: /(?:Firefox|FxiOS)\/(\d+(\.\d+)?)/ },
    { name: 'Chrome', regex: /(?:Chrome|CriOS)\/(\d+(\.\d+)?)/ },
    { name: 'Safari', regex: /Version\/(\d+(\.\d+)?).*Safari/ },
  ];

  for (const rule of browserRules) {
    const match = ua.match(rule.regex);
    if (match) {
      const version = match[1] || 'Unknown';
      const major = version.split('.')[0] || 'Unknown';
      return { name: rule.name, version, major };
    }
  }

  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    return { name: 'Safari', version: 'Unknown', major: 'Unknown' };
  }

  return { name: 'Unknown Browser', version: 'Unknown', major: 'Unknown' };
}

export function detectOS(ua: string): { name: string; version: string } {
  if (/Windows NT 10.0/i.test(ua)) return { name: 'Windows', version: '10 / 11' };
  if (/Windows NT 6.3/i.test(ua)) return { name: 'Windows', version: '8.1' };
  if (/Windows NT 6.2/i.test(ua)) return { name: 'Windows', version: '8' };
  if (/Windows NT 6.1/i.test(ua)) return { name: 'Windows', version: '7' };
  if (/Windows/i.test(ua)) return { name: 'Windows', version: 'Unknown' };

  const iOSMatch = ua.match(/(?:iPhone|iPad|iPod).*?OS (\d+[._]\d+)/i);
  if (iOSMatch) {
    return { name: 'iOS', version: iOSMatch[1].replace(/_/g, '.') };
  }

  const macMatch = ua.match(/Mac OS X (\d+[._]\d+)/i);
  if (macMatch) {
    return { name: 'macOS', version: macMatch[1].replace(/_/g, '.') };
  }

  const androidMatch = ua.match(/Android (\d+(?:\.\d+)?)/i);
  if (androidMatch) {
    return { name: 'Android', version: androidMatch[1] };
  }

  if (/CrOS/i.test(ua)) return { name: 'Chrome OS', version: 'Unknown' };
  if (/Ubuntu/i.test(ua)) return { name: 'Ubuntu Linux', version: 'Unknown' };
  if (/Linux/i.test(ua)) return { name: 'Linux', version: 'Unknown' };

  return { name: 'Unknown OS', version: 'Unknown' };
}

export function detectEngine(ua: string): { name: string; version: string } {
  const matchBlink = ua.match(/Chrome\/(\d+)/i);
  if (matchBlink && !/Edge\/\d+$/i.test(ua)) {
    return { name: 'Blink', version: matchBlink[1] };
  }

  const matchWebKit = ua.match(/AppleWebKit\/(\d+(\.\d+)?)/i);
  if (matchWebKit) {
    return { name: 'WebKit', version: matchWebKit[1] };
  }

  const matchGecko = ua.match(/Gecko\/(\d+)/i);
  if (matchGecko) {
    return { name: 'Gecko', version: matchGecko[1] };
  }

  return { name: 'Unknown Engine', version: 'Unknown' };
}

export function detectDevice(
  ua: string,
  isBot: boolean
): { type: UaParsedResult['device']['type'] } {
  if (isBot) return { type: 'Bot' };
  if (/iPad|Tablet|(Android(?!.*Mobile))/i.test(ua)) return { type: 'Tablet' };
  if (/Mobile|iPhone|iPod|Android.*Mobile|webOS|BlackBerry/i.test(ua)) return { type: 'Mobile' };
  if (/Windows|Macintosh|Linux|CrOS/i.test(ua)) return { type: 'Desktop' };
  return { type: 'Unknown' };
}

export function detectCPU(ua: string): { architecture: string } {
  if (/x86_64|Win64|WOW64|x64|amd64/i.test(ua)) return { architecture: 'x86_64 (64-bit)' };
  if (/aarch64|arm64|AppleWebKit.*Mobile.*Safari/i.test(ua)) return { architecture: 'arm64' };
  if (/armv\d+l?/i.test(ua)) return { architecture: 'arm (32-bit)' };
  if (/i686|i386|x86/i.test(ua)) return { architecture: 'x86 (32-bit)' };
  return { architecture: 'Unknown' };
}

export function parseUserAgent(uaString: string): UaParsedResult {
  const ua = (uaString || '').trim();
  const botInfo = detectBot(ua);
  const browser = detectBrowser(ua);
  const os = detectOS(ua);
  const engine = detectEngine(ua);
  const device = detectDevice(ua, botInfo.isBot);
  const cpu = detectCPU(ua);

  return {
    raw: ua,
    browser,
    os,
    device,
    engine,
    cpu,
    isBot: botInfo.isBot,
    botDetails: botInfo.botDetails,
  };
}

export const UA_PRESETS: UaPreset[] = [
  {
    id: 'chrome-win',
    name: 'Chrome 122 (Win 11)',
    category: 'Desktop',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  },
  {
    id: 'safari-mac',
    name: 'Safari 17 (macOS Sonoma)',
    category: 'Desktop',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  },
  {
    id: 'iphone-safari',
    name: 'Safari (iPhone 15, iOS 17)',
    category: 'Mobile',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
  },
  {
    id: 'pixel-chrome',
    name: 'Chrome Mobile (Android 14)',
    category: 'Mobile',
    ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36',
  },
  {
    id: 'firefox-linux',
    name: 'Firefox 123 (Ubuntu Linux)',
    category: 'Desktop',
    ua: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0',
  },
  {
    id: 'googlebot',
    name: 'Googlebot Smartphone',
    category: 'Bot',
    ua: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  },
];
