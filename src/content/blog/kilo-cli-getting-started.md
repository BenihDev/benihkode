---
title: "Getting Started with Kilo CLI"
description: "A practical guide to using Kilo CLI for agentic engineering—code, plan, and debug directly from your terminal."
pubDate: 2026-04-11
tags: ["Kilo", "CLI", "Tools"]
---

If you've been using AI coding assistants in your IDE, you're already part of the agentic engineering revolution. But what happens when you're SSH'd into a remote server at 2am debugging production, or working in a terminal without your favorite extension? That's where Kilo CLI comes in.

## What is Kilo CLI?

Kilo CLI is a terminal-first AI coding tool that brings the same agentic experience you'd get in VS Code or JetBrains directly to your command line. Built on the open-source OpenCode foundation, it supports 500+ AI models and integrates seamlessly with Kilo's IDE extensions—your sessions sync everywhere.

## Installation

Getting started takes seconds:

```bash
npm install -g @kilocode/cli
```

Or run directly without installing:

```bash
npx --package @kilocode/cli kilo
```

Verify it worked:

```bash
kilo --version
```

## Your First Session

Navigate to any project directory and run:

```bash
kilo
```

Kilo auto-detects your repository and launches an interactive Terminal User Interface (TUI). Use `/connect` to add your first AI provider credentials, then start coding.

## Core Commands

| Command | Description |
|---|---|
| `kilo` | Launch interactive TUI |
| `kilo run "..."` | Run a one-off task |
| `kilo auth` | Manage AI provider credentials |
| `kilo models` | List available models |
| `kilo mcp` | Manage MCP servers |
| `kilo session list` | List your sessions |
| `kilo upgrade` | Update to latest version |

## Operational Modes

Kilo isn't a one-trick pony. It offers specialized modes for different workflows:

- **Code Mode** — High-speed generation and multi-file refactoring
- **Architect Mode** — High-level planning and technical strategy
- **Debug Mode** — Systematic problem diagnosis and resolution

Switch modes interactively or specify them in your prompt.

## One-Off Tasks

Don't need an interactive session? Run autonomous tasks from the command line:

```bash
kilo run "add input validation to the signup form"
```

For CI/CD or automation, use the `--auto` flag for fully autonomous operation:

```bash
kilo run --auto "run tests and fix any failures"
```

## Model Flexibility

With 500+ models from OpenAI, Anthropic, Google, and more, you're never locked into a single provider. Choose the best cost-to-performance ratio for each task—use a lightweight model for quick edits, a reasoning model for complex debugging.

```bash
kilo models  # Browse and switch models
```

## Session Persistence

Kilo solves "AI amnesia" with persistent sessions. Start something in the CLI, check it in VS Code when you're back at your desk, share it via Slack with a teammate. Your context moves with you.

## Interactive Slash Commands

Within the TUI, slash commands give you keyboard-first navigation:

- `/sessions` — Resume a previous session
- `/models` — Switch models mid-session
- `/connect` — Add new provider credentials
- `/checkpoint list` — View restore points
- `/checkpoint restore <id>` — Roll back to a previous state
- `/tasks` — View and search task history
- `/themes` — Switch the UI theme
- `/help` — Show available commands

## Why Kilo CLI?

The tool fits into workflows where IDE extensions can't reach: remote servers, minimal environments, automated pipelines. Combined with Kilo's IDE extensions, you get a unified experience across your entire development lifecycle.

Install it, run `kilo`, and start coding. Your terminal just got an upgrade.
