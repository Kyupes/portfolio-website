import { describe, expect, test } from 'bun:test';
import {
  categoryLabels,
  formatCompletionDate,
  originLabels,
  statusLabels,
} from '../src/lib/project-presentation';
import { renderProjectMarkdown } from '../src/lib/render-project-markdown';

describe('Portuguese project presentation', () => {
  test('provides labels for shared project facts', () => {
    expect(statusLabels['in-progress']).toBe('Em andamento');
    expect(statusLabels.completed).toBe('Concluído');
    expect(originLabels.academic).toBe('Acadêmico');
    expect(categoryLabels.algorithms).toBe('Algoritmos');
  });

  test('formats month and full completion dates without shifting time zones', () => {
    expect(formatCompletionDate('2026-09')).toBe('setembro de 2026');
    expect(formatCompletionDate('2026-09-23')).toBe('23 de setembro de 2026');
  });

  test('renders authored technical Markdown as static HTML', async () => {
    const html = await renderProjectMarkdown('Uma **decisão** com [fonte](https://example.com).');
    expect(html).toContain('<strong>decisão</strong>');
    expect(html).toContain('href="https://example.com"');
  });
});
