import React, { useState, useMemo } from 'react';
import { Search, Globe, Shield, Radio, X } from 'lucide-react';
import { StatusCategory } from './statusCodesData';
import { HeaderCategory } from './headersData';
import { filterStatusCodes, filterHttpHeaders } from './httpLookupLogic';
import { StatusCodeCard } from './StatusCodeCard';
import { HeaderCard } from './HeaderCard';

type TabMode = 'status-codes' | 'headers';

const STATUS_CATEGORIES: { id: StatusCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Codes' },
  { id: '1xx', label: '1xx Informational' },
  { id: '2xx', label: '2xx Success' },
  { id: '3xx', label: '3xx Redirection' },
  { id: '4xx', label: '4xx Client Error' },
  { id: '5xx', label: '5xx Server Error' },
];

const HEADER_CATEGORIES: { id: HeaderCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Headers' },
  { id: 'security', label: 'Security' },
  { id: 'cors', label: 'CORS' },
  { id: 'caching', label: 'Caching' },
  { id: 'authentication', label: 'Auth' },
  { id: 'content-negotiation', label: 'Negotiation' },
];

export const HttpStatusLookupTool: React.FC = () => {
  const [tab, setTab] = useState<TabMode>('status-codes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusCategory, setStatusCategory] = useState<StatusCategory | 'all'>('all');
  const [headerCategory, setHeaderCategory] = useState<HeaderCategory | 'all'>('all');

  const filteredStatusCodes = useMemo(() => {
    return filterStatusCodes(searchQuery, statusCategory);
  }, [searchQuery, statusCategory]);

  const filteredHeaders = useMemo(() => {
    return filterHttpHeaders(searchQuery, headerCategory);
  }, [searchQuery, headerCategory]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Notice Ribbon */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>HTTP Protocol Reference:</strong> Offline RFC-compliant dictionary of HTTP
            status codes and modern security/CORS/caching headers.
          </span>
        </div>
      </div>

      {/* Main Tab Controls: Status Codes vs Headers */}
      <div className="flex bg-surface-container-low rounded-xl p-1 border border-outline-variant max-w-md">
        <button
          type="button"
          onClick={() => {
            setTab('status-codes');
            setSearchQuery('');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'status-codes'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Status Codes ({filteredStatusCodes.length})</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('headers');
            setSearchQuery('');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'headers'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>HTTP Headers ({filteredHeaders.length})</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            tab === 'status-codes'
              ? 'Search status code (e.g., 404, teapot, unauthorized, gateway)...'
              : 'Search HTTP header (e.g., csp, origin, authorization, etag)...'
          }
          className="w-full py-2.5 pl-10 pr-10 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface placeholder:text-outline focus:outline-hidden focus:border-primary transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-outline hover:text-on-surface transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-outline uppercase tracking-wider">
          Category:
        </span>
        {tab === 'status-codes'
          ? STATUS_CATEGORIES.map((cat) => {
              const isActive = statusCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setStatusCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary border border-primary shadow-xs font-semibold'
                      : 'bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })
          : HEADER_CATEGORIES.map((cat) => {
              const isActive = headerCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setHeaderCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary border border-primary shadow-xs font-semibold'
                      : 'bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
      </div>

      {/* Results Grid */}
      {tab === 'status-codes' ? (
        filteredStatusCodes.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-surface-container-low border border-outline-variant space-y-2">
            <p className="text-xs font-semibold text-on-surface">No status codes found</p>
            <p className="text-xs text-outline">
              No matching status code found for &quot;{searchQuery}&quot;. Try clearing filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStatusCodes.map((status) => (
              <StatusCodeCard key={status.code} status={status} />
            ))}
          </div>
        )
      ) : filteredHeaders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-surface-container-low border border-outline-variant space-y-2">
          <p className="text-xs font-semibold text-on-surface">No headers found</p>
          <p className="text-xs text-outline">
            No matching HTTP header found for &quot;{searchQuery}&quot;. Try clearing filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHeaders.map((header) => (
            <HeaderCard key={header.name} header={header} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HttpStatusLookupTool;
