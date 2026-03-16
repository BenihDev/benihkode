---
title: FocusFlow Timer
description: 'Pomodoro timer for developers with GitHub integration. Automatically commit focus sessions as "work logs" and track productivity patterns.'
status: in-progress
meta: "MVP in development"
order: 2
---

## 1. Overview & Problem Statement
Developers often struggle to maintain deep work states due to context switching and notifications. Existing Pomodoro timers are generic and disconnected from a developer's actual workflow (writing code, making commits, reviewing PRs). 

**Goal:** Build a developer-centric focus timer that integrates directly with GitHub, treating focused work sessions as first-class metrics alongside code commits.

## 2. Target Audience
- Software engineers working remotely or in distraction-heavy environments.
- Indie hackers managing multiple side projects.
- Developers who use GitHub as their primary source of truth for work tracking.

## 3. Core Features (MVP)
- **Menu Bar Utility:** Lives in the macOS/Windows menu bar for quick access. Minimal UI.
- **Configurable Intervals:** Standard 25/5 breaks, but fully customizable.
- **GitHub Integration (The differentiator):** 
  - Authenticate via GitHub OAuth.
  - At the end of a successful focus session, optionally push a "Work Log" commit to a private `.focusflow` repository.
  - Generates a GitHub contributions graph strictly for deep work hours.
- **Blocker Mode:** (Stretch goal) Temporarily block `reddit.com`, `twitter.com`, `news.ycombinator.com` during active focus sessions.

<div class="callout">
  <p><strong>Design Note:</strong> The interface should feel native to the OS. Dark mode by default. Heavy use of keyboard shortcuts (e.g., <code>Cmd+Shift+P</code> to start a session).</p>
</div>

## 4. User Flow
1. User clicks menu bar icon to open the popover.
2. User types a task intent: *"Refactoring the auth middleware"* and hits Enter.
3. Timer starts (25:00 countdown) in the menu bar.
4. When timer finishes, a native OS notification appears.
5. Popover prompts: *"Did you finish? (Yes/Partially)"*
6. Background process creates a markdown log file and pushes to the user's connected GitHub repo.

## 5. Technical Architecture
- **Frontend / Client:** Tauri (Rust backend + Svelte frontend). Chosen for tiny footprint and native API access.
- **Authentication:** Supabase Auth (for handling GitHub OAuth dance smoothly).
- **GitHub Interop:** Octokit REST API wrapper.
- **State Management:** XState (useful for modeling the strict states of a Pomodoro timer: idle ↔ working ↔ breaking ↔ paused).

## 6. Success Metrics for MVP
- Launch and get 50 active daily users using the app for at least 2 sessions a day.
- Achieve a 99% success rate on GitHub commit syncs.
- Keep the application footprint under 50MB of RAM.
