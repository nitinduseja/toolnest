import React from 'react';

const PRESET_DOMAINS = [
  'google.com',
  'github.com',
  'cloudflare.com',
  'wikipedia.org',
  'toolnest.dev',
];

interface DnsPresetsBarProps {
  onSelect: (domain: string) => void;
}

export const DnsPresetsBar: React.FC<DnsPresetsBarProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface/60 p-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-outline">
        Quick Domains:
      </span>
      {PRESET_DOMAINS.map((domain) => (
        <button
          key={domain}
          type="button"
          onClick={() => onSelect(domain)}
          className="rounded-lg border border-outline-variant/60 bg-surface-container-low/60 px-2.5 py-1 text-xs font-medium text-on-surface transition hover:border-primary/50 hover:bg-surface-container-low"
        >
          {domain}
        </button>
      ))}
    </div>
  );
};
