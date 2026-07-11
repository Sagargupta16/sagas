export const SHELVES = {
  fantasy: {
    name: 'Original Fantasy',
    blurb: 'Worlds of my own. Long arcs, written as they come.',
  },
  fanfic: {
    name: 'Fan Fiction',
    blurb: 'Stories set in universes I love. Free, non-commercial, always.',
  },
  essays: {
    name: 'Essays',
    blurb: 'How I see the world, one topic at a time.',
  },
} as const;

export type Shelf = keyof typeof SHELVES;

export const STATUS_LABELS = {
  ideation: 'still an idea',
  drafting: 'drafting',
  ongoing: 'ongoing',
  hiatus: 'on hiatus',
  complete: 'complete',
} as const;

export const CHAPTER_STATUS_LABELS = {
  draft: 'draft',
  revising: 'revising',
  final: 'final',
} as const;

/** Book entry ids look like `<slug>/book`, chapter ids like `<slug>/chapters/<file>`. */
export const bookSlug = (id: string) => id.split('/')[0];
export const chapterSlug = (id: string) => id.split('/')[2];

/** Prefix an absolute internal path with the deploy base (e.g. `/sagas`). */
export const withBase = (path: string) =>
  `${import.meta.env.BASE_URL}${path}`.replace(/\/+/g, '/');

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
