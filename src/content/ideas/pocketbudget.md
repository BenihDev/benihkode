---
title: "PocketBudget"
description: "A privacy-first personal budget tracker for Android. Track income and expenses locally with no cloud sync, no accounts, and no data leaving your device."
status: completed
meta: "Shipped to Google Play"
order: 1
---

## 1. Title & One-Liner

**PocketBudget — Your money, your device, your rules.**

A local-first personal finance app for Android that lets you track income and expenses without an account, without cloud sync, and without giving your financial data to anyone.

## 2. Platform Target

- **Android** (primary) — Google Play Store
- **iOS** — future consideration after Android validation

<div class="callout">
  <p><strong>Why Android first:</strong> Google Play has a $25 one-time developer fee vs Apple's $99/year. For a bootstrapped zero-budget launch, Android is the only viable first platform.</p>
</div>

## 3. The Problem

Most budgeting apps fall into two traps:

1. **Over-engineered** — They sync to the cloud, require accounts, and treat your financial data as a product to monetize.
2. **Under-featured** — Simple note-taking apps that don't understand money (categories, balances, summaries).

The gap: a clean, fast, private app that just tracks your money. No account. No sync. No server. Just a ledger on your phone.

## 4. Target Audience

**Primary Persona: The Privacy-Conscious Budgeter**
- Wants to track spending but doesn't trust cloud-based finance apps
- Doesn't need bank sync or investment tracking — just a simple ledger
- Comfortable with Android, likely uses a mid-range device

**Secondary Persona: The Minimalist**
- Tried Mint, YNAB, or similar — found them overwhelming
- Wants something that opens fast and gets out of the way
- Values simplicity over features

## 5. Core User Loop

1. **Open app** — See current balance and recent transactions
2. **Add transaction** — Tap +, enter amount, pick category, add note
3. **Review** — Dashboard shows spending breakdown by category
4. **Export** (premium) — Download CSV for spreadsheet users

## 6. MVP Feature Set

**Free Tier:**
- Transaction entry (income / expense)
- Category management (preset + custom)
- Dashboard with balance and spending breakdown
- Transaction history with search/filter
- Ad-supported (Google AdMob)

**Premium (IAP):**
- Remove Ads — one-time purchase, disables AdMob
- Export Data — CSV export of transaction history

**Explicitly Out of Scope for MVP:**
- Bank sync / Open Banking
- Cloud backup / sync
- iOS version
- Recurring transactions
- Budget goals / alerts

## 7. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React Native + Expo | Cross-platform foundation, fast iteration |
| Local DB | expo-sqlite (SQLite) | Proven, offline-first, no server needed |
| Ads | Google AdMob | Standard Android monetization |
| IAP | RevenueCat | Handles entitlements, receipts, restore |
| Auth | None | Removed Firebase — no accounts needed |

<div class="callout">
  <p><strong>Firebase removal:</strong> Firebase was integrated early for authentication. Removed before launch — the app doesn't need accounts, and removing it simplified the architecture, reduced bundle size, and improved privacy posture.</p>
</div>

## 8. Monetization Strategy

**Model: Ad-supported freemium with one-time IAP**

- Free tier: fully functional with banner/interstitial ads
- Remove Ads: one-time purchase (~$2–3)
- Export Data: one-time purchase (~$1–2)

Revenue paths:
1. AdMob impressions from free users
2. IAP conversions from users who want ad-free experience
3. IAP conversions from power users who want data export

**Why not subscription?** The app has no server costs. A subscription model would be dishonest for a local-only app. One-time purchases align with the value delivered.

## 9. Privacy Design

- All financial data stored in SQLite on-device
- No user accounts, no authentication
- No data transmitted to any server (except AdMob/RevenueCat SDKs per their own policies)
- Uninstall = complete data deletion
- Privacy policy hosted publicly at `/projects/pocketbudget/privacy-policy`

## 10. Launch Criteria

- [x] App builds and runs on physical Android device
- [x] Core transaction flow works end-to-end
- [x] AdMob integration tested (test mode → production)
- [x] RevenueCat IAP products configured and tested
- [x] Privacy policy live at public URL
- [x] Play Store listing complete with screenshots
- [x] APK signed and uploaded to Play Console

## 11. Validation Metrics (Post-Launch)

- **Installs** — Target: 100 in first 30 days (organic only)
- **DAU/MAU ratio** — Target: >20% (indicates genuine daily use)
- **IAP conversion** — Target: >2% of active users
- **AdMob eCPM** — Baseline to establish within 30 days
- **Rating** — Target: >4.0 stars

## 12. Risks

<div class="callout">
  <p><strong>Risk 1: Play Store review rejection</strong><br/>
  Mitigation: Privacy policy live before submission. No sensitive permissions beyond what's declared. AdMob properly disclosed.</p>
</div>

<div class="callout">
  <p><strong>Risk 2: Low organic discoverability</strong><br/>
  Mitigation: ASO-optimized listing. Blog post and project page on benihkode.web.id for backlinks. Community posts on relevant subreddits.</p>
</div>

<div class="callout">
  <p><strong>Risk 3: AdMob policy violations</strong><br/>
  Mitigation: Follow AdMob implementation guidelines strictly. No incentivized ad clicks. Proper consent flow for EU users.</p>
</div>
