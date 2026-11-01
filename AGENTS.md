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
- `projects` requires `title`, `description`, `emoji`, `techStack`, and `order`; `category` splits Tools (`tool`) from Apps (`app`, the default), and `distributed` marks an App that ships through an app store
- `appPages` holds long-form per-App page copy keyed by Project slug: `<slug>.md` for privacy clauses, `<slug>-support.md` for support copy
- `ideas` requires `title`, `description`, `status`, and `order`

All collections load `.md` and `.mdx` files from `src/content/{collection}/`.

### Routes

- `src/pages/blog/[...slug].astro` generates blog post routes
- `src/pages/ideas/[slug].astro` generates idea routes
- `src/pages/apps/[slug].astro` generates App landings at `/apps/<slug>`
- `src/pages/apps/[slug]/support.astro` and `src/pages/apps/[slug]/privacy.astro` generate the store-facing pages at `/apps/<slug>/support` and `/apps/<slug>/privacy` for Apps with `distributed: true`
- `src/pages/tools/[slug].astro` generates Tool routes at `/tools/<slug>`
- The portfolio index stays at `src/pages/projects/index.astro` (`/projects/`) and links each card to its canonical landing through `projectLandingHref` (`src/utils/projects.ts`)

The store-facing pages hang off the single `distributed` frontmatter marker — there are no per-page flags. Every distributed App gets the whole trio (landing, support, privacy); non-distributed Apps and Tools get no subpages. The generated support and privacy templates render the App's copy from the `appPages` collection and own the header and contact sections, so content documents never hardcode the contact address.

File presence is the escape hatch: a hand-written page at `src/pages/apps/<slug>/support.astro` or `src/pages/apps/<slug>/privacy.astro` publishes the same URL the generated route would emit, so the generated route steps aside — each template discovers hand-written pages with `import.meta.glob` and `getSupportStaticPaths` / `getPrivacyPolicyStaticPaths` (`src/utils/projects.ts`) skip those slugs, keeping one page per URL. Support and Privacy links on a landing are uniform (`getSupportHref` / `getPrivacyPolicyHref`) regardless of which kind of page sits behind them.

Redirects: the prebuild (`scripts/gen-redirects.mjs`, run by `pnpm build`) derives 301 pairs from content frontmatter into `vercel.json` — `/projects/<slug>` for every project's landing, plus `/projects/<slug>/support` and `/projects/<slug>/privacy-policy` for distributed Apps, plus the moved site-level `/support` page — each in both slashless and slashed form, because Vercel matches the slashless source exactly. Astro's `redirects` config is not used since it strips trailing slashes (see the script header). After editing the generator or project frontmatter, run `pnpm build` and commit the regenerated `vercel.json`; `src/utils/redirects.test.ts` fails when the committed file drifts.

### Tests

- Unit tests live in `src/utils/*.test.ts`
- End-to-end tests live in `e2e/*.spec.ts`
- Playwright starts the local dev server automatically

## Working Style

- Prefer small, targeted changes over broad rewrites
- Preserve the existing visual language unless the task explicitly calls for redesign
- When editing content collection schemas or route generation, verify `pnpm build`
- When changing utilities or route logic, run the relevant tests before finishing
