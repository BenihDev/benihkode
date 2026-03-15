# Codebase Structure for bkastro

## Directory Overview

```
bkastro/
├── public/                  # Static assets served directly
│   ├── fonts/              # Custom font files (Atkinson)
│   ├── favicon.ico         # Site favicon
│   └── favicon.svg         # SVG favicon
├── src/
│   ├── assets/             # Images and media for optimization
│   │   └── blog-placeholder-*.jpg  # Sample blog images
│   ├── components/         # Reusable Astro components
│   │   ├── BaseHead.astro       # SEO meta tags and head content
│   │   ├── Footer.astro         # Site footer
│   │   ├── FormattedDate.astro  # Date formatting component
│   │   ├── Header.astro         # Site header with navigation
│   │   └── HeaderLink.astro     # Navigation link component
│   ├── content/           # Content collections (blog posts)
│   │   └── blog/              # Markdown/MDX blog posts
│   │       ├── first-post.md
│   │       ├── markdown-style-guide.md
│   │       ├── using-mdx.mdx
│   │       └── ...
│   ├── layouts/           # Page layout templates
│   │   └── BlogPost.astro     # Layout for individual blog posts
│   ├── pages/             # File-based routing
│   │   ├── index.astro         # Homepage
│   │   ├── about.astro         # About page
│   │   ├── blog/
│   │   │   ├── index.astro         # Blog index (all posts)
│   │   │   └── [...slug].astro     # Individual blog posts
│   │   └── rss.xml.js         # RSS feed endpoint
│   ├── styles/            # Global styles
│   │   └── global.css          # Base CSS (Bear Blog theme)
│   ├── consts.ts          # Global constants (site title, description)
│   ├── content.config.ts  # Content collection schemas
│   └── env.d.ts           # TypeScript type definitions
├── .vscode/               # VSCode settings
│   ├── settings.json          # Editor configuration
│   ├── extensions.json        # Recommended extensions
│   └── launch.json            # Debug configurations
├── astro.config.mjs      # Astro framework configuration
├── wrangler.jsonc        # Cloudflare Pages configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
├── worker-configuration.d.ts  # Cloudflare Workers types
└── README.md             # Project documentation
```

## Key Files and Their Purposes

### Configuration Files
- **astro.config.mjs**: Astro integrations (MDX, sitemap), Cloudflare adapter, image service
- **wrangler.jsonc**: Cloudflare Pages deployment config, compatibility flags, asset bindings
- **tsconfig.json**: TypeScript strict mode settings, include paths
- **package.json**: Dependencies (Astro, integrations), scripts for development/build

### Core Application Files
- **src/content.config.ts**: Defines blog content collection schema with Zod validation
- **src/consts.ts**: Global site constants (title, description)
- **src/env.d.ts**: Global TypeScript type declarations

### Routing Architecture
- **src/pages/index.astro**: Homepage with welcome message
- **src/pages/blog/index.astro**: Blog post listing (sorted by date, newest first)
- **src/pages/blog/[...slug].astro**: Dynamic routing for individual posts using `getStaticPaths()`
- **src/pages/rss.xml.js**: RSS feed generation using @astrojs/rss

### Component System
- **BaseHead.astro**: SEO meta tags, Open Graph data, canonical URLs
- **Header.astro**: Site navigation and social media links
- **Footer.astro**: Site footer content
- **FormattedDate.astro**: Consistent date formatting across the site
- **BlogPost.astro**: Layout template for individual blog posts

### Styling System
- **src/styles/global.css**: Base CSS with CSS variables for theming
- Component-scoped styles in individual `.astro` files
- Mobile-first responsive design with 720px breakpoint

## Content Management

### Blog Posts Structure
Each blog post in `src/content/blog/` requires frontmatter:
```yaml
---
title: 'Post Title'
description: 'SEO description'
pubDate: 'YYYY-MM-DD'
heroImage: '../../assets/image.jpg'  # optional
updatedDate: 'YYYY-MM-DD'  # optional
---
```

### Content Collection Schema
- Defined in `src/content.config.ts`
- Uses Zod for type validation
- Supports `.md` and `.mdx` files
- Auto-generates TypeScript types for content

## Image Management

### Asset Locations
- **src/assets/**: Images for optimization (used in content)
- **public/**: Static assets served directly (fonts, favicons)

### Image Usage
- In content frontmatter: Reference relative to content file
- In components: Use `<Image />` from `astro:assets`
- Automatic optimization via Cloudflare image service

## Deployment Structure

### Build Output
- **./dist/**: Production build output
- Static files deployed to Cloudflare Pages
- Assets bound to Cloudflare Pages via Wrangler config

### Edge Integration
- Cloudflare adapter enables edge deployment
- Platform proxy for local development
- Node.js compatibility mode for server-side features
