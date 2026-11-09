import { describe, it, expect, vi } from 'vitest';
import {
  cleanDomainInput,
  formatTtl,
  buildDohUrl,
  executeDnsQuery,
  DNS_STATUS_CODES,
  DNS_TYPE_IDS,
} from './dnsLogic';

describe('dnsLogic', () => {
  it('cleans domain input stripping protocol, paths, and ports', () => {
    expect(cleanDomainInput('https://example.com/some/path')).toBe('example.com');
    expect(cleanDomainInput('http://sub.domain.org:8080/')).toBe('sub.domain.org');
    expect(cleanDomainInput('   GITHUB.COM   ')).toBe('github.com');
  });

  it('formats TTL seconds into human-readable strings', () => {
    expect(formatTtl(45)).toBe('45s');
    expect(formatTtl(300)).toBe('5m 0s');
    expect(formatTtl(3665)).toBe('1h 1m');
  });

  it('builds Cloudflare DoH URL correctly', () => {
    const url = buildDohUrl({
      domain: 'example.com',
      type: 'A',
      provider: 'cloudflare',
    });
    expect(url).toBe('https://cloudflare-dns.com/dns-query?name=example.com&type=A');
  });

  it('builds Google DoH URL correctly', () => {
    const url = buildDohUrl({
      domain: 'google.com',
      type: 'MX',
      provider: 'google',
    });
    expect(url).toBe('https://dns.google/resolve?name=google.com&type=MX');
  });

  it('executes DNS query successfully with mocked fetch', async () => {
    const mockResponse = {
      Status: 0,
      TC: false,
      RD: true,
      RA: true,
      AD: false,
      CD: false,
      Question: [{ name: 'example.com.', type: 1 }],
      Answer: [{ name: 'example.com.', type: 1, TTL: 300, data: '93.184.216.34' }],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    const result = await executeDnsQuery(
      { domain: 'example.com', type: 'A', provider: 'cloudflare' },
      mockFetch
    );

    expect(result.Status).toBe(0);
    expect(result.Answer?.length).toBe(1);
    expect(result.Answer?.[0].typeName).toBe('A');
    expect(result.Answer?.[0].data).toBe('93.184.216.34');
  });

  it('throws error when response status is not ok', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    } as unknown as Response);

    await expect(
      executeDnsQuery({ domain: 'example.com', type: 'A', provider: 'cloudflare' }, mockFetch)
    ).rejects.toThrow('DNS Query failed with HTTP 503');
  });

  it('verifies standard status codes and type IDs', () => {
    expect(DNS_STATUS_CODES[0]).toContain('NoError');
    expect(DNS_STATUS_CODES[3]).toContain('NXDomain');
    expect(DNS_TYPE_IDS.A).toBe(1);
    expect(DNS_TYPE_IDS.AAAA).toBe(28);
    expect(DNS_TYPE_IDS.MX).toBe(15);
  });
});
