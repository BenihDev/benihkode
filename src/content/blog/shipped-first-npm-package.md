---
title: "Shipped My First NPM Package"
description: "How gitcommitgen went from a shell alias to a published npm package — and what I learned about open source along the way."
pubDate: 2025-01-20
updatedDate: 2026-04-08
tags: ["Open Source", "NPM", "CLI"]
---

I'd been writing the same kind of commit messages for months. `fix stuff`, `update`, `wip`. Then I'd spend five minutes rewriting them before pushing because my team's CI enforced conventional commits. At some point I thought: *why am I doing this manually when my diff already has all the information?*

That thought became **gitcommitgen** — and it became my first npm package.

## The Problem

Conventional commits are great for automated changelogs, semantic versioning, and commit history that actually means something. But writing them is tedious. You have to classify your change (feat? fix? docs?), figure out the scope, and write a description that's concise enough for a one-liner but informative enough to be useful.

I was already using AI tools for code review and documentation. Using one for commit messages felt like the obvious next step.

## Building It

The core idea is simple:

1. Run `git diff --staged` to get your staged changes
2. Send the diff to an LLM with a prompt tuned for conventional commits
3. Get back a clean commit message

The first version was literally a shell script. It worked, but it wasn't portable. I wanted something anyone could install and use, so I rewrote it in TypeScript as a proper CLI tool.

Key decisions:

- **Provider flexibility.** Not everyone uses the same LLM. I added support for both OpenAI and Anthropic from the start, with a config file at `~/.gitcommitgen.json` for defaults.
- **Edit mode by default.** AI-generated commit messages are good, but not always perfect. The default behavior opens your `$EDITOR` so you can tweak the message before committing. `--commit` skips this for the confident.
- **Dry-run mode.** Sometimes you just want to see what it would generate without committing anything. `--dry-run` prints the diff summary and proposed message.

## The Hard Part Wasn't the Code

Publishing to npm is straightforward. `npm publish` and you're done. But the *process* of getting there taught me a lot:

**Semantic versioning.** I had to actually understand semver. What constitutes a breaking change in a CLI tool? (Answer: changing flag behavior or removing options.) When to bump patch vs minor? I settled on: bug fixes are patch, new features are minor, breaking changes are major.

**Documentation matters more than features.** I spent more time on the README and usage examples than on the core logic. A tool that nobody knows how to use is a tool that nobody uses.

**CI/CD.** I set up automated publishing with GitHub Actions. Push a tag, and the package publishes itself. No more manual `npm publish` and hoping I bumped the version.

**The `bin` field.** Getting a CLI tool to actually work when installed globally requires the `bin` field in `package.json` and a proper shebang line. Small details that are easy to miss.

## What gitcommitgen Does Today

```bash
# Generate and print commit message
gitcommitgen

# Generate and auto-commit
gitcommitgen --commit

# Use a specific provider and model
gitcommitgen --provider anthropic --model claude-haiku-4-5

# Preview before committing
gitcommitgen --dry-run
```

Zero-config — set your API key and it works. Supports a config file for team defaults. Works with any Git repository.

## What I Learned

1. **Ship early, iterate fast.** The first version was rough. But having it published meant I could actually use it daily and find the rough edges.
2. **Conventions exist for a reason.** Building a tool that enforces conventional commits made me appreciate the format more. Structured commit messages aren't bureaucracy — they're documentation.
3. **CLI tools are a different kind of product.** Web apps have a visual UI. CLI tools have flags, help text, and exit codes. The UX is the interface, and getting it right matters just as much.
4. **Open source is a conversation.** Publishing the package was the start, not the end. Feedback from early users shaped the feature set more than my original roadmap.

## What's Next

gitcommitgen was the first, but it kicked off something bigger. I started building more CLI tools — tools for changelogs, secret scanning, PR descriptions, JSON querying. The idea is simple: build the small utilities that make a developer's day less tedious.

Check it out: [github.com/BenihDev/gitcommitgen](https://github.com/BenihDev/gitcommitgen)

---

*gitcommitgen is open source and available on npm as `@fanioz/gitcommitgen`.*
