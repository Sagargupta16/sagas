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

sagas -- a living library of unfinished books. Original fantasy, fan fiction, and perspective essays by Sagar, written in the open one chapter at a time. Frontend-only static site; downloads and audiobooks may come later.

Deploys to GitHub Pages at https://sagas.sagargupta.online.

## Stack

- **Language**: TypeScript (strict)
- **Framework**: Astro 7, content collections, zero client JS
- **Database**: none -- Markdown files in `src/content/` are the data
- **Package manager**: pnpm
- **Deploy target**: GitHub Pages via `.github/workflows/deploy.yml`

## Run

```
pnpm install
pnpm dev
pnpm build
```

## Test

```
pnpm check
pnpm build
```

No test framework yet; `astro check` + a clean build is the bar.

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
- Fan fiction is free and non-commercial, always. `universe` frontmatter names the source world.
- The three seed books tagged `placeholder` exist to prove routes; replace them as real writing lands.

## Gotchas

- `smartypants: false` in `astro.config.mjs` -- Markdown `--` must NOT become en-dashes (dash rule applies to prose too).
- pnpm 11 needs `allowBuilds` in `pnpm-workspace.yaml` for esbuild/sharp; without it installs fail.
- Fontsource imports must point at `index.css` explicitly or `astro check` fails (no types on the bare entry).
- Fonts are self-hosted via Fontsource (Eczar display, Literata body). No Google Fonts CDN.

## Repo-specific rules

- Prose (everything under `src/content/`) is CC BY-NC-ND 4.0; code is MIT. See LICENSE. Don't relicense either direction.
- Chapter markdown is Sagar's writing voice, not code: never "fix" his prose style, only typos when asked.
- Reading experience is the product: any UI change must be verified on mobile viewport first.
