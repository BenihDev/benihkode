---
title: gitcommitgen
description: "AI-powered conventional commit message generator. Analyzes staged changes and generates clean commit messages."
summary: "gitcommitgen is a free CLI that reads your staged git changes and writes a clean Conventional Commits message for you."
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

## Usage Examples

The real value of `gitcommitgen` shows up in the boring middle of a workday, not
in a demo. A few patterns that pay off immediately:

**The staged-only workflow.** Stage exactly the files that belong in one logical
change, then let the tool read that slice:

```bash
git add src/auth/session.ts src/auth/session.test.ts
gitcommitgen --commit
# → "fix(auth): refresh session token before expiry check"
```

Because the tool only sees `git diff --staged`, the message describes the change
you actually staged — not the three unrelated files still sitting dirty in your
working tree.

**The pipe that never blocks.** If you already live in the shell, skip the extra
process management:

```bash
git commit -m "$(gitcommitgen)"
```

This is useful in scripts or aliases where you want the message generation to be
a pure function of the index.

**The review-first habit.** When a change is subtle, use dry-run so the model
cannot commit on your behalf:

```bash
gitcommitgen --dry-run
```

You get the diff summary and the proposed message, decide, and then either copy
it or re-run with `--commit`.

**Team defaults.** Commit a shared config to your dotfiles and every repo picks
up the same provider, model, and mode:

```json
{ "provider": "anthropic", "model": "claude-haiku-4-5", "commit": true }
```

## When to Use gitcommitgen

Use it when the friction is real:

- You write "fix stuff" and "wip" messages and regret them later.
- Your team enforces Conventional Commits and you keep guessing the right `type`.
- You work on many small commits per day and typing message prose is overhead.
- You want commit messages to be consistent across a team without a linter
  lecture.

Skip it when the message carries design intent that only you know. The tool reads
a diff; it cannot explain *why* a decision was made. In those cases, write the
body yourself and use the tool only for the subject line.

## gitcommitgen vs. Alternatives

| Tool | Approach | Requires API key | Auto-commit | Best for |
|------|----------|------------------|-------------|----------|
| **gitcommitgen** | LLM reads staged diff | Yes | Yes (`--commit`) | Fast, low-friction conventional commits |
| **commitizen** | Interactive prompts, templates | No | No | Teams standardizing message shape |
| **aicommits** | LLM reads staged diff | Yes | Yes | Similar scope, broader provider config |
| **commitlint** | Lints messages after the fact | No | No | Enforcing a rule, not writing the message |

The practical split: `gitcommitgen` and `aicommits` generate; `commitizen` and
`commitlint` enforce. Many teams run a generator plus `commitlint` in a commit-msg
hook so the generated message is also validated.

## FAQ

**Does it send my code to the cloud?**
Yes. The staged diff is sent to the provider you configure (OpenAI or Anthropic).
Do not use it on repositories whose diffs you cannot share with that provider.

**Which provider should I pick?**
`gpt-4o-mini` is cheap and fast and handles conventional commit typing well.
`claude-haiku-4-5` is a good alternative when you already pay for Anthropic.

**Does it work without an API key?**
No. An API key is required for the chosen provider.

**Can I use it in CI?**
Yes, but be deliberate. Auto-committing in CI can create noisy history; most teams
use it locally and keep CI for linting messages with `commitlint`.

**What if the generated message is wrong?**
Run with `--edit` (or the default mode) and correct it before committing. The
tool never commits in dry-run or plain generate mode.

## Related Tools

- [gitprgen](/tools/gitprgen) — generate the pull request description from the
  same staged diff.
- [gitprune](/tools/gitprune) — clean up branches once the work is merged.
- [secretsweep](/tools/secretsweep) — scan the staged files for secrets before
  you commit them.
- Read the build story in [Building gitprgen](/blog/building-gitprgen) and the
  collection overview in [Introducing BenihKode Dev Tools](/blog/introducing-benihkode-dev-tools).
