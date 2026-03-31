// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://benihkode.web.id',
  integrations: [mdx(), sitemap()],
  adapter: cloudflare(),
  vite: {
    build: {
      minify: false,
    },
  },
});