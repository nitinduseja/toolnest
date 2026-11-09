import React, { useState, useEffect, useCallback } from 'react';
import { DnsRecordType, DnsProvider, DnsResponse } from './types';
import { executeDnsQuery, cleanDomainInput, DNS_STATUS_CODES } from './dnsLogic';
import { DnsPresetsBar } from './DnsPresetsBar';
import { DnsRecordCard } from './DnsRecordCard';
import { Icon } from '@/components/atoms/Icon';

const RECORD_TYPES: DnsRecordType[] = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'CAA'];

export const DnsLookup: React.FC = () => {
  const [domain, setDomain] = useState<string>('github.com');
  const [recordType, setRecordType] = useState<DnsRecordType>('A');
  const [provider, setProvider] = useState<DnsProvider>('cloudflare');
  const [response, setResponse] = useState<DnsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  const runQuery = useCallback(async () => {
    const cleaned = cleanDomainInput(domain);
    if (!cleaned) {
      setError('Please provide a valid domain name.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await executeDnsQuery({ domain: cleaned, type: recordType, provider });
      setResponse(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'DNS lookup request failed');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }, [domain, recordType, provider]);

  useEffect(() => {
    void runQuery();
  }, [runQuery]);

  const statusLabel = response
    ? DNS_STATUS_CODES[response.Status] || `Status ${response.Status}`
    : '';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon name="Globe" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              DNS over HTTPS (DoH) Inspector
            </h1>
            <p className="text-xs text-text-secondary sm:text-sm">
              Query global DNS records directly from your browser using privacy-preserving
              Cloudflare and Google DoH endpoints.
            </p>
          </div>
        </div>
      </div>

      <DnsPresetsBar onSelect={(d) => setDomain(d)} />

      {/* Query Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void runQuery()}
              placeholder="e.g. example.com"
              className="w-full rounded-lg border border-border/60 bg-surface-secondary/70 px-3.5 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="DNS Provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as DnsProvider)}
              className="rounded-lg border border-border/60 bg-surface-secondary px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="cloudflare">Cloudflare (1.1.1.1)</option>
              <option value="google">Google (8.8.8.8)</option>
            </select>

            <button
              type="button"
              onClick={() => void runQuery()}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              <Icon
                name={loading ? 'RefreshCw' : 'Search'}
                className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`}
              />
              <span>{loading ? 'Resolving...' : 'Lookup'}</span>
            </button>
          </div>
        </div>

        {/* Record Type Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Record Type:
          </span>
          {RECORD_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRecordType(type)}
              className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                recordType === type
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border/50 bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-medium text-red-500">
          {error}
        </div>
      )}

      {/* Response Display */}
      {response && !error && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-secondary">
                Status: <strong className="text-text-primary">{statusLabel}</strong>
              </span>
              {response.Answer && (
                <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-[11px] text-text-tertiary">
                  {response.Answer.length} record{response.Answer.length === 1 ? '' : 's'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-surface-primary p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                  viewMode === 'table'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary'
                }`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('json')}
                className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                  viewMode === 'json' ? 'bg-primary text-primary-foreground' : 'text-text-secondary'
                }`}
              >
                Raw JSON
              </button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <DnsRecordCard answers={response.Answer || []} />
          ) : (
            <pre className="max-h-96 overflow-auto rounded-xl border border-border/50 bg-surface-secondary/70 p-4 font-mono text-xs text-text-primary">
              <code>{JSON.stringify(response, null, 2)}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default DnsLookup;
