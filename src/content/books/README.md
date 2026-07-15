# Books live here

One folder per book:

```
src/content/books/<slug>/
  book.md               # frontmatter + about-notes (the book entry)
  chapters/
    01-<chapter>.md     # one file per chapter, NN- prefix matches `order`
  _outline.md           # working outline (underscore = ignored by the site)
  _bible.md             # continuity bible (ignored by the site)
```

`book.md` frontmatter: `title`, `shelf` (`fantasy | fanfic | essays`),
`status` (`ideation | drafting | ongoing | hiatus | complete`), `synopsis`,
`startedOn`, optional `universe` (required for fanfic), `tags`, `pdfUrl`,
`audioUrl`.

Chapter frontmatter: `title`, `order` (positive integer, unique per book),
`status` (`draft | revising | final`), optional `publishedOn` (this is what
puts a chapter in the RSS feed), `pdfUrl`, `audioUrl`.

The schema is enforced by `src/content.config.ts` plus `pnpm verify:content`
(cross-file rules the schema cannot see). The `new-book` and `new-chapter`
skills scaffold all of this.
