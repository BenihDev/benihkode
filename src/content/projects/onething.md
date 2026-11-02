---
title: OneThing
description: "A local-first focus timer for iPhone. One thing per day, one honest target — no account, no sync, no subscription. The session lives on your Lock Screen."
summary: "One day, one thing, done. A single-task timer for iPhone with a Live Activity, a configurable day boundary, and a one-time purchase instead of a subscription."
emoji: "🎯"
techStack: ["SwiftUI", "SwiftData", "ActivityKit", "StoreKit 2", "AdMob"]
category: "app"
order: 12
distributed: true
appName: "OneThing"
---

OneThing is a focus timer for iPhone built on a single rule: one day holds one OneThing. You set it, you give it a target, and the app gets out of the way until it's done. Everything lives on the device — there is no account, no sync, and nothing to sign up for.

## What It Does

- **One OneThing per Day** — set a task and a target; the Day holds exactly one, so the choice stays honest
- **Focus timer** with Start, Pause, Resume and *I did it* — a running target can be edited without losing Focus
- **Live Activity** — the session shows on the Lock Screen and in Dynamic Island; Pause from the Lock Screen works without opening the app
- **Days that end on your schedule** — the reset hour is configurable (default 4 AM), so a late session still belongs to today
- **Carried OneThings** — a missed day carries forward with its history; the streak counts honest runs
- **Gentle reminders** — at most three local notifications a day, with a master switch in Settings
- **History and streaks** — Met, Missed, Carried and Replaced days in one list, with a shareable streak card
- **One-time purchase** — *Remove ads* is a single non-consumable purchase, not a subscription

## Tech Stack

Built with **SwiftUI** and **SwiftData** — the Days, OneThings and timer sessions live in local SQLite, and nothing leaves the device. **ActivityKit** drives the Lock Screen and Dynamic Island presence; **UserNotifications** schedules the three daily reminders locally. **StoreKit 2** handles the one-time *Remove ads* purchase, and **AdMob** serves the free tier's banner ads on the Settings and History screens only — never on Today.

## Design Notes

The screens read like a printed sheet: paper, ink and sage, with typography doing the work color never has to. Every state is named in words, every target is reachable at one tap, and the whole app scales from the largest Dynamic Type size down to the smallest iPhone.
