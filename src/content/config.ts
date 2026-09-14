import { defineCollection, z } from 'astro:content';

const studies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    year: z.number(),
    journal: z.string(),
    citationId: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().url(),
    intervention: z.enum([
      'music-therapy',
      'music-listening',
      'singing-bowls',
      'vibroacoustic',
      'overview',
      'other',
    ]),
    outcomes: z.array(z.string()),
    evidenceStrength: z.enum(['strong', 'mixed', 'weak', 'none']),
    studyType: z.string(),
    summary: z.string(),
    honestLine: z.string(),
    featured: z.boolean().default(false),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    source: z.string(),
    url: z.string().url(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

const experiments = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    status: z.enum(['exploratory', 'planned', 'complete']).default('exploratory'),
    summary: z.string(),
    labels: z.array(z.string()).default(['exploratory']),
  }),
});

const newsletters = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    issue: z.number(),
    summary: z.string(),
    readingTime: z.string().optional(),
  }),
});

export const collections = { studies, news, experiments, newsletters };
