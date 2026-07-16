# sagas

A living library of unfinished books.

Original fantasy, fan fiction, and essays on how I see the world -- written in
the open, one chapter at a time. Live at
[sagargupta.online/sagas](https://sagargupta.online/sagas).

The shelves are built and open; the first books are being written. Every book
starts as an idea and gets written in public. Drafts are drafts; git history is
the writing log.

## The shelves

- **Original Fantasy** -- worlds of my own, long arcs, written as they come.
- **Fan Fiction** -- stories set in universes I love. Free, non-commercial,
  always.
- **Essays** -- my perspective on popular topics, one essay at a time.

## The reader

The site is a static Astro 7 build, but the chapter reader is a small
client-side reading platform (no backend, no accounts, everything in
localStorage):

- reader preferences: theme (auto/dark/light/sepia), typeface, text size,
  line spacing -- applied before first paint
- reading progress: per-chapter position with a resume offer and a
  "continue reading" card on the homepage
- keyboard (arrows / h,l) and swipe navigation between chapters
- read-aloud via the browser's speech synthesis, with voice/speed/sleep-timer
  controls and lock-screen media keys
- per-chapter writing history straight from git: first drafted, last revised,
  revision count

Motion honors `prefers-reduced-motion` everywhere.

## Stack

Astro 7 static site with content collections. Books are folders of Markdown
under [src/content/books/](src/content/books/); one `book.md` plus one file
per chapter (see the README there for the exact contract).

```
pnpm install
pnpm dev             # local dev at :4321/sagas
pnpm build           # static build to dist/
pnpm check           # types + content schema
pnpm verify:content  # cross-file content invariants
pnpm format:check    # prettier
pnpm test:e2e        # Playwright smoke tests against the built site
```

CI runs all of those on every pull request; pushes to `main` deploy to GitHub
Pages.

## Adding a chapter

1. Drop `NN-title.md` into `src/content/books/<book>/chapters/`.
2. Frontmatter: `title`, `order`, `status` (`draft | revising | final`), and
   `publishedOn` once it should appear in the
   [RSS feed](https://sagargupta.online/sagas/rss.xml).
3. Push. CI validates, main deploys.

## License

Code is MIT. The writing itself (everything under `src/content/`) is
[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/). Fan
fiction is transformative fan work: free, non-commercial, and unaffiliated
with the rights holders of the universes it borrows. See [LICENSE](LICENSE).
