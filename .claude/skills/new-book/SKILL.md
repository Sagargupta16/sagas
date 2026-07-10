---
name: new-book
description: Scaffold a new book on one of the three shelves (fantasy, fanfic, essays). Use when Sagar says "new book", "start a book", "new fanfic", "new essay collection", or names a story he wants to begin.
---

# New book

Scaffold `src/content/books/<slug>/` for a new book.

## Steps

1. Resolve from the request (ask only if genuinely ambiguous):
   - **shelf**: `fantasy` (original world), `fanfic` (existing universe), `essays` (perspective collection).
   - **title** and kebab-case **slug** derived from it.
   - **universe**: required for fanfic (e.g. "Wizarding World"), omitted otherwise.
2. Check `src/content/books/` for slug collisions first.
3. Create `src/content/books/<slug>/book.md` with frontmatter matching the schema in `src/content.config.ts`:
   - `title`, `shelf`, `status` (start at `ideation` unless prose already exists), `synopsis` (one or two sentences, Sagar's voice, no marketing), `universe` (fanfic only), `startedOn` (today, absolute date), `tags`.
   - Body: worldbuilding notes, outline, or premise -- whatever Sagar provided.
4. Create the `chapters/` directory with the first chapter only if he gave chapter content; never invent prose.
5. If any `placeholder`-tagged seed book sits on the same shelf, ask whether to remove it now that a real book exists.
6. Verify: `pnpm build` passes and the book renders at `/books/<slug>`.

## Rules

- Synopsis and notes are written AS Sagar: direct, no buzzwords, no em/en-dashes.
- Fanfic books must keep the free/non-commercial framing; never add monetization language.
- Never write story prose unless he explicitly asks for drafting help.
