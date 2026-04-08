---
title: "Introducing BenihKode Dev Tools"
description: "A collection of CLI utilities built to make everyday development less tedious — from commit messages to secret scanning."
pubDate: 2026-04-08
tags: ["Announcement", "CLI", "Open Source"]
---

Over the past few months, I've been building CLI tools to solve the small, repetitive problems that show up in every developer's workflow. Today, I'm sharing the full collection: **BenihKode Dev Tools**.

## The Idea

Every developer has a toolkit — scripts, aliases, and one-liners they've accumulated over time. The problem is that these tools are usually personal, undocumented, and fragile. I wanted to take the utilities I was already using daily, polish them, and publish them so others could benefit too.

The common thread: these tools handle the tedious parts of development so you can focus on the actual work.

## The Tools

### gitcommitgen

AI-powered conventional commit message generator. Analyzes your staged git changes and generates clean commit messages. Supports OpenAI and Anthropic.

```bash
npm install -g @fanioz/gitcommitgen
gitcommitgen --commit
```

### changelog-ai

Generate professional changelogs from your git history. Works with or without an AI API key — falls back to heuristic-based grouping.

```bash
npx changelog-ai
```

### secretsweep

Zero-config secret scanning for staged git files. Catches API keys, tokens, and credentials before you push. Scans for AWS, GitHub, GCP, Azure, Stripe, Slack, database URIs, and more.

```bash
npm install -g @fanioz/secretsweep
secretsweep
```

### gitprgen

AI-powered PR description generator. Reads your branch diff and generates structured pull request descriptions.

```bash
npm install -g gitprgen
gitprgen
```

### jsonask

Query JSON with natural language instead of jq syntax. No API key needed — works offline.

```bash
npm install -g @fanioz/jsonask
cat data.json | jsonask "show names"
```

### mcpkit

Generate ready-to-use MCP servers from OpenAPI specs, SQLite databases, or YAML descriptions. Goes from zero to a working MCP server in seconds.

```bash
npx @fanioz/mcpkit from openapi.yaml
```

### gitprune

Safe git branch cleanup. Identify and remove merged and stale branches without losing work.

```bash
gitprune --delete
```

### envtainer

Manage environment variables across projects and environments. Validate required variables, diff between environments, keep `.env` files in sync.

```bash
envtainer init
envtainer validate
```

## Design Principles

Every tool in this collection follows the same principles:

- **Zero-config when possible.** Install and run. Optional config files for customization.
- **Works where you already work.** These are CLI tools — they live in your terminal, in your git hooks, in your CI pipeline.
- **Offline-first where it makes sense.** jsonask and secretsweep work without any API keys. The AI-powered tools (gitcommitgen, gitprgen, changelog-ai) need keys but fall back gracefully.
- **Open source.** Every tool is on [GitHub](https://github.com/BenihDev) under the BenihDev organization.

## What's Next

This is a starting point, not a finished product. I'm actively working on improvements and new tools. If you have ideas, bug reports, or want to contribute, the repos are open.

Explore the full collection on the [tools page](/tools).

---

*All BenihKode dev tools are open source. Check out the [BenihDev GitHub organization](https://github.com/BenihDev) for source code and issue trackers.*
