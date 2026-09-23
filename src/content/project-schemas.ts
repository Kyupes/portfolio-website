import { z } from 'astro/zod';

export const projectSlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  error: 'Use a lowercase, URL-safe slug such as my-mouse.',
});

const nonEmptyText = z.string().trim().min(1);
const markdownText = nonEmptyText;

function uniqueNonEmptyList<T extends z.ZodType<string>>(item: T) {
  return z.array(item).min(1).refine(
    (items) => new Set(items.map((value) => value.toLowerCase())).size === items.length,
    { error: 'Values must be unique.' },
  );
}

const publicSourceUrl = z.url().refine((url) => /^https?:\/\//.test(url), {
  error: 'Use an HTTP or HTTPS URL.',
});

const sourceCodeSchema = z.discriminatedUnion('availability', [
  z.strictObject({
    availability: z.literal('public'),
    provider: nonEmptyText,
    url: publicSourceUrl,
  }),
  z.strictObject({
    availability: z.literal('private'),
    provider: nonEmptyText.optional(),
  }),
  z.strictObject({ availability: z.literal('unavailable') }),
]);

const demoSchema = z.discriminatedUnion('availability', [
  z.strictObject({ availability: z.literal('interactive'), id: projectSlugSchema }),
  z.strictObject({ availability: z.literal('planned') }),
  z.strictObject({ availability: z.literal('unavailable') }),
]);

const completionDateSchema = z.union([
  z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  z.iso.date(),
]);

const sharedComplexitySchema = z
  .strictObject({
    time: nonEmptyText.optional(),
    space: nonEmptyText.optional(),
  })
  .refine((complexity) => Boolean(complexity.time || complexity.space), {
    error: 'Provide at least one time or space complexity bound.',
  });

export const projectMetadataSchema = z
  .strictObject({
    slug: projectSlugSchema,
    status: z.enum(['completed', 'in-progress']),
    categories: uniqueNonEmptyList(z.enum(['backend', 'algorithms', 'systems', 'web'])),
    origin: z.enum(['academic', 'personal', 'professional']),
    topics: uniqueNonEmptyList(projectSlugSchema),
    technologies: uniqueNonEmptyList(nonEmptyText),
    sourceCode: sourceCodeSchema,
    demo: demoSchema,
    algorithm: z.strictObject({ complexity: sharedComplexitySchema }).optional(),
    completionDate: completionDateSchema.optional(),
  })
  .refine((project) => project.status === 'completed' || !project.completionDate, {
    error: 'An in-progress project cannot have a completion date.',
    path: ['completionDate'],
  });

export const localizedProjectFieldsSchema = z.strictObject({
  locale: z.enum(['pt', 'en']),
  title: nonEmptyText,
  summary: nonEmptyText,
  technicalOverview: markdownText.optional(),
  architecture: markdownText.optional(),
  algorithm: z
    .strictObject({
      explanation: markdownText,
      complexity: z.strictObject({ explanation: markdownText }).optional(),
    })
    .optional(),
  technicalDecisions: z.array(markdownText).optional(),
  challenges: z.array(markdownText).optional(),
  testing: markdownText.optional(),
  lessonsLearned: z.array(markdownText).optional(),
  demoExplanation: markdownText.optional(),
});
