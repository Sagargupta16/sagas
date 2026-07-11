import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const books = defineCollection({
  loader: glob({ pattern: '*/book.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    shelf: z.enum(['fantasy', 'fanfic', 'essays']),
    status: z.enum(['ideation', 'drafting', 'ongoing', 'hiatus', 'complete']),
    synopsis: z.string(),
    universe: z.string().optional(),
    startedOn: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // downloadable / listenable formats (added as the book gains them)
    pdfUrl: z.string().optional(),
    audioUrl: z.string().optional(),
    cover: z.string().optional(),
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '*/chapters/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    status: z.enum(['draft', 'revising', 'final']).default('draft'),
    publishedOn: z.coerce.date().optional(),
    // per-chapter formats
    pdfUrl: z.string().optional(),
    audioUrl: z.string().optional(),
  }),
});

export const collections = { books, chapters };
