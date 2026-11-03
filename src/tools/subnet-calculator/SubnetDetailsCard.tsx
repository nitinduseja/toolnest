import React from 'react';
import { Copy, Check, Network } from 'lucide-react';
import { SubnetDetails } from './types';

export interface SubnetDetailsCardProps {
  details: SubnetDetails;
}

export const SubnetDetailsCard: React.FC<SubnetDetailsCardProps> = ({ details }) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rows = [
    { label: 'IP Address', value: details.ip, key: 'ip' },
    { label: 'Network Address', value: `${details.networkAddress}/${details.cidr}`, key: 'net' },
    { label: 'Subnet Mask', value: details.netmask, key: 'mask' },
    { label: 'Wildcard Mask', value: details.wildcardMask, key: 'wildcard' },
    { label: 'Broadcast Address', value: details.broadcastAddress, key: 'bcast' },
    {
      label: 'Usable Host Range',
      value: `${details.firstUsableIp} - ${details.lastUsableIp}`,
      key: 'range',
    },
    {
      label: 'Usable Hosts',
      value: `${details.usableHosts.toLocaleString()} (${details.totalHosts.toLocaleString()} total)`,
      key: 'hosts',
    },
    {
      label: 'IP Class & Scope',
      value: `Class ${details.ipClass} • ${details.ipType}`,
      key: 'scope',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between text-xs"
          >
            <div>
              <span className="text-[11px] text-outline font-medium block">{row.label}</span>
              <span className="font-mono font-semibold text-on-surface text-sm mt-0.5 block">
                {row.value}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(row.value, row.key)}
              title="Copy value"
              className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface cursor-pointer"
            >
              {copiedKey === row.key ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Binary Representation */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
          <Network className="w-4 h-4 text-primary" />
          <span>Binary Representation (32-bit Breakdown)</span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div>
            <div className="flex justify-between text-[11px] text-outline mb-0.5">
              <span>IP Address:</span>
              <span className="text-primary font-bold">/{details.cidr} Network</span>
            </div>
            <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/60 tracking-wider overflow-x-auto text-on-surface">
              {details.binaryIp}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-outline mb-0.5">Subnet Mask:</div>
            <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/60 tracking-wider overflow-x-auto text-primary font-semibold">
              {details.binaryNetmask}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
