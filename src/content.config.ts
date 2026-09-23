import { existsSync, readFileSync } from 'node:fs';
import { defineCollection, reference } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { localizedProjectFieldsSchema, projectMetadataSchema } from './content/project-schemas';
import {
  validateAlgorithmCoverage,
  validateLocalizedProjectEntry,
  validateProjectFileIdentity,
} from './content/project-validation';

const projectFiles = glob({
  base: './src/content/projects',
  pattern: '*.json',
  generateId: ({ entry }) => entry.replace(/\.json$/, ''),
});

const projectLoader: Loader = {
  name: 'validated-project-files',
  async load(context) {
    await projectFiles.load(context);

    for (const entry of context.store.values()) {
      const project = projectMetadataSchema.parse(entry.data);
      validateProjectFileIdentity(entry.id, project.slug, (slug) =>
        existsSync(new URL(`./content/project-content/pt/${slug}.md`, import.meta.url)),
      );
    }
  },
};

const localizedProjectSchema = localizedProjectFieldsSchema.extend({
  project: reference('projects'),
});

const localizedFiles = glob({
  base: './src/content/project-content',
  pattern: '**/*.md',
  generateId: ({ entry }) => entry.replace(/\.md$/, '').replaceAll('\\', '/'),
});

const projectContentLoader: Loader = {
  name: 'validated-project-content-files',
  async load(context) {
    await localizedFiles.load(context);

    for (const entry of context.store.values()) {
      const content = localizedProjectSchema.parse(entry.data);
      const projectId = content.project.id;

      validateLocalizedProjectEntry(
        { id: entry.id, locale: content.locale, projectId, body: entry.body },
        (slug) => existsSync(new URL(`./content/projects/${slug}.json`, import.meta.url)),
      );

      const sharedFile = new URL(`./content/projects/${projectId}.json`, import.meta.url);
      const sharedProject = projectMetadataSchema.parse(JSON.parse(readFileSync(sharedFile, 'utf8')));
      validateAlgorithmCoverage(entry.id, Boolean(sharedProject.algorithm), Boolean(content.algorithm));
    }
  },
};

export const collections = {
  projects: defineCollection({ loader: projectLoader, schema: projectMetadataSchema }),
  projectContent: defineCollection({ loader: projectContentLoader, schema: localizedProjectSchema }),
};
