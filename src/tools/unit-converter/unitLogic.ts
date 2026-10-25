export type UnitCategory = 'length' | 'mass' | 'temperature' | 'data';

export interface ConversionUnit {
  id: string;
  label: string;
  toBase?: (val: number) => number;
  fromBase?: (val: number) => number;
  factor?: number; // relative to base unit
}

export const UNIT_DEFINITIONS: Record<UnitCategory, ConversionUnit[]> = {
  length: [
    { id: 'm', label: 'Meters (m)', factor: 1 },
    { id: 'km', label: 'Kilometers (km)', factor: 1000 },
    { id: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
    { id: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
    { id: 'mi', label: 'Miles (mi)', factor: 1609.344 },
    { id: 'yd', label: 'Yards (yd)', factor: 0.9144 },
    { id: 'ft', label: 'Feet (ft)', factor: 0.3048 },
    { id: 'in', label: 'Inches (in)', factor: 0.0254 },
  ],
  mass: [
    { id: 'kg', label: 'Kilograms (kg)', factor: 1 },
    { id: 'g', label: 'Grams (g)', factor: 0.001 },
    { id: 'mg', label: 'Milligrams (mg)', factor: 0.000001 },
    { id: 'lb', label: 'Pounds (lb)', factor: 0.45359237 },
    { id: 'oz', label: 'Ounces (oz)', factor: 0.028349523125 },
    { id: 'ton', label: 'Metric Ton (t)', factor: 1000 },
  ],
  temperature: [
    {
      id: 'c',
      label: 'Celsius (°C)',
      toBase: (c) => c,
      fromBase: (c) => c,
    },
    {
      id: 'f',
      label: 'Fahrenheit (°F)',
      toBase: (f) => ((f - 32) * 5) / 9,
      fromBase: (c) => (c * 9) / 5 + 32,
    },
    {
      id: 'k',
      label: 'Kelvin (K)',
      toBase: (k) => k - 273.15,
      fromBase: (c) => c + 273.15,
    },
  ],
  data: [
    { id: 'b', label: 'Bytes (B)', factor: 1 },
    // Decimal (SI 1000^n)
    { id: 'kb', label: 'Kilobytes (KB - 10³ B)', factor: 1000 },
    { id: 'mb', label: 'Megabytes (MB - 10⁶ B)', factor: 1000000 },
    { id: 'gb', label: 'Gigabytes (GB - 10⁹ B)', factor: 1000000000 },
    { id: 'tb', label: 'Terabytes (TB - 10¹² B)', factor: 1000000000000 },
    // Binary (IEC 1024^n)
    { id: 'kib', label: 'Kibibytes (KiB - 2¹⁰ B)', factor: 1024 },
    { id: 'mib', label: 'Mebibytes (MiB - 2²⁰ B)', factor: 1048576 },
    { id: 'gib', label: 'Gibibytes (GiB - 2³⁰ B)', factor: 1073741824 },
    { id: 'tib', label: 'Tebibytes (TiB - 2⁴⁰ B)', factor: 1099511627776 },
  ],
};

export interface ConvertUnitOptions {
  from: string;
  to: string;
  category: UnitCategory;
}

export function convertUnit(val: number, options: ConvertUnitOptions): number {
  const { from: fromId, to: toId, category } = options;
  if (isNaN(val)) return 0;
  if (fromId === toId) return val;

  const units = UNIT_DEFINITIONS[category];
  const fromUnit = units.find((u) => u.id === fromId);
  const toUnit = units.find((u) => u.id === toId);

  if (!fromUnit || !toUnit) {
    throw new Error(`Invalid unit conversion: ${fromId} to ${toId}`);
  }

  // Temperature formula-based conversion
  if (category === 'temperature') {
    const baseVal = fromUnit.toBase ? fromUnit.toBase(val) : val;
    return toUnit.fromBase ? Number(toUnit.fromBase(baseVal).toFixed(6)) : baseVal;
  }

  // Factor-based conversion
  const fromFactor = fromUnit.factor ?? 1;
  const toFactor = toUnit.factor ?? 1;

  const baseVal = val * fromFactor;
  const result = baseVal / toFactor;
  return Number(result.toPrecision(10)) / 1;
}
