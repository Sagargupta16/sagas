---
name: shelf-status
description: Audit the whole library -- every book, chapter counts, statuses, staleness -- and report what needs attention. Use when Sagar asks "shelf status", "library status", "what's on the shelves", or "which books are stale".
---

# Shelf status

Full audit of `src/content/books/`. Read-only; report, don't change.

## Steps

1. Enumerate every book folder and every chapter file (full count first, per the sweep rule).
2. For each book report: shelf, status, chapter count, chapters by status (draft/revising/final), last chapter `publishedOn`, days since last git commit touching that folder.
3. Flag:
   - Books tagged `placeholder` (still awaiting real writing).
   - `ongoing` books with no commit in 30+ days -> candidates for `hiatus` (honest status beats a dead "ongoing").
   - Chapters `final` but missing `publishedOn` (invisible to RSS).
   - Frontmatter that fails the schema in `src/content.config.ts` (run `pnpm build` to catch).
4. Output one table: book, shelf, status, chapters, last activity, flag. Then a short "needs attention" list ordered by importance.

## Rules

- Dates absolute (2026-07-10), never "3 weeks ago".
- Suggest status changes; never apply them without a yes.
