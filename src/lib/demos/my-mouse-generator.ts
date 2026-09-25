export const mouseDimensionLimits = { min: 5, max: 50, defaultWidth: 25, defaultHeight: 15 } as const;

type Cell = { x: number; y: number };

export interface GeneratedMouseMaze {
  map: string;
  construction: {
    route: Cell[];
    shortcut: { from: Cell; to: Cell };
  };
}

export function isMouseDimension(value: number): boolean {
  return Number.isInteger(value) && value >= mouseDimensionLimits.min && value <= mouseDimensionLimits.max;
}

export function generateMyMouseMaze(width: number, height: number, random: () => number = Math.random): GeneratedMouseMaze {
  if (!isMouseDimension(width) || !isMouseDimension(height)) {
    throw new RangeError('A largura e a altura devem ser números inteiros entre 5 e 50.');
  }

  function pick(count: number): number {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) {
      throw new Error('Não foi possível gerar o labirinto. Tente novamente.');
    }
    return Math.floor(value * count);
  }

  const vertical = pick(2) === 1;
  const reverse = pick(2) === 1;
  const along = vertical ? height : width;
  const across = vertical ? width : height;
  const alongCount = Math.floor((along - 3) / 2) + 1;
  const acrossCount = Math.floor((across - 3) / 2) + 1;
  const track = pick(acrossCount);
  const otherTrack = track === 0 ? 1 : track === acrossCount - 1 ? track - 1 : track + (pick(2) === 0 ? -1 : 1);
  const shortcutSegment = pick(alongCount - 1);
  const detours = new Set([shortcutSegment]);
  const candidates = Array.from({ length: alongCount - 1 }, (_, index) => index)
    .filter((index) => Math.abs(index - shortcutSegment) > 1);
  const additionalDetours = Math.floor((alongCount - 2) / 3);
  while (candidates.length && detours.size <= additionalDetours) {
    const index = pick(candidates.length);
    const segment = candidates[index];
    detours.add(segment);
    candidates.splice(index, 1);
    for (let remaining = candidates.length - 1; remaining >= 0; remaining--) {
      if (Math.abs(candidates[remaining] - segment) <= 1) candidates.splice(remaining, 1);
    }
  }
  const walls = Array.from({ length: across }, () => Array<string>(along).fill('*'));
  const logical = (cell: Cell): Cell => ({ x: 1 + 2 * cell.x, y: 1 + 2 * cell.y });
  const key = (cell: Cell): number => cell.y * alongCount + cell.x;
  const visited = new Set<number>();

  function carve(cell: Cell): void {
    const { x, y } = logical(cell);
    walls[y][x] = ' ';
  }

  function connect(from: Cell, to: Cell): void {
    const a = logical(from);
    const b = logical(to);
    walls[(a.y + b.y) / 2][(a.x + b.x) / 2] = ' ';
  }

  // Multiple separated bends keep the route nontrivial after one bend is
  // shortened. The seeded tree path remains simple and connected.
  const route: Cell[] = [{ x: 0, y: track }];
  let shortcutFromIndex = -1;
  for (let x = 0; x < alongCount - 1; x++) {
    if (detours.has(x)) {
      if (x === shortcutSegment) shortcutFromIndex = route.length - 1;
      route.push({ x, y: otherTrack }, { x: x + 1, y: otherTrack }, { x: x + 1, y: track });
    } else {
      route.push({ x: x + 1, y: track });
    }
  }

  for (let index = 0; index < route.length; index++) {
    const cell = route[index];
    visited.add(key(cell));
    carve(cell);
    if (index > 0) connect(route[index - 1], cell);
  }

  type Frontier = { from: Cell; to: Cell };
  const frontier: Frontier[] = [];
  function addFrontier(from: Cell): void {
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const to = { x: from.x + dx, y: from.y + dy };
      if (to.x >= 0 && to.x < alongCount && to.y >= 0 && to.y < acrossCount && !visited.has(key(to))) {
        frontier.push({ from, to });
      }
    }
  }
  for (const cell of route) addFrontier(cell);

  const total = alongCount * acrossCount;
  let attempts = 0;
  while (visited.size < total && frontier.length && attempts < 4 * total) {
    attempts++;
    const index = pick(frontier.length);
    const edge = frontier[index];
    frontier[index] = frontier[frontier.length - 1];
    frontier.pop();
    if (visited.has(key(edge.to))) continue;
    connect(edge.from, edge.to);
    carve(edge.to);
    visited.add(key(edge.to));
    addFrontier(edge.to);
  }
  if (visited.size !== total) throw new Error('Não foi possível gerar o labirinto. Tente novamente.');

  const shortcut = { from: route[shortcutFromIndex], to: route[shortcutFromIndex + 3] };
  connect(shortcut.from, shortcut.to);
  const opening = logical({ x: 0, y: track }).y;
  walls[opening][0] = '1';
  const last = logical({ x: alongCount - 1, y: track }).x;
  for (let x = last + 1; x < along - 1; x++) walls[opening][x] = ' ';
  walls[opening][along - 1] = '2';

  function transform(cell: Cell): Cell {
    const x = reverse ? along - 1 - cell.x : cell.x;
    return vertical ? { x: cell.y, y: x } : { x, y: cell.y };
  }
  const grid = Array.from({ length: height }, () => Array<string>(width).fill('*'));
  for (let y = 0; y < across; y++) {
    for (let x = 0; x < along; x++) {
      const position = transform({ x, y });
      grid[position.y][position.x] = walls[y][x];
    }
  }

  return {
    map: `${height}x${width}* o12\n${grid.map((row) => row.join('')).join('\n')}\n`,
    construction: {
      route: route.map((cell) => transform(logical(cell))),
      shortcut: {
        from: transform(logical(shortcut.from)),
        to: transform(logical(shortcut.to)),
      },
    },
  };
}
