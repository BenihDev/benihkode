# BenihKode

BenihKode is a personal site built with [Astro](https://astro.build). It combines a blog, a project portfolio, and a collection of product ideas in one statically generated site.

> **Benih** means seed, and **kode** means code.

## What The Site Contains

- Blog posts about building, debugging, and shipping software
- Project pages for completed work
- Product idea pages written as lightweight PRDs
- Project-specific privacy policy pages when needed

## Stack

- [Astro 6](https://astro.build)
- MDX via `@astrojs/mdx`
- Content Collections for typed content schemas
- Vanilla CSS
- [Vercel](https://vercel.com) deployment
- RSS and sitemap generation

## Local Development

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`.

## Available Commands

```bash
pnpm dev         # start the dev server
pnpm build       # create a production build
pnpm preview     # preview the production build locally
pnpm test        # run unit tests
pnpm test:e2e    # run Playwright end-to-end tests
pnpm run deploy  # deploy to Vercel
```

## Project Structure

```text
src/
  components/   shared Astro components
  content/      blog, ideas, and projects content
  layouts/      page layouts
  pages/        route files
  styles/       global styling
  utils/        testable helper functions
public/         static assets
docs/           project notes and supporting docs
```

## Content Model

The site uses Astro Content Collections defined in `src/content.config.ts`:

- `blog`: posts with `title`, `description`, and `pubDate`
- `projects`: portfolio entries with metadata such as `emoji`, `techStack`, and `order`
- `ideas`: product idea entries with `status` and ordering metadata

Content files live under `src/content/{collection}/` and can be written in Markdown or MDX.

## Live Site

- [benihkode.web.id](https://benihkode.web.id)
- [RSS feed](https://benihkode.web.id/rss.xml)

## License

Code is provided for reference unless stated otherwise. Site content and writing remain © BenihKode.
