---
title: "Building secretsweep: Zero-Config Secret Scanning for Your Pre-Commit Hook"
description: "Build story of secretsweep, a zero-config secret scanning CLI that catches staged API keys and tokens with pattern matching and entropy detection."
pubDate: 2026-10-08
tags: ["Security", "CLI", "TypeScript", "Git", "Build Story"]
---

Every developer has a story about the secret that almost shipped. Mine ends well — the key got rotated, nothing was exploited — but the details are irrelevant, because the punchline is always the same: *a regex could have caught it before it ever left my laptop.*

[secretsweep](/tools/secretsweep) is that regex, weaponized: a zero-config secret scanning CLI that checks your staged git files — the exact set that's about to be committed — and fails loudly if it finds API keys, tokens, database URIs, or private keys. It ships as an [npm package](/tools/), runs in under two seconds, and needs no setup file. This is the build story.

## Why zero-config secret scanning starts with staged files

Existing scanners — gitleaks, truffleHog — are excellent, and enterprise-grade. They're also built to audit entire repositories and organizational histories, which is a different job from the one I wanted done: **stop the leak at 11:58pm, before `git push`**.

That framing made two decisions automatic:

- **Scan the git index, not the working tree.** Staged files are the exact set about to be committed. Scanning everything produces a wall of pre-existing noise that trains you to ignore the output. Scanning the delta keeps every finding actionable: *this* key, in *this* file, right now.
- **Zero config as a hard requirement.** A security tool that demands a `.yaml` file before its first run is a security tool that doesn't get installed. secretsweep works with `npx` and nothing else. Ignore patterns exist (`.secretsweepignore`) for the false-positive case, but you never touch them until you need to.

The whole thing drops into a pre-commit hook in one line — `npx @fanioz/secretsweep staged` — because the best security tooling is the kind you forget is running.

## The detection stack: patterns plus entropy

Two layers catch what one layer misses.

**Layer one: known formats.** AWS access keys (`AKIA…`), GitHub tokens (`ghp_`, `gho_`), Stripe keys (`sk_live_`), Slack bot tokens, connection strings for MongoDB, PostgreSQL, MySQL, and Redis, private key PEM blocks, bearer tokens. These are cheap, precise, and generate almost no false positives when anchored properly.

**Layer two: entropy.** The danger case is the credential with no prefix — a random-looking 32-character string assigned to `API_KEY = "..."`. secretsweep computes Shannon entropy on string literals and flags high-entropy assignments in source files. Entropy scanning is inherently noisier, so it's tuned conservatively: better to let a weird but harmless string through than to bury real findings under fifty false alarms.

The full detection matrix — categories, patterns, and the ignore-file syntax — lives on the [tool's page](/tools/secretsweep), and it keeps growing as new token formats show up in the wild.

## The war on false positives

The first week of dogfooding produced the pattern every scanner author learns: **a scanner that cries wolf gets uninstalled**. Test fixtures with fake AWS keys. Example code in `examples/` that's *supposed* to show a hardcoded token. Documentation with obvious placeholders.

The response was three-fold:

1. **Git-aware scoping.** Defaulting to staged files eliminated the largest noise source — you only ever hear about what you're actually committing.
2. **A path-based ignore file.** `.secretsweepignore` supports globs, so `test/fixtures/` and `*.test.js` vanish with two lines.
3. **Findings that explain themselves.** Each match prints the file, line, matched category, and a snippet — enough context to triage in seconds instead of forcing you to open the file and play detective.

The goal was never perfect recall on the first run. It was a scanner precise enough that when it *does* scream, you look — the same principle I applied when I [hardened search input on this site](/blog/devlog-2026-10-05) after an XSS finding. Trust is the product; the scanning is just the mechanism.

## The 2-second budget

A pre-commit hook competes with every commit you make, so latency is a feature. The performance work was unglamorous: read only staged paths from the index, stream files instead of buffering, and short-circuit pattern matching with cheap literal checks before running entropy math. Typical repos scan in under two seconds, which means the hook never becomes the reason you `--no-verify`.

## What shipped

The package is on npm as `@fanioz/secretsweep`:

```bash
npx @fanioz/secretsweep            # scan staged files (pre-commit friendly)
secretsweep scan ./src             # scan a directory
secretsweep scan ./config/prod.json
```

Source is on [GitHub](https://github.com/BenihDev/secretsweep) under MIT, with the tool documented in the [portfolio](/projects/). It has already caught two high-entropy strings in my own staged files that turned out to be session tokens I'd forgotten in a debug script. Both times, the scanner was right and I was the bug.

## What's next

Three seeds in the tray: a `--history` mode for scanning recent commits before an open-source release, CI-friendly exit codes with a JSON output mode, and a wider entropy heuristic that understands base64-encoded blobs. If your pre-commit hook doesn't have a [secret scanner](/tools/secretsweep) on it yet, this one costs you one line and two seconds — cheap insurance against the story that doesn't end well.
