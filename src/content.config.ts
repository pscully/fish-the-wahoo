import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: z.string(),
    description: z.string().optional().default(''),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
