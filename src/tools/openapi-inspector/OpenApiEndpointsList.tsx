import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { OpenApiEndpoint, HttpMethod } from './types';

interface OpenApiEndpointsListProps {
  endpoints: OpenApiEndpoint[];
  selectedId?: string;
  onSelect: (endpoint: OpenApiEndpoint) => void;
}

export const OpenApiEndpointsList: React.FC<OpenApiEndpointsListProps> = ({
  endpoints,
  selectedId,
  onSelect,
}) => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');

  const getMethodBadge = (method: HttpMethod) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'POST':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'PUT':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'DELETE':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'PATCH':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30';
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return endpoints.filter((e) => {
      const matchesMethod = methodFilter === 'ALL' || e.method === methodFilter;
      const matchesSearch =
        !q ||
        e.path.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q));
      return matchesMethod && matchesSearch;
    });
  }, [endpoints, search, methodFilter]);

  const methods = ['ALL', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  return (
    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter endpoints by path or keyword..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Method Filters */}
      <div className="flex flex-wrap gap-1">
        {methods.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethodFilter(m)}
            className={`px-2 py-0.5 text-[11px] font-mono font-semibold rounded-lg border transition-all ${
              methodFilter === m
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Endpoints Count */}
      <div className="text-[11px] font-semibold text-outline uppercase tracking-wider">
        Showing {filtered.length} of {endpoints.length} Endpoints
      </div>

      {/* Endpoints Scroll List */}
      <div className="space-y-2 max-h-[440px] overflow-y-auto p-0.5">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-outline">
            No endpoints matched your filter.
          </div>
        ) : (
          filtered.map((ep) => {
            const isSelected = ep.id === selectedId;
            return (
              <button
                key={ep.id}
                type="button"
                onClick={() => onSelect(ep)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border ${getMethodBadge(
                      ep.method
                    )}`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-semibold text-on-surface truncate">
                    {ep.path}
                  </span>
                </div>
                <div className="text-[11px] text-outline truncate">{ep.summary}</div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
