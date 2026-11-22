---
title: branchprune
description: "Zero-config safe git branch cleanup. Remove merged branches in seconds."
summary: "branchprune is a free CLI that finds merged git branches — then removes them safely, without losing work."
emoji: "✂️"
techStack: ["TypeScript", "Node.js", "CLI"]
category: "tool"
githubUrl: "https://github.com/fanioz/branchprune"
npmPackage: "branchprune"
installCommand: "npm i -g branchprune"
order: 9
---

Zero-config, safe git branch cleanup. `branchprune` detects your default branch, lists everything merged into it, protects the branches you still need — then removes the rest with your confirmation.

## Features

- Zero config — auto-detects the default branch (main or master)
- Safe by default — protects main, master, develop, and your current branch
- Interactive — review and select which branches to delete
- Dry-run mode — preview what would be deleted before anything is removed
- Remote support — clean up stale remote-tracking branches too

## Usage

```bash
# Run once, no install
npx branchprune

# List merged branches, prompt to delete
branchprune

# Preview only, no deletions
branchprune --dry-run

# Also clean up remote-tracking branches
branchprune --remote

# Skip the confirmation prompt
branchprune --force
```

## Why branchprune?

Over time, repositories accumulate dozens of merged branches that clutter `git branch` output and make it harder to find active work. `branchprune` automates the cleanup while protecting branches you still need.

## Use Cases

- Clean up after a merge-heavy workflow
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
