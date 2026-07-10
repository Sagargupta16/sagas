---
name: new-chapter
description: Add a chapter to an existing book, with correct ordering and a consistency pass. Use when Sagar says "new chapter", "add chapter", or pastes chapter prose for a book. For releasing a finished chapter, use publish-chapter instead.
---

# New chapter

Add `src/content/books/<book>/chapters/NN-<slug>.md`.

## Steps

1. Identify the book (ask if the title could match more than one).
2. Read the book's existing chapters to find the next `order` number; filename prefix `NN-` matches it (zero-padded).
3. Frontmatter per `src/content.config.ts`: `title`, `order`, `status` (`draft` unless he says otherwise). Setting `publishedOn` is the `publish-chapter` skill's job, not this one's.
4. Paste his prose verbatim. Do not edit style, wording, or punctuation. Convert any em/en-dashes he pasted to `--` only if he confirms (his prose, his call).
5. Consistency pass (report findings, don't fix silently):
   - Run the `story-bible` skill's check mode if the book has a `_bible.md`; otherwise check names and timeline against earlier chapters directly.
   - Book `status` still `ideation` though chapters now exist -> suggest `drafting` or `ongoing`.
6. Verify: `pnpm build` passes and the chapter renders at `/books/<book>/<chapter-slug>`.

## Rules

- The prose is Sagar's voice. Never rewrite it; flag typos, apply fixes only when he confirms.
- One chapter per file; never merge or split chapters without an explicit ask.
