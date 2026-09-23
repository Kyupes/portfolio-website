import type { CollectionEntry } from 'astro:content';

type Project = CollectionEntry<'projects'>;
type ProjectContent = CollectionEntry<'projectContent'>;

export function getPortugueseProjects(projects: Project[], entries: ProjectContent[]) {
  const projectsById = new Map(projects.map((project) => [project.id, project]));

  return entries
    .filter((entry) => entry.data.locale === 'pt')
    .map((content) => {
      const project = projectsById.get(content.data.project.id);
      if (!project) {
        throw new Error(`Portuguese content "${content.id}" references a missing project.`);
      }

      return { project, content, slug: project.data.slug };
    })
    .sort((a, b) => a.content.data.title.localeCompare(b.content.data.title, 'pt'));
}
