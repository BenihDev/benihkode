---
title: "Tutupen"
description: "A silent janitor for your browser — auto-closes tabs you forgot about. Pinned tabs protected by default; everything it closes is restorable."
status: completed
meta: "Shipping to Edge Add-ons & Chrome Web Store"
order: 1
---

## 1. Title & One-Liner

**Tutupen — Close the tabs you forgot about.**

A Manifest V3 extension for Chrome and Edge that silently closes tabs you haven't touched for longer than your threshold, records every close, and brings anything back with one click. Javanese for "close it".

## 2. Platform Target

- **Chromium browsers** (primary) — Chrome Web Store and Microsoft Edge Add-ons, from one MV3 package
- **Firefox** — future consideration; MV3 event-page semantics differ enough to be its own effort

<div class="callout">
  <p><strong>Why Chromium first:</strong> one codebase ships to both stores, Edge review is free and fast, and the author's own daily browser is Edge — the dogfood test drives itself.</p>
</div>

## 3. The Problem

Tab hoarding is a one-way ratchet:

1. You open tabs "for later" — later never comes
2. The pile only grows; you never revisit old tabs, you only add new ones
3. Discarded-but-resident tabs hold memory the browser never frees

Existing fixes miss the point. Session savers add workflow (you have to *do* something). Aggressive cleaners ask for confirmation on every close (nagware) or close things you loved (shredder). The gap: a set-and-forget janitor that is silent on the close and generous on the recovery.

## 4. Target Audience

**Primary Persona: The Tab Accumulator**
- Opens 5–20 tabs a day, revisits almost none of them
- Feels the RAM hit but never feels enough pain to clean manually
- Will not adopt any tool that adds a step to their browsing

**Secondary Persona: The Focus-Protector**
- Wants fewer open loops, not just less memory
- Values tools that make defaults safe and get out of the way

## 5. Core User Loop

1. **Install** — threshold defaults to 24 hours; extension is active immediately
2. **Forget about it** — the janitor sweeps every 5 minutes, silently
3. **Notice the badge** — session close count, passive proof it's working
4. **Restore** (rare) — one click from the popup's Recently Auto-Closed list, or native Ctrl+Shift+T

## 6. MVP Feature Set

- Global idle threshold: 1 hour to 7 days (default 24h)
- Idle metric: native `tabs.lastAccessed` — no content scripts
- Sweep every 5 minutes via the Alarms API
- Safety invariants: never close active, audible, or excepted domains
- **Protect Pinned** toggle (default ON) — pins are a user contract; overriding it is an explicit opt-out
- Restore log: last 100 closes with title, URL, favicon, timestamp
- One-click "exempt this domain" from the popup
- Badge with session close count

**Explicitly Out of Scope for MVP:**
- Per-domain thresholds, URL-pattern exceptions
- Pre-close warnings (silence is the contract)
- Manual "sweep now" button
- Firefox support

## 7. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Platform | Chrome MV3 | One package → both stores |
| Background | Service worker + Alarms API | Wakes every 5 min; no persistent process |
| Idle metric | `tabs.lastAccessed` | Native, matches "haven't looked at it" |
| Settings | `chrome.storage.sync` | Follows the user's own browser sync |
| Restore log | `chrome.storage.local` (cap 100) | Device-only, restorable history |

<div class="callout">
  <p><strong>No network code:</strong> the extension makes zero network requests and ships no remote code. That is both a privacy posture and a review-friendly one.</p>
</div>

## 8. Monetization Strategy

**None. Free, open source.** The extension has no server, no costs, and no reason to exist behind a paywall. It is a scratch-your-own-itch tool published under the MIT license.

## 9. Privacy Design

- Tab metadata is read locally and never transmitted
- Settings sync via the browser's own `storage.sync` — no Tutupen server exists
- Closed-tabs log stays in `storage.local` on the device
- Uninstall = complete data removal
- Privacy policy hosted at `/projects/tutupen/privacy-policy`

## 10. Launch Criteria

- [x] Sweep verified on a real profile: 46 genuinely idle tabs closed in production, pinned tabs untouched
- [x] Restore path verified end-to-end (popup → tab reopened → log entry removed)
- [x] Alarm recreated on browser startup (found via supervised live testing)
- [x] Privacy policy live at a public URL
- [x] Store listing copy, screenshots, and permission justifications prepared
- [ ] Edge Add-ons approved
- [ ] Chrome Web Store approved

## 11. Validation Metrics (Post-Launch)

- **Installs** — Target: 100 in first 30 days (organic only)
- **Rating** — Target: >4.5 stars; a janitor that touches one pinned tab gets one star, so the safety invariants are the product
- **Restore rate** — If users restore >30% of closed tabs, the threshold is too aggressive for them and the default should be reconsidered
- **Retention** — Uninstall churn within 7 days signals trust problems, not feature gaps

## 12. Risks

<div class="callout">
  <p><strong>Risk 1: Closing something the user loved</strong><br/>
  Mitigation: layered invariants (pinned/audible/active/exceptions), restorable log of the last 100 closes, and native tab recovery still applies.</p>
</div>

<div class="callout">
  <p><strong>Risk 2: `lastAccessed` semantics differ across browsers</strong><br/>
  Mitigation: treat missing `lastAccessed` as "not idle" (never close), and keep the sweep logic browser-agnostic so Firefox porting is a contained effort.</p>
</div>

<div class="callout">
  <p><strong>Risk 3: Store review friction on the `tabs` permission</strong><br/>
  Mitigation: minimal permission set (no notifications, no host permissions), single-purpose statement, and a truthful privacy policy with per-permission justifications.</p>
</div>
