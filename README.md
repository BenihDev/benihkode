# Next.js Starter Template

A configurable starter template for building modern web applications with Next.js 16, Drizzle ORM, and NextAuth.js v5.

## What is this?

This is a **starter template** designed to be the foundation for new projects. It includes:

- Modern tech stack (Next.js 16 App Router, React 19, Tailwind CSS, shadcn/ui)
- Optional authentication with NextAuth.js
- Optional content management system (posts, drafts, comments)
- Database integration with Drizzle ORM (PostgreSQL/Neon)
- Feature flags to enable/disable functionality
- Setup wizard for quick configuration

## Quick Start

### 1. Run the Setup Wizard

```bash
pnpm install
pnpm setup
```

The setup wizard will guide you through:
- App branding (name, title, description)
- Feature selection (auth, posts, comments, etc.)
- Content settings
- UI preferences (theme, colors)
- SEO configuration

### 2. Configure Environment Variables

Create a `.env.local` file (copy from `.env.local.example`):

```bash
cp .env.local.example .env.local
```

Configure the following variables based on your enabled features:

```env
# Database (required for posts, auth)
DATABASE_URL="postgresql://username:password@hostname/database"

# NextAuth (required if auth enabled)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (required if auth enabled)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Set Up the Database

If you enabled database features:

```bash
pnpm db:push
```

### 4. Run the Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your app.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Authentication**: NextAuth.js v5 (optional)
- **Testing**: Vitest + Testing Library

## Configuration

All configuration is centralized in `config/app.config.ts`:

```typescript
export const appConfig: AppConfig = {
  // App Branding
  appName: 'my-app',
  appTitle: 'My App',
  appDescription: 'A modern web application',
  appTagline: 'Build something amazing',

  // Feature Flags
  features: {
    auth: true,        // Enable/disable authentication
    posts: true,       // Enable/disable posts
    comments: false,   // Enable/disable comments
    categories: false, // Enable/disable categories
    drafts: true,      // Enable/disable drafts
  },

  // ... more settings
};
```

You can:
1. Run `pnpm setup` to use the interactive wizard
2. Manually edit `config/app.config.ts` to change settings later

## Features

### Core Features

- [x] TypeScript
- [x] ESLint + TypeScript checking
- [x] Tailwind CSS + shadcn/ui components
- [x] Vitest testing setup
- [x] Environment variable management

### Optional Features (configured via setup wizard)

- User authentication (NextAuth with Google OAuth)
- Content management (posts, drafts)
- Markdown editor with live preview
- Comments system
- Categories and tags
- Dark mode support

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth (if auth enabled)
│   │   └── posts/              # Post CRUD (if posts enabled)
│   ├── posts/                  # Post pages (if posts enabled)
│   ├── auth/                   # Auth pages (if auth enabled)
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── editor/                 # Editor components (if posts enabled)
│   └── ui/                     # shadcn/ui components
├── config/
│   └── app.config.ts           # App configuration
├── db/
│   ├── schema.ts               # Database schema
│   └── index.ts                # Database connection
├── lib/
│   ├── auth.ts                 # Auth configuration
│   └── utils.ts                # Utilities
└── scripts/
    └── setup-wizard.ts         # Setup wizard
```

## Customization Guide

### Changing Branding

Edit `config/app.config.ts`:

```typescript
appTitle: 'Your App Name',
appDescription: 'Your app description',
appTagline: 'Your tagline',
```

### Toggling Features

Disable features you don't need:

```typescript
features: {
  auth: false,    // Remove authentication
  posts: false,   // Remove content management
  comments: false,
  categories: false,
  drafts: false,
},
```

### UI Customization

Change the theme and colors:

```typescript
ui: {
  defaultTheme: 'dark',  // or 'light', 'system'
  colorScheme: 'blue',   // or 'zinc', 'green', 'purple', 'red', 'orange'
},
```

### Adding New Features

1. Add feature flags to `config/app.config.ts`
2. Use the config throughout your app:
   ```typescript
   import { appConfig } from '@/config/app.config';

   if (appConfig.features.yourFeature) {
     // Feature code here
   }
   ```

## Database Schema

The schema includes tables for:

- `users` - User accounts (if auth enabled)
- `accounts` - OAuth accounts (if auth enabled)
- `sessions` - User sessions (if auth enabled)
- `posts` - Content/posts (if posts enabled)
- `categories` - Categories (if categories enabled)
- `comments` - Comments (if comments enabled)

Tables are only created/migrated for enabled features.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

Ensure your platform supports:
- Node.js 18+
- PostgreSQL database (if using database features)

## Scripts

- `pnpm setup` - Run setup wizard
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio

## Removing Unused Code

After disabling features, you may want to remove unused files:

1. Disable features in `config/app.config.ts`
2. Remove corresponding files from `app/` and `components/`
3. Update database schema if needed

## License

MIT

## Support

For issues or questions, please refer to the original project repository or create an issue in your fork.
