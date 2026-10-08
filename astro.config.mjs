// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

/**
 * Rehype plugin: load the first blog image eagerly and default other
 * markdown/MDX images to lazy loading. Decode images asynchronously.
 *
 * Uses only the hast node shape — no extra npm dependency required.
 * @returns {import('unified').Plugin}
 */
function rehypeLazyImages() {
  return (tree, file) => {
    const isBlog = /(^|[/\\])src[/\\]content[/\\]blog[/\\]/.test(file.path || '');
    let isFirstImage = true;
    const visit = (node, type, fn) => {
      if (node.type === type) fn(node);
      if (node.children) node.children.forEach(child => visit(child, type, fn));
    };
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        node.properties = node.properties || {};
        if (isBlog && isFirstImage) node.properties.loading = 'eager';
        else if (!node.properties.loading) node.properties.loading = 'lazy';
        if (!node.properties.decoding) node.properties.decoding = 'async';
        isFirstImage = false;
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://benihkode.web.id',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/feed.json') &&
        !page.includes('/rss.xml') &&
        !page.includes('/llms'),
    }),
  ],
  adapter: vercel(),
  markdown: {
    rehypePlugins: [rehypeLazyImages],
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  },
});
