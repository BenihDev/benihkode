# AGENTS.md

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server at localhost:4321

# Building & Deployment
pnpm build                  # Build for production
pnpm preview                # Preview production build locally
pnpm run deploy             # Deploy to Vercel (Production)

# Testing
pnpm test                   # Run unit tests (Node.js native test runner)
pnpm test:e2e               # Run E2E tests with Playwright
```

## Architecture

### Content Collections System

The site uses Astro's Content Collections for type-safe content management across three collections defined in `src/content.config.ts`:

- **blog**: Dev journal posts (requires `title`, `description`, `pubDate`; optional `tags`, `updatedDate`)
- **projects**: Shipped project entries (requires `title`, `description`, `emoji`, `techStack`, `order`; optional `url`, `hasPrivacyPolicy`, `appName`)
- **ideas**: Product idea PRDs (requires `title`, `description`, `status`, `order`; optional `meta`)

Each collection uses glob loaders that find `.md` and `.mdx` files in `src/content/{collection}/`. Access content via `getCollection('{collection}')` which returns typed `CollectionEntry<'{collection}'>[]`.

### Routing & Page Generation

- Dynamic routes in `src/pages/{collection}/[...slug].astro` or `[slug].astro` use `getStaticPaths()` to generate routes from content collections
- Blog index (`src/pages/blog/index.astro`) uses parallel collection fetching (see PR #13)
- Privacy policy routes are conditionally generated in `src/pages/projects/[slug]/privacy-policy.astro` based on `hasPrivacyPolicy` field

### Testing Strategy

- **Unit tests**: Located in `src/utils/*.test.ts`, use Node.js native test runner with `--experimental-strip-types` flag
- **E2E tests**: Located in `e2e/*.spec.ts`, use Playwright with automatic dev server startup
- Playwright configuration includes webServer settings that run `pnpm dev` before tests

### Key Constraints

- Package manager: `pnpm` (enforced by engines field in package.json)
- Node.js version: 22.12.0 or higher
- Site URL in `astro.config.mjs` defaults to `https://example.com` - update before deploying
