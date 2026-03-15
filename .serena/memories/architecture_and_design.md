# Architecture and Design Patterns for bkastro

## Architectural Principles

### 1. Performance-First Design
The project prioritizes performance above all else:
- **100/100 Lighthouse score** achieved through minimal dependencies
- **No JavaScript framework** for UI (pure Astro components)
- **CSS-only styling** without framework overhead
- **Image optimization** via Astro's Image component and Cloudflare service
- **Static generation** for maximum caching and CDN efficiency

### 2. Content as Data
Blog content is treated as structured data rather than files:
- **Content Collections**: Type-safe content management with schemas
- **Frontmatter validation**: Zod schemas ensure data integrity
- **Compile-time type checking**: Catch content errors at build time
- **Programmatic access**: Use `getCollection('blog')` to query content

### 3. Island Architecture
Astro's "islands" approach for minimal JavaScript:
- **Zero JavaScript by default**: Pure HTML/CSS for content
- **Hydrate only when needed**: No interactive components currently
- **Progressive enhancement**: Can add interactivity without rebuilding

## Key Architectural Patterns

### Content Layer Pattern
```
Content Collection (schema) → Static Paths → Dynamic Route → Layout
```

1. **Schema Definition** (`src/content.config.ts`)
   - Defines content structure with Zod
   - Generates TypeScript types automatically

2. **Static Path Generation** (`getStaticPaths()`)
   - Pre-builds all possible routes at compile time
   - Creates static HTML for each blog post

3. **Dynamic Routing** (`[...slug].astro`)
   - Maps URL parameters to content entries
   - Renders content with appropriate layout

4. **Layout System** (`BlogPost.astro`)
   - Wraps content with consistent structure
   - Provides shared UI elements (header, footer)

### Asset Optimization Pattern
```
Source Asset → Astro Image Component → Cloudflare Service → Optimized Output
```

1. **Source**: Place images in `src/assets/`
2. **Reference**: Use in frontmatter with relative paths
3. **Optimization**: Astro transforms at build time
4. **Service**: Cloudflare image service for edge delivery

### Styling Architecture
```
Global CSS (variables) → Component Scoped Styles → Responsive Design
```

1. **Design Tokens**: CSS variables in `global.css`
2. **Component Styles**: Scoped in individual `.astro` files
3. **Responsive**: Mobile-first with breakpoints
4. **Theme System**: Consistent color/spacing via variables

## Data Flow Patterns

### Blog Index Page
```
getCollection('blog') → Sort by date → Map to components → Render
```

### Individual Blog Post
```
getStaticPaths() → Get post by slug → Render with layout → Inject content
```

### RSS Feed Generation
```
getCollection('blog') → Transform for RSS → Generate XML
```

## Deployment Architecture

### Build Process
1. **Astro Build**: Generate static HTML/CSS/JS
2. **Asset Optimization**: Process images and fonts
3. **Type Generation**: Create Cloudflare Workers types
4. **Output**: Static files in `./dist/`

### Cloudflare Pages Integration
- **Static Site Generation**: Pre-rendered HTML
- **Edge Deployment**: Content served from CDN edge locations
- **Assets Binding**: Static assets bound to Cloudflare Pages
- **Node.js Compatibility**: Enables server-side features if needed

## Extension Points

### Adding New Content Types
1. Define new collection in `src/content.config.ts`
2. Create directory in `src/content/`
3. Add schema with Zod
4. Use `getCollection()` to query

### Adding Interactive Features
1. Install framework integration (React, Vue, Svelte)
2. Create interactive component
3. Use `client:*` directive to hydrate
4. Maintain static-first approach

### Custom Styling
1. Modify CSS variables in `global.css`
2. Add component-scoped styles
3. Maintain mobile-first approach
4. Test responsive breakpoints

## Performance Considerations

### Current Optimizations
- Static HTML generation (no server-side rendering needed)
- Minimal CSS (no framework overhead)
- Image optimization at build time
- Edge delivery via Cloudflare CDN
- Font loading with `font-display: swap`

### Monitoring
- Cloudflare Analytics for performance metrics
- Lighthouse scores for performance audit
- Core Web Vitals tracking through Cloudflare

## Design Philosophy

### Bear Blog Heritage
The design is based on Bear Blog principles:
- **Content-first**: Reading experience is paramount
- **Minimal distraction**: Clean, focused interface
- **Fast loading**: No unnecessary resources
- **Accessibility**: Semantic HTML and proper ARIA labels

### Modern Web Standards
- **Semantic HTML**: Proper heading hierarchy and structure
- **SEO optimization**: Meta tags, Open Graph, structured data
- **Accessibility**: Screen reader support, keyboard navigation
- **Progressive enhancement**: Works without JavaScript
