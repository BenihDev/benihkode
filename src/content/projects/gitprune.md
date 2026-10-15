---
title: gitprune
description: "Safe git branch cleanup tool. Identify and remove merged branches without losing work."
summary: "gitprune is a free CLI that finds merged, stale, and untracked git branches — then removes them safely, without losing work."
emoji: "✂️"
techStack: ["TypeScript", "Node.js", "CLI"]
category: "tool"
githubUrl: "https://github.com/BenihDev/gitprune"
order: 9
---

Safely clean up your git branches. Identify merged, stale, and untracked branches — then remove them with confidence.

## Features

- Detect merged branches (local and remote)
- Identify stale branches by age
- Preview what will be deleted before taking action
- Protect important branches from accidental deletion
- Clean up remote-tracking branches for deleted remotes

## Usage

```bash
# Preview merged branches
gitprune

# Delete merged local branches
gitprune --delete

# Also clean up remote-tracking branches
gitprune --remote

# Set staleness threshold (days)
gitprune --stale 30

# Dry-run to see what would be deleted
gitprune --dry-run
```

## Why gitprune?

Over time, repositories accumulate dozens of merged branches that clutter `git branch` output and make it harder to find active work. `gitprune` automates the cleanup while protecting branches you still need.

## Use Cases

- Clean up after a merge-heavy workflow
- Remove stale feature branches older than N days
- Sync remote-tracking references after team branch cleanup
- Keep your branch list focused on active work

## Related Tools

- [gitprgen](/tools/gitprgen) — describe the pull request whose branch you will
  later prune.
- [gitcommitgen](/tools/gitcommitgen) — write clean messages so branch history is
  readable before cleanup.
- [secretsweep](/tools/secretsweep) — scan staged files as part of the git
  workflow.
- Browse the rest of the [developer tools collection](/tools/) and the
  [collection announcement](/blog/introducing-benihkode-dev-tools).
