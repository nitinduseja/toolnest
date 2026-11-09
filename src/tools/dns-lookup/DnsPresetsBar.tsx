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
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-surface-primary/60 p-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        Quick Domains:
      </span>
      {PRESET_DOMAINS.map((domain) => (
        <button
          key={domain}
          type="button"
          onClick={() => onSelect(domain)}
          className="rounded-lg border border-border/60 bg-surface-secondary/60 px-2.5 py-1 text-xs font-medium text-text-primary transition hover:border-primary/50 hover:bg-surface-secondary"
        >
          {domain}
        </button>
      ))}
    </div>
  );
};
