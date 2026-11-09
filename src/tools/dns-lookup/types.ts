export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA' | 'CAA';

export type DnsProvider = 'cloudflare' | 'google';

export interface DnsAnswer {
  name: string;
  type: number;
  typeName: string;
  TTL: number;
  data: string;
}

export interface DnsResponse {
  Status: number;
  TC?: boolean;
  RD?: boolean;
  RA?: boolean;
  AD?: boolean;
  CD?: boolean;
  Question: Array<{ name: string; type: number }>;
  Answer?: DnsAnswer[];
  Comment?: string;
}

export interface DnsQueryOptions {
  domain: string;
  type: DnsRecordType;
  provider: DnsProvider;
}
