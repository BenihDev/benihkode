---
title: gitcommitgen
description: "AI-powered conventional commit message generator. Analyzes staged changes and generates clean commit messages."
emoji: "📝"
techStack: ["TypeScript", "Node.js", "CLI"]
category: "tool"
npmPackage: "@fanioz/gitcommitgen"
githubUrl: "https://github.com/BenihDev/gitcommitgen"
installCommand: "npm install -g @fanioz/gitcommitgen"
order: 1
---

Analyze your staged git changes and generate clean, meaningful conventional commit messages — powered by AI.

## Setup

Set your LLM provider API key:

```bash
# OpenAI
export OPENAI_API_KEY="sk-..."

# Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."
```

Optionally, create a config file at `~/.gitcommitgen.json` for defaults:

```json
{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "commit": true,
  "edit": true,
  "dryRun": false
}
```

Without a config file or flags, defaults to `--edit` mode.

## Usage

```bash
# Generate and print commit message
gitcommitgen

# Generate and auto-commit
gitcommitgen --commit

# Use a specific provider and model
gitcommitgen --provider anthropic --model claude-haiku-4-5

# Preview: show diff summary and proposed message
gitcommitgen --dry-run

# Edit the generated message before committing
gitcommitgen --commit --edit
```

You can also pipe directly to git:

```bash
git commit -m "$(gitcommitgen)"
```

## How It Works

1. Reads `git diff --staged` to see your changes
2. Sends the diff to an LLM with a prompt tuned for conventional commits
3. Returns a clean commit message (type, optional scope, description)

## Supported Providers

| Provider | Default Model | Env Var |
|----------|--------------|---------|
| OpenAI | gpt-4o-mini | `OPENAI_API_KEY` |
| Anthropic | claude-haiku-4-5 | `ANTHROPIC_API_KEY` |

## Features

- Zero-config — works out of the box with just an API key
- Supports OpenAI and Anthropic as providers
- Config file support for team defaults (`~/.gitcommitgen.json`)
- Dry-run mode to preview before committing
- Edit mode to tweak the generated message
- Auto-commit with `--commit` flag
