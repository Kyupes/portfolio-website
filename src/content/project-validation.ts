import { projectSlugSchema } from './project-schemas';

export function validateProjectFileIdentity(
  id: string,
  slug: string,
  hasPortugueseContent: (slug: string) => boolean,
): void {
  if (id !== slug) {
    throw new Error(`Project file ID "${id}" must match its slug "${slug}".`);
  }

  if (!hasPortugueseContent(slug)) {
    throw new Error(`Project "${slug}" needs Portuguese content at pt/${slug}.md.`);
  }
}

export function validateLocalizedProjectEntry(
  entry: {
    id: string;
    locale: 'pt' | 'en';
    projectId: string;
    body?: string;
  },
  projectExists: (slug: string) => boolean,
): void {
  projectSlugSchema.parse(entry.projectId);

  if (entry.id !== `${entry.locale}/${entry.projectId}`) {
    throw new Error(
      `Localized project file ID "${entry.id}" must match ${entry.locale}/${entry.projectId}.`,
    );
  }

  if (!entry.body?.trim()) {
    throw new Error(`Localized project "${entry.id}" needs a Markdown description body.`);
  }

  if (!projectExists(entry.projectId)) {
    throw new Error(`Localized project "${entry.id}" references missing project "${entry.projectId}".`);
  }
}

export function validateAlgorithmCoverage(
  id: string,
  hasSharedComplexity: boolean,
  hasLocalizedAlgorithm: boolean,
): void {
  if (hasSharedComplexity && !hasLocalizedAlgorithm) {
    throw new Error(`Localized project "${id}" needs an algorithm explanation for its shared complexity.`);
  }
}
