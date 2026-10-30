# CLAUDE.md

This file provides repository guidance for Claude Code and similar coding assistants.

## Project Overview

BenihKode is a public personal site built with Astro. It includes:

- a blog
- a projects section
- an ideas section
- optional privacy policy pages for selected projects

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
- `projects`: `title`, `description`, `emoji`, `techStack`, `order`, optional `url`, optional `hasPrivacyPolicy`, optional `hasSupportPage`, optional `privacyPolicyUrl`, optional `appName`
- `ideas`: `title`, `description`, `status`, `order`, optional `meta`

Files are loaded from:

- `src/content/blog/`
- `src/content/projects/`
- `src/content/ideas/`

### Routing

- `src/pages/blog/[...slug].astro`
- `src/pages/ideas/[slug].astro`
- `src/pages/projects/[slug].astro` — project pages; renders the Support and Privacy Policy links
- `src/pages/projects/[slug]/privacy-policy.astro` — generated; skips entries that set `privacyPolicyUrl`
- `src/pages/projects/<slug>/support.astro` — hand-written support page per app (currently only `echochess`)
- `src/pages/projects/<slug>/privacy-policy.astro` — hand-written policy pages, one per app that opts out of the generated route
- `src/pages/rss.xml.js`

Support pages are bespoke: there is no generic support route, so `/projects/<slug>/support` exists only when the app ships `src/pages/projects/<slug>/support.astro`. The project page links to it when `hasSupportPage: true`, and an entry without that flag gets no Support link. The former site-level `/support` URL is not a route — `scripts/gen-redirects.mjs` writes it into `vercel.json` at prebuild as a 301 to `/projects/echochess/support/`.

Privacy policy pages have two sources. The generated `src/pages/projects/[slug]/privacy-policy.astro` covers entries with `hasPrivacyPolicy: true`, and `privacyPolicyUrl` is the explicit exception to it: a hand-written policy lives at `src/pages/projects/<slug>/privacy-policy.astro`, which is the same URL the generated route would emit, so `getPrivacyPolicyStaticPaths` skips any entry that sets the field and `getPrivacyPolicyHref` (both in `src/utils/projects.ts`) sends the page link to the hand-written URL. Entries with a hand-written policy keep `hasPrivacyPolicy: true` and add `privacyPolicyUrl`.

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

- **`.agents/skills/add-project-entry/SKILL.md`** — invoke this when adding a new project entry (post, project card, idea PRD, privacy policy, banner, homepage surfacing). It encodes the content schemas, routing rules (`/projects` vs `/tools`), homepage slice/order pitfalls, and the PR workflow.

## Agent skills

### Issue tracker

Issues are tracked in this repo's GitHub Issues (`BenihDev/benihkode`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage label vocabulary (each label string equals its canonical role name). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
