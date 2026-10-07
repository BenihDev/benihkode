---
name: add-project-entry
description: Add a complete project entry to the BenihKode blog — build-story post, project card, product-idea PRD, native privacy policy, banner, and homepage surfacing — following the repo's content conventions.
disable-model-invocation: true
---

A shipped (or about-to-ship) project needs four artifacts plus a banner, and must land correctly in the homepage sections. This skill walks the whole entry, BenihKode-flavored: English, first person "I", honest tone.

## Before writing

- `git pull` first.
- Read `src/content.config.ts` (schemas), one recent post, one project card, and one idea PRD to absorb the current voice.
- **Ask the user what is unclear; never assume** the topic, angle, or voice.

## The four artifacts

1. **Build-story post** — `src/content/blog/<slug>.md`. Front-matter: `title`, `description` (≤ ~160 chars, meta/og description), `pubDate`, `tags`. Banner image directly after the front-matter: `![<alt>](/<slug>-banner.png)`.
2. **Project card** — `src/content/projects/<slug>.md`. Front-matter: `title`, `description` (card-sized, ~140 chars — this doubles as the meta description), `emoji`, `techStack` (4 items max fits one badge row), `category`, optional `url`/`githubUrl`, `order`, optional `hasPrivacyPolicy: true` + `appName`, optional `icon`. Body: What It Does (bullets) / Tech Stack / a "why" section.
3. **Idea PRD** — `src/content/ideas/<slug>.md`. Front-matter: `title`, `description`, `status` (`idea`|`in-progress`|`completed`), `meta` (shipping status line), `order`. Body: the 12-section PRD pattern (Title & One-Liner, Platform Target, Problem, Audience, User Loop, MVP + explicitly out of scope, Tech Stack table, Monetization, Privacy Design, Launch Criteria checklist, Validation Metrics, Risks — use `<div class="callout">` for callouts).
4. **Native privacy policy** — `src/pages/projects/<slug>/privacy-policy.astro`, copied from an existing one (e.g. smartstartup) and adapted. Set `hasPrivacyPolicy: true` and `appName` on the card. This page's URL is what store listings should reference (`https://benihkode.web.id/projects/<slug>/privacy-policy`), not a GitHub link.

## Routing and homepage rules (learned the hard way)

- **Category routes the detail page**: `/projects` lists `category: "app"` only; `/tools` lists `category: "tool"` only (CLI/dev tools). A consumer app with `category: "tool"` vanishes from `/projects`.
- **Homepage shows `slice(0, 4)` per collection**, sorted **ascending by `order`** — ties break alphabetically by filename, so a new entry at `order: 1` can still lose to four older `order: 1` files. New flagship entries belong at `order: 0` (or the lowest sensible).
- Both the homepage and the collection index filter/slice independently — verify **both** in the build output.

## Icon (optional but preferred for shipped apps)

- Card emoji is a placeholder; shipped products should set `icon: "/icons/<slug>.png"` (256px from the app's real icon set). The schema is `projects`-only; idea cards use status badges, not icons.
- `PortfolioCard` and the project detail page render `<img>` when `icon` is set, with the emoji as fallback. Card icon renders at 72px (radius 18) — keep the source square.

## Banner

1200×500, composed from the project's real icon + wordmark + tagline on the dark radial gradient (`#312e81 → #18181b → #09090b`). Build by serving the needed assets over `python3 -m http.server` and screenshotting an HTML wrapper in the internal browser at exactly 1200×500. Store at `public/<slug>-banner.png`.

## Validate and ship

- `pnpm build` must pass; then grep `dist/` to confirm the routes exist AND the homepage sections contain the new entry (both slices).
- Work on a branch (`post/<slug>` or `feat/<slug>`) and open a PR — **the repo's policy guard blocks `git reset --hard`**, so branch *before* committing to avoid needing it. Vercel posts a preview URL per PR; merge publishes to production.
- Watch the commit scope: `git add -A` can sweep the owner's untracked WIP files into your commit — add paths explicitly.
