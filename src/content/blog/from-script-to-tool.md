---
title: "From Script to Tool: Building My Second CLI with Bun"
description: "How a simple automation script evolved into a proper CLI tool, and what I learned about tool-building, error handling, and the joy of shipping."
pubDate: 2025-05-21
tags: ["Journal", "Learning", "Technical", "CLI", "Bun"]
---

Every developer has that one script. The thing they cobbled together to avoid repetitive work, saved in a `scripts/` folder with a name like `do-the-thing.sh`. It works, but it's fragile, poorly documented, and only you know how to use it.

For me, that script was responsible for generating changelogs from commit messages. It started as a few lines in my terminal history, grew into a 200-line monster, and eventually became my second published CLI tool.

## The Starting Point

I maintain a handful of npm packages now. Each release needs a changelog entry, and each entry needs to follow conventional commit format. At first, I manually copied and formatted commit messages. Then I copy-pasted between tabs. Then I wrote a shell script that did the formatting.

The script worked like this:

```bash
#!/bin/bash
git log --oneline $(git describe --tags --abbrev=0)..HEAD | \
  awk '{print "- " $2}' | \
  sed 's/^/- /'
```

Simple, but it didn't handle conventional commits properly, couldn't distinguish between features and fixes, and would crash if I ran it on a repo with no tags. Still, it saved me maybe five minutes per release.

## The Pain Points Piled Up

After shipping `gitcommitgen`, I started paying attention to my own workflows. The changelog script was causing real friction:

- Manual copy-pasting of the output into my changelog files
- No grouping of commits by type (feat, fix, docs)
- Links to PRs weren't included
- Breaking changes weren't highlighted
- It only worked on my machine with bash

I found myself avoiding releases because the changelog process was tedious. That's when I knew it was time to turn this script into something better.

## Discovering Bun

I'd been hearing about Bun, the JavaScript runtime that promised faster startup times and built-in utilities. For a CLI tool that runs and exits quickly, that sounded perfect.

The migration from bash to Bun wasn't just about performance—it was about expressing logic clearly. What took 20 lines of fragile bash became readable TypeScript:

```typescript
import { $ } from "bun";

const commits = await $`git log --oneline ${lastTag}..HEAD`.text();
const parsed = commits
  .split("\n")
  .map(parseConventionalCommit)
  .filter(Boolean);
```

Bun's `$` tagged template literal for shell commands felt natural. Error handling with `try/catch` was infinitely better than checking exit codes. And the built-in file utilities meant I didn't need external dependencies for reading and writing files.

## Building the Actual Tool

I started with the core question: what would make changelog generation delightful?

Three things came to mind:
1. Automatic grouping of commits by type
2. Links to GitHub PRs and commits
3. Breaking change detection with clear warnings

The implementation was straightforward once I committed to the vision. I parsed conventional commits into structured data, fetched PR information from the GitHub API, and generated markdown with proper sections.

But the real learning happened in the details:

**Error handling in CLIs is different.** You can't just throw and catch — users need clear error messages and exit codes. `process.exit(1)` after logging the error became my pattern.

**Configuration is a feature.** I added support for a `changelog.config.json` file so users could customize output formats, filter commit types, and specify repository URLs.

**Testing CLI tools requires different thinking.** Instead of mocking functions, I was spawning child processes and checking stdout. The Bun test runner made this surprisingly pleasant.

## The Hardest Part: Shipping Anxiety

The technical challenges were solvable. The emotional challenge—hitting "publish"—was harder.

With `gitcommitgen`, I had a clear use case: I needed it daily. With this changelog tool, I was solving a problem that was already solved by other tools. Why would mine be valuable?

The answer came from using it. After generating a few changelogs, I realized the difference: my tool understood my workflow. It knew I wanted PR links, it grouped things the way I think, and it caught breaking changes I'd missed.

I pushed the first version to npm and braced for crickets. Instead, a few colleagues tried it. Their feedback was immediate: "Can it handle merge commits?" "How do I exclude chore commits?"

Each question led to a better tool. By version 0.3.0, it felt solid.

## Key Lessons Learned

This journey reinforced things I'd learned from `gitcommitgen`, and taught me new lessons:

1. **Start with your own friction.** The best tools solve problems you feel acutely. That pain guides the feature set better than any product roadmap.

2. **Runtime choice matters for CLIs.** Bun's fast startup time makes running short-lived tools feel instant. For something that runs for 50ms and exits, that responsiveness changes the interaction quality.

3. **Configuration files are UX.** A well-designed config system lets users adapt the tool to their workflow instead of forcing them to adapt to the tool.

4. **Grouping is powerful.** The moment I saw commits organized by type—Features, Fixes, Breaking Changes—it felt like the tool was thinking with me, not just for me.

5. **Shipping is educational.** Every user question revealed an assumption I'd made. Assumptions are gaps in understanding, and bridging them makes better software.

## What's Next

The changelog tool is stable, but there's more to explore:

- Support for conventional commits with scopes (like `feat(api): add endpoint`)
- Custom templates for different output formats
- Integration with release-it and other release tools
- GitHub Actions integration for automated changelog generation

More broadly, I'm building a suite of these small tools—`gitcommitgen` for commits, this changelog tool for releases, and more in the pipeline. Each one teaches me something new about the intersection of developer experience and practical utility.

---

*changeling is open source and available on npm. The name comes from the mythical creature that changes shape—a reflection of how this tool evolved from a simple script into something entirely different.*