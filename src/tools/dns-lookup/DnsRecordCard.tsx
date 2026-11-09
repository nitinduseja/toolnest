import React, { useState } from 'react';
import { DnsAnswer } from './types';
import { formatTtl } from './dnsLogic';
import { Icon } from '@/components/atoms/Icon';

interface DnsRecordCardProps {
  answers: DnsAnswer[];
}

export const DnsRecordCard: React.FC<DnsRecordCardProps> = ({ answers }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (answers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 p-8 text-center text-text-tertiary">
        <Icon name="Globe" className="mb-2 h-8 w-8 opacity-40" />
        <p className="text-sm font-medium">No records found for this query.</p>
        <p className="mt-1 text-xs">
          Try selecting a different record type (e.g. A, AAAA, MX) or provider.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-surface-primary/70">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/50 bg-surface-secondary/50 text-text-tertiary">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">Host / Name</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">TTL</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">Value / Target</th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono">
            {answers.map((ans, idx) => (
              <tr key={`${ans.name}-${ans.type}-${idx}`} className="hover:bg-surface-secondary/30">
                <td className="px-4 py-3">
                  <span className="rounded bg-primary/10 px-2 py-0.5 font-sans font-bold text-primary">
                    {ans.typeName}
                  </span>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-text-secondary">{ans.name}</td>
                <td className="px-4 py-3 text-text-tertiary">{formatTtl(ans.TTL)}</td>
                <td className="max-w-md break-all px-4 py-3 font-medium text-text-primary">
                  {ans.data}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleCopy(ans.data, idx)}
                    className="inline-flex items-center gap-1 rounded bg-surface-secondary px-2 py-1 text-text-secondary hover:text-text-primary"
                  >
                    <Icon name={copiedIdx === idx ? 'Check' : 'Copy'} className="h-3 w-3" />
                    <span className="font-sans text-[11px]">
                      {copiedIdx === idx ? 'Copied' : 'Copy'}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
