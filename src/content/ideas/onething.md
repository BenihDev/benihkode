---
title: "OneThing"
description: "An honest focus timer for iPhone: set one thing, choose a target, and do it — local-first, no account, with the session living on your Lock Screen."
status: in-progress
meta: "iOS build in release polish"
order: 5
---

## 1. Title & One-Liner

**OneThing — One day, one thing, done.**

A local-first focus timer for iPhone built around a single rule: you pick one thing for today, you give it a target, and the app gets out of the way until it's done.

## 2. Where It Came From

OneThing began as a pivot of an earlier idea in this garden, [FocusFlow Timer](/ideas/focusflow-timer) — a menu-bar Pomodoro for developers that synced sessions to GitHub. Building towards it surfaced a different question: the integrations were the product I was designing *around*, not the product I actually needed. What stuck from FocusFlow was the belief that a timer should respect deep work; what fell away was everything else — the accounts, the sync, the metrics dashboard.

The pivot kept one rule and dropped the rest: no server, no sign-in, no graph to feed. The whole product fits on the device it runs on.

## 3. The Problem

Timer apps compete on features: blockchains of streaks, social accountability, cross-device sync, subscription dashboards. For someone who just needs to protect ninety minutes on one task, all of it is friction:

1. **Setup tax** — accounts, onboarding wizards, permission mazes before the first session.
2. **Meta-work** — logging, tagging and categorizing the work instead of doing it.
3. **Subscription fatigue** — a monthly fee for a countdown.

The gap: a timer that is honest about how little it needs to know. One task. One target. A start button.

## 4. Target Audience

**Primary: the single-tasker.** Anyone who ends a day having touched twelve things and finished none — a student, a developer, a parent with one free hour — who wants an app that holds them to one commitment at a time.

**Secondary: the privacy-minded.** People who read permission dialogs and decline cloud sync on principle, and who would rather pay once than rent a stopwatch.

## 5. Core Product (MVP)

- **One OneThing per day.** The Day is the unit. A Day holds a single OneThing — set it, work it, or miss it; the app never pretends a day was four productive hours if it wasn't.
- **Targets that fit real days.** Direct presets (15m, 30m, 1h, 2h) plus a custom stepper from 5 minutes to 4 hours. Editing a running target never discards Focus.
- **A timer that lives where you look.** The session runs as a Live Activity on the Lock Screen and in Dynamic Island — start, pause, resume and finish without unlocking the app.
- **Missed days carry, they don't punish.** A missed OneThing carries to tomorrow with its history intact; the streak counts honest runs, not guilt.
- **A Day that ends on your schedule.** The reset hour is configurable (default 4 AM) — night owls don't lose their Day at midnight.
- **Gentle reminders.** At most three local notifications a day: one if nothing is set, one if nothing has started, one when the target is reached. A master switch in Settings silences all of them.

<div class="callout">
  <p><strong>Design stance:</strong> paper, ink and sage. Typography-first screens that read like a printed sheet; the Day's state is always named in words, never color alone.</p>
</div>

## 6. User Flow

1. First launch: a two-panel introduction — what the app is, then your reset hour and reminder hour. Skip is always available.
2. Today is empty: *"What's your one thing?"* Type it, pick a target, **Set**.
3. **Start**. The clock runs; the session appears on the Lock Screen.
4. Life happens: **Pause** freezes Focus, **Resume** continues, a swipe away is asked before it discards.
5. Done: **I did it**. The Day reads Met; the streak grows; the share card is yours if you want it.
6. Midnight (or your reset hour) passes: the Day closes itself, Yesterday lands in History, Today is empty again.

## 7. Technical Architecture

- **SwiftUI on iOS**, one screen per concern; the Day is the state root.
- **SwiftData** for the store — Days, OneThings and timer sessions live in local SQLite. Nothing syncs because there is nothing to sync with.
- **ActivityKit** for the Live Activity: the timer session is the truth, the Lock Screen card is a display of it — losing the card loses nothing.
- **UserNotifications** for the three reminders, scheduled locally, never from a server.
- **StoreKit 2** for the one-time, non-consumable *Remove ads* purchase.
- **AdMob** banner ads on the Settings and History screens only — never on Today — with Google's UMP consent flow where required.

## 8. Monetization

Free with banner ads outside Today; a single one-time purchase removes them for good. No subscription, no account, no server cost to cover — the price of a coffee, once.

## 9. Success Metrics for Launch

- Ship to the App Store with the full accessibility sweep green: Dynamic Type to the largest sizes, VoiceOver-traversable screens, 44 pt targets.
- A first-session rate that needs no tutorial: new installs reach a running timer without documentation.
- Crash-free sessions above the App Store median for productivity apps.
- Zero network calls that are not ads or store — verifiable in a proxy.
