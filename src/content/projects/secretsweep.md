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

## Security Use Cases

`secretsweep` is small on purpose, but it slots into several real workflows:

**Stop the leak at the commit boundary.** The cheapest moment to catch a secret
is before it enters history. A pre-commit hook fails the commit and nothing ever
reaches the remote:

```bash
# .husky/pre-commit
npx secretsweep staged
```

**Audit a directory you are about to publish.** Before open-sourcing a repo or
shipping a config bundle, scan the tree directly:

```bash
secretsweep scan ./config
secretsweep scan ./scripts/deploy
```

**Guard a CI step.** Run the same scan in a job that inspects a pull request's
changed files, so a developer who skipped local hooks still gets caught.

**Catch credentials in fixture data.** Test fixtures and example files are a
common hiding place. Instead of disabling the scan, list them in
`.secretsweepignore` so the ignore intent is explicit and reviewable.

## Threat Model

Understanding what the tool does and does not protect against matters more than
the feature list.

**In scope.** Accidental commits of known credential formats (AWS, GitHub, GCP,
Stripe, Slack) and of high-entropy strings that look like secrets. The tool
reduces the window between "a key lands in the index" and "someone notices" to
zero for the commit path.

**Out of scope.** It is not a replacement for secret management. If a credential
is committed and later removed, it remains in git history until rewritten, and it
should be **rotated**, not just deleted. `secretsweep` cannot un-leak a key; it
prevents the leak.

**Trust boundary.** The scan runs locally and reads file contents only. It sends
nothing over the network. The risk it addresses is entirely in the diff leaving
your machine through `git push`.

**Known limits.** Entropy scanning trades recall for precision: a well-disguised
secret can pass, and a benign high-entropy constant can be flagged. Known-format
matching is precise but only covers formats the tool ships patterns for. Treat a
clean scan as "no obvious leak," not "provably secret-free."

## secretsweep vs. Alternatives

| Tool | Scope | Config required | Runtime | Best for |
|------|-------|-----------------|---------|----------|
| **secretsweep** | Staged files by default | None (`.secretsweepignore` optional) | Node/CLI, under 2s | Fast pre-commit gate with zero setup |
| **gitleaks** | Full repo and history | `gitleaks.toml` for tuning | Go binary | Repo-wide audits and CI |
| **trufflehog** | History, filesystem, live verification | Config optional | Go binary | Deep history scans and verified credentials |
| **git-secrets** | Staged/files, AWS-centric | `git secrets --register-aws` | Shell hooks | AWS-heavy workflows |

The trade-off is deliberate. `gitleaks` and `trufflehog` are stronger history
auditors; `secretsweep` optimizes for one job — make the pre-commit gate
frictionless enough that it is actually installed. Run both if your threat model
warrants it.

## FAQ

**Does it scan my whole repository history?**
No. By default it scans the staged git index — the files about to be committed.
Use `secretsweep scan <path>` or a history-aware tool when you need more.

**Does it need network access?**
No. Detection is local pattern matching plus entropy analysis.

**Will it slow down my commits?**
A typical repo scans in under two seconds.

**How do I handle a false positive?**
Add the path or glob to `.secretsweepignore`.

**Is a key already in history safe?**
No. Rotate the credential and purge it from history. Prevention and history
cleanup are different problems.

## Related Tools

- [gitcommitgen](/tools/gitcommitgen) — write the commit message after the scan
  comes back clean.
- [envtainer](/tools/envtainer) — keep `.env` files validated and out of version
  control.
- [jsonask](/tools/jsonask) — inspect the JSON config files the scan flags.
- Read the build story in [Building secretsweep](/blog/building-secretsweep) and
  the collection overview in [Introducing BenihKode Dev Tools](/blog/introducing-benihkode-dev-tools).
