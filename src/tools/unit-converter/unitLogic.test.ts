import { describe, it, expect } from 'vitest';
import { convertUnit } from './unitLogic';

describe('Unit Converter Domain Logic', () => {
  it('converts length measurements accurately', () => {
    expect(convertUnit(1, { from: 'km', to: 'm', category: 'length' })).toBe(1000);
    expect(convertUnit(1, { from: 'mi', to: 'm', category: 'length' })).toBe(1609.344);
    expect(convertUnit(12, { from: 'in', to: 'ft', category: 'length' })).toBe(1);
  });

  it('converts mass measurements accurately', () => {
    expect(convertUnit(1, { from: 'kg', to: 'g', category: 'mass' })).toBe(1000);
    expect(convertUnit(1, { from: 'lb', to: 'kg', category: 'mass' })).toBeCloseTo(0.453592, 4);
  });

  it('converts temperature between Celsius, Fahrenheit, and Kelvin', () => {
    expect(convertUnit(0, { from: 'c', to: 'f', category: 'temperature' })).toBe(32);
    expect(convertUnit(100, { from: 'c', to: 'f', category: 'temperature' })).toBe(212);
    expect(convertUnit(0, { from: 'c', to: 'k', category: 'temperature' })).toBe(273.15);
    expect(convertUnit(32, { from: 'f', to: 'c', category: 'temperature' })).toBe(0);
  });

  it('accurately distinguishes decimal (SI) and binary (IEC) data units', () => {
    // 1 MB = 1,000,000 bytes
    // 1 MiB = 1,048,576 bytes
    expect(convertUnit(1, { from: 'mb', to: 'b', category: 'data' })).toBe(1000000);
    expect(convertUnit(1, { from: 'mib', to: 'b', category: 'data' })).toBe(1048576);
    expect(convertUnit(1, { from: 'gib', to: 'mib', category: 'data' })).toBe(1024);
  });
});
