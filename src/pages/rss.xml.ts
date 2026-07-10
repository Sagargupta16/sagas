import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { bookSlug, chapterSlug } from '../lib/shelf';

export async function GET(context: APIContext) {
  const books = await getCollection('books');
  const chapters = (await getCollection('chapters')).filter(
    (c) => c.data.publishedOn,
  );

  const titleOf = (slug: string) =>
    books.find((b) => bookSlug(b.id) === slug)?.data.title ?? slug;

  return rss({
    title: 'sagas',
    description:
      'A living library of unfinished books. New chapters as they land.',
    site: context.site!,
    items: chapters
      .sort(
        (a, b) => b.data.publishedOn!.valueOf() - a.data.publishedOn!.valueOf(),
      )
      .map((chapter) => {
        const slug = bookSlug(chapter.id);
        return {
          title: `${titleOf(slug)}: ${chapter.data.title}`,
          pubDate: chapter.data.publishedOn!,
          link: `/books/${slug}/${chapterSlug(chapter.id)}`,
        };
      }),
  });
}
