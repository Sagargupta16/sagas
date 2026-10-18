# Changelog

All notable changes to sagas.

## [0.3.0] - 2026-10-18

### Added

- Demo book: `tests/fixtures/books/reader-demo/`, three chapters (two
  published, one draft). It loads only when `SAGAS_FIXTURES=1` is set, through
  `pnpm dev:demo`, `pnpm build:demo` and `pnpm test:e2e:demo`
  (`scripts/with-fixtures.mjs` sets the flag so it also works on Windows). The
  production build and the deploy never include it, and CI now checks that.
- CI runs the browser suite against the production build and again against
  the demo build, so the reader tests run on every PR. Before this, 12 of 42 were skipped because the library has no
  chapters. The suite is now 78 tests, 26 per viewport, and none skip. New
  coverage: progress saved by a real scroll, the resume offer, arrow-key
  chapter navigation, the continue-reading card, chapter order on the book
  page, draft chapters kept out of RSS, slash-terminated canonicals and
  sitemap entries, glass blur surviving minification, and the `--` dash rule
  in built prose. Passed 234/234 with `--repeat-each=3`. `SAGAS_FIXTURES`
  must be exactly `1`, and `scripts/with-fixtures.mjs` quotes its arguments
  so `pnpm test:e2e:demo -g "arrow keys move"` works.
- README screenshots at desktop and phone widths, taken from the demo build.
  `pnpm screenshots` (`scripts/screenshots.mjs`) regenerates them as WebP
  through the browser's own encoder, so there is no image dependency.
- README "Try the reader locally" and "Quality" sections. Lighthouse 13.5.0
  mobile on the demo build: home 99/100/100/100, chapter 100/100/100/100
  (performance, accessibility, best practices, SEO).

### Fixed

- Canonical, `og:url`, sitemap and RSS links no longer point at redirects.
  With `trailingSlash: 'never'` every page URL was the slashless form, which
  GitHub Pages 301s to `.../`, and the sitemap listed the home page twice. The
  site now uses `trailingSlash: 'always'`, and page links go through the new
  `bookHref()` / `chapterHref()` helpers.
- Glass surfaces (sticky header, cards, resume prompt, reader panels) had no
  backdrop blur in Chromium. The minifier kept only the `-webkit-` form of
  each `backdrop-filter` pair, and Chromium ignores that form, so the computed
  value was `none`. The declarations are now ordered so the standard one is
  kept.
- The home stats read "1 booktaking shape" once a book existed, because a
  line break in the template dropped the space.
- Accessibility (Lighthouse 95 to 100): faint ink (`--ink-faint`) now clears
  WCAG AA 4.5:1 on every surface. Dark goes from 3.2:1 to 4.85:1 on the
  lightest dark surface, and light and sepia were raised to match. The
  header wordmark drops an `aria-label` that hid its visible text from its
  accessible name.

## [0.2.3] - 2026-10-18

### Fixed

- Reading progress no longer resets on mobile reloads. The `resize` listener
  counted as reader engagement, and mobile browsers fire `resize` on load and
  whenever the URL bar collapses, so a saved 50% was overwritten with 0%
  before the reader scrolled. `resize` now only redraws the progress bar.
  Reproduced and verified with a temporary long chapter: the reader suite
  failed 3 of 3 runs on the mobile project before the fix and passed 36/36
  across desktop, mobile and 320px after it.
- Chapter meta descriptions append `...` only when the excerpt is actually
  truncated (short chapters ended in `text....`).
- `pnpm format:check` no longer fails on every lockfile update:
  `pnpm-lock.yaml` is now in `.prettierignore`, because pnpm 11 writes a
  layout Prettier rejects.

### Security

- Overrode `sharp` to 0.35.5 (high, librsvg vulnerability,
  GHSA-wq5f-xc86-pv6w, via `astro`). `pnpm audit` is clean.
- Recorded from 2026-10-06 (#12): lockfile-only bumps of `undici` 8.11.2,
  `fast-uri` 3.1.8, `http-cache-semantics` 4.3.0, `source-map-js` 1.2.2 and
  `smol-toml` 1.9.0.

### Changed

- Dependencies: `astro` 7.4.0, `@astrojs/sitemap` 3.7.4, `@astrojs/check`
  0.9.10, `@astrojs/markdown-satteri` 0.4.4 (the `--` dash rule re-verified
  on a built chapter), `@playwright/test` 1.64.1, `prettier` 3.9.10,
  Fontsource Eczar and Literata 5.3.0. TypeScript stays on 6.x because
  `@astrojs/check` does not accept 7 yet, and `prettier-plugin-astro` stays
  on 0.14.x because 1.x reflows inline text into visible spaces before
  punctuation.
- README: CI, deploy and live-site badges, plus a "How it works" section
  with an architecture diagram and the design decisions behind it.
- Added `SECURITY.md` with the private vulnerability reporting policy (#14).

## [0.2.2] - 2026-09-21

### Security

- Added pnpm overrides forcing patched transitive dependencies: `smol-toml`
  1.7.1 (high, denial of service via malformed TOML documents, Dependabot #12)
  and `devalue` 5.9.2 (medium, denial of service via malformed input, Dependabot
  #13). Neither is declared in `package.json`; both arrive through the Astro and
  Svelte resolution tree, so an override is the only durable floor.
- Overrides are pinned at the advisory minimums rather than the resolved
  versions, matching the 0.2.1 entries. Resolution lands on `smol-toml` 1.8.0 and
  `devalue` 5.9.4.

## [0.2.1] - 2026-09-02

### Security

- Bumped `astro` to 7.2.10 (reflected XSS via unescaped View Transition
  animation properties).
- Added pnpm overrides forcing patched transitive dependencies: `nanoid`
  3.3.18, `postcss` 8.5.26, `js-yaml` 4.3.2, `fast-uri` 3.1.6,
  `fast-xml-parser` 5.11.1, `svgo` 4.1.0. Resolves all ten open
  Dependabot alerts.

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
