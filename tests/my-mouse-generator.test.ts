import { describe, expect, test } from 'bun:test';
import { generateMyMouseMaze, isMouseDimension, mouseDimensionLimits } from '../src/lib/demos/my-mouse-generator';

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function inspectMaze(width: number, height: number, seed: number): void {
  const { map, construction } = generateMyMouseMaze(width, height, seededRandom(seed));
  expect(map.includes('\r')).toBe(false);
  expect(map.endsWith('\n')).toBe(true);
  const [header, ...rowsWithEmpty] = map.split('\n');
  const rows = rowsWithEmpty.slice(0, -1);
  expect(rowsWithEmpty.at(-1)).toBe('');
  expect(header).toBe(`${height}x${width}* o12`);
  expect(rows).toHaveLength(height);
  expect(rows.every((row) => row.length === width && /^[* 12]+$/.test(row))).toBe(true);
  expect(rows.join('').match(/1/g)).toHaveLength(1);
  expect(rows.join('').match(/2/g)).toHaveLength(1);

  const entrance = rows.flatMap((row, y) => [...row].flatMap((value, x) => value === '1' ? [{ x, y }] : []))[0];
  const exit = rows.flatMap((row, y) => [...row].flatMap((value, x) => value === '2' ? [{ x, y }] : []))[0];
  expect(rows[0][0]).toBe('*');
  expect(rows[0][width - 1]).toBe('*');
  expect(rows[height - 1][0]).toBe('*');
  expect(rows[height - 1][width - 1]).toBe('*');
  const oppositeLeftRight = entrance.x === 0 && exit.x === width - 1 || entrance.x === width - 1 && exit.x === 0;
  const oppositeTopBottom = entrance.y === 0 && exit.y === height - 1 || entrance.y === height - 1 && exit.y === 0;
  expect(oppositeLeftRight || oppositeTopBottom).toBe(true);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        expect(rows[y][x] === '*' || x === entrance.x && y === entrance.y || x === exit.x && y === exit.y).toBe(true);
      }
    }
  }

  // This is the route the generator constructs, not a second shortest-path search.
  // Its chord joins two adjacent grid cells separated by a three-edge detour.
  const route = construction.route;
  const { from, to } = construction.shortcut;
  const fromIndex = route.findIndex((point) => point.x === from.x && point.y === from.y);
  const toIndex = route.findIndex((point) => point.x === to.x && point.y === to.y);
  expect(toIndex - fromIndex).toBe(3);
  expect(Math.abs(from.x - to.x) + Math.abs(from.y - to.y)).toBe(2);
  expect(rows[(from.y + to.y) / 2][(from.x + to.x) / 2]).toBe(' ');
  if (Math.min(width, height) >= 15) {
    const unopenedBends = route.slice(0, -3).filter((point, index) => {
      const later = route[index + 3];
      return Math.abs(point.x - later.x) + Math.abs(point.y - later.y) === 2 &&
        rows[(point.y + later.y) / 2][(point.x + later.x) / 2] === '*';
    });
    expect(unopenedBends.length).toBeGreaterThan(0);
  }
  for (let index = 1; index < route.length; index++) {
    const a = route[index - 1];
    const b = route[index];
    expect(Math.abs(a.x - b.x) + Math.abs(a.y - b.y)).toBe(2);
    expect(rows[(a.y + b.y) / 2][(a.x + b.x) / 2]).toBe(' ');
  }
}

describe('my_mouse maze generator', () => {
  test('enforces demo-only integer dimension limits', () => {
    expect(mouseDimensionLimits).toEqual({ min: 5, max: 50, defaultWidth: 25, defaultHeight: 15 });
    for (const value of [4, 51, 5.5, 0, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(isMouseDimension(value)).toBe(false);
      expect(() => generateMyMouseMaze(value, 15)).toThrow(RangeError);
    }
    expect(isMouseDimension(5)).toBe(true);
    expect(isMouseDimension(50)).toBe(true);
  });

  test.each([[5, 5], [6, 6], [25, 15], [15, 25], [50, 50]])('generates valid %i × %i maps across seeds', (width, height) => {
    for (let seed = 0; seed < 20; seed++) inspectMaze(width, height, seed);
  });

  test('supports both orientations and directions', () => {
    const openings = new Set<string>();
    for (const orientation of [0.1, 0.9]) {
      for (const direction of [0.1, 0.9]) {
        const values = [orientation, direction];
        const map = generateMyMouseMaze(9, 7, () => values.shift() ?? 0.1).map;
        const rows = map.split('\n').slice(1, -1);
        const row = rows.findIndex((line) => line.includes('1'));
        const column = rows[row].indexOf('1');
        openings.add(`${column},${row}`);
      }
    }
    expect(openings.size).toBe(4);
  });

  test('random seeds produce different layouts at the default dimensions', () => {
    const layouts = new Set(Array.from({ length: 8 }, (_, seed) =>
      generateMyMouseMaze(mouseDimensionLimits.defaultWidth, mouseDimensionLimits.defaultHeight, seededRandom(seed)).map));
    expect(layouts.size).toBeGreaterThan(1);
  });

  test('fails promptly when randomness is unusable', () => {
    for (const value of [-1, 1, Number.NaN]) {
      expect(() => generateMyMouseMaze(25, 15, () => value)).toThrow();
    }
  });

  test('terminates at the maximum dimensions even with repetitive randomness', () => {
    inspectMaze(50, 50, 0);
    expect(generateMyMouseMaze(50, 50, () => 0).map.startsWith('50x50* o12\n')).toBe(true);
  });
});
