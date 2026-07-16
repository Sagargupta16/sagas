---
name: outline-book
description: Turn a book idea into a structural outline with promises, arcs, and a chapter plan. Use when Sagar says "outline this book", "plan the plot", "structure this story", or has a new book idea that needs shape before drafting.
---

# Outline a book

Produce a working outline for a book in `src/content/books/<slug>/`, stored in the book folder as `_outline.md` (the `_` prefix keeps it out of the content-collection globs).

## Preparation

Read from the `writing-craft` skill library:

- `references/story-structure.md` -- always
- `references/serial-fiction.md` -- always (everything here publishes serially)
- `references/fantasy-genre.md` -- for fantasy/fanfic shelves
- `references/theme.md` -- if the idea has a message or moral question
- `references/character.md` -- if protagonists are already known

## Steps

1. Read the book's `book.md` and any existing `_outline.md` or chapters.
2. Interview the idea (ask Sagar only what the files don't answer, max 3 questions):
   - What is the ending state? (Wells: plot backwards from the Resolution)
   - Who changes, and what Lie do they start believing? (Weiland)
   - What are the chapter-one promises: tone, story, character, structure? (Sanderson)
3. Pick the framework that fits, don't force one:
   - Single-protagonist transformation -> Hero's Journey or Weiland beats.
   - Ensemble epic -> per-POV promise/progress/payoff threads (Sanderson).
   - Chapter-unit pacing for the serial -> Harmon Story Circle per chapter/arc.
   - State which framework was chosen and why, one line.
4. Write `_outline.md` with: premise paragraph, the four opening promises, act/arc breakdown with percentage targets, per-thread promise-progress-payoff table, and a first-arc chapter list (title + one-line goal + hook type per chapter, two hooks per chapter per the serial module).
5. Mark every chapter's "signpost of progress" -- which tracked thread visibly advances (Sanderson: readers quit when nothing signposts progress).
6. Verify `pnpm build` still passes (the `_` prefix must keep the file out of collections).

## Rules

- Outlines are living documents; revise freely. Published chapters are not (see `revision.md` module on public-serial revision discipline).
- Never pad the outline with chapters that only "travel". Leonard: leave out the parts readers skip.
- The outline is a diagnostic, not a contract: discovery-writing against it is fine, but update it after each detour so consistency checks stay meaningful.
