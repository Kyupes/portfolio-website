import { describe, expect, test } from 'bun:test';
import { solveBsqWithModule, type BsqModule } from '../src/lib/demos/my-bsq-adapter';

const exampleMap = '2\n..\n.o\n';
const paintedMap = '2\nx.\n.o\n';

function moduleFor(status: number, pointer = 42, result = paintedMap, size = 1) {
  const calls: Array<[string, Array<string | number>]> = [];
  const module: BsqModule = {
    ccall(name, _returnType, _argTypes, args) {
      calls.push([name, args]);
      return name === 'bsq_solve' ? status : name === 'bsq_result' ? pointer : name === 'bsq_size' ? size : 0;
    },
    UTF8ToString(value) {
      expect(value).toBe(pointer);
      return result;
    },
  };
  return { module, calls };
}

describe('my_bsq browser adapter', () => {
  test('passes exact input and returns the C map and square size', () => {
    const { module, calls } = moduleFor(0);
    expect(solveBsqWithModule(module, exampleMap)).toEqual({ map: paintedMap, size: 1 });
    expect(calls).toEqual([
      ['bsq_solve', [exampleMap, new TextEncoder().encode(exampleMap).length]],
      ['bsq_result', []],
      ['bsq_size', []],
      ['bsq_reset', []],
    ]);
  });

  test('accepts a zero-size result', () => {
    expect(solveBsqWithModule(moduleFor(0, 42, '2\noo\noo\n', 0).module, '2\noo\noo\n').size).toBe(0);
  });

  test.each([1, 2, 99])('handles status %i and resets', (status) => {
    const { module, calls } = moduleFor(status);
    expect(() => solveBsqWithModule(module, exampleMap)).toThrow();
    expect(calls.at(-1)?.[0]).toBe('bsq_reset');
  });

  test.each([[0, paintedMap, 1], [42, '', 1], [42, paintedMap, -1], [42, paintedMap, 1.5]])(
    'rejects unexpected result data and resets', (pointer, result, size) => {
      const { module, calls } = moduleFor(0, pointer, result, size);
      expect(() => solveBsqWithModule(module, exampleMap)).toThrow();
      expect(calls.at(-1)?.[0]).toBe('bsq_reset');
    },
  );
});
