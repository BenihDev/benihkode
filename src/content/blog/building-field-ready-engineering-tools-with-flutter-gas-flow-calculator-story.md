---
title: "Building Field-Ready Engineering Tools with Flutter: The Gas Flow Calculator Story"
description: "How we refined the Gas Flow Calculator for production, focusing on field-first UX, precision input steppers, and sleek floating navigation."
pubDate: 2026-05-14
tags: ["flutter", "engineering", "gasflow", "UX design"]
---

**TL;DR**: Refining an engineering utility for the field requires moving beyond generic UI. We standardized the branding, implemented precision input steppers, and designed a custom floating navigation bar to prioritize ergonomics and clarity.

Building a field engineering tool isn't just about the math; it's about making that math accessible in high-pressure, low-connectivity environments where gloves are thick and precision is non-negotiable. Over the last few sessions, we've taken the Gas Flow Calculator from a functional prototype to a production-ready utility now live on the Play Store's internal track.

Here is how we tackled the challenges of field-first design using Flutter.

## The Shift to Clarity: Standardizing the Identity

In the early stages of development, the app carried the name "GasFlow Pro." While it sounded technical, it didn't align with the specific intent of the users searching for it: engineers looking for a reliable, ISO 5167-compliant calculator.

We standardized the identity to **Gas Flow Calculator** across the entire stack—from the `android/app/build.gradle` application ID to the header text in the UI.

```dart
// lib/screens/calculator_screen.dart
Widget _buildHeader() {
  return Text(
    "Gas Flow Calculator",
    style: GoogleFonts.outfit(
      fontSize: 24,
      fontWeight: FontWeight.bold,
      color: AppColors.textPrimary,
    ),
  );
}
```

This alignment isn't just aesthetic; it's about building trust. When an engineer pulls up an app in the field, they need to know exactly what it is and what standard it follows.

## Field-First Input Design: Steppers and Focus Management

One of the biggest friction points in mobile engineering apps is data entry. Standard text fields are often too small, and the default keyboard behavior can be frustrating when you're trying to make minute adjustments to an orifice diameter.

To solve this, we refactored our core input component, `BentoInput`, with three specific field-friendly features:

1. **Precision Steppers**: Added +/- buttons using `CupertinoIcons` that allow for 0.01 or 0.1 increments without opening the keyboard.
2. **Select-All-on-Focus**: When a user taps into a field, the entire value is selected automatically. This eliminates the need to backspace through old values.
3. **Haptic Feedback**: Every stepper tap provides a subtle physical vibration, confirming the input was registered.

```dart
// snippet from BentoInput
Widget _buildStepperButton(IconData icon, VoidCallback onPressed) {
  return IconButton(
    icon: Icon(icon, size: 20, color: AppColors.primary),
    onPressed: () {
      HapticFeedback.lightImpact();
      onPressed();
    },
  );
}
```

These micro-interactions make the app feel like a rugged piece of hardware rather than just another software form.

## The "Single-Tap" Conversion Challenge

Field work often involves jumping between imperial and metric systems. A technician might measure a pipe in inches but have a sensor reading in centimeters. Forcing them into a "Settings" menu to change units is a workflow killer.

We implemented a "Single-Tap" conversion pattern. By making the unit labels themselves interactive, users can toggle between units instantly. The `BentoInput` now accepts an `onUnitTap` callback that triggers the conversion logic in the parent state.

```dart
// In CalculatorScreen
BentoInput(
  label: "Orifice Diameter",
  value: _orificeDiameter,
  unit: _orificeUnit,
  onUnitTap: () => _handleUnitToggle("orifice"),
  // ...
)
```

This design pattern ensures that the calculator adapts to the user's current environment, not the other way around.

## Ergonomics at the Bottom: Designing the Floating Pill Navigation

Standard bottom navigation bars take up valuable vertical real estate. In a calculator where the "Calculate" button needs to be prominent, every pixel counts.

We moved away from `BottomNavigationBar` in favor of a custom-built **Floating Pill Navigation**. This component uses a glassmorphism effect (semi-transparent background with a blur) to float above the content. It's narrower than a standard bar, making it easier to reach with a thumb while holding a mobile device one-handed.

```dart
// lib/screens/calculator_screen.dart
Widget _buildBottomNav() {
  return Container(
    height: 64,
    margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
    decoration: BoxDecoration(
      color: AppColors.surface.withOpacity(0.8),
      borderRadius: BorderRadius.circular(32),
      boxShadow: [/* ... */],
    ),
    child: Row(/* Navigation Items */),
  );
}
```

This approach allows the background content to "peek" through the bottom of the screen, creating a sense of depth and making the app feel more modern and premium.

## Shipping for Success: Play Store Release Engineering

Finalizing a tool for production also means getting the "boring" stuff right. We streamlined the `AboutScreen` to remove complex equation sections that were cluttered on small screens, replacing them with a streamlined support section.

Using the `url_launcher` package, we added a "Report a Bug" feature that pre-fills an email to our support desk with the app version and subject line.

```dart
// lib/screens/about_screen.dart
final Uri emailUri = Uri(
  scheme: 'mailto',
  path: 'hello@benihkode.web.id',
  query: 'subject=Bug Report: Gas Flow Calculator v1.0.1',
);
```

Finally, we bumped the version to `1.0.1+3` and generated the signed App Bundle (`.aab`) for the internal track. The result is a tool that is mathematically sound, visually stunning, and ergonomically optimized for the people who need it most.

**Takeaway**: When building professional utilities, look beyond the core feature. The real value is found in the inputs, the transitions, and the ergonomics of the field environment.
