import React, { useState, useMemo } from 'react';
import { Copy, Check, ArrowRightLeft, Ruler, Scale, Thermometer, HardDrive } from 'lucide-react';
import { convertUnit, UNIT_DEFINITIONS, UnitCategory } from './unitLogic';
import { copyToClipboard } from '@/lib/clipboard';

export const UnitConverterTool: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('km');
  const [toUnit, setToUnit] = useState('m');
  const [val, setVal] = useState('1');
  const [copied, setCopied] = useState(false);

  const units = UNIT_DEFINITIONS[category];

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const newUnits = UNIT_DEFINITIONS[newCat];
    setFromUnit(newUnits[0].id);
    setToUnit(newUnits[1]?.id || newUnits[0].id);
  };

  const handleSwap = () => {
    const prevFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(prevFrom);
  };

  const result = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) return '0';
    try {
      return String(convertUnit(num, { from: fromUnit, to: toUnit, category }));
    } catch {
      return 'Error';
    }
  }, [val, fromUnit, toUnit, category]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(result);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const categoryIcons: Record<UnitCategory, React.ReactNode> = {
    length: <Ruler className="w-4 h-4" />,
    mass: <Scale className="w-4 h-4" />,
    temperature: <Thermometer className="w-4 h-4" />,
    data: <HardDrive className="w-4 h-4" />,
  };

  return (
    <div className="space-y-6">
      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['length', 'mass', 'temperature', 'data'] as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {categoryIcons[cat]}
            <span>{cat === 'data' ? 'Data Storage' : cat}</span>
          </button>
        ))}
      </div>

      {/* Main Conversion Panel */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Source Input */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-medium text-outline block">
              From ({units.find((u) => u.id === fromUnit)?.label})
            </label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-surface border border-outline-variant font-mono text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:pt-4">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant text-outline hover:text-primary transition-all shadow-xs"
              title="Swap Units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Output */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs text-outline">
              <label className="font-medium">
                To ({units.find((u) => u.id === toUnit)?.label})
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-primary hover:underline flex items-center gap-1"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={result}
              className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-sm text-on-surface focus:outline-none"
            />
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Common Conversions Reference */}
        {category === 'data' && (
          <div className="pt-3 border-t border-outline-variant/60 text-xs text-outline space-y-1">
            <span className="font-semibold text-on-surface-variant">
              Binary vs Decimal Storage:
            </span>
            <p>
              Decimal units (KB, MB, GB) use powers of 10 (1000 bytes per KB). Binary units (KiB,
              MiB, GiB) use powers of 2 (1024 bytes per KiB), commonly reported by operating systems
              and memory hardware.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitConverterTool;
