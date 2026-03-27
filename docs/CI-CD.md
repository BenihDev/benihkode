# CI/CD Pipeline Documentation

This document describes the automated CI/CD pipeline for the BenihKode app factory.

## Overview

The CI/CD pipeline is built using GitHub Actions and provides:

- **Automated Testing**: Linting, type checking, and unit tests on every push
- **Security Scanning**: Automated vulnerability detection using npm audit and Trivy
- **Automated Releases**: GitHub releases with changelog generation on version tags
- **Zero-Downtime Deployment**: Automated deployment to staging and production environments

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

Triggers on: Push to `main`/`develop` branches, Pull Requests

**Jobs:**

| Job | Purpose |
|-----|---------|
| `lint` | Runs ESLint for code quality checks |
| `type-check` | Validates TypeScript types |
| `test` | Executes unit tests with Vitest |
| `build` | Builds the Next.js application |
| `security` | Runs npm audit and Trivy security scanner |

**Quality Gates:**
- All jobs must pass before merge is allowed
- Security scan results are uploaded to GitHub Security tab
- Build artifacts are retained for 7 days

### 2. Release Workflow (`.github/workflows/release.yml`)

Triggers on: Git tags matching `v*.*.*` (e.g., `v1.0.0`)

**Jobs:**

| Job | Purpose |
|-----|---------|
| `release` | Creates GitHub release with auto-generated notes |
| `publish-npm` | Publishes packages to NPM (disabled for apps) |

**Release Process:**

```bash
# 1. Update version in package.json
npm version patch  # or minor, or major

# 2. Push the tag
git push origin main --tags

# 3. GitHub Actions creates the release automatically
```

### 3. Deploy Workflow (`.github/workflows/deploy.yml`)

Triggers on: Push to `main`/`develop`, Manual dispatch

**Environments:**

| Environment | Branch | URL |
|-------------|--------|-----|
| Staging | `develop` | https://staging.benihkode.com |
| Production | `main` | https://benihkode.com |

**Deployment Strategy:**
- Vercel for zero-downtime deployments
- Preview deployments for pull requests (automatic with Vercel)
- Manual deployment option via workflow dispatch

## Required Secrets

Configure these secrets in your GitHub repository settings:

| Secret | Description | How to Get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Vercel authentication token | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | Project `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Vercel project ID | Project `.vercel/project.json` |
| `NPM_TOKEN` | NPM publishing token | npmjs.com → Access Tokens (for packages only) |

## Local Development Scripts

```bash
# Run tests locally
pnpm test              # Run tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report

# Code quality
pnpm lint              # Check code style
pnpm lint:fix          # Fix auto-fixable lint issues
pnpm tsc               # Type check without building

# Build
pnpm build             # Build for production
```

## Branch Protection Rules

Recommended settings for `main` branch:

1. **Require pull request reviews** before merging
2. **Require status checks** to pass:
   - Lint
   - Type Check
   - Test
   - Build
   - Security Scan
3. **Require branches to be up to date** before merging
4. **Do not allow bypassing** the above settings

## Testing Strategy

### Unit Tests
- Location: `**/*.test.tsx` or `**/*.spec.tsx`
- Framework: Vitest with React Testing Library
- Coverage target: >80%

### Integration Tests
- Database migrations: Test with local database
- API routes: Test with integration test suite

### E2E Tests
- Tool: Playwright (to be added)
- Critical user flows: Auth, post creation, publishing

## Troubleshooting

### Build Failures

1. **Lint errors**: Run `pnpm lint:fix` locally
2. **Type errors**: Run `pnpm tsc` to see detailed errors
3. **Test failures**: Run `pnpm test` locally with verbose output

### Deployment Failures

1. **Vercel auth error**: Verify `VERCEL_TOKEN` is valid
2. **Build timeout**: Check Vercel build logs for specific errors
3. **Environment variables**: Ensure all required env vars are set in Vercel

### Security Scan Failures

1. **npm audit**: Review vulnerable packages, update if needed
2. **Trivy alerts**: Check for OS-level vulnerabilities in dependencies

## Next Steps

1. Set up Vercel project and link to GitHub
2. Configure GitHub secrets (Vercel tokens, etc.)
3. Enable branch protection rules
4. Add more tests as codebase grows
5. Set up E2E testing with Playwright
6. Configure monitoring and alerts (Sentry, etc.)
