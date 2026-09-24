import { describe, expect, test } from 'bun:test';
import { getAvailableProjectFilters, matchesProjectFilters } from '../src/lib/project-filters';

const projects = [
  { categories: ['backend', 'web'], origin: 'personal' },
  { categories: ['algorithms'], origin: 'academic' },
  { categories: ['backend'], origin: 'academic' },
];

describe('project filters', () => {
  test('derives only values used by the available projects', () => {
    expect(getAvailableProjectFilters(projects)).toEqual({
      categories: ['backend', 'web', 'algorithms'],
      origins: ['personal', 'academic'],
    });
    expect(getAvailableProjectFilters([])).toEqual({ categories: [], origins: [] });
  });

  test('keeps every project when filters are cleared', () => {
    expect(projects.filter((project) => matchesProjectFilters(project, { category: '', origin: '' }))).toEqual(
      projects,
    );
  });

  test('filters by category or origin independently', () => {
    expect(projects.filter((project) => matchesProjectFilters(project, { category: 'backend', origin: '' })))
      .toHaveLength(2);
    expect(projects.filter((project) => matchesProjectFilters(project, { category: '', origin: 'academic' })))
      .toHaveLength(2);
  });

  test('requires both criteria when both are selected', () => {
    expect(projects.filter((project) => matchesProjectFilters(project, { category: 'backend', origin: 'academic' })))
      .toEqual([projects[2]]);
    expect(projects.filter((project) => matchesProjectFilters(project, { category: 'web', origin: 'academic' })))
      .toEqual([]);
  });
});
