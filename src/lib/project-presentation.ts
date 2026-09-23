import type { CollectionEntry } from 'astro:content';

type ProjectData = CollectionEntry<'projects'>['data'];

export const statusLabels: Record<ProjectData['status'], string> = {
  completed: 'Concluído',
  'in-progress': 'Em andamento',
};

export const originLabels: Record<ProjectData['origin'], string> = {
  academic: 'Acadêmico',
  personal: 'Pessoal',
  professional: 'Profissional',
};

export const categoryLabels: Record<ProjectData['categories'][number], string> = {
  algorithms: 'Algoritmos',
  backend: 'Backend',
  systems: 'Sistemas',
  web: 'Web',
};

export function hasComplexitySection(
  sharedBounds: NonNullable<ProjectData['algorithm']>['complexity'] | undefined,
  localizedExplanation: string | undefined,
): boolean {
  return Boolean(sharedBounds || localizedExplanation);
}

export function formatCompletionDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    ...(day ? { day: 'numeric' } : {}),
  }).format(new Date(Date.UTC(year, month - 1, day ?? 1)));
}
