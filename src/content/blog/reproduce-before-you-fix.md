---
title: "Reproduce Before You Fix"
description: "How I learned the hard way that reproducing a bug is half the solution. A debugging story about restraint, process, and the discipline of sitting still before acting."
pubDate: 2026-06-17
tags: ["Journal", "Learning", "Technical", "Debugging"]
---

Most debugging advice is tactical. Check the logs, break out the debugger, inspect the network tab, bisect the commit history. All correct. But the advice I most need to give myself — the advice I hate hearing most — is the first one: **reproduce the bug before you try to fix it.**

I learned this the hard way on a bug that looked simple from the outside but wasn't.

## The Bug That Looked Simple

A user reported that their saved settings were disappearing. Not intermittently — every single time. The app would load defaults, behave correctly for the session, and then forget everything the next time they came back.

I read the report, glanced at the related code, and immediately saw what I thought was the culprit: an async initialization function that might be writing before reading. I wrote what I was sure was the fix, pushed it to staging, confirmed the behavior looked good, and shipped it.

Two hours later, the same user replied: still happening.

## Sitting Still

That's when I should have backed up and reproduced the bug first. Instead, I started my second guess. And my third. The fixes got smaller, more speculative, and more confident. Each one passed my quick tests. Each one failed for the user.

By the time I sat down to actually set up a cloned environment and walk through the exact sequence the user described, I had wasted a day and introduced two other regressions.

Here's what worked.

### Step 1: Reproduce on my own machine

I didn't trust my tests. I reset my local database to a clean state, walked through the user's exact steps, and watched the bug happen. Concretely:

- Create a new account
- Set a preference
- Log out
- Log back in
- Preference is gone

Reproduced. In 20 minutes. Against the original code, before any of my "fixes."

### Step 2: Instrument the failing path

Instead of guessing what changed between the write and the read, I added temporary logging at every point where settings were touched. Not fancy logging — just `console.error` statements so I could see the *when* and the *what*.

What I saw surprised me.

### Step 3: The real cause

The settings were persisting correctly. The database had them. The API was returning them. But the client-side initialization was running multiple times, and a later initialization was silently overwriting the merged state with defaults.

The bug wasn't a write failure. It was a race between two initialization calls that happened to run close together. The fixing gesture — a simple mutex — was 15 lines. But I never found it because I kept patching the symptom I imagined instead of the behavior I hadn't yet traced.

## Three Lessons

The fix itself isn't the lesson worth keeping. What I wrote down afterward was:

**1. A bug report is a contract with yourself.**

When I read a bug report, the first job is to validate the world the user described exists. If I can't make it happen, I need to tell the user that instead of assuming I know what they mean. If I *can* make it happen, I've already won half the argument with the code.

**2. Instrument before you act.**

Logging felt obvious once it showed me the race condition. Before that, I was reasoning about a black box. A few print statements turned a black box into a timeline. Nine times out of ten, the timeline tells you more than any intuition about where the problem lives.

**3. Fix the smallest thing that can be wrong.**

My first fix was a refactor. My second fix was a refactor of the refactor. Simplistically: I kept changing code that *could produce* the race, rather than code that *was producing* it. The mutex isn't glamorous. It's a few lines that say "only one init at a time." It was also the right move the whole time, if I'd followed the execution instead of my theory.

## A Habit Now

I treat bug work in two phases now, almost ritualistically:

1. **Reproduce and document.** Walk through the exact user steps until it breaks. Screenshot it. Time it. Note the variables.
2. **Diagnose from evidence.** Then, and only then, introduce fixes one at a time, each with a hypothesis and a confirmation test.

The speed isn't lost; it's invested. A 20-minute reproduction preceded by a disciplined hour of diagnosis beats a day of well-intentioned guesses. Every time.

## What This Taught Me About Building

The same discipline shows up in feature work, too. Before I design a new screen, I try to use the app without it. Before I reach for a library, I try to build what I need by hand once. The urge to skip setup and jump to action is strong — and it's usually the reason similar bugs appear later.

Building the right thing starts by confirming you understand what's broken.

---

*That was a slower bug than it needed to be. But I think about it more often than the fast fixes, because it's the one that corrected how I start.*
