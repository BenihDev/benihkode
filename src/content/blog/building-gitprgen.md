---
title: "Building gitprgen: An AI Pull Request Description Generator CLI"
description: "Build story of gitprgen, an AI pull request description generator CLI: parsing git diffs, prompting LLMs, and writing PR descriptions worth keeping."
pubDate: 2026-10-08
tags: ["CLI", "TypeScript", "AI", "Open Source", "Build Story"]
---

Every pull request I open starts the same way: I finish the work, push the branch, open GitHub — and then freeze in front of an empty description box. The code is done. Explaining it is the tax.

[gitprgen](/tools/gitprgen) is my answer: an AI pull request description generator that reads your git diff, sends it to the LLM of your choice, and hands back a structured description — summary, changes, testing notes — in the exact shape your team's template expects. It's a TypeScript CLI, published as an [npm package](/tools/), and it took one focused weekend to build. This is the build story.

## The problem: the last mile of every PR

I already automated commit messages with [gitcommitgen](/blog/shipped-first-npm-package). But commit messages are one-liners; PR descriptions are documents. They need context ("why does this change exist?"), structure ("what changed?"), and a testing section that reviewers actually read.

Writing those by hand cost me ten to fifteen minutes per PR. Multiply that by the branch-heavy workflow I keep — I had [a whole cleanup tool](/tools/gitprune) precisely because I open so many branches — and the tax adds up fast. When a chore has a mechanical half, I turn it into a tool. That's the whole ethos of this garden: [from script to tool](/blog/from-script-to-tool), every time.

## How the AI pull request description generator works

The design fits in a sentence: run `git diff`, collect context, let a large language model write the first draft. The implementation is a little more honest:

1. **Diff collection.** `gitprgen` diffs the current branch against a base (default `main`, overridable with `--base develop`). It also gathers commit messages and a changed-files summary, because a diff alone loses the narrative of *how* the code got there.
2. **Provider dispatch.** The diff and context go to Anthropic or OpenAI, selected by flags or a config file. Two providers was the right scope — one is a demo, five is a maintenance headache.
3. **Template-shaped output.** The model is prompted to fill a PR template: summary, changes, testing. If you pass `--template ./pr-template.md`, your own structure wins.

The details that took real time weren't the happy path. They were the edges: repos with no commits yet, diffs larger than a model's context window, and providers returning malformed output mid-stream.

## Decisions I'd defend in a code review

**TypeScript on Node, no Bun this time.** [My second CLI moved to Bun](/blog/from-script-to-tool) for startup speed. gitprgen is different: it's network-bound — it waits seconds for an LLM response — so a 40ms faster boot is invisible. Plain Node means one less runtime for contributors to think about.

**Config in `~/.gitprgen.json`, flags override it.** Persistent preferences (provider, model) belong in a file; per-run choices belong on the command line. Supporting both sounds like scope creep until you're the user who types the same model name for the tenth time.

**Structured output over free-form prose.** The prompt demands sections, not an essay. A PR description is skimmable or it's useless — reviewers read headings first, sentences second.

**No git history collection beyond the diff.** The tool reads what it needs and nothing else. I care about this because I [sweep my own repos for leaked secrets before every push](/tools/secretsweep) — tools that read broadly are tools that eventually read something they shouldn't.

## The failure that shaped the prompt

The first working version produced descriptions that *read* well and were subtly wrong. It would summarize intentions from the commit messages — "improve performance" — that the diff didn't actually support. Reviewers would have caught it; worse, they'd have stopped trusting the tool.

The fix was a prompt constraint: **describe what the diff shows, not what the commits claim.** Commit messages became supporting context, ranked below the actual code changes. That single rule turned the output from plausible to trustworthy, and it's the same lesson I learned the hard way once before — [reproduce before you fix](/blog/reproduce-before-you-fix). Verify against reality, not against the story you told yourself.

## What shipped

The package is on npm as `gitprgen`, installable globally or run ad hoc with `npx`:

```bash
npx gitprgen                     # describe current branch vs main
gitprgen --base develop          # different base
gitprgen --template ./pr-template.md
```

The full source is on [GitHub](https://github.com/BenihDev/gitprgen) under MIT, and the tool now has its page in [the garden's portfolio](/projects/). Generating a draft takes about ten seconds; editing a draft I agree with takes one minute.

## What's next

Two seeds are already germinating: a `--dry-run` mode that prints token counts before spending them, and a review mode that critiques an *existing* PR description instead of writing one. If you open pull requests for a living, [try gitprgen](/tools/gitprgen) — and if it saves you the freeze in front of the empty box, that's the harvest I planted it for.
