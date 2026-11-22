---
title: "Shipping the Gas Flow Calculator App: From Closed Testers to Google Play"
description: "The Gas Flow Calculator app is now live on Google Play — the launch story: the closed testing grind, data safety, and the ads decision."
pubDate: 2026-11-21
tags: ["flutter", "android", "google play", "build story"]
---

![The Gas Flow Calculator listing on Google Play — BenihKode, the 10+ downloads badge highlighted, and the app icon](/gasflow-banner.png)

In May I wrote about [building the Gas Flow Calculator app](/blog/building-field-ready-engineering-tools-with-flutter-gas-flow-calculator-story) — a Flutter utility for ISO 5167 gas flow calculations, made for field engineers who need precision on a small screen. That post ended at a tidy milestone: a signed App Bundle, version 1.0.1+3, uploaded to Play's internal testing track. Tidy, and incomplete. An app on an internal track is invisible; nobody can search Google Play for it, nobody can install it, and months of work sit behind a dashboard only I can open.

That gap is closed now. The Gas Flow Calculator app is public on Google Play, listed under Tools, installable on any phone running Android 7.0 or newer. The calculator itself works fully offline, and inputs and saved values never leave the device.

The distance between those two states — signed bundle and public listing — was the longest part of the entire build. Not because of code. Because of testers.

## The closed testing gauntlet

For a new personal developer account, Google Play doesn't let you flip from uploaded to published. Before the production track opens, the app has to survive a closed testing period: a real release, distributed to a real roster of opted-in testers, running long enough to show the app behaves. For a consumer app with an existing audience, that's a formality. For a niche engineering calculator — gas flow through pipes, orifice calculations — there is no natural pool of strangers waiting to sign up.

The problem was never marketing. It was arithmetic. The people who would genuinely use this app are working engineers, and every one of them has a job that does not involve testing side projects.

## What the launch actually involved

The mechanics of a closed test are simple: the same signed bundle, an opt-in link, a dashboard of status changes. The launch version testers eventually received was not the one from May, though. While the closed test ran, the app picked up a refreshed design — a rebuilt About screen, animated results, a pipe cross-section diagram that shows what all those inputs describe, and a two-column layout that opens up on wide screens.

One deliberate addition: a small banner ad above the bottom navigation, served through Google AdMob. It sits out of the calculator's way, and the calculator keeps working fully offline whether the banner loads or not. Ad consent is requested based on your region, exactly as the listing states.

Alongside the ads came the least glamorous engineering of the whole project: the data safety declarations and the privacy policy. The calculator collects nothing — inputs and saved values stay on the device — and the store listing says precisely that. The ads layer declares itself separately through Google's consent flow. Getting every claim exact took longer than I expected, and it was the right kind of slow. I've [written before](/blog/devlog-2026-11-01) about how easy it is for an app with ads to carry a privacy claim that quietly stops being true; this time every line was written to stay true with ads enabled.

## Decisions I'd defend

**Ads to keep it free.** The alternatives for a calculator are a paid upfront purchase or a subscription, and both tax exactly the field engineers this app is for. One small banner, declared honestly in the listing, keeps the download free while the math stays untouched.

**Testers who use the tool, not testers who owe a favor.** I could have filled the roster faster with friends and family. The point of a closed test is to watch the app behave in real workflows, so the roster was built from colleagues who actually compute gas flow for a living. Slow recruitment, real signal.

**Offline, unconditionally.** Field sites are where signal goes to die. The calculations run with no connection at all; the banner is the only thing on the screen that even tries.

## The part I budgeted wrong

The code took weeks. The closed testing period took months. The roster crawled upward at a pace I never predicted: it took several months to reach about fifteen testers, and nearly all of them came from a single source — colleagues from work who actually use the app in their jobs. There was no shortcut, no trick, no way to make an engineer with a full-time job test a side project sooner than they chose to.

The uncomfortable lesson: I treated the store release as the last step of an engineering project, when it was really a recruiting project with some engineering inside it. The app was ready in May. The store unlocked in November. Between those dates, very little code needed writing — and all of the wait was spent on the part I had planned the least.

## What shipped: the Gas Flow Calculator app is on Google Play

The listing is live: [Gas Flow Calculator on Google Play](https://play.google.com/store/apps/details?id=id.fanioz.gasflowcalc&hl=en-US). Search for "Gas Flow Calculator" or install straight from that link — free, Android 7.0 and up, fully usable offline.

The [App landing page](/apps/gas-flow-calculator) carries the full feature rundown, with the [support page](/apps/gas-flow-calculator/support) and the [privacy policy](/apps/gas-flow-calculator/privacy) reachable from there — the same pages the store listing links to.

Downloads so far: 10+, the store's smallest badge and, for a tool this niche, the right place to start.

## What's next

Two seeds, deliberately small. First, iteration from feedback — the colleagues who tested the closed build keep using it, and their reports are the highest-signal input this project has. Second, watching how adoption settles before promising anything bigger; the roadmap for a tool like this should be written by its users' real pain, not by a feature list drafted before launch.

If you work with gas flow calculations, install it and tell me what hurts: [Gas Flow Calculator on Google Play](https://play.google.com/store/apps/details?id=id.fanioz.gasflowcalc&hl=en-US). The landing at [/apps/gas-flow-calculator](/apps/gas-flow-calculator) is the permanent home for support and privacy. And the [Portfolio](/projects/) holds the rest of the garden — ideas become projects, projects get stories, and this one finally made it to the store.
