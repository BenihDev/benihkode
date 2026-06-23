---
title: "Building PocketBudget: From Idea to Play Store in One Sprint"
description: "The full story of building a local-first Android budget tracker — ideation, PRD, engineering sprint, Firebase removal, and Play Store submission. What worked, what didn't, and what we learned."
pubDate: 2026-05-10
tags: ["React Native", "Android", "Expo", "SQLite", "AdMob", "Indie Hacking", "Journal"]
---

PocketBudget started as a simple question: why do all budgeting apps want your data?

Most personal finance apps sync to the cloud, require an account, and treat your financial behavior as a product. For users who just want a ledger — income in, expenses out, balance visible — that's overkill and a privacy risk. We decided to build the alternative: a local-first budget tracker that stores everything in SQLite on your device and never touches a server.

This is the story of how we built it, what broke, what we cut, and what we shipped.

## The Idea

The PRD came first. Before writing a single line of code, we documented the problem, the target user, the MVP feature set, and the monetization model. You can read the full spec in the [PocketBudget product idea](/ideas/pocketbudget).

The core insight: a budgeting app doesn't need a server. Transactions are personal. They don't need to sync across devices. They don't need to be backed up to our infrastructure. SQLite on the device is sufficient — and it's actually better for privacy.

Monetization was straightforward: ad-supported free tier via Google AdMob, with one-time IAP purchases to remove ads and unlock data export. No subscription. No server costs. Revenue from day one.

## The Stack

We chose **React Native + Expo** for the framework. The reasoning:

- Cross-platform foundation for a future iOS port
- Expo's managed workflow speeds up iteration significantly
- `expo-sqlite` gives us a solid SQLite abstraction
- Large ecosystem, well-documented

For ads: **Google AdMob**. For IAP: **RevenueCat**. Both are standard choices for Android monetization and have solid Expo/React Native support.

## The Firebase Detour

Early in the build, we integrated Firebase for authentication. The thinking was: users might want to restore their data if they switch phones.

We removed it before launch.

The problem was philosophical. The whole point of PocketBudget is that your data stays on your device. Adding Firebase authentication — even just for identity — contradicts that. It adds a dependency on Google's infrastructure, increases bundle size, and creates a privacy disclosure obligation that undermines the app's core value proposition.

Removing Firebase simplified everything: no auth flow, no account management, no session handling. The app opens and you're in. That's the right experience for this product.

## The Engineering Sprint

The build happened fast. Key milestones:

**Week 1: Core transaction flow**
- SQLite schema: transactions, categories, settings
- Transaction entry screen (amount, category, note, date)
- Transaction history with basic filtering
- Dashboard with balance calculation

**Week 2: Monetization integration**
- AdMob banner and interstitial ads
- RevenueCat setup with two products: Remove Ads, Export Data
- IAP purchase flow and entitlement checking
- Ad suppression for premium users

**Week 3: Polish and Play Store prep**
- UI refinement and performance optimization
- Privacy policy written and hosted
- Play Store listing: screenshots, description, categorization
- APK signing and upload to Play Console

The sprint ran ahead of schedule. The local-first architecture meant no backend to build, no API to design, no server to deploy. SQLite is fast and reliable. The complexity budget went entirely into the product experience.

## What Worked

**Local-first is genuinely simpler.** No auth, no sync, no conflict resolution, no server costs. The architecture is a single SQLite file. Every feature is a query. Debugging is straightforward.

**Expo managed workflow.** We didn't touch native code until the very end (signing the APK). Expo handled the build pipeline, the native module linking, and the development experience. For a small team moving fast, this is the right call.

**RevenueCat for IAP.** The alternative is implementing Google Play Billing directly, which is painful. RevenueCat abstracts the receipt validation, entitlement management, and restore purchases flow. Worth the dependency.

## What Didn't Work

**Firebase integration (removed).** As described above — it was the wrong architectural choice for this product. The lesson: validate your core value proposition before adding infrastructure. We added auth before we'd confirmed users needed it.

**Scope creep on categories.** We spent too long on the category management UI — custom categories, reordering, color coding. For MVP, preset categories with a simple "add custom" option would have been sufficient. We shipped more than we needed to.

**Play Store review timeline.** The first submission took longer than expected to review. Build in buffer time for Play Store review cycles, especially for a new developer account.

## The Privacy Policy

Play Store requires a privacy policy for apps that use AdMob. We wrote a specific policy for PocketBudget covering:

- Local SQLite storage (no cloud sync)
- AdMob data collection (device identifiers, IP, usage data)
- In-app purchases via Google Play / RevenueCat
- User rights (delete data by uninstalling)
- No personal financial data transmitted to any server

The policy is hosted at [/projects/pocketbudget/privacy-policy](/projects/pocketbudget/privacy-policy) and linked from the Play Store listing.

## The Numbers (Early)

PocketBudget launched on Android. Early metrics:

- **Development time:** ~3 weeks from PRD to Play Store submission
- **Budget spent:** $25 (Google Play developer account, one-time fee)
- **Backend infrastructure cost:** $0 (local-only, no server)
- **Monetization:** AdMob + IAP (results pending first 30 days)

## What's Next

The Android version is live. The immediate roadmap:

1. **Monitor Play Store metrics** — installs, ratings, crash reports
2. **AdMob optimization** — test ad placements and formats for eCPM
3. **User feedback** — iterate on the most-requested features
4. **iOS consideration** — evaluate after Android validation

The longer-term question is whether to add cloud backup as an opt-in feature. The privacy-first positioning is a differentiator, but some users genuinely want cross-device sync. If we add it, it will be opt-in, end-to-end encrypted, and clearly disclosed.

## Lessons

**Ship the simple version.** The local-first constraint that seemed like a limitation turned out to be the product's identity. Constraints clarify.

**Remove what contradicts your value proposition.** Firebase was technically working. We removed it anyway because it was wrong for the product. That decision made the app better.

**A $25 investment can ship a real product.** The entire launch cost was the Google Play developer fee. No hosting, no backend, no infrastructure. The economics of local-first software are genuinely different.

---

*PocketBudget is available on [Google Play](https://play.google.com/store/apps/details?id=com.benihkode.pocketbudget). The full product spec lives in the [ideas section](/ideas/pocketbudget). Built by AlfaCorp.*
