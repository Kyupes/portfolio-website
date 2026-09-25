export const bsqSizeLimits = { min: 5, max: 50, default: 20 } as const;

export interface GeneratedBsqMap {
  map: string;
  candidate: { x: number; y: number; size: number };
}

export function isBsqSize(value: number): boolean {
  return Number.isInteger(value) && value >= bsqSizeLimits.min && value <= bsqSizeLimits.max;
}

export function generateMyBsqMap(size: number, random: () => number = Math.random): GeneratedBsqMap {
  if (!isBsqSize(size)) throw new RangeError('Informe um tamanho inteiro entre 5 e 50.');

  function pick(count: number): number {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) {
      throw new Error('Não foi possível gerar o mapa. Tente novamente.');
    }
    return Math.floor(value * count);
  }

  // Keep a visible empty square, without deciding whether it is the largest.
  const candidateSize = Math.max(2, Math.floor(size / 4));
  const candidate = {
    x: pick(size - candidateSize + 1),
    y: pick(size - candidateSize + 1),
    size: candidateSize,
  };
  const rows = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      const protectedCell = x >= candidate.x && x < candidate.x + candidate.size &&
        y >= candidate.y && y < candidate.y + candidate.size;
      return protectedCell ? '.' : pick(4) === 0 ? 'o' : '.';
    }).join(''));

  return { map: `${size}\n${rows.join('\n')}\n`, candidate };
}
