---
name: publish-chapter
description: Pre-publish gate and release for a chapter -- final checks, publishedOn, RSS verification, bible update. Use when Sagar says "publish this chapter", "release it", "ship chapter N", or sets a chapter final and wants it live.
---

# Publish a chapter

The deliberate act that makes a chapter public-official (it's technically visible in git before this, but `publishedOn` is the announcement). Everything here is a gate, run in order; any failure stops the publish and gets reported.

## Gates

1. **Status**: chapter is `final`, or Sagar explicitly overrides ("publish it as-is").
2. **Continuity**: run the `story-bible` check mode against the chapter. Blockers block.
3. **Shelf gate**: fanfic shelf -> run `fanfic-check` blockers only.
4. **Read-aloud spot check**: opening paragraph and closing paragraph (hook) read clean.
5. **Mechanical sweep**: no em/en-dash characters, dialogue punctuation consistent, no leftover draft notes (`TODO`, `[fix]`, the stopping-note line from writing sessions).
6. **Hook present**: the chapter ends on an open question, decision, revelation, or arrival -- name which. A serial chapter with no forward pull is a retention leak (Sanderson progress signposts; two-hooks guidance in `serial-fiction.md`).

## Release

1. Set `publishedOn` to today (absolute date), confirm `order` is correct and unique.
2. `pnpm build` -- must pass.
3. Verify the chapter page renders and `/rss.xml` now carries it (build output or preview).
4. Update `_bible.md` with new facts (this is the point of no return for facts: published facts are canon).
5. Commit with a message like `feat(<book-slug>): publish chapter NN`.

## After

- Report: chapter link, word count, hook type, threads advanced.
- If the book's backlog of unpublished final chapters just hit zero, say so -- cadence outlives enthusiasm only with a buffer (serial-fiction module: backlog before cadence).

## Rules

- Never set `publishedOn` speculatively or backdate it.
- Once published, the chapter joins the no-retroactive-surgery regime: typos yes, plot changes no (retcon discipline lives in `serial-fiction.md`; contradictions get forward-fixes or an author's note).
