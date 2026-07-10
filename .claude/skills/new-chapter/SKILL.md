---
name: new-chapter
description: Add a chapter to an existing book, with correct ordering and a consistency pass. Use when Sagar says "new chapter", "add chapter", "publish chapter", or pastes chapter prose for a book.
---

# New chapter

Add `src/content/books/<book>/chapters/NN-<slug>.md`.

## Steps

1. Identify the book (ask if the title could match more than one).
2. Read the book's existing chapters to find the next `order` number; filename prefix `NN-` matches it (zero-padded).
3. Frontmatter per `src/content.config.ts`: `title`, `order`, `status` (`draft` unless he says otherwise), `publishedOn` ONLY when he wants it announced in RSS.
4. Paste his prose verbatim. Do not edit style, wording, or punctuation. Convert any em/en-dashes he pasted to `--` only if he confirms (his prose, his call).
5. Consistency pass (report findings, don't fix silently):
   - Character or place names spelled differently than earlier chapters.
   - Timeline contradictions with previous chapters.
   - Book `status` still `ideation` though chapters now exist -> suggest `drafting` or `ongoing`.
6. Verify: `pnpm build` passes, chapter renders at `/books/<book>/<chapter-slug>`, and it appears in `/rss.xml` when `publishedOn` is set.

## Rules

- The prose is Sagar's voice. Never rewrite it; flag typos, apply fixes only when he confirms.
- One chapter per file; never merge or split chapters without an explicit ask.
