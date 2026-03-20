## 2024-05-18 - Astro Prerendering with Test Files
**Learning:** Test files (like `rss.xml.test.js`) in the `src/pages` directory will be picked up by Astro's routing and prerendering step, causing build failures when they try to use Node.js built-ins like `node:test` that aren't available during the prerender phase or when their imports are resolved automatically in an unsupported way.
**Action:** Move test files out of the `src/pages` directory or exclude them from the build. In this case, `rss.xml.test.js` is causing the build error.
