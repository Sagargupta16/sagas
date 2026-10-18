# CLAUDE.md

> This file stacks on top of the workspace root at `C:\Code\GitHub\`:
>
> - Root [`CLAUDE.md`](../../CLAUDE.md) -- voice, rules, routing map, references, skills, slash commands, conventions.
> - Root [`MEMORY.md`](../../MEMORY.md) -- live facts across repos.
> - Root [`STATUS.md`](../../STATUS.md) -- live PR/CI/security dashboard.
> - [`.claude/resources/`](../../.claude/resources/README.md) -- deep reference for collaboration, workflow, git, OSS, debugging, voice.
>
> Read those first. The guidance below only adds **repo-specific context** -- it does not override anything in the root.

## Project

sagas -- a living library of unfinished books. Original fantasy, fan fiction, and perspective essays by Sagar, written in the open one chapter at a time. Static site with a small client-side reader platform (preferences, progress, TTS); no backend, everything in localStorage. Launches with zero books -- the shelves show crafted empty states until real writing lands.

Deploys to GitHub Pages at https://sagargupta.online/sagas (project-site subpath, matching every other project repo in the workspace).

## Stack

- **Language**: TypeScript (strict)
- **Framework**: Astro 7, content collections; inline client scripts power the chapter reader (progress, preferences, keyboard/swipe nav, speech synthesis)
- **Database**: none -- Markdown files in `src/content/` are the data
- **Package manager**: pnpm (pinned via `packageManager`)
- **Deploy target**: GitHub Pages via `.github/workflows/deploy.yml`; PR quality gate in `.github/workflows/ci.yml`

## Run

```
pnpm install
pnpm dev
pnpm dev:demo        # with the demo book from tests/fixtures/books/
pnpm build
```

## Test

```
pnpm check           # types + schema
pnpm verify:content  # cross-file content invariants
pnpm format:check    # prettier (LF everywhere; .gitattributes enforces it)
pnpm build
pnpm test:e2e        # Playwright tests (desktop / mobile / 320px)
pnpm build:demo      # build with the demo book (SAGAS_FIXTURES=1)
pnpm test:e2e:demo   # Playwright against the demo build -- what CI runs
pnpm screenshots     # README images; needs `pnpm preview` of a demo build
```

CI runs all of these on every PR. It builds the real site, asserts
`dist/books/reader-demo` is absent, runs `pnpm test:e2e` on it (the empty
shelves as shipped), then rebuilds with `pnpm build:demo` and runs
`pnpm test:e2e:demo`, so `tests/e2e/reader.spec.ts` always has chapters.
Without `SAGAS_FIXTURES` the reader tests fall back to the first real chapter
and skip while the shelves are empty.

## Entry points

- `src/pages/index.astro` -- homepage, three shelves
- `src/pages/books/[book].astro` -- book page with chapter list
- `src/pages/books/[book]/[chapter].astro` -- chapter reader
- `src/pages/rss.xml.ts` -- chapter feed

## Key files

- `src/content.config.ts` -- collection schemas (books, chapters); the content contract
- `src/content/books/<slug>/book.md` -- one book: frontmatter + about-notes
- `src/content/books/<slug>/chapters/NN-title.md` -- one chapter per file
- `src/lib/shelf.ts` -- shelf names, status labels, id helpers
- `src/styles/global.css` -- design tokens (OKLCH, dark-first via light-dark())
- `.impeccable.md` -- design context; read before any design work

## Content model

- Three shelves: `fantasy`, `fanfic`, `essays`. Essay collections are books; each essay is a chapter.
- Book status: `ideation | drafting | ongoing | hiatus | complete`. Chapter status: `draft | revising | final`.
- Chapters need `order` (number) and get into RSS only once `publishedOn` is set.
- Fan fiction is free and non-commercial, always. `universe` frontmatter is required on the fanfic shelf (schema-enforced).
- The library launches with zero books; shelves render crafted empty states. `src/content/books/README.md` documents the authoring contract.
- Per-book working files use a `_` prefix (`_outline.md`, `_bible.md`) so the collection globs ignore them. They are visible in the public repo -- keep spoilers out or the repo private-drafted.

## Skills (project-level)

Invoke via the Skill tool when the trigger matches. The craft knowledge base is `writing-craft` (18 reference modules of source-verified rules, fact-checked 2026-07-11); the other skills route into it.

| Skill              | Use when Sagar...                                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `writing-craft`    | ...asks any craft question; library of 18 modules (structure, character, worldbuilding, prose, dialogue, pacing, serial, openings, revision, POV, description, exposition, theme, genre, fanfic, essays, habits, formats) |
| `new-book`         | ...starts a book on any shelf                                                                                                                                                                                             |
| `outline-book`     | ...wants plot/structure for a book (`_outline.md`)                                                                                                                                                                        |
| `writing-session`  | ...says "let's write" / wants a drafting session with quota and ritual                                                                                                                                                    |
| `new-chapter`      | ...adds chapter prose to a book                                                                                                                                                                                           |
| `critique-chapter` | ...wants a craft critique of a draft                                                                                                                                                                                      |
| `revise-chapter`   | ...wants an edit pass (macro-to-micro ladder, -10% target)                                                                                                                                                                |
| `story-bible`      | ...needs continuity tracking or a "does this contradict" check (`_bible.md`)                                                                                                                                              |
| `worldbuild`       | ...designs magic/cultures/places (Sanderson's Laws applied)                                                                                                                                                               |
| `name-forge`       | ...needs names or titles consistent with a book's conventions                                                                                                                                                             |
| `fanfic-check`     | ...wants canon/OOC/tagging checks on the fanfic shelf                                                                                                                                                                     |
| `write-essay`      | ...develops a perspective essay (Graham/Orwell method)                                                                                                                                                                    |
| `publish-chapter`  | ...releases a chapter (gates, publishedOn, RSS verify)                                                                                                                                                                    |
| `shelf-status`     | ...asks for a library-wide audit                                                                                                                                                                                          |
| `frontend-quality` | ...ships a page/route or asks about accessibility, performance, or SEO (a11y/CWV/metadata/sitemap/OG). Site-shell gate, not prose. Adapted from the kalchar skill of the same name                                        |

## Gotchas

- `markdown.processor: satteri({ features: { smartPunctuation: false } })` in `astro.config.mjs` -- Markdown `--` must NOT become en-dashes (dash rule applies to prose too). The old `smartypants` flag is deprecated in Astro 7.
- pnpm 11 needs `allowBuilds` in `pnpm-workspace.yaml` for esbuild/sharp; without it installs fail.
- `pnpm-lock.yaml` is in `.prettierignore`: pnpm's own writer disagrees with Prettier, so every lockfile update used to fail `pnpm format:check`.
- Hold `prettier-plugin-astro` at 0.14.x: 1.x reflows inline text around closing tags (`</a\n>.` becomes `</a>\n.`), which renders a visible space before punctuation.
- The demo book lives in `tests/fixtures/books/reader-demo/` and loads only when `SAGAS_FIXTURES` is set (`src/content.config.ts` switches the glob loaders to two roots with `base: '.'` and its own `generateId`). Never move it under `src/content/`; deploy builds must stay fixture-free. Set the flag through `scripts/with-fixtures.mjs` (the `:demo` scripts), because an inline `VAR=1 cmd` prefix fails in the Windows shell pnpm uses.
- Reader-script changes are covered by `pnpm build:demo` + `pnpm test:e2e:demo`. Chapter 1 of the demo book is deliberately long enough to scroll on every viewport; keep it that way or the progress tests lose meaning.
- Locally, `astro preview` can detach into a background server and exit, which makes Playwright report "Process from config.webServer exited early". Run `pnpm test:e2e` again (it reuses the running server) and finish with `pnpm exec astro preview stop`.
- Fontsource imports must point at `index.css` explicitly or `astro check` fails (no types on the bare entry).
- Fonts are self-hosted via Fontsource (Eczar display, Literata body). No Google Fonts CDN.
- Site deploys at a subpath (`base: '/sagas'` in `astro.config.mjs`): every internal `href`/link must go through `withBase()` from `src/lib/shelf.ts`, never a raw `/path` string. `@astrojs/rss` link fields also need `withBase()` -- `site`/`base` aren't applied to them automatically.
- `trailingSlash: 'always'`: GitHub Pages serves `dir/index.html` at `dir/` and 301s `dir` to it. Page links use `bookHref()` / `chapterHref()`, which end in `/`; files (`/rss.xml`, `/favicon.svg`) keep `withBase()` with no slash. `astro preview` 404s a slashless page URL, so tests must use the slash form too.
- Write `-webkit-backdrop-filter` BEFORE `backdrop-filter`. The CSS minifier keeps only the last of the pair, and Chromium ignores the prefixed one, so the other order shipped glass with no blur at all. `site.spec.ts` asserts the computed blur.

## Repo-specific rules

- Prose (everything under `src/content/`) is CC BY-NC-ND 4.0; code is MIT. See LICENSE. Don't relicense either direction.
- Chapter markdown is Sagar's writing voice, not code: never "fix" his prose style, only typos when asked.
- Reading experience is the product: any UI change must be verified on mobile viewport first.

## Knowledge Graph (graphify)

- `graphify-out/` holds a prebuilt code graph (gitignored). For architecture/relationship questions ("what calls X", "what imports Y", impact of a change), query it before grepping: `graphify query "<question>"`, `graphify path "A" "B"`, `graphify explain "X"`, `graphify affected "X"`.
- After large refactors run `graphify update .` (local AST, no LLM) to refresh it. If `graphify-out/` is missing, fall back to normal search -- don't rebuild unasked.
