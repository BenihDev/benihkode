# Project Overview: bkastro

## Purpose

This is an **Astro-based blog starter template** configured for deployment on **Cloudflare Pages**. The project focuses on:

- **Performance**: 100/100 Lighthouse score
- **SEO**: Built-in optimization with canonical URLs, Open Graph data, sitemap, and RSS feeds
- **Minimal Design**: Clean, lightweight interface based on Bear Blog theme
- **Developer Experience**: Type-safe content management with Astro Content Collections

## Tech Stack

### Core Framework
- **Astro 6.0.4**: Modern static site generator with component islands architecture
- **TypeScript**: Strict mode enabled for type safety
- **Node.js**: Version 22.12.0 or higher required

### Key Integrations
- **@astrojs/cloudflare**: Adapter for Cloudflare Pages deployment
- **@astrojs/mdx**: MDX support for blog posts
- **@astrojs/sitemap**: Automatic sitemap generation
- **@astrojs/rss**: RSS feed generation
- **sharp**: Image optimization library

### Deployment Platform
- **Cloudflare Pages**: Edge-hosted static site with CDN
- **Wrangler**: Cloudflare's CLI tool for deployment and local development

### Styling
- **Pure CSS**: No CSS framework, custom theme based on Bear Blog
- **CSS Variables**: For consistent theming and maintainability
- **Scoped Styles**: Component-specific styles in `.astro` files

### Package Manager
- **pnpm**: Efficient package manager with strict dependency management

## Project Type

This is a **static site/blog** with:
- File-based routing
- Content collections for blog posts
- Dynamic routing for individual posts
- RSS feed generation
- Sitemap generation
- Image optimization via Astro's Image component
- Cloudflare image service integration
