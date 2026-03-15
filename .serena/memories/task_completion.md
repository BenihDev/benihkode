# Task Completion Checklist for bkastro

## When Completing Development Tasks

### 1. Build Verification
```bash
# Always build before considering a task complete
pnpm build
```
- Ensure the build completes successfully
- Check for any TypeScript errors
- Verify the `./dist/` directory is generated correctly

### 2. Local Testing
```bash
# Test locally before deploying
pnpm dev          # Start dev server (localhost:4321)
# or
pnpm preview      # Test production build locally
```
- Verify the changes work as expected
- Check responsive behavior on different viewport sizes
- Test any new routes or functionality

### 3. Content Changes
If you've modified blog content or added new posts:
- Verify frontmatter schema compliance
- Check that images are properly referenced
- Ensure posts appear in the blog index
- Test RSS feed generation at `/rss.xml`

### 4. Type Safety
```bash
# Regenerate types if you modified Wrangler config
pnpm cf-typegen
```
- Ensure TypeScript compilation passes
- Check for type errors in `.astro` and `.ts` files
- Verify content collection schemas are correct

### 5. Deployment
```bash
# Deploy to Cloudflare Pages when ready
pnpm deploy
```
- Only deploy after local verification
- Ensure site URL is updated in `astro.config.mjs` if needed
- Check deployment succeeds on Cloudflare dashboard

## What NOT to Worry About

- **Tests**: No test framework is configured
- **Linting**: No ESLint/Prettier setup
- **Formatting**: No automated formatting configured
- **Type checking**: TypeScript handles this via `astro check`

## Common Issues

### Build Failures
- Check for missing dependencies: `pnpm install`
- Verify Node.js version: `node --version` (should be >=22.12.0)
- Clear cache: `rm -rf node_modules .astro dist && pnpm install`

### Type Errors
- Regenerate Cloudflare types: `pnpm cf-typegen`
- Restart TypeScript server in your IDE
- Check for type conflicts in content schemas

### Asset Issues
- Verify image paths in frontmatter use relative paths
- Check that images exist in `src/assets/`
- Ensure `<Image>` components have proper dimensions

## Deployment Checklist

Before deploying to production:
1. ✅ Build succeeds locally
2. ✅ Changes tested in development/preview mode
3. ✅ Site URL is correct in `astro.config.mjs`
4. ✅ Environment variables configured in Cloudflare (if any)
5. ✅ Cloudflare types are up-to-date
6. ✅ Content changes verified
