/**
 * Starter Template Configuration
 *
 * This file contains all configurable settings for your app.
 * Modify these values to customize the template for your use case.
 */

export interface AppConfig {
  // App Branding
  appName: string;
  appTitle: string;
  appDescription: string;
  appTagline: string;

  // Feature Flags
  features: {
    // Enable/disable authentication
    auth: boolean;
    // Enable/disable posts/content management
    posts: boolean;
    // Enable/disable comments
    comments: boolean;
    // Enable/disable categories/tags
    categories: boolean;
    // Enable/disable draft functionality
    drafts: boolean;
  };

  // Content Settings
  content: {
    // Items per page for listings
    itemsPerPage: number;
    // Enable markdown support
    markdown: boolean;
    // Enable cover images
    coverImages: boolean;
    // Enable excerpts/summaries
    excerpts: boolean;
  };

  // UI Settings
  ui: {
    // Theme (light, dark, system)
    defaultTheme: 'light' | 'dark' | 'system';
    // Primary color scheme
    colorScheme: 'zinc' | 'blue' | 'green' | 'purple' | 'red' | 'orange';
  };

  // SEO Settings
  seo: {
    // Default meta title suffix
    titleSuffix: string;
    // OpenGraph image (relative to public folder)
    ogImage: string;
    // Twitter handle
    twitterHandle?: string;
  };
}

/**
 * Default Configuration
 *
 * Edit these values to customize your app.
 */
export const appConfig: AppConfig = {
  // App Branding
  appName: 'my-app',
  appTitle: 'My App',
  appDescription: 'A modern web application built with Next.js',
  appTagline: 'Build something amazing',

  // Feature Flags - Enable/disable features
  features: {
    auth: true,        // Authentication (NextAuth)
    posts: true,       // Posts/content management
    comments: false,   // Comment system
    categories: false, // Categories and tags
    drafts: true,      // Draft functionality
  },

  // Content Settings
  content: {
    itemsPerPage: 20,
    markdown: true,
    coverImages: true,
    excerpts: true,
  },

  // UI Settings
  ui: {
    defaultTheme: 'system',
    colorScheme: 'zinc',
  },

  // SEO Settings
  seo: {
    titleSuffix: '| My App',
    ogImage: '/og-image.png',
    twitterHandle: undefined,
  },
};

// Type exports for use throughout the app
export type { AppConfig };
