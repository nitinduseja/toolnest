import React, { useState, useMemo } from 'react';
import { Network, ListTree } from 'lucide-react';
import { calculateSubnetDetails, parseCidrInput } from './subnetLogic';
import { SubnetDetailsCard } from './SubnetDetailsCard';
import { VlsmPlanner } from './VlsmPlanner';

const COMMON_PRESETS = [
  { label: '192.168.1.0/24 (Home/LAN)', val: '192.168.1.0/24' },
  { label: '10.0.0.0/16 (Corporate)', val: '10.0.0.0/16' },
  { label: '172.16.0.0/12 (Private B)', val: '172.16.0.0/12' },
  { label: '10.254.1.0/30 (P2P WAN)', val: '10.254.1.0/30' },
];

export const SubnetCalculatorTool: React.FC = () => {
  const [ipInput, setIpInput] = useState<string>('192.168.1.1');
  const [cidr, setCidr] = useState<number>(24);
  const [activeTab, setActiveTab] = useState<'details' | 'vlsm'>('details');

  const parsed = useMemo(() => {
    return parseCidrInput(`${ipInput}/${cidr}`);
  }, [ipInput, cidr]);

  const handleCidrInputChange = (val: string) => {
    if (val.includes('/')) {
      const p = parseCidrInput(val);
      if (p) {
        setIpInput(p.ip);
        setCidr(p.cidr);
        return;
      }
    }
    setIpInput(val);
  };

  const handleApplyPreset = (presetVal: string) => {
    const p = parseCidrInput(presetVal);
    if (p) {
      setIpInput(p.ip);
      setCidr(p.cidr);
    }
  };

  const details = useMemo(() => {
    if (!parsed) return null;
    return calculateSubnetDetails(parsed.ip, parsed.cidr);
  }, [parsed]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">Subnet & CIDR IP Calculator</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              IPv4 & VLSM
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Calculate network bounds, wildcard masks, usable host ranges, and variable-length
            subnets.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {COMMON_PRESETS.map((p) => (
            <button
              key={p.val}
              type="button"
              onClick={() => handleApplyPreset(p.val)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface">
              IP Address / CIDR Notation
            </label>
            <input
              type="text"
              placeholder="e.g. 192.168.1.1 or 10.0.0.0/24"
              value={ipInput}
              onChange={(e) => handleCidrInputChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-sm font-mono text-on-surface"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-on-surface">Subnet Prefix:</span>
              <span className="text-primary font-bold font-mono">/{cidr}</span>
            </div>
            <select
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs font-mono text-on-surface cursor-pointer"
            >
              {Array.from({ length: 33 }, (_, i) => 32 - i).map((c) => (
                <option key={c} value={c}>
                  /{c} ({Math.pow(2, 32 - c).toLocaleString()} hosts)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CIDR Slider */}
        <div className="pt-2">
          <input
            type="range"
            min="1"
            max="32"
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-outline font-mono mt-1">
            <span>/1 (Global WAN)</span>
            <span>/16 (Class B)</span>
            <span>/24 (Class C)</span>
            <span>/32 (Host)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'details'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Subnet Bounds & Binary</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vlsm')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'vlsm'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <ListTree className="w-3.5 h-3.5" />
          <span>VLSM Subnet Planner</span>
        </button>
      </div>

      {/* Content */}
      {details ? (
        activeTab === 'details' ? (
          <SubnetDetailsCard details={details} />
        ) : (
          <VlsmPlanner baseIp={details.networkAddress} baseCidr={details.cidr} />
        )
      ) : (
        <div className="p-8 text-center text-xs text-outline rounded-xl bg-surface-container-low border border-outline-variant">
          Please enter a valid IPv4 address (e.g. 192.168.1.1).
        </div>
      )}
    </div>
  );
};

export default SubnetCalculatorTool;
