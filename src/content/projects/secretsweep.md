---
title: secretsweep
description: "Zero-config secret scanning for staged git files — catch API keys before you push."
emoji: "🔍"
techStack: ["TypeScript", "Node.js", "CLI"]
category: "tool"
npmPackage: "@fanioz/secretsweep"
githubUrl: "https://github.com/BenihDev/secretsweep"
installCommand: "npm install -g @fanioz/secretsweep"
order: 6
---

Zero-config secret scanning for staged git files — catch API keys, tokens, and credentials before they leave your machine.

## Setup

No configuration needed. Works out of the box.

## Usage

```bash
# Scan staged files (pre-commit friendly)
secretsweep

# Scan a directory
secretsweep scan ./src

# Scan a specific file
secretsweep scan ./config/production.json
```

### Pre-commit hook

Add to `.husky/pre-commit` (or `.git/hooks/pre-commit`):

```bash
npx secretsweep staged
```

## What It Detects

| Category | Patterns |
|----------|----------|
| **AWS** | Access Keys (AKIA...), Secret Keys |
| **GitHub** | Personal Access Tokens, OAuth, App Tokens |
| **GCP** | API Keys, OAuth tokens, Service Account keys |
| **Azure** | Connection Strings |
| **Stripe** | Secret and Publishable Keys |
| **Slack** | Bot tokens, Webhooks |
| **Database** | MongoDB, PostgreSQL, MySQL, Redis URIs |
| **Generic** | Bearer tokens, API keys, passwords, private keys |
| **Entropy** | High-entropy strings that look like secrets |

## Ignore False Positives

Create a `.secretsweepignore` file:

```
test/fixtures/
*.test.js
examples/demo.js
```

## How It Works

1. Scans staged files in your git index (or specified paths)
2. Matches against patterns for common secret formats
3. Flags high-entropy strings that look like secrets
4. Reports findings before you push

## Features

- Zero config — works immediately, no setup files needed
- Fast — under 2 seconds for typical repos
- Git-aware — scans staged files by default, not your whole history
- Pre-commit ready — drop it into your hooks and forget about it
- Broad detection — AWS, GitHub, GCP, Azure, Stripe, Slack, databases, and more
