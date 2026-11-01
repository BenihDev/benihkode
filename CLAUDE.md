# CLAUDE.md

This file provides repository guidance for Claude Code and similar coding assistants.

## Project Overview

BenihKode is a public personal site built with Astro. It includes:

- a blog
- a projects section (portfolio index; Apps land at `/apps/<slug>`, Tools at `/tools/<slug>`)
- an ideas section
- store-facing support and privacy pages for store-distributed Apps, generated under `/apps/<slug>/`

The repository is deployed on Vercel and uses Astro Content Collections for typed content.

## Development Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm test
pnpm test:e2e
pnpm run deploy
```

## Current Architecture

### Content collections

Collection schemas live in `src/content.config.ts`.

- `blog`: `title`, `description`, `pubDate`, optional `updatedDate`, optional `tags`
- `projects`: `title`, `description`, `emoji`, `techStack`, `order`, optional `url`, optional `category` (`tool`|`app`, default `app`), optional `distributed` (the single marker for an App that ships through an app store), optional `appName`, optional `githubUrl`/`npmPackage`/`installCommand`, optional `icon`
- `appPages`: long-form per-App page copy keyed by Project slug (`<slug>.md` for privacy clauses, `<slug>-support.md` for support copy)
- `ideas`: `title`, `description`, `status`, `order`, optional `meta`

Files are loaded from:

- `src/content/blog/`
- `src/content/projects/`
- `src/content/app-pages/`
- `src/content/ideas/`

### Routing

- `src/pages/blog/[...slug].astro`
- `src/pages/ideas/[slug].astro`
- `src/pages/apps/[slug].astro` — App landings at `/apps/<slug>`; renders the Support and Privacy links
- `src/pages/apps/[slug]/support.astro` and `src/pages/apps/[slug]/privacy.astro` — generated store-facing pages for Apps with `distributed: true`; they render the App's copy from the `appPages` collection and own the header and contact sections
- `src/pages/tools/[slug].astro` — Tool pages at `/tools/<slug>`
- `src/pages/projects/index.astro` — the portfolio index (`/projects/`); it links each card to its canonical landing through `projectLandingHref` (`src/utils/projects.ts`)
- `src/pages/rss.xml.js`

The store-facing pages hang off the single `distributed: true` frontmatter marker — there are no per-page flags. Every distributed App gets the whole trio (landing, `/apps/<slug>/support`, `/apps/<slug>/privacy`); non-distributed Apps and Tools get no subpages.

File presence is the escape hatch: a hand-written page at `src/pages/apps/<slug>/support.astro` or `src/pages/apps/<slug>/privacy.astro` publishes the same URL the generated route would emit, so the generated route steps aside — each template discovers hand-written pages with `import.meta.glob` and `getSupportStaticPaths` / `getPrivacyPolicyStaticPaths` (`src/utils/projects.ts`) skip those slugs, keeping one page per URL. The Support and Privacy links on a landing are uniform (`getSupportHref` / `getPrivacyPolicyHref`) regardless of which kind of page sits behind them.

The old `/projects/<slug>` URLs are not routes — `scripts/gen-redirects.mjs` (run by `pnpm build` as a prebuild) derives 301 pairs from content frontmatter into `vercel.json`: landings for every project, plus support and privacy pairs for distributed Apps, plus the moved site-level `/support` page, each in both slashless and slashed form. After editing the generator or project frontmatter, run `pnpm build` and commit the regenerated `vercel.json`; `src/utils/redirects.test.ts` fails when the committed file drifts.

### Layouts and components

- `src/layouts/BaseLayout.astro` is the main shared layout
- `src/components/` contains shared UI pieces such as the header, footer, and head tags
- `src/styles/` contains global styling

## Deployment Notes

- Deployment target is Vercel
- Astro uses the Vercel adapter in `astro.config.mjs`
- `pnpm build` should succeed before any deploy-oriented change is considered complete

## Editing Guidance

- Keep documentation and metadata public-ready
- Prefer accurate repository-specific guidance over generic starter-template wording
- When changing routing, content schemas, or deployment config, run `pnpm build`
- When changing utilities, run `pnpm test`
- Avoid introducing provider-specific config unless the repo is actually deployed there

## Public Repository Hygiene

- Do not leave stale references to old hosting providers or starter-template defaults
- Keep instructions short and concrete
- Assume outside contributors may read these files first

## Skills

- **`.agents/skills/add-project-entry/SKILL.md`** — invoke this when adding a new project entry (post, project card, idea PRD, App support and privacy pages, banner, homepage surfacing). It encodes the content schemas, routing rules (`/apps` vs `/tools`), homepage slice/order pitfalls, and the PR workflow.

## Agent skills

### Issue tracker

Issues are tracked in this repo's GitHub Issues (`BenihDev/benihkode`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage label vocabulary (each label string equals its canonical role name). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
