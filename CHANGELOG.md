# Changelog

All notable changes to sagas.

## [0.2.0] - 2026-07-15

Zero-book launch: the placeholder seed books are gone, the shelves open
honestly empty, and every finding from the full repo audit is fixed.

### Added

- Ambient candlelight backdrop (dot lattice, drifting radial glow, edge
  vignette) and an SVG paper-grain layer, both decorative and fully inert
  (patterns adapted from the portfolio-react and kalchar design systems).
- Tiered design tokens with a warm-ink elevation ladder
  (`--shadow-hairline`, `--shadow-e1..e4`) replacing ad-hoc shadows.
- Tilted-plate hero and crafted per-shelf empty states, so a zero-book
  library reads as intent instead of absence.
- "How this library works" colophon on the homepage.
- Skip-to-content link, sticky-header scroll padding, and accessible names
  for the text-size buttons and the read-aloud toggle.
- `Book` and `Chapter` JSON-LD, `article:published_time`, and excerpt-based
  chapter meta descriptions; RSS items now carry descriptions.
- Content schema hardening: positive-integer `order`, https/relative-only
  media URLs, `universe` required on the fanfic shelf.
- `pnpm verify:content`: cross-file invariants (orphan chapters, duplicate
  orders, filename-prefix mismatches, future/missing `publishedOn`).
- Playwright smoke suite (desktop, mobile, 320px) covering the fixed
  regressions; reader tests self-activate once the first chapter lands.
- CI quality gate on every PR: frozen install, format check, content
  verification, `astro check`, build, browser tests.
- `.gitattributes` LF policy and a pinned `packageManager`.
- Authoring contract documented in `src/content/books/README.md`.

### Changed

- Reading progress persists only after real engagement and is debounced;
  the saved position is read before anything writes, so the resume offer
  survives reloads (previously the load path zeroed it out).
- Chapter shortcuts (arrows / h,l) no longer fire from focused links,
  buttons, or form controls, and respect all modifier keys.
- All motion honors `prefers-reduced-motion`; the anti-reduced-motion house
  rule in `.impeccable.md` and the frontend-quality skill is reversed.
- `[hidden]` now always computes to `display: none`, fixing the always-open
  reader/TTS panels, the premature stop button, and the empty
  continue-reading card.
- Grid tracks use `minmax(min(100%, NNrem), 1fr)`, removing horizontal
  overflow at 320px viewports.
- Git writing history batches into one `git log --name-only` pass per build
  instead of one process per chapter (rename tracking via `--follow` is
  dropped; renames restart a chapter's visible history).
- Markdown pipeline moved to `satteri({ features: { smartPunctuation:
false } })`, clearing the deprecated `markdown.smartypants` flag; schema
  imports moved to `astro/zod`, clearing all 22 deprecation hints.
- Deploy workflow hardened: job-scoped least-privilege permissions and a
  pinned pnpm version instead of `pnpm@latest`.
- Inline JSON payloads (`readingMap`, JSON-LD) escape `<` to prevent
  script-block breakout from content-controlled strings.
- Favicon replaced with the flame brand mark used in the masthead.
- `revise-chapter` can no longer set `publishedOn` (publishing stays behind
  the `publish-chapter` gates); `outline-book` names `_outline.md`
  consistently.
- README, CLAUDE.md, and `.impeccable.md` rewritten to describe the actual
  product (reader platform, tests, glass-and-grain aesthetic, zero-book
  launch).

### Removed

- The three placeholder seed books and the sample chapter. The library now
  launches genuinely empty; templates and pipelines stay ready for the
  first real book.

## [0.1.0] - 2026-07-12

Everything up to the reader-platform release, previously unversioned:

- Astro 7 static site: three shelves as content collections, book pages,
  chapter reader, RSS feed, GitHub Pages deploy (#1, #2).
- Shared visual system: status pills, skeletons, glass chrome, candlelit
  OKLCH palette (#3).
- SEO axis: sitemap, robots.txt, canonical/OG/Twitter tags, WebSite
  JSON-LD; frontend-quality gate (#4).
- Formats capability: optional per-book/per-chapter PDF and audio, inline
  players, format badges; reading-time estimates; glass theme (#5).
- Two-tier responsive width system for desktop (#6).
- Read-aloud TTS, styled RSS feed, elevated masthead (#7).
- Reader platform: preferences, progress, keyboard/swipe navigation,
  richer TTS with media-session keys, git writing history (#8).
- Writing-craft skill library: 18 fact-checked reference modules and the
  authoring workflow skills.
