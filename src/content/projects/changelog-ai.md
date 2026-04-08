---
title: changelog-ai
description: "Zero-config AI-powered changelog generator. Reads git history and generates clean release notes."
emoji: "📖"
techStack: ["TypeScript", "Node.js", "CLI"]
category: "tool"
npmPackage: "changelog-ai"
installCommand: "npx changelog-ai"
order: 2
---

Generate professional changelogs from your git history — no conventional commits required. Works with or without an AI API key.

## Usage

```bash
# Generate changelog from last tag to HEAD
npx changelog-ai

# Generate from all commits
npx changelog-ai --all

# Changes since a specific version
npx changelog-ai --from v1.0

# Skip AI, use heuristic grouping
npx changelog-ai --no-ai

# Output to terminal instead of CHANGELOG.md
npx changelog-ai --stdout
```

## AI Mode

Set your LLM provider API key to enable AI-powered summarization:

```bash
export OPENAI_API_KEY=sk-...
npx changelog-ai
```

Without an API key, changelog-ai automatically falls back to heuristic-based commit classification.

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--all` | false | Include all commits, not just since last tag |
| `--from <ref>` | last tag | Start from a specific tag, branch, or commit |
| `--output <file>` | CHANGELOG.md | Output file path |
| `--no-ai` | false | Disable AI, use heuristic grouping only |
| `--provider <name>` | auto | Force AI provider (openai or anthropic) |
| `--version-tag <tag>` | date | Version header (e.g. v1.2.0) |
| `--stdout` | false | Print to terminal instead of writing a file |

## How It Works

1. Reads git log from your repository
2. Classifies commits by type (features, fixes, docs, etc.)
3. With AI: summarizes and groups into user-friendly release notes
4. Without AI: uses pattern matching to categorize commits
5. Writes markdown to CHANGELOG.md (or stdout)

## Features

- Zero-config — works without any setup
- AI-powered with OpenAI and Anthropic support
- Graceful fallback to heuristic grouping when no API key is set
- Flexible range selection (`--from`, `--all`)
- Outputs to file or stdout
- No conventional commits required
