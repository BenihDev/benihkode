# Suggested Commands for bkastro

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server (localhost:4321)
pnpm dev

# Build for production
pnpm build

# Preview production build locally with Wrangler
pnpm preview

# Deploy to Cloudflare Pages
pnpm deploy

# Generate Cloudflare Workers TypeScript types
pnpm cf-typegen
# or
pnpm generate-types

# Run Astro CLI commands
pnpm astro [command]
```

## System Commands (Darwin/macOS)

```bash
# File operations
ls -la              # List files with details
pwd                 # Show current directory
cd [path]          # Change directory
find . -name "*.astro"  # Find Astro files
grep -r "pattern" .     # Search recursively

# Git operations
git status          # Show git status
git add .           # Stage all changes
git commit -m "message"  # Commit changes
git push            # Push to remote
git log --oneline   # Show commit history
git diff            # Show unstaged changes

# Process management
ps aux | grep astro  # Find running Astro processes
kill -9 [PID]        # Kill process by PID
```

## Important Notes

- This project uses **pnpm** as package manager (required by engines field)
- Node.js version requirement: >=22.12.0
- No test framework currently configured
- No linting/formatting tools configured (ESLint, Prettier, etc.)
- Development server runs on port 4321 by default
- Wrangler is used for Cloudflare Pages deployment
