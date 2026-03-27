# Example Usage Guide

This guide shows how to use the starter template to build different types of applications.

## Example 1: Simple Marketing Site

**Goal**: A static marketing site with no database or authentication.

**Configuration**:

```typescript
// config/app.config.ts
export const appConfig: AppConfig = {
  appName: 'awesome-product',
  appTitle: 'Awesome Product',
  appDescription: 'The best product ever',
  appTagline: 'Simplify your workflow',

  features: {
    auth: false,
    posts: false,
    comments: false,
    categories: false,
    drafts: false,
  },
  // ... other settings
};
```

**Steps**:
1. Run `pnpm setup` and disable all features
2. Create your pages in `app/` directory
3. Deploy without database setup

---

## Example 2: Blog Platform

**Goal**: A simple blog with authentication and post management.

**Configuration**:

```typescript
// config/app.config.ts
export const appConfig: AppConfig = {
  appName: 'my-blog',
  appTitle: 'My Tech Blog',
  appDescription: 'Thoughts on technology and development',
  appTagline: 'Sharing knowledge, one post at a time',

  features: {
    auth: true,        // Enable author login
    posts: true,       // Enable posts
    comments: false,   // No comments for now
    categories: true,  // Organize posts by category
    drafts: true,      // Save drafts before publishing
  },
  // ... other settings
};
```

**Steps**:
1. Run `pnpm setup`
2. Configure Google OAuth in `.env.local`
3. Set up database with `pnpm db:push`
4. Start writing posts!

---

## Example 3: Community Forum

**Goal**: A discussion platform with posts and comments.

**Configuration**:

```typescript
// config/app.config.ts
export const appConfig: AppConfig = {
  appName: 'dev-community',
  appTitle: 'Dev Community',
  appDescription: 'A place for developers to connect',
  appTagline: 'Learn, share, grow together',

  features: {
    auth: true,        // User accounts
    posts: true,       // Discussions/posts
    comments: true,    // Enable replies
    categories: true,  # Topics (e.g., JavaScript, Python)
    drafts: false,     // No drafts for discussions
  },

  content: {
    itemsPerPage: 50,  // Show more discussions
    markdown: true,
    coverImages: false,
    excerpts: true,
  },
  // ... other settings
};
```

**Steps**:
1. Run `pnpm setup`
2. Implement comment components in `components/comments/`
3. Add comment routes in `app/api/comments/`
4. Customize the post page to show comments

---

## Example 4: SaaS Dashboard

**Goal**: Internal dashboard for a SaaS product.

**Configuration**:

```typescript
// config/app.config.ts
export const appConfig: AppConfig = {
  appName: 'saas-dashboard',
  appTitle: 'My SaaS Dashboard',
  appDescription: 'Manage your account and settings',
  appTagline: 'Your control center',

  features: {
    auth: true,        # Required for SaaS
    posts: false,      # Not a blog
    comments: false,
    categories: false,
    drafts: false,
  },

  ui: {
    defaultTheme: 'system',
    colorScheme: 'blue',
  },
  // ... other settings
};
```

**Steps**:
1. Run `pnpm setup` with only auth enabled
2. Remove blog-related files
3. Create dashboard pages in `app/dashboard/`
4. Add SaaS-specific features

---

## Customization Examples

### Custom Color Scheme

```typescript
// config/app.config.ts
ui: {
  defaultTheme: 'dark',
  colorScheme: 'purple',  // purple, blue, green, etc.
}
```

Then customize Tailwind config for brand colors:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',  // Your brand color
        // ...
      }
    }
  }
}
```

### Custom SEO

```typescript
// config/app.config.ts
seo: {
  titleSuffix: '| My Brand',
  ogImage: '/custom-og-image.png',
  twitterHandle: '@yourbrand',
}
```

### Feature Toggle in Components

```typescript
// components/MyComponent.tsx
import { appConfig } from '@/config/app.config';

export function MyComponent() {
  if (!appConfig.features.auth) {
    return null; // Don't render if auth is disabled
  }

  return <div>Authenticated content</div>;
}
```

---

## Migration from Old Blog Platform

If you're migrating from the old "Edu Tech Blog" platform:

1. **Run the setup wizard**: `pnpm setup`
2. **Keep your data**: The database schema is compatible
3. **Update branding**: Change title, description in config
4. **Customize**: Add/remove features as needed

Your existing posts and users will continue to work!
