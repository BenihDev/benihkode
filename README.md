# BenihKode — Seed of Code 🌱

A developer's garden where ideas are planted as PRDs, cultivated through development, and harvested as shipped products. Built with [Astro](https://astro.build) and deployed on [Vercel](https://vercel.com).

> **Benih** (Indonesian) = Seed · **Kode** = Code

## 🌿 What's Inside

- **Product Ideas** — Full PRDs for apps that are in ideation or development
- **Shipped Projects** — A portfolio of completed projects with tech stacks
- **Dev Journal** — Blog posts documenting the journey of building in public

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 6](https://astro.build) with MDX |
| Hosting | [Vercel](https://vercel.com) |
| Styling | Vanilla CSS with custom design system |
| Fonts | Inter, Playfair Display, JetBrains Mono |
| Features | RSS feed, sitemap, dark/light theme, scroll animations |

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server at localhost:4321
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Deploy to Vercel
pnpm run deploy
```

## 📁 Project Structure

```
src/
├── components/     # Astro UI components (Header, Footer, Hero, Cards)
├── content/
│   ├── blog/       # Dev journal posts (Markdown)
│   ├── ideas/      # Product idea PRDs (Markdown/MDX)
│   └── projects/   # Shipped project entries (Markdown)
├── layouts/        # Base page layout
├── pages/          # Route pages (index, about, blog, ideas, projects)
└── styles/         # Global CSS design system
public/
├── favicon.svg     # BenihKode seed icon
├── og-default.png  # Default Open Graph preview image
└── robots.txt      # Crawler permissions
```

## 🌏 Links

- **Live site**: [benihkode.web.id](https://benihkode.web.id)
- **RSS Feed**: [benihkode.web.id/rss.xml](https://benihkode.web.id/rss.xml)

## 📄 License

Personal project. All content © BenihKode.
