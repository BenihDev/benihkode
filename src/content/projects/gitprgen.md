---
title: gitprgen
description: "AI-powered PR description generator. Generates clear, structured pull request descriptions from your git diffs."
emoji: "🔀"
techStack: ["TypeScript", "Node.js", "CLI"]
category: "tool"
npmPackage: "gitprgen"
githubUrl: "https://github.com/BenihDev/gitprgen"
installCommand: "npm install -g gitprgen"
order: 7
---

Generate clear, structured pull request descriptions from your git diffs — powered by AI.

## Setup

Set your LLM provider API key:

```bash
# Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."

# OpenAI
export OPENAI_API_KEY="sk-..."
```

Optionally create a config file at `~/.gitprgen.json`:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514"
}
```

## Usage

```bash
# Generate PR description for current branch vs main
gitprgen

# Specify base branch
gitprgen --base develop

# Use custom template
gitprgen --template ./pr-template.md

# Specify LLM provider and model
gitprgen -p anthropic -m claude-sonnet-4-20250514
```

## How It Works

1. Reads the diff between your current branch and the base branch (main by default)
2. Collects commit messages and changed files summary
3. Sends everything to an LLM
4. Outputs a structured PR description (summary, changes, testing)

## Supported Providers

| Provider | Env Var |
|----------|---------|
| Anthropic | `ANTHROPIC_API_KEY` |
| OpenAI | `OPENAI_API_KEY` |

## Features

- Zero-config with sensible defaults
- Supports Anthropic and OpenAI as providers
- Custom PR templates
- Configurable base branch
- Structured output: summary, changes, testing notes
