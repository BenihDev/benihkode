---
title: EchoChess
description: "Offline chess sparring studio for iPhone. Every session starts from a curated midgame or endgame position, with a one-thumb coordinate pad and a board that fades to train spatial memory."
emoji: "♞"
techStack: ["SwiftUI", "SwiftData", "CoreHaptics", "WidgetKit"]
category: "app"
order: 3
hasPrivacyPolicy: true
privacyPolicyUrl: "/projects/echochess/privacy-policy"
appName: "EchoChess"
---

**In development.** EchoChess is not on the App Store yet. This page describes what it does and why; the privacy
policy is published ahead of release because App Store submission requires it to be reachable.

EchoChess is a spatial chess trainer for iPhone that never plays a game from the first move. Every session starts
from a curated midgame or endgame position with a clear objective — win, draw, or survive — so the time goes into
calculation and board vision instead of opening theory.

## What It Does

- **Curated sparring positions.** A deck of midgame and endgame scenarios across three collections: Tactical
  Midgame, Endgame Mastery and King Survival. No phase where you are reciting moves you have seen before.
- **Ghost Mode.** A three-step ladder for spatial memory. *Clear* shows every piece. *Echo* fades the board to a
  faint silhouette a few seconds after each move, so you carry the position yourself. *Blind* removes the pieces
  entirely and leaves the coordinates.
- **A one-thumb coordinate pad.** Algebraic entry built for a single thumb, with the illegal keys dimmed before you
  press them. Castling is simply the king's destination; en passant is the square behind the pawn.
- **Blunder Sense.** Instead of an evaluation graph, a deliberately shaped haptic tells you the move you just made
  dropped the position — a double heartbeat, not a number.
- **Daily Endgame widget.** One endgame position a day on the home screen, opening straight into the board.

## Why

Most chess apps assume you want a full game. But the part of chess that is hard, and the part worth training, is
holding a position in your head while you calculate. EchoChess is built around that one skill: the board is taken
away gradually, and the only thing left to lean on is your own sense of where everything is.

It is also completely offline. The engine, the scenarios and the daily position all live on the device. There is no
account, no sync, no subscription, and no analytics — see the
[privacy policy](/projects/echochess/privacy-policy) for the short version.
