import { describe, expect, test } from 'bun:test';
import type { CollectionEntry } from 'astro:content';
import { getPortugueseProjects } from '../src/lib/portuguese-projects';

type Project = CollectionEntry<'projects'>;
type ProjectContent = CollectionEntry<'projectContent'>;

const projects = [
  { id: 'first-project', data: { slug: 'first-project' } },
  { id: 'second-project', data: { slug: 'second-project' } },
] as Project[];

const entries = [
  { id: 'en/first-project', data: { locale: 'en', project: { id: 'first-project' }, title: 'English' } },
  { id: 'pt/second-project', data: { locale: 'pt', project: { id: 'second-project' }, title: 'Zeta' } },
  { id: 'pt/first-project', data: { locale: 'pt', project: { id: 'first-project' }, title: 'Alfa' } },
] as ProjectContent[];

describe('Portuguese project routes', () => {
  test('allows an empty content collection', () => {
    expect(getPortugueseProjects([], [])).toEqual([]);
  });

  test('joins Portuguese content to shared identity and uses its slug', () => {
    expect(getPortugueseProjects(projects, entries).map(({ slug, content }) => [slug, content.id])).toEqual([
      ['first-project', 'pt/first-project'],
      ['second-project', 'pt/second-project'],
    ]);
  });

  test('rejects Portuguese content without shared metadata', () => {
    expect(() => getPortugueseProjects([], entries)).toThrow('references a missing project');
  });
});
