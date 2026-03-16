---
title: "Vellum: Context Overlay"
description: 'A desktop utility that pins transparent, click-through reference overlays (images, PDFs, websites) on top of your active workspace.'
status: idea
meta: "Draft v1.0"
order: 1
---

## 1. Title & One-Liner

**Vellum: The Ghost Mode for Your Workflow.**

A desktop utility that pins transparent, click-through reference overlays (images, PDFs, websites) on top of your active workspace, eliminating the "Alt-Tab tax" for developers and designers.

## 2. Platform Target

- **Desktop Only**: macOS (Universal), Windows 11/10, Linux (X11/Wayland experimental).

<div class="callout">
  <p><strong>Justification:</strong> Requires OS-level window compositing (click-through transparency) not possible in web browsers.</p>
</div>

## 3. Core User Loop

1. **Snap**: User selects a region of a screen (or file) to "pin".
2. **Ghost**: The selection becomes a floating, transparent window that stays on top.
3. **Work**: User types *through* the ghost window in their IDE/Design tool, using the overlay as a direct visual guide.
4. **Dismiss**: A global hotkey toggles visibility or dismisses the ghost when done.

## 4. Target Audience

- **Primary Persona**: The "Pixel-Perfect" Frontend Developer.
  - *Pain Point*: Constantly switching between Figma and VS Code to match padding/colors, losing context and flow.
- **Secondary**: Digital Artists (tracing references), Data Entry Clerks (transcribing text from images).

## 5. MVP Feature Set

- **Ghost Windows**: Create up to 3 simultaneous overlay windows.
- **Click-Through Mode**: Toggle that makes the overlay ignore mouse events (allowing interaction with the app behind it).
- **Opacity Slider**: Global hotkey + Scroll wheel to adjust transparency (10% - 100%).
- **Source Support**:
  - Image Files (Drag & Drop)
  - Screen Region Capture (Snipping tool style)
  - URL (render a live website as an overlay - e.g., mobile view of localhost)
- **Hiding**: "Panic Key" to instantly hide all overlays.

**Future Scope**:
- OCR on overlays (copy text from the image).
- Video overlays (watch tutorial while coding).
- Team Sync (share overlay sets).

## 6. Tech Stack Recommendation

- **Frontend/Core**: **Tauri v2** (Rust + React/TypeScript).
  - *Why*: Critical for minimizing RAM usage (Electron is too heavy for a background utility) and accessing native OS window traits (`NSWindow` on macOS, `SetWindowLong` on Windows) for click-through transparency.
- **State Management**: **Rust Backend** (managing window handles) -> **Frontend** (UI for settings).
- **Distribution**:
  - macOS: DMG/Updater (Notarized).
  - Windows: NSIS Installer.
  - Linux: AppImage.

## 7. Technical Challenges & Mitigations

<div class="callout">
  <p><strong>1. Click-Through Transparency</strong></p>
  <p><em>Risk:</em> OS support varies wildly. Windows requires specific flag combinations; macOS needs `ignoresMouseEvents`. Linux (Wayland) is strict about window positioning.</p>
  <p><em>Mitigation:</em> Use the `tauri-plugin-window-state` and custom Rust commands to invoke platform-specific APIs. Fallback to "always on top but not click-through" for Wayland.</p>
</div>

<div class="callout">
  <p><strong>2. Performance Overhead</strong></p>
  <p><em>Risk:</em> Overlays causing input lag in the underlying high-performance app (e.g., Blender, Game Engine).</p>
  <p><em>Mitigation:</em> Use GPU acceleration for the webview but ensure the Rust backend process runs at normal priority. Enforce strict resource limits on the WebView.</p>
</div>

<div class="callout">
  <p><strong>3. macOS Permissions</strong></p>
  <p><em>Risk:</em> Screen recording permission is required for the "Region Capture" feature.</p>
  <p><em>Mitigation:</em> Implement a "Check & Request" flow on first launch explaining *why* it's needed (not for spying, but for local cropping).</p>
</div>

## 8. Monetization Strategy

- **Model**: **Freemium**.
- **Free Tier**: 1 active overlay, Image support only.
- **Pro Tier ($29 One-Time License)**: Unlimited overlays, URL/Web support, "Save Workspaces".
- **Sustainability**: Zero server cost (local app). One-time payment aligns with the "Power Tool" utility market.

## 9. Compliance & Distribution

- **Privacy**: 100% Local. No screen data ever leaves the device.
- **Stores**:
  - **Mac App Store**: *Risk* - "Click-through" APIs might be flagged as non-standard behavior. Plan for Direct Distribution (DMG) as primary channel.
  - **Microsoft Store**: Generally permissible for desktop utilities.

## 10. Validation Metrics

- **Retention**: "Daily Active Users" who toggle an overlay > 5 times/day.
- **Conversion**: Free-to-Paid upgrade rate > 3%.
- **Performance**: Overlay latency (time to move) < 16ms (60fps).
