export type FilterableProject = {
  categories: readonly string[];
  origin: string;
};

export type ProjectFilters = {
  category: string;
  origin: string;
};

export function getAvailableProjectFilters<Category extends string, Origin extends string>(
  projects: readonly { categories: readonly Category[]; origin: Origin }[],
) {
  return {
    categories: [...new Set(projects.flatMap((project) => project.categories))],
    origins: [...new Set(projects.map((project) => project.origin))],
  };
}

export function matchesProjectFilters(project: FilterableProject, filters: ProjectFilters): boolean {
  return (
    (!filters.category || project.categories.includes(filters.category)) &&
    (!filters.origin || project.origin === filters.origin)
  );
}
