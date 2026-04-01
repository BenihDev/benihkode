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
- `projects`: `title`, `description`, `emoji`, `techStack`, `order`, optional `url`, optional `hasPrivacyPolicy`, optional `appName`
- `ideas`: `title`, `description`, `status`, `order`, optional `meta`

Files are loaded from:

- `src/content/blog/`
- `src/content/projects/`
- `src/content/ideas/`

### Routing

- `src/pages/blog/[...slug].astro`
- `src/pages/ideas/[slug].astro`
- `src/pages/projects/[slug].astro`
- `src/pages/projects/[slug]/privacy-policy.astro`
- `src/pages/rss.xml.js`

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
