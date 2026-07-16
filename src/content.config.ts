import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Media links must be https or site-relative -- never javascript:, data:,
 *  or plain http. Enforced here so a bad frontmatter line fails the build. */
const mediaUrl = z
  .string()
  .refine((v) => v.startsWith('https://') || v.startsWith('/'), {
    message: 'media URLs must be https:// or site-relative (/...)',
  });

const books = defineCollection({
  loader: glob({ pattern: '*/book.md', base: './src/content/books' }),
  schema: z
    .object({
      title: z.string().min(1),
      shelf: z.enum(['fantasy', 'fanfic', 'essays']),
      status: z.enum(['ideation', 'drafting', 'ongoing', 'hiatus', 'complete']),
      synopsis: z.string().min(1),
      universe: z.string().optional(),
      startedOn: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      // downloadable / listenable formats (added as the book gains them)
      pdfUrl: mediaUrl.optional(),
      audioUrl: mediaUrl.optional(),
      cover: mediaUrl.optional(),
    })
    .refine((data) => data.shelf !== 'fanfic' || Boolean(data.universe), {
      message: 'fanfic books must name their `universe`',
    }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '*/chapters/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string().min(1),
    order: z.number().int().positive(),
    status: z.enum(['draft', 'revising', 'final']).default('draft'),
    publishedOn: z.coerce.date().optional(),
    // per-chapter formats
    pdfUrl: mediaUrl.optional(),
    audioUrl: mediaUrl.optional(),
  }),
});

export const collections = { books, chapters };
