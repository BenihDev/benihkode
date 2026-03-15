# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based blog starter template configured for deployment on Cloudflare Pages. It uses a minimal design approach (based on Bear Blog) with a focus on performance (100/100 Lighthouse score) and SEO.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs on localhost:4321)
pnpm dev

# Build for production
pnpm build

# Preview production build locally with Wrangler
pnpm preview

# Deploy to Cloudflare Pages
pnpm deploy

# Generate/update Cloudflare Workers TypeScript types
pnpm cf-typegen
```

## Architecture

### Content Management System

The blog uses Astro's **Content Collections** feature for type-safe content management:

- **Configuration**: `src/content.config.ts` defines the `blog` collection schema
- **Schema**: Blog posts must include frontmatter with `title`, `description`, `pubDate`, optional `updatedDate`, and optional `heroImage`
- **Loader**: Uses glob loader to find `.md` and `.mdx` files in `src/content/blog/`
- **Content Access**: Use `getCollection('blog')` to retrieve all posts, typed as `CollectionEntry<'blog'>`

### Routing Structure

- **File-based routing**: Pages in `src/pages/` become routes based on filename
- **Dynamic routes**: `src/pages/blog/[...slug].astro` uses `getStaticPaths()` to generate routes for each blog post
- **Blog index**: `src/pages/blog/index.astro` lists all posts sorted by publication date (newest first)
- **RSS feed**: `src/pages/rss.xml.js` generates an RSS feed for the blog

### Component Architecture

- **Layouts**: `src/layouts/BlogPost.astro` is the main layout for individual blog posts
- **Components**: Reusable UI components in `src/components/` (Header, Footer, BaseHead, FormattedDate)
- **Scoped styles**: Each `.astro` file can include scoped styles in `<style>` tags
- **Global styles**: `src/styles/global.css` contains the base CSS (customized Bear Blog theme)

### Image Optimization

The project uses Astro's built-in Image optimization with Cloudflare as the image service:
- Configure in `astro.config.mjs`: `imageService: "cloudflare"`
- Images in `src/assets/` are optimized and transformed at build time
- Use `<Image />` component from `astro:assets` for optimized images
- Hero images are referenced in blog frontmatter and rendered in BlogPost layout

## Deployment Configuration

### Cloudflare Pages

- **Adapter**: `@astrojs/cloudflare` with platform proxy enabled for local development
- **Wrangler**: Configuration in `wrangler.jsonc`
  - Node.js compatibility mode enabled
  - Assets binding to `./dist` directory
  - Observability enabled for monitoring
- **Build output**: Static site built to `./dist/` directory

### Integrations

- **MDX**: `@astrojs/mdx` for MDX support in blog posts
- **Sitemap**: `@astrojs/sitemap` automatically generates sitemap.xml
- **RSS**: `@astrojs/rss` generates RSS feed at `/rss.xml`

## Styling Approach

The project uses a custom CSS theme (based on Bear Blog) with:

- **CSS Variables**: Defined in `:root` for consistent theming (accent colors, grayscale values, box shadows)
- **Typography**: Custom Atkinson font loaded from `/fonts/` directory
- **Responsive**: Mobile-first approach with breakpoints at 720px
- **Performance**: Minimal CSS, no framework dependencies
- **Scoped**: Component-specific styles are scoped to avoid conflicts

## Content Creation

To add a new blog post:

1. Create a new `.md` or `.mdx` file in `src/content/blog/`
2. Include required frontmatter:
   ```yaml
   ---
   title: 'Post Title'
   description: 'Post description for SEO'
   pubDate: 'YYYY-MM-DD'
   heroImage: '../../assets/filename.jpg'  # optional
   ---
   ```
3. The post will automatically appear in the blog index and be accessible at `/blog/filename/`

## Type Safety

- **TypeScript**: Strict mode enabled in `tsconfig.json`
- **Content types**: Auto-generated from content collection schemas
- **Cloudflare types**: Generated via `wrangler types` and stored in `worker-configuration.d.ts`
- Always ensure type definitions are up-to-date after modifying Wrangler configuration

## Important Notes

- The site URL in `astro.config.mjs` is set to `https://example.com` - update this before deploying
- Social links in `src/components/Header.astro` default to Astro's accounts - customize these
- Blog posts are sorted by `pubDate` in descending order (newest first)
- The project uses `pnpm` as the package manager (required by `engines` field in package.json)
- Node.js 22.12.0 or higher is required
