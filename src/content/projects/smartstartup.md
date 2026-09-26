---
title: SmartStartup
description: "Windows 11 boot optimization utility. Scan startup apps, classify risk offline, and optimize with one click - local, private, no telemetry."
emoji: "⚡"
techStack: ["Avalonia", "C#/.NET 10", "SQLite", "MSIX"]
category: "app"
url: "https://apps.microsoft.com/detail/9P0QNS4L0GG8"
order: 2
hasPrivacyPolicy: true
appName: "SmartStartup"
---

SmartStartup is a Windows 11 startup optimizer built as a native desktop app. It's designed around a single principle: your startup configuration belongs to you - everything runs locally, with no accounts, no telemetry, and no data leaving your device.

## What It Does

- Scans every app that launches at logon (registry Run keys, Startup folder, Task Scheduler)
- Classifies each startup app by risk: Essential, Safe to Disable, or Recommended to Delay
- One-Click Optimize: instantly disables safe-to-disable apps and delays the rest
- Per-app delays (15-300 seconds, or until network/idle) via Task Scheduler
- Self-healing watchdog that re-applies your choices if an app re-adds itself
- Boot time history with before/after comparison and CSV export
- Critical Windows processes are always protected from changes

## Tech Stack

Built with **Avalonia UI on C#/.NET 10** (MVVM), with **SQLite** for local boot history and app rulesets, **Task Scheduler COM interop** for delay and watchdog tasks, and **MSIX** packaging for the Microsoft Store.

## Why Local-First

Startup configuration is system configuration. Most "optimizers" ship cloud accounts, telemetry, or ads. SmartStartup reads and writes only your local startup entries, keeps its boot analytics in a local SQLite database, and never opens a network connection. Uninstalling the app removes everything.
