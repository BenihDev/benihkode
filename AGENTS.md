# AGENTS.md

Guidance for coding agents working in this repository.

## Purpose

This project is a personal Astro site with three main content areas:

- `blog`: development journal posts
- `projects`: shipped work and portfolio entries
- `ideas`: product ideas and lightweight PRDs

The repository is public-facing, so keep changes tidy, accurate, and safe to publish.

## Common Commands

```bash
pnpm dev
pnpm build
pnpm preview
pnpm test
pnpm test:e2e
pnpm run deploy
```

## Repository Notes

- Package manager is `pnpm`
- Node.js 22.12.0 or newer is required
- Deployment target is Vercel
- The site URL is configured in `astro.config.mjs`

## Architecture

### Content collections

Content schemas are defined in `src/content.config.ts`.

- `blog` requires `title`, `description`, and `pubDate`
- `projects` requires `title`, `description`, `emoji`, `techStack`, and `order`
- `ideas` requires `title`, `description`, `status`, and `order`

All collections load `.md` and `.mdx` files from `src/content/{collection}/`.

### Routes

- `src/pages/blog/[...slug].astro` generates blog post routes
- `src/pages/ideas/[slug].astro` generates idea routes
- `src/pages/projects/[slug].astro` generates project routes
- `src/pages/projects/[slug]/privacy-policy.astro` is generated only when `hasPrivacyPolicy` is true and the entry does not set `privacyPolicyUrl`
- `src/pages/projects/<slug>/support.astro` and `src/pages/projects/<slug>/privacy-policy.astro` are hand-written per app (`<slug>` is literal: `echochess`, `pocketbudget`, ...), not generated

`privacyPolicyUrl` is the explicit exception to the generated privacy route: a hand-written `privacy-policy.astro` sits at the same URL the generated page would emit, so the entry sets the field and `getPrivacyPolicyStaticPaths` skips it. Without that field both pages compete for one URL; `getPrivacyPolicyHref` (same file, `src/utils/projects.ts`) then links to the hand-written one.

Support pages exist only where an app ships one and there is no generic support route; the project page links to `/projects/<slug>/support` when `hasSupportPage` is true. The old site-level `/support` URL is only a 301 source in `vercel.json`, emitted by `scripts/gen-redirects.mjs`.

### Tests

- Unit tests live in `src/utils/*.test.ts`
- End-to-end tests live in `e2e/*.spec.ts`
- Playwright starts the local dev server automatically

## Working Style

- Prefer small, targeted changes over broad rewrites
- Preserve the existing visual language unless the task explicitly calls for redesign
- When editing content collection schemas or route generation, verify `pnpm build`
- When changing utilities or route logic, run the relevant tests before finishing
