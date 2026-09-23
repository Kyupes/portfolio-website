import { describe, expect, test } from 'bun:test';
import {
  localizedProjectFieldsSchema,
  projectMetadataSchema,
} from '../src/content/project-schemas';
import {
  validateAlgorithmCoverage,
  validateLocalizedProjectEntry,
  validateProjectFileIdentity,
} from '../src/content/project-validation';

const validProject = {
  slug: 'example-project',
  status: 'completed',
  categories: ['algorithms'],
  origin: 'academic',
  topics: ['pathfinding'],
  technologies: ['C'],
  sourceCode: { availability: 'public', provider: 'GitHub', url: 'https://example.com/source' },
  demo: { availability: 'interactive', id: 'example-demo' },
  completionDate: '2026-09',
};

describe('shared project metadata', () => {
  test('accepts valid project facts', () => {
    expect(projectMetadataSchema.safeParse(validProject).success).toBe(true);
  });

  test('requires a URL-safe slug and nonempty classification lists', () => {
    expect(projectMetadataSchema.safeParse({ ...validProject, slug: 'Bad Slug' }).success).toBe(false);
    expect(projectMetadataSchema.safeParse({ ...validProject, categories: [] }).success).toBe(false);
    expect(projectMetadataSchema.safeParse({ ...validProject, topics: [] }).success).toBe(false);
    expect(projectMetadataSchema.safeParse({ ...validProject, technologies: [] }).success).toBe(false);
  });

  test('rejects duplicate classification values', () => {
    expect(projectMetadataSchema.safeParse({ ...validProject, categories: ['web', 'web'] }).success).toBe(false);
    expect(projectMetadataSchema.safeParse({ ...validProject, technologies: ['C', 'c'] }).success).toBe(false);
  });

  test('requires a public source provider and HTTP(S) URL', () => {
    expect(projectMetadataSchema.safeParse({
      ...validProject,
      sourceCode: { availability: 'public', url: 'https://example.com/source' },
    }).success).toBe(false);
    expect(projectMetadataSchema.safeParse({
      ...validProject,
      sourceCode: { availability: 'public', provider: 'Gitea', url: 'ftp://example.com/source' },
    }).success).toBe(false);
  });

  test('does not allow a visitor URL for private or unavailable source', () => {
    expect(projectMetadataSchema.safeParse({
      ...validProject,
      sourceCode: { availability: 'private', url: 'https://example.com/source' },
    }).success).toBe(false);
    expect(projectMetadataSchema.safeParse({
      ...validProject,
      sourceCode: { availability: 'unavailable', provider: 'GitHub' },
    }).success).toBe(false);
  });

  test('requires a demo ID only for an interactive demo', () => {
    expect(projectMetadataSchema.safeParse({ ...validProject, demo: { availability: 'interactive' } }).success).toBe(false);
    expect(projectMetadataSchema.safeParse({ ...validProject, demo: { availability: 'planned', id: 'example-demo' } }).success).toBe(false);
  });

  test('allows a completion date only for completed work', () => {
    expect(projectMetadataSchema.safeParse({ ...validProject, status: 'in-progress', completionDate: '2026-09' }).success).toBe(false);
    expect(projectMetadataSchema.safeParse({ ...validProject, completionDate: '2026-13' }).success).toBe(false);
  });

  test('keeps language-independent complexity bounds inside shared algorithm metadata', () => {
    expect(projectMetadataSchema.safeParse({
      ...validProject,
      algorithm: { complexity: { time: 'O(n)', space: 'O(1)' } },
    }).success).toBe(true);
    expect(projectMetadataSchema.safeParse({ ...validProject, complexity: { time: 'O(n)' } }).success).toBe(false);
    expect(projectMetadataSchema.safeParse({ ...validProject, algorithm: { complexity: {} } }).success).toBe(false);
  });
});

describe('localized project content', () => {
  const content = {
    locale: 'pt',
    title: 'Projeto de exemplo',
    summary: 'Resumo curto.',
  };

  test('requires a title and summary and keeps narrative complexity inside algorithm', () => {
    expect(localizedProjectFieldsSchema.safeParse(content).success).toBe(true);
    expect(localizedProjectFieldsSchema.safeParse({ ...content, title: '  ' }).success).toBe(false);
    expect(localizedProjectFieldsSchema.safeParse({ ...content, complexity: { time: 'O(n)' } }).success).toBe(false);
    expect(localizedProjectFieldsSchema.safeParse({
      ...content,
      algorithm: { explanation: 'Explicação', complexity: { explanation: 'Um passo por item.' } },
    }).success).toBe(true);
  });

  test('rejects an empty algorithm or complexity section', () => {
    expect(localizedProjectFieldsSchema.safeParse({ ...content, algorithm: {} }).success).toBe(false);
    expect(localizedProjectFieldsSchema.safeParse({
      ...content,
      algorithm: { explanation: 'Explicação', complexity: {} },
    }).success).toBe(false);
  });

  test('requires a matching file, Portuguese entry, and nonempty description', () => {
    expect(() => validateProjectFileIdentity('example-project', 'example-project', () => true)).not.toThrow();
    expect(() => validateProjectFileIdentity('other', 'example-project', () => true)).toThrow();
    expect(() => validateProjectFileIdentity('example-project', 'example-project', () => false)).toThrow();

    const entry = {
      id: 'pt/example-project',
      locale: 'pt' as const,
      projectId: 'example-project',
      body: 'Descrição do projeto.',
    };
    expect(() => validateLocalizedProjectEntry(entry, () => true)).not.toThrow();
    expect(() => validateLocalizedProjectEntry({ ...entry, body: '  ' }, () => true)).toThrow();
    expect(() => validateLocalizedProjectEntry({ ...entry, id: 'pt/other' }, () => true)).toThrow();
    expect(() => validateLocalizedProjectEntry(entry, () => false)).toThrow();
    expect(() => validateAlgorithmCoverage(entry.id, true, false)).toThrow();
    expect(() => validateAlgorithmCoverage(entry.id, true, true)).not.toThrow();
  });
});
