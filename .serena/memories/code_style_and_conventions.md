# Code Style and Conventions for bkastro

## General Conventions

### File Naming
- **Astro components**: PascalCase (e.g., `BaseHead.astro`, `FormattedDate.astro`)
- **Pages**: lowercase with hyphens for multi-word (e.g., `about.astro`)
- **Dynamic routes**: Square brackets for parameters (e.g., `[...slug].astro`)
- **Content files**: lowercase with hyphens (e.g., `first-post.md`, `markdown-style-guide.md`)

### TypeScript/Astro Conventions
- **Type safety**: Strict TypeScript mode enabled
- **Component props**: Use `type Props = { ... }` for component prop typing
- **Content collections**: Use Zod schemas for frontmatter validation
- **Imports**: ES6 imports with `.astro` and `.js` extensions where needed

### Code Organization
- **Components**: Reusable UI components in `src/components/`
- **Layouts**: Page layout templates in `src/layouts/`
- **Pages**: File-based routing in `src/pages/`
- **Content**: Blog posts in `src/content/blog/`
- **Styles**: Global CSS in `src/styles/global.css`
- **Assets**: Images and fonts in `src/assets/` and `public/`

## Astro-Specific Patterns

### Component Structure
```astro
---
// Frontmatter: imports, data fetching, TypeScript
import Component from './Component.astro'
const data = Astro.props
---

<!-- Template: HTML, scoped styles -->
<div>
  <Component />
</div>

<style>
  /* Scoped CSS - component-specific */
  div { color: var(--accent); }
</style>
```

### Content Collection Pattern
```typescript
// src/content.config.ts
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.optional(image()),
  }),
})
```

### Dynamic Routing Pattern
```astro
---
// src/pages/blog/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog')
  return posts.map(post => ({
    params: { slug: post.id },
    props: post,
  }))
}
---
```

## CSS Conventions

### CSS Variables (defined in global.css)
```css
:root {
  --accent: #2337ff;
  --accent-dark: #000d8a;
  --black: 15, 18, 25;
  --gray: 96, 115, 159;
  --gray-light: 229, 233, 240;
  --gray-dark: 34, 41, 57;
  --box-shadow: 0 2px 6px rgba(...);
}
```

### Styling Approach
- **Mobile-first**: Responsive breakpoints at 720px
- **Minimal CSS**: No framework dependencies
- **Scoped styles**: Component-specific styles in `<style>` tags
- **Global styles**: Base styles in `global.css`

## Important Notes

- **No linting/formatting tools**: ESLint and Prettier are not configured
- **No test framework**: No testing setup currently in place
- **Type generation**: Use `pnpm cf-typegen` to regenerate Cloudflare Workers types after config changes
- **Image references**: In content frontmatter, use relative paths like `../../assets/image.jpg`
- **Date formatting**: Use `<FormattedDate>` component for consistent date display
