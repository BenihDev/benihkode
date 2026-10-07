---
title: Tutupen
description: "A silent janitor for your browser. Tutupen auto-closes tabs you forgot about on a threshold you set — audible and excepted tabs are always safe, pinned tabs are protected by default, and everything it closes is restorable."
emoji: "⏰"
icon: "/icons/tutupen.png"
techStack: ["Chrome Extension", "MV3", "JavaScript", "Alarms API", "Chrome Storage"]
category: "app"
githubUrl: "https://github.com/fanioz/tutupen"
order: 0
hasPrivacyPolicy: true
appName: "Tutupen"
---

Tutupen is a silent janitor for your browser. Every five minutes it checks your tabs and closes the ones you haven't touched for longer than your threshold - so memory comes back and your tab strip stays sane. It ships as a Manifest V3 extension for Chrome and Edge.

## What It Does

- Sweeps idle tabs every 5 minutes via the Alarms API (idle = not accessed for longer than your threshold, default 24 hours, adjustable from 1 hour to 7 days)
- Never touches tabs that are playing audio, the tab you're looking at, or domains on your exception list
- Pinned tabs are protected by default, with an explicit toggle to opt out
- Every auto-closed tab lands in a Restore list (last 100) - one click reopens it, and native `Ctrl+Shift+T` works too
- A badge counts how many tabs the janitor cleaned this session
- Exempt the site you're on in one click from the popup

## Tech Stack

Built as a **Manifest V3 extension** with a **service worker** woken by the **Alarms API** - no persistent background page, no network code at all. Settings ride `chrome.storage.sync`, the closed-tabs log lives in `chrome.storage.local` (capped at 100 entries), and the idle metric is the native `tabs.lastAccessed` timestamp. No content scripts, no host permissions, no remote code.

## Why Silent + Restorable

Deletion tools earn trust by making loss reversible. Tutupen closes quietly - no nagging popups - but every close is recorded with title, URL, and timestamp, and everything can be brought back with one click. The janitor cleans; you stay in control.
