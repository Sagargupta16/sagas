import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Demo and test builds (`SAGAS_FIXTURES=1`) also load the sample book in
 * `tests/fixtures/books/`, so the reader always has a chapter to run against.
 * Production builds never set the flag and load `src/content/books/` only.
 */
const withFixtures = process.env.SAGAS_FIXTURES === '1';
const ROOTS = withFixtures
  ? ['src/content/books', 'tests/fixtures/books']
  : ['src/content/books'];

/** Entry id relative to its books root, matching the single-root default
 *  (`<slug>/book`, `<slug>/chapters/<file>`). */
const idFromRoot = ({ entry }: { entry: string }) => {
  const root = ROOTS.find((r) => entry.startsWith(`${r}/`)) ?? '';
  return entry
    .slice(root.length + 1)
    .replace(/\.md$/, '')
    .toLowerCase();
};

const booksLoader = (pattern: string) =>
  withFixtures
    ? glob({
        pattern: ROOTS.map((root) => `${root}/${pattern}`),
        base: '.',
        generateId: idFromRoot,
      })
    : glob({ pattern, base: './src/content/books' });

/** Media links must be https or site-relative -- never javascript:, data:,
 *  or plain http. Enforced here so a bad frontmatter line fails the build. */
const mediaUrl = z
  .string()
  .refine((v) => v.startsWith('https://') || v.startsWith('/'), {
    message: 'media URLs must be https:// or site-relative (/...)',
  });

const books = defineCollection({
  loader: booksLoader('*/book.md'),
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
  loader: booksLoader('*/chapters/*.md'),
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
