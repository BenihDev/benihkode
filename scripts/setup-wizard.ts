#!/usr/bin/env tsx

/**
 * Starter Template Setup Wizard
 *
 * This script helps you configure your new app from the starter template.
 * Run it with: npx tsx scripts/setup-wizard.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

function confirm(query: string): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(`${query} (y/N): `, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

interface AppConfig {
  appName: string;
  appTitle: string;
  appDescription: string;
  appTagline: string;
  features: {
    auth: boolean;
    posts: boolean;
    comments: boolean;
    categories: boolean;
    drafts: boolean;
  };
  content: {
    itemsPerPage: number;
    markdown: boolean;
    coverImages: boolean;
    excerpts: boolean;
  };
  ui: {
    defaultTheme: 'light' | 'dark' | 'system';
    colorScheme: 'zinc' | 'blue' | 'green' | 'purple' | 'red' | 'orange';
  };
  seo: {
    titleSuffix: string;
    ogImage: string;
    twitterHandle?: string;
  };
}

async function runWizard() {
  console.log('\n🚀 Starter Template Setup Wizard\n');
  console.log('This wizard will help you configure your new app.\n');

  const config: AppConfig = {
    appName: '',
    appTitle: '',
    appDescription: '',
    appTagline: '',
    features: {
      auth: false,
      posts: false,
      comments: false,
      categories: false,
      drafts: false,
    },
    content: {
      itemsPerPage: 20,
      markdown: true,
      coverImages: true,
      excerpts: true,
    },
    ui: {
      defaultTheme: 'system',
      colorScheme: 'zinc',
    },
    seo: {
      titleSuffix: '',
      ogImage: '/og-image.png',
      twitterHandle: undefined,
    },
  };

  // App Branding
  console.log('--- App Branding ---\n');

  config.appName = await question('App name (used for URLs, lowercase, no spaces): ');
  config.appTitle = await question('App title (displayed in header): ');
  config.appDescription = await question('App description (for SEO): ');
  config.appTagline = await question('App tagline (displayed under title): ');

  // Features
  console.log('\n--- Features ---\n');
  console.log('Which features would you like to enable?\n');

  config.features.auth = await confirm('Enable authentication (NextAuth with Google OAuth)?');
  config.features.posts = await confirm('Enable posts/content management?');
  if (config.features.posts) {
    config.features.comments = await confirm('  Enable comments on posts?');
    config.features.categories = await confirm('  Enable categories/tags?');
    config.features.drafts = await confirm('  Enable draft functionality?');
  }

  // Content Settings
  console.log('\n--- Content Settings ---\n');

  const itemsPerPage = await question('Items per page (default: 20): ');
  config.content.itemsPerPage = itemsPerPage ? parseInt(itemsPerPage, 10) : 20;
  config.content.markdown = await confirm('Enable markdown support?');
  config.content.coverImages = await confirm('Enable cover images?');
  config.content.excerpts = await confirm('Enable excerpts/summaries?');

  // UI Settings
  console.log('\n--- UI Settings ---\n');

  const themeAnswer = await question('Default theme (light/dark/system, default: system): ');
  config.ui.defaultTheme = themeAnswer === 'light' || themeAnswer === 'dark' || themeAnswer === 'system'
    ? themeAnswer
    : 'system';

  const colorAnswer = await question('Color scheme (zinc/blue/green/purple/red/orange, default: zinc): ');
  config.ui.colorScheme = ['zinc', 'blue', 'green', 'purple', 'red', 'orange'].includes(colorAnswer)
    ? colorAnswer as any
    : 'zinc';

  // SEO Settings
  console.log('\n--- SEO Settings ---\n');

  config.seo.titleSuffix = await question('SEO title suffix (default: "| " + app title): ');
  if (!config.seo.titleSuffix) {
    config.seo.titleSuffix = `| ${config.appTitle}`;
  }

  const twitterHandle = await question('Twitter handle (optional, without @): ');
  config.seo.twitterHandle = twitterHandle || undefined;

  // Summary
  console.log('\n--- Configuration Summary ---\n');
  console.log(JSON.stringify(config, null, 2));

  const confirmed = await confirm('\nIs this configuration correct?');
  if (!confirmed) {
    console.log('\nSetup cancelled. Run the wizard again to restart.');
    rl.close();
    process.exit(0);
  }

  // Write configuration
  const configPath = path.join(process.cwd(), 'config', 'app.config.ts');
  const configContent = generateConfigFile(config);

  fs.writeFileSync(configPath, configContent, 'utf-8');

  console.log('\n✅ Configuration written to config/app.config.ts');
  console.log('\nNext steps:');
  console.log('1. Review and update .env.local with your credentials');
  console.log('2. Run pnpm install to install dependencies');
  console.log('3. Run pnpm db:push to set up the database');
  console.log('4. Run pnpm dev to start the development server\n');

  rl.close();
}

function generateConfigFile(config: AppConfig): string {
  return `/**
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
export const appConfig: AppConfig = ${JSON.stringify(config, null, 2)};

// Type exports for use throughout the app
export type { AppConfig };
`;
}

runWizard().catch((error) => {
  console.error('Error running wizard:', error);
  rl.close();
  process.exit(1);
});
