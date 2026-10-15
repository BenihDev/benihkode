# BEN-8 — Core Web Vitals & Schema Enrichment

Site: `https://www.benihkode.web.id`
Measurement date: 2026-10-15
Branch: `feat/ben-8-cwv-schema` (PR #61)

## 1. Core Web Vitals — what was measured and what was not

The board approved reading CWV data through **GSC API access**. That access is
**not present in this environment**:

- No `GOOGLE_*` / `GSC_*` / service-account variables are set for the agent.
- No `~/.config/claude-seo/google-api.json` (the `seo-google` skill config).
- The CrUX API returns `403 ... use API Key or other form of API consumer identity`.
- PageSpeed Insights API returns `429` (daily quota exhausted for the shared key).
- The `seo-google` connection resolves to Composio, which is not yet authorized.

So the **field** audit (GSC → Experience → Core Web Vitals, CrUX p75) is still
blocked on credentials. This report records the **lab/static** audit that is
possible without credentials, plus the fixes that were shipped.

### 1.1 HTTP-level measurements (live production)

| URL | TTFB | Total | HTML (raw) | HTML (compressed) |
| --- | --- | --- | --- | --- |
| `/` | 69 ms | 69 ms | 37.8 KB | 10.0 KB |
| `/tools/gitprgen/` | 45 ms | 45 ms | 23.9 KB | 7.6 KB |
| `/blog/git-commit-message-best-practices/` | 343 ms | 343 ms | 30.5 KB | 9.8 KB |

TTFB is well inside the 800 ms "Good" threshold. HTML payloads are small and
heavily compressed.

### 1.2 Static CWV guardrails (all 74 built pages)

| Check | Result |
| --- | --- |
| `<img>` with explicit `width` + `height` | 6 / 6 (was 3 / 6) |
| `<img>` with `alt` | 6 / 6 |
| Below-the-fold images lazy-loaded | yes |
| Web fonts (`@font-face`) | none — system font stack, no FOUT/CLS risk |
| Blog hero images | `loading="eager"` on first image (LCP), `decoding="async"` |

No render-blocking web fonts and no third-party scripts beyond Vercel Analytics
(with `@vercel/analytics`, loaded after hydration and non-blocking).

### 1.3 CLS fix shipped

Three blog hero banners (`/tutupen-banner.png`, `/openopc-banner.png`,
`/sysmonitor-banner.png`) had **no `width`/`height`**, so the browser could not
reserve layout space before the image decoded — a direct CLS source.

Fix: the `rehypeLazyImages` plugin in `astro.config.mjs` now resolves the real
pixel dimensions of local `public/` images (parses PNG IHDR / JPEG SOFn headers
synchronously) and injects `width`/`height` when they are missing. This covers
every existing image and any future one automatically.

Verified in the build: **0 of 6 images missing dimensions** (was 3 of 6).

## 2. Schema markup — verified in the built output

Every page was parsed from `dist/client` (180 JSON-LD blocks across 74 pages,
**0 invalid**):

| Type | Count | Coverage |
| --- | --- | --- |
| Organization | 75 | site-wide |
| Person | 75 | site-wide (author) |
| WebSite | 75 | site-wide |
| WebPage | 75 | site-wide |
| BreadcrumbList | 65 | site-wide incl. `/about`, `/services`, all tools |
| BlogPosting | 22 | all blog posts |
| SoftwareApplication | 18 | 9 tool pages × 2 (page + nested) |

Note: HowTo was **skipped** — Google removed HowTo rich results in September
2023, so it adds no value.

## 3. Verification status

| Item | Status |
| --- | --- |
| `pnpm test` | 21 / 21 pass |
| `pnpm build` | clean |
| JSON-LD parse (all pages) | 0 invalid |
| Explicit image dimensions | 6 / 6 |
| Google Rich Results Test (5 sample pages) | **pending deploy** — run after merge |
| GSC → Enhancements, zero schema errors | **pending** — 1 week after deploy |
| GSC CWV re-check ("Good" status) | **pending** — 2 weeks after deploy, needs credentials |

## 4. Open items / blockers

1. **CWV field data** — needs working GSC/CrUX credentials in this environment
   (the approved option). Until then, only the lab/static audit is possible.
2. **PR #61 review** — merge conflict with `origin/main` was resolved on this
   branch; PR is now `MERGEABLE`. Needs a reviewer to merge.
3. **Post-deploy checks** — Rich Results Test, GSC Enhancements, and the CWV
   re-check are time-gated and run outside this environment.
