import { describe, expect, test } from 'bun:test';
import { exampleMap, solveWithModule, type MouseModule } from '../src/lib/demos/my-mouse-adapter';

const solvedMap = '3x5* o12\n*****\n*1o2*\n*****\n';

function moduleFor(status: number, pointer = 42): { module: MouseModule; calls: Array<[string, Array<string | number>]> } {
  const calls: Array<[string, Array<string | number>]> = [];
  return {
    calls,
    module: {
      ccall(name, _returnType, _argTypes, args) {
        calls.push([name, args]);
        return name === 'mouse_solve' ? status : name === 'mouse_result' ? pointer : name === 'mouse_steps' ? 1 : 0;
      },
      UTF8ToString(value) {
        expect(value).toBe(pointer);
        return solvedMap;
      },
    },
  };
}

describe('my_mouse browser adapter', () => {
  test('passes the complete LF-terminated map and length, reads output, and resets', () => {
    const { module, calls } = moduleFor(0);
    expect(solveWithModule(module, exampleMap)).toEqual({ map: solvedMap, steps: 1 });
    expect(calls).toEqual([
      ['mouse_solve', [exampleMap, new TextEncoder().encode(exampleMap).length]],
      ['mouse_result', []],
      ['mouse_steps', []],
      ['mouse_reset', []],
    ]);
  });

  test.each([1, 2, 3, 99])('handles solver status %i locally and resets', (status) => {
    const { module, calls } = moduleFor(status);
    expect(() => solveWithModule(module, exampleMap)).toThrow();
    expect(calls.at(-1)?.[0]).toBe('mouse_reset');
  });

  test('rejects a missing result and resets', () => {
    const { module, calls } = moduleFor(0, 0);
    expect(() => solveWithModule(module, exampleMap)).toThrow();
    expect(calls.at(-1)?.[0]).toBe('mouse_reset');
  });
});
