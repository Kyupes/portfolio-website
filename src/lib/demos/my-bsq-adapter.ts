export interface BsqModule {
  ccall(name: string, returnType: 'number' | null, argTypes: string[], args: Array<string | number>): number;
  UTF8ToString(pointer: number): string;
}

export interface BsqSolution {
  map: string;
  size: number;
}

const moduleUrl = '/demos/my-bsq/my_bsq.mjs';
const wasmUrl = '/demos/my-bsq/my_bsq.wasm';
let modulePromise: Promise<BsqModule> | undefined;

async function loadModule(): Promise<BsqModule> {
  modulePromise ??= import(/* @vite-ignore */ moduleUrl)
    .then(({ default: createModule }: { default: (options: { locateFile: (filename: string) => string }) => Promise<BsqModule> }) =>
      createModule({ locateFile: (filename) => filename.endsWith('.wasm') ? wasmUrl : filename }))
    .catch((error: unknown) => {
      modulePromise = undefined;
      throw error;
    });
  return modulePromise;
}

export function solveBsqWithModule(module: BsqModule, map: string): BsqSolution {
  try {
    const status = module.ccall('bsq_solve', 'number', ['string', 'number'], [map, new TextEncoder().encode(map).length]);
    if (status === 1) throw new Error('O mapa gerado não foi aceito pelo solucionador.');
    if (status === 2) throw new Error('Não foi possível preparar o resultado do mapa.');
    if (status !== 0) throw new Error('O solucionador retornou um status inesperado.');

    const pointer = module.ccall('bsq_result', 'number', [], []);
    if (!pointer) throw new Error('O solucionador não retornou um mapa.');
    const result = module.UTF8ToString(pointer);
    const size = module.ccall('bsq_size', 'number', [], []);
    if (!result || !Number.isInteger(size) || size < 0) {
      throw new Error('O solucionador retornou dados inesperados.');
    }
    return { map: result, size };
  } finally {
    module.ccall('bsq_reset', null, [], []);
  }
}

export async function solveMyBsq(map: string): Promise<BsqSolution> {
  return solveBsqWithModule(await loadModule(), map);
}
