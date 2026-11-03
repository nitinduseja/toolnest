import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { VlsmRequest, VlsmSubnet } from './types';
import { calculateVlsm } from './subnetLogic';

export interface VlsmPlannerProps {
  baseIp: string;
  baseCidr: number;
}

export const VlsmPlanner: React.FC<VlsmPlannerProps> = ({ baseIp, baseCidr }) => {
  const [requests, setRequests] = useState<VlsmRequest[]>([
    { id: '1', name: 'Engineering', neededHosts: 60 },
    { id: '2', name: 'Marketing', neededHosts: 25 },
    { id: '3', name: 'VoIP Devices', neededHosts: 12 },
    { id: '4', name: 'Point-to-Point WAN', neededHosts: 2 },
  ]);
  const [newName, setNewName] = useState<string>('');
  const [newHosts, setNewHosts] = useState<number>(10);

  const handleAdd = () => {
    if (!newName.trim() || newHosts <= 0) return;
    setRequests((prev) => [
      ...prev,
      { id: `req_${Date.now()}`, name: newName.trim(), neededHosts: newHosts },
    ]);
    setNewName('');
    setNewHosts(10);
  };

  const handleRemove = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const allocations: VlsmSubnet[] = calculateVlsm(baseIp, baseCidr, requests);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <span className="text-xs font-semibold text-outline block">
          ADD SUBNET PARTITION (VLSM)
        </span>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            placeholder="Subnet Name (e.g. Sales)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="65534"
              placeholder="Needed Hosts"
              value={newHosts}
              onChange={(e) => setNewHosts(Number(e.target.value))}
              className="w-28 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {allocations.length > 0 && (
        <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-low">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-container border-b border-outline-variant text-[11px] text-outline">
                <tr>
                  <th className="p-3">Subnet</th>
                  <th className="p-3">Needed</th>
                  <th className="p-3">Allocated</th>
                  <th className="p-3">CIDR</th>
                  <th className="p-3">Network / Range</th>
                  <th className="p-3">Mask</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {allocations.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-container/50">
                    <td className="p-3 font-sans font-semibold text-on-surface">{sub.name}</td>
                    <td className="p-3 text-outline">{sub.neededHosts}</td>
                    <td className="p-3 text-emerald-500 font-bold">{sub.allocatedHosts}</td>
                    <td className="p-3 text-primary font-bold">/{sub.cidr}</td>
                    <td className="p-3">
                      <span className="text-on-surface font-semibold">{sub.networkAddress}</span>
                      <span className="text-[10px] text-outline block">
                        {sub.firstUsableIp} - {sub.lastUsableIp}
                      </span>
                    </td>
                    <td className="p-3 text-outline">{sub.netmask}</td>
                    <td className="p-3 text-right font-sans">
                      <button
                        type="button"
                        onClick={() => handleRemove(sub.id)}
                        className="p-1 rounded hover:bg-surface-container text-outline hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
