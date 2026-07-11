---
name: story-bible
description: Create or update a book's story bible (characters, places, magic, timeline, canon facts) and run continuity checks against it. Use when Sagar says "story bible", "series bible", "continuity check", "does this contradict", or before drafting in a book with 3+ chapters.
---

# Story bible

Maintain `src/content/books/<slug>/_bible.md` as the single source of truth for a book's facts (the `_` prefix keeps it out of content collections). A living bible prevents the continuity errors serials cannot rewrite away.

## Structure of `_bible.md`

- **Characters**: name, role, physical tells, voice notes (speech patterns for the dialogue-swap test), Want/Need/Lie, current state as of latest chapter.
- **Places**: name, geography that has been established on-page (blocking rule: nothing may appear the moment it becomes useful).
- **Magic/rules** (fantasy): stated costs and limitations -- limitations power the plot (Sanderson's Second Law); note which rules readers have been shown vs what only the bible knows (First Law: magic solves problems only in proportion to reader understanding).
- **Timeline**: chapter-by-chapter ledger of elapsed time, dates, ages.
- **Canon facts** (fanfic): source-canon facts relied on, the declared divergence point, fanon deliberately used or rejected.
- **Retcon log**: anything a published chapter got wrong and how it was handled (author's note, forward-fix, or accepted).

## Update mode

After a chapter reaches `final` or gets `publishedOn`: extract every new fact into the bible, note the chapter it was established in (`ch. 03`), and flag conflicts with existing entries.

## Check mode

Given a draft: compare every name, date, distance, ability, and eye color against the bible. Report contradictions with both citations (bible entry + its establishing chapter vs the draft line). The bible wins unless Sagar says the new text is the correction -- then update the bible and add a retcon-log entry if the old fact was published.

## Rules

- The bible records what IS, never what WILL BE (no spoilers in it beyond the latest chapter, so it stays safe to publish in-repo).
- Facts shown on-page outrank bible-only notes; if they disagree, the page is canon and the bible gets fixed.
- Keep entries terse and factual, not prose. It's a lookup table, not lore documentation (worldbuilder's-disease guard: build only what scenes need).
