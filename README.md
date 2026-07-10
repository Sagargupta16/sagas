# sagas

A living library of unfinished books.

Original fantasy, fan fiction, and essays on how I see the world -- written in the open, one chapter at a time. Live at [sagas.sagargupta.online](https://sagas.sagargupta.online).

## The shelves

- **Original Fantasy** -- worlds of my own, long arcs, written as they come.
- **Fan Fiction** -- stories set in universes I love (wizarding world and more). Free, non-commercial, always.
- **Essays** -- my perspective on popular topics, one essay at a time.

Every book starts as an idea and gets written in public. Drafts are drafts; git history is the writing log. Downloads and audiobooks may come later.

## Stack

Astro 7 static site, content collections, zero client JS. Books are folders of Markdown under [src/content/books/](src/content/books/); one `book.md` plus one file per chapter.

```
pnpm install
pnpm dev      # local dev at :4321
pnpm build    # static build to dist/
```

Deploys to GitHub Pages on every push to `main`.

## Adding a chapter

1. Drop `NN-title.md` into `src/content/books/<book>/chapters/`.
2. Frontmatter: `title`, `order`, `status` (`draft | revising | final`), and `publishedOn` once it should appear in the [RSS feed](https://sagas.sagargupta.online/rss.xml).
3. Push. That's the whole pipeline.

## License

Code is MIT. The writing itself (everything under `src/content/`) is [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/). Fan fiction is transformative fan work: free, non-commercial, and unaffiliated with the rights holders of the universes it borrows. See [LICENSE](LICENSE).
