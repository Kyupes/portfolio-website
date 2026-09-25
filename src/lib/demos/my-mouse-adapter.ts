export interface MouseModule {
  ccall(name: string, returnType: 'number' | null, argTypes: string[], args: Array<string | number>): number;
  UTF8ToString(pointer: number): string;
}

export interface MouseSolution {
  map: string;
  steps: number;
}

const moduleUrl = '/demos/my-mouse/my_mouse.mjs';
const wasmUrl = '/demos/my-mouse/my_mouse.wasm';
let modulePromise: Promise<MouseModule> | undefined;

async function loadModule(): Promise<MouseModule> {
  modulePromise ??= import(/* @vite-ignore */ moduleUrl)
    .then(({ default: createModule }: { default: (options: { locateFile: (filename: string) => string }) => Promise<MouseModule> }) =>
      createModule({ locateFile: (filename) => filename.endsWith('.wasm') ? wasmUrl : filename }))
    .catch((error: unknown) => {
      modulePromise = undefined;
      throw error;
    });
  return modulePromise;
}

export function solveWithModule(module: MouseModule, map: string): MouseSolution {
  try {
    const status = module.ccall('mouse_solve', 'number', ['string', 'number'], [map, new TextEncoder().encode(map).length]);
    if (status === 1) throw new Error('O mapa de exemplo não foi aceito pelo solucionador.');
    if (status === 2) throw new Error('Não foi encontrado um caminho neste mapa.');
    if (status === 3) throw new Error('Não foi possível preparar o resultado do labirinto.');
    if (status !== 0) throw new Error('O solucionador retornou um resultado inesperado.');

    const pointer = module.ccall('mouse_result', 'number', [], []);
    if (!pointer) throw new Error('O solucionador não retornou um labirinto.');
    const result = module.UTF8ToString(pointer);
    // The C interface counts painted interior cells; a route from the start
    // through those cells to the exit has one more movement than that count.
    const paintedCells = module.ccall('mouse_steps', 'number', [], []);
    return { map: result, steps: paintedCells + 1 };
  } finally {
    module.ccall('mouse_reset', null, [], []);
  }
}

export async function solveMyMouse(map: string): Promise<MouseSolution> {
  const module = await loadModule();
  return solveWithModule(module, map);
}
