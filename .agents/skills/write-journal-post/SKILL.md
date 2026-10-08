---
name: write-journal-post
description: Reusable content brief for BenihKode Journal / Build Story posts — keyword targeting, post structure, internal linking, and pre-publish checklist (BEN-4).
disable-model-invocation: true
---

# BenihKode Content Brief — Journal / Build Story Posts

*Reusable template for ongoing posts (BEN-4). Apply to every new Journal entry so
posts stay consistent in voice, keyword targeting, and internal linking.*

---

## 1. Positioning

- **Site:** BenihKode (benihkode.web.id) — "a developer's garden where ideas are
  planted, code is cultivated, and growth is documented."
- **Audience:** indie developers and engineers who ship side projects; readers
  looking for practical build stories, dev tools, and honest engineering logs.
- **Content funnel (site architecture):** **Ideas (PRD) → Portfolio (shipped
  projects) → Journal (build stories)**. Every post lives at the end of that
  funnel — it documents something that started as an idea and/or shipped as a
  project.

## 2. Keyword rules

- **One primary keyword per post**, chosen to match real search intent
  (e.g. "AI pull request description generator", "zero-config secret scanning").
- Place the primary keyword in:
  1. the `<title>` frontmatter (append "— Dev Journal" is added automatically),
  2. the first ~100 words of the body,
  3. at least one H2,
  4. the meta description.
- **2–4 secondary keywords/phrases**, used naturally at most once or twice each.
  Never stuff: if a sentence reads oddly without the keyword, drop the keyword.
- Title style: "Building {Tool}: {Benefit-driven hook with primary keyword}" —
  see `building-gitprgen.md` and `building-secretsweep.md` as references.
- Description: 130–160 characters, states the *specific outcome* of the post,
  includes the primary keyword once.

## 3. Post structure (Build Story)

| Section | Purpose | Length |
|---|---|---|
| Hook | The friction that triggered the build. Concrete, personal, no throat-clearing. | 2–3 paragraphs |
| The problem | Why existing solutions weren't enough. | 1–2 paragraphs |
| The build / core loop | How it actually works — the decisions, not a changelog. Include one code block or example if natural. | 3–5 paragraphs |
| Decisions I'd defend | 2–4 opinionated calls, each with the reasoning. | 1 paragraph each |
| The failure / hard part | One honest war story. This is what makes the garden different from a changelog. | 1–2 paragraphs |
| What shipped | Install command + links to the tool/project page. | short |
| What's next | 2–3 future seeds; ends with a link to the tool page. | short |

Target length: **900–1,300 words**. Format frontmatter per the `blog` schema in
`src/content.config.ts` (`title`, `description`, `pubDate`, optional
`updatedDate`, `tags`).

## 4. Tags

- Always include the primary topic tag (`CLI`, `Security`, `Chrome Extension`…)
  and `Build Story` for build stories.
- 3–5 tags total; tags become Article `keywords` in the JSON-LD automatically.

## 5. Internal linking (mandatory)

Each post must contain **at least 4 internal links**, spread as:

- **1 link to the tool/project detail page** (`/tools/{slug}` or `/projects/{slug}`) —
  the money page for the keyword.
- **1 link to its sibling section index** (`/tools/`, `/projects/`, `/ideas/`).
- **1–2 links to older related Journal posts** (use descriptive anchors, not "this post").
- **Footer funnel block**: posts end with the Ideas → Portfolio → Journal nav
  block (added automatically by `src/pages/blog/[...slug].astro`) — don't
  duplicate it, but do reference one of the three sections in the last paragraph
  when it fits naturally.

Outbound links: fine for attribution/docs, always `target="_blank" rel="noopener"`.

## 6. Technical signals (handled by the codebase — verify, don't hand-code)

- JSON-LD: `Organization`, `WebSite`, `WebPage` (site-wide, `BaseLayout.astro`);
  `BreadcrumbList` (per page via `breadcrumbs` prop); `BlogPosting` Article
  (posts, via `src/utils/schema.ts` `articleSchema`). No manual JSON-LD in posts.
- Canonical/OG URLs use the `www` origin (`src/utils/schema.ts`, `BaseHead.astro`).
- `pubDate`/`updatedDate` feed the Article `datePublished`/`dateModified` —
  bump `updatedDate` when materially revising an old post.
- Post slug = filename; keep it short, hyphenated, keyword-adjacent
  (`building-gitprgen.md` → `/blog/building-gitprgen/`).

## 7. Pre-publish checklist

- [ ] Primary keyword in title, first 100 words, one H2, description
- [ ] 3–5 tags, including `Build Story` (for build stories)
- [ ] ≥ 4 internal links (tool page + section index + 1–2 journal posts)
- [ ] One honest failure/lesson section
- [ ] Code block with the install/usage command
- [ ] Description is 130–160 chars and outcome-driven
- [ ] `pnpm build` passes and the post renders at `/blog/{slug}/`
