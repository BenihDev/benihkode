---
title: "Git Commit Message Best Practices (With a Generator That Does It for You)"
description: "Git commit message best practices: the seven rules, conventional commit types, real examples, and how to automate consistent messages with gitcommitgen."
pubDate: 2026-10-10
tags: ["Git", "CLI", "Conventional Commits", "Developer Tools"]
---

Git commit message best practices are the cheapest engineering habit there is:
one line of clear text saves hours of archaeology later. This guide covers the
rules that matter, the conventional commit format, real examples, and how to make
the habit automatic with [gitcommitgen](/tools/gitcommitgen).

## The seven rules of a great commit message

These are the widely cited conventions, and they hold up:

1. **Separate subject from body with a blank line.**
2. **Limit the subject line to 50 characters.**
3. **Capitalize the subject line.**
4. **Do not end the subject line with a period.**
5. **Use the imperative mood** — "Add", not "Added" or "Adds".
6. **Wrap the body at 72 characters.**
7. **Use the body to explain what and why**, not how.

The imperative mood is the one most people miss. A commit message should complete
the sentence: *"If applied, this commit will…"* — "Fix login redirect loop", not
"Fixed login redirect loop".

## Conventional Commits: a machine-readable format

Conventional Commits adds a type and optional scope to the subject:

```
<type>(<optional scope>): <description>
```

Common types:

| Type | Use for |
|------|---------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or correcting tests |
| `chore` | Build, tooling, or maintenance work |

A scoped example:

```
fix(auth): refresh session token before expiry check
```

The payoff is automation. Tools can parse the type to generate changelogs, decide
version bumps, and filter release notes.

## Real examples: bad vs. good

A quick comparison makes the rules concrete.

| Bad | Why | Better |
|-----|-----|--------|
| `fix stuff` | Tells the reader nothing | `fix(cart): recalculate totals after coupon removal` |
| `WIP` | Not a commit message | `feat(search): add fuzzy match for partial queries` |
| `Added tests.` | Past tense, trailing period | `test(auth): cover token refresh edge cases` |
| `update` | Unscoped, vague | `chore(deps): bump astro to 6.1.0` |

Notice the good versions answer two questions: what area changed, and what
happened. A reader in six months can filter `git log --grep "fix(cart)"` and find
exactly this change.

## When to use a body

The subject is for scanning; the body is for understanding. Add a body when the
change is non-obvious:

```
fix(auth): refresh session token before expiry check

The previous check compared the token's expiry against the request
start time, so long requests could refresh a token that had already
expired mid-flight. Compare against the current time instead.

Refs: #412
```

The body explains *why*, links the issue, and leaves the how to the diff. That is
the entire job.

## Automating best practices with gitcommitgen

Discipline alone rarely survives a busy afternoon. [gitcommitgen](/tools/gitcommitgen)
generates a conventional commit message from your staged diff so the format is
consistent without willpower:

```bash
npm install -g @fanioz/gitcommitgen

git add src/auth/session.ts
gitcommitgen --commit
# → "fix(auth): refresh session token before expiry check"
```

Because it reads `git diff --staged`, the message describes exactly what you
staged. Use `--dry-run` when you want to review before committing, and `--edit`
to adjust the wording. The tool page documents every flag.

## Enforcing the rules in a team

Generation handles writing; enforcement handles drift. Pair the generator with a
message linter in a `commit-msg` hook so a malformed message cannot be committed:

```bash
npx --no -- commitlint --edit "$1"
```

Generation plus enforcement means the format is right by default and impossible
to break silently. For the sibling workflow, [gitprgen](/tools/gitprgen) drafts
the pull request description from the same diff, and
[gitprune](/tools/gitprune) cleans up branches once the work is merged.

## Commit hygiene beyond the message

The message is only half of a readable history. Two more habits:

- **Commit one logical change at a time.** If the subject needs the word "and",
  split it.
- **Stage deliberately.** Use `git add -p` or explicit paths, then let
  [gitcommitgen](/tools/gitcommitgen) describe only that slice.

Together with good messages, these habits produce a history that reads like a
well-kept changelog instead of a diary.

## Common pitfalls that break the habit

Even teams that agree with the rules drift in predictable ways. Watch for these:

- **The mega-commit.** One commit touching the API, the UI, and the docs. It
  cannot have a clean subject because it is three changes. Split it.
- **The review commit.** Messages like "address PR feedback" pile up and hide
  what actually changed. Squash them into the original logical commit, or
  describe the substance of the feedback addressed.
- **The context leak.** The message assumes the reader is holding the same PR and
  issue number in their head. Link the issue and explain the change in the body.
- **The auto-generated dump.** A generated message that is accurate but
  mechanical still helps; a generated message that is vague does not. Review it.

None of these are exotic. They are the everyday ways a clean history degrades,
and naming them makes the checklist below easier to apply mechanically.

## The checklist

Before you commit, confirm:

- [ ] Subject is imperative, under 50 characters, no trailing period.
- [ ] A conventional type and, when useful, a scope are present.
- [ ] Non-obvious changes have a body explaining why.
- [ ] Only one logical change is staged.
- [ ] No secrets are staged — run [secretsweep](/tools/secretsweep) first.

Automate the first four with [gitcommitgen](/tools/gitcommitgen), guard the last
with [secretsweep](/tools/secretsweep), and browse the rest of the
[developer tools collection](/tools/) for the workflows around them.
