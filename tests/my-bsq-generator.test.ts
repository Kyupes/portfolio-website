import { describe, expect, test } from 'bun:test';
import { bsqSizeLimits, generateMyBsqMap, isBsqSize } from '../src/lib/demos/my-bsq-generator';

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

describe('my_bsq map generator', () => {
  test('enforces demo-only integer size limits', () => {
    expect(bsqSizeLimits).toEqual({ min: 5, max: 50, default: 20 });
    for (const value of [4, 51, 5.5, 0, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(isBsqSize(value)).toBe(false);
      expect(() => generateMyBsqMap(value)).toThrow(RangeError);
    }
    expect(isBsqSize(5)).toBe(true);
    expect(isBsqSize(50)).toBe(true);
  });

  test.each([5, 20, 50])('generates a valid square map of side %i with a protected candidate', (size) => {
    for (let seed = 0; seed < 12; seed++) {
      const { map, candidate } = generateMyBsqMap(size, seededRandom(seed));
      expect(map.includes('\r')).toBe(false);
      expect(map.endsWith('\n')).toBe(true);
      const [header, ...rowsWithEmpty] = map.split('\n');
      const rows = rowsWithEmpty.slice(0, -1);
      expect(header).toBe(String(size));
      expect(rowsWithEmpty.at(-1)).toBe('');
      expect(rows).toHaveLength(size);
      expect(rows.every((row) => row.length === size && /^[.o]+$/.test(row))).toBe(true);
      expect(candidate.size).toBeGreaterThanOrEqual(2);
      expect(candidate.x).toBeGreaterThanOrEqual(0);
      expect(candidate.y).toBeGreaterThanOrEqual(0);
      expect(candidate.x + candidate.size).toBeLessThanOrEqual(size);
      expect(candidate.y + candidate.size).toBeLessThanOrEqual(size);
      for (let y = candidate.y; y < candidate.y + candidate.size; y++) {
        for (let x = candidate.x; x < candidate.x + candidate.size; x++) {
          expect(rows[y][x]).toBe('.');
        }
      }
    }
  });

  test('seeded randomness produces different layouts', () => {
    const maps = new Set(Array.from({ length: 8 }, (_, seed) => generateMyBsqMap(20, seededRandom(seed)).map));
    expect(maps.size).toBeGreaterThan(1);
  });

  test('rejects unusable randomness promptly and terminates at maximum size', () => {
    for (const value of [-1, 1, Number.NaN]) {
      expect(() => generateMyBsqMap(50, () => value)).toThrow();
    }
    expect(generateMyBsqMap(50, () => 0).map.startsWith('50\n')).toBe(true);
  });
});
