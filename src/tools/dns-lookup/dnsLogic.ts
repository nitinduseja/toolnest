import { DnsRecordType, DnsQueryOptions, DnsResponse, DnsAnswer } from './types';

export const DNS_TYPE_IDS: Record<DnsRecordType, number> = {
  A: 1,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  MX: 15,
  TXT: 16,
  AAAA: 28,
  CAA: 257,
};

export const DNS_ID_TO_TYPE: Record<number, string> = {
  1: 'A',
  2: 'NS',
  5: 'CNAME',
  6: 'SOA',
  15: 'MX',
  16: 'TXT',
  28: 'AAAA',
  257: 'CAA',
};

export function cleanDomainInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '');
}

export function formatTtl(ttlSeconds: number): string {
  if (ttlSeconds < 60) return `${ttlSeconds}s`;
  if (ttlSeconds < 3600) return `${Math.floor(ttlSeconds / 60)}m ${ttlSeconds % 60}s`;
  const hours = Math.floor(ttlSeconds / 3600);
  const mins = Math.floor((ttlSeconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export function buildDohUrl(options: DnsQueryOptions): string {
  const cleanDomain = cleanDomainInput(options.domain);
  if (options.provider === 'google') {
    return `https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=${options.type}`;
  }
  return `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanDomain)}&type=${options.type}`;
}

export async function executeDnsQuery(
  options: DnsQueryOptions,
  customFetch: typeof fetch = fetch
): Promise<DnsResponse> {
  const url = buildDohUrl(options);
  const response = await customFetch(url, {
    headers: {
      Accept: 'application/dns-json',
    },
  });

  if (!response.ok) {
    throw new Error(`DNS Query failed with HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    Status: number;
    Question: Array<{ name: string; type: number }>;
    Answer?: Array<{ name: string; type: number; TTL: number; data: string }>;
  };

  const enrichedAnswers: DnsAnswer[] = (data.Answer || []).map((ans) => ({
    ...ans,
    typeName: DNS_ID_TO_TYPE[ans.type] || `TYPE${ans.type}`,
  }));

  return {
    ...data,
    Answer: enrichedAnswers,
  };
}

export const DNS_STATUS_CODES: Record<number, string> = {
  0: 'NoError (Success)',
  1: 'FormErr (Format Error)',
  2: 'ServFail (Server Failure)',
  3: 'NXDomain (Non-Existent Domain)',
  4: 'NotImp (Not Implemented)',
  5: 'Refused (Query Refused)',
};
