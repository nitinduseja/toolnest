import { describe, it, expect } from 'vitest';
import { reorderIds, moveIdByStep } from './favoritesOrderLogic';

describe('favoritesOrderLogic', () => {
  const sample = ['uuid-generator', 'json-formatter', 'jwt-studio', 'base64'];

  it('reorders items when dragging forward and backward', () => {
    expect(reorderIds(sample, 'uuid-generator', 'jwt-studio')).toEqual([
      'json-formatter',
      'jwt-studio',
      'uuid-generator',
      'base64',
    ]);

    expect(reorderIds(sample, 'base64', 'json-formatter')).toEqual([
      'uuid-generator',
      'base64',
      'json-formatter',
      'jwt-studio',
    ]);
  });

  it('ignores invalid or identical IDs safely', () => {
    expect(reorderIds(sample, 'uuid-generator', 'uuid-generator')).toBe(sample);
    expect(reorderIds(sample, 'missing', 'json-formatter')).toBe(sample);
    expect(reorderIds(sample, 'uuid-generator', 'missing')).toBe(sample);
  });

  it('moves items cleanly by step offset within bounds', () => {
    expect(moveIdByStep(sample, 'json-formatter', -1)).toEqual([
      'json-formatter',
      'uuid-generator',
      'jwt-studio',
      'base64',
    ]);

    expect(moveIdByStep(sample, 'json-formatter', 1)).toEqual([
      'uuid-generator',
      'jwt-studio',
      'json-formatter',
      'base64',
    ]);

    // Boundary checks
    expect(moveIdByStep(sample, 'uuid-generator', -1)).toEqual(sample);
    expect(moveIdByStep(sample, 'base64', 1)).toEqual(sample);
  });
});
