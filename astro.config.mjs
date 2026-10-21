// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';


/**
 * Resolve width/height for a local public image so the emitted <img> reserves
 * layout space. Prevents CLS (Cumulative Layout Shift). Parses the PNG IHDR and
 * JPEG SOFn headers directly to stay synchronous inside the rehype transform.
 * @param {string} src
 * @returns {{width:number,height:number}|null}
 */
const imageSizeCache = new Map();
function localImageSize(src) {
  if (!src || /^(https?:)?\/\//.test(src)) return null;
  const rel = src.replace(/^\//, '');
  const abs = fileURLToPath(new URL('./public/' + rel, import.meta.url));
  if (!existsSync(abs)) return null;
  if (imageSizeCache.has(abs)) return imageSizeCache.get(abs);
  let size = null;
  try {
    const buf = readFileSync(abs);
    if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
      size = { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    } else if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i + 9 < buf.length) {
        if (buf[i] !== 0xff) { i++; continue; }
        // A valid JPEG may pad with repeated 0xFF fill bytes before a marker.
        let j = i + 1;
        while (j < buf.length && buf[j] === 0xff) j++;
        if (j >= buf.length) break;
        const marker = buf[j];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          size = { height: buf.readUInt16BE(j + 3), width: buf.readUInt16BE(j + 5) };
          break;
        }
        i = j + 1 + buf.readUInt16BE(j + 1);
      }
    }
  } catch { size = null; }
  imageSizeCache.set(abs, size);
  return size;
}

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
        if (node.properties.width == null || node.properties.height == null) {
          const size = localImageSize(node.properties.src);
          if (size) {
            if (node.properties.width == null && node.properties.height == null) {
              node.properties.width = size.width;
              node.properties.height = size.height;
            } else if (node.properties.width == null) {
              node.properties.width = Math.round(Number(node.properties.height) * size.width / size.height);
            } else {
              node.properties.height = Math.round(Number(node.properties.width) * size.height / size.width);
            }
          }
        }
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
