---
title: "Building Tutupen: A Janitor for My 90 Open Tabs"
description: "I built a Chrome/Edge extension that silently closes tabs I forgot about - and verified it live by letting it close 46 of my own tabs. The full build story, including the naming saga."
pubDate: 2026-10-07
tags: ["Chrome Extension", "MV3", "Side Projects", "Indie Hacking", "Journal"]
---

![Tutupen — auto close idle tabs](/tutupen-banner.png)

My browser had around ninety open tabs. Pinned ones I actually used; the rest were a sediment of "I'll read this later" - a GitHub doc from last week, a hotel page, a blog post, another AI-router dashboard. Chrome's task manager showed Gmail's discarded-but-resident tabs eating memory I never got back. The pile grew monotonically. I never revisited old tabs; I only ever opened new ones.

So I built **Tutupen** - a Manifest V3 extension for Chrome and Edge that silently closes tabs you haven't touched for longer than your threshold, and lets you restore everything it closed. This is the build story: the decisions, the live test that made me trust it, and the naming saga that took longer than the code.

## The product shape came before the code

"Close my idle tabs" hides three different products. A janitor that closes by rule. A sweeper that parks tabs in a read-later list. A wellbeing leash that kills distracting sites. They differ in the core risk (data loss vs annoyance) and in what the user is really buying.

I wanted the janitor. And a janitor lives or dies on one contract: **silent, but always restorable**. Closing quietly is the whole point - a tool that nags you before every close is just a confirmation dialog with extra steps. But silent deletion is terrifying. So restorability is not a feature; it's the safety net that makes silence acceptable.

That one decision shaped everything downstream:

- **Idle metric**: the tab's native `lastAccessed` timestamp - "I haven't looked at this in X time" - not interaction tracking via content scripts. Simpler, permission-cheaper, and it matches the mental model.
- **Threshold**: one global slider, default 24 hours. Per-domain thresholds are a post-MVP idea, deliberately left in the fog.
- **Sweep cadence**: every 5 minutes via the Alarms API. For "idle > 24 hours", a 5-minute latency is invisible.
- **Safety invariants**: never close the active tab, audible tabs (something is playing), tabs whose domain is on the exception list, and pinned tabs (protected by default - the toggle gets its own section below).
- **Storage split**: settings in `chrome.storage.sync` (they follow you across your own machines), the closed-tabs log in `chrome.storage.local` (device-only, capped at 100 entries).

## The build itself was small

An MV3 service worker that wakes on the alarm, queries all tabs, and closes the ones past the threshold - recording each one before `tabs.remove()` fires. A popup with the Restore list and a one-click "exempt this domain" button. An options page with the slider and the exception list. That's the whole product. If the decisions are right, the code is a weekend.

I skipped writing the code first, though, and grilled myself through the product questions until nothing was left to decide. That sounds like ceremony for a 700-line extension, but it's exactly why the build stayed a weekend: every argument about "should it warn before closing" was settled before it could fossilize into half-built UI.

## The test that earned my trust

I didn't want to verify with mocks alone, so I drove my real Edge - the one with ninety tabs - through its accessibility tree, and walked the checklist: extension loaded unpacked with no errors, options page reactive, popup correct, sweep logic counting eligible tabs read-only.

Then something better happened. **The 5-minute alarm fired mid-verification, on its own, and closed 46 of my real tabs.** All of them genuinely idle past 24 hours - old dashboards, a hotel booking, duplicate routers. The pinned tabs survived untouched: Gmail, Discord, everything I'd actually pinned. The badge showed 46. The log had 46 entries with titles, URLs, and timestamps. And when I clicked Restore on one entry, the tab came back and dropped off the list.

That single natural event verified more than any test I could have written: the alarm schedule, the sweep, the invariants, the log, the badge, and the restore path - in production, on the messiest profile I own.

It also caught a real bug. To test safely I had cleared the alarm manually - and realized that nothing in the code would ever recreate it. On a browser restart, my janitor would have gone permanently mute. The fix was two lines of design, not code: recreate the alarm in `onStartup`, and make install seeding idempotent so reloads can never wipe the restore log.

## The naming saga took longer than the code

"Auto Tab Closer" was a working title, not a name. The candidates fell one by one:

- **Tab Janitor** - already an extension on the Chrome Web Store.
- **Tab Sweeper** - worse: four of them.
- **Rontok** - a word I liked from Indonesian... until the search revealed it's a known ransomware family. Hard pass.
- **Tab Custodian** - clean, but it scanned like enterprise software.

I landed on **Tutupen** - Javanese for "close it", which is literally the product's whole job description. The store listing carries the searchable part ("Auto Close Idle Tabs"); the name carries the personality. No conflicts on either store.

One naming-adjacent design fight is worth logging. I proposed that pinned-tab protection be immutable - pins are an explicit contract with the browser, and an extension that closes them because of a setting is a liability. The user (me, but in product-owner mode) overruled: ship it as a toggle, default ON, with a warning label. The compromise is honest: "pin means keep this, so leave this on unless you really want the janitor to touch pins." Defaults protect people; options respect them.

## Prepping for the stores

The submission kit was its own small project: a `package.sh` that zips only runtime files, a privacy policy (the extension makes zero network requests, so the policy is short and true), real permission justifications, and store screenshots taken from a clean install - deliberately empty-state, so my browsing history doesn't leak into a public listing. Dropping the `notifications` permission (goodbye welcome message, hello auto-opened settings page) shrunk the review surface for free.

The settings-sync choice surfaced one more privacy wrinkle worth knowing: `chrome.storage.sync` syncs your exception list through *the browser's own* sync - no Tutupen server involved. The privacy policy says exactly that, because "sync" appearing in an extension's storage API makes people assume a backend.

## What's next

The Edge Add-ons submission goes first (free review), Chrome Web Store after. The fog list for later: per-domain thresholds, URL-pattern exceptions, a pre-close warning toggle, a manual "sweep now" button.

The bigger takeaway is about process, not tabs. Small tools deserve the same decision discipline as big ones - grilling the product questions first is why the code stayed boring. And the most valuable test suite I ran was letting the product operate on real data, supervised: it found a bug no mock would have shown, and earned the kind of trust a green checkmark never could.

If your tab strip looks like a landfill, [Tutupen is open source](https://github.com/fanioz/tutupen) - grab the source, load it unpacked, and let the janitor sweep.
