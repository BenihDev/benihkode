# Edu Tech Blog Platform

An MVP blogging platform for educational technology content, built with Next.js 14, Drizzle ORM, and NextAuth.js v5.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Authentication**: NextAuth.js v5 (Google OAuth)
- **Content**: Markdown with live preview

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file (copy from `.env.local.example`):

```bash
cp .env.local.example .env.local
```

Configure the following variables:

```env
# Database - Get your connection string from Neon (https://neon.tech)
DATABASE_URL="postgresql://username:password@hostname/database"

# NextAuth - Generate a secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth - Create credentials at https://console.cloud.google.com
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Set Up the Database

Generate and run migrations:

```bash
pnpm db:generate  # Generate migration files
pnpm db:push      # Push schema to database
```

### 4. Run the Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## Features Implemented

### ✅ Core Features

- User authentication with Google OAuth
- Markdown editor with live preview
- Post creation and publishing
- Draft management with autosave (every 2 seconds)
- Post listing and individual post pages
- Basic SEO settings (title, excerpt, metadata)
- Responsive design with shadcn/ui components

### 📝 Post Editor

- Real-time markdown preview
- Auto-generated slug from title
- Cover image support
- Excerpt/summary field
- Autosave functionality

### 🎨 UI Components

- Pre-built components from shadcn/ui
- Dark mode support (Tailwind)
- Toast notifications (Sonner)
- Responsive layout

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth API route
│   │   └── posts/               # Post CRUD API
│   ├── posts/
│   │   ├── [slug]/              # Individual post page
│   │   └── new/                 # Post creation page
│   ├── auth/signin/             # Sign in page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page (post listing)
├── components/
│   ├── editor/
│   │   └── markdown-editor.tsx  # Markdown editor component
│   └── ui/                      # shadcn/ui components
├── db/
│   ├── schema.ts                # Database schema
│   ├── index.ts                 # Database connection
│   └── migrations/              # Drizzle migrations
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   └── utils.ts                 # Utility functions
└── drizzle.config.ts            # Drizzle configuration
```

## Database Schema

### Tables

- `users` - User accounts and authentication
- `accounts` - OAuth provider accounts
- `sessions` - User sessions
- `posts` - Blog posts
- `categories` - Post categories (for future use)
- `post_categories` - Post-category relationships
- `comments` - Post comments (for future use)

## API Endpoints

### Authentication

- `GET/POST /api/auth/[...nextauth]` - NextAuth handler
- `/auth/signin` - Sign in page

### Posts

- `GET /api/posts` - List published posts
- `POST /api/posts` - Create a new post
- `GET /posts/[slug]` - View individual post
- `/posts/new` - Create new post page

## Next Steps

### Recommended Enhancements

1. **Image Upload**: Integrate a storage solution (Vercel Blob, S3) for image uploads
2. **Categories/Tags**: Implement category and tag functionality
3. **Comments**: Add comment system for posts
4. **Search**: Implement full-text search
5. **RSS Feed**: Generate RSS feed for blog posts
6. **Analytics**: Integrate analytics (Vercel Analytics, Plausible)
7. **Author Profiles**: Create author profile pages
8. **Draft Management**: Add draft listing and edit functionality

### Deployment

The application is ready for deployment on Vercel:

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio

## License

MIT
