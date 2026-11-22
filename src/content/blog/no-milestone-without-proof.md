---
title: "No Milestone Without Proof: What M1 of a Kitchen Simulator Had to Show"
description: "Seven stations, three workers, and acceptance gates that only count if they run — plus why the simulation architecture was rewritten before a single line of M2 feature code existed."
pubDate: 2026-11-22
tags: ["godot", "game dev", "process"]
---

The project is an offline, single-player, stylized 3D isometric management simulator about Indonesian school meal kitchens: feed students, run the kitchen, keep the budget from collapsing. It targets PC and Android, its first UI language is Indonesian, and it currently goes by a working title that may change before release.

This week it reached **M1**. Not "M1 mostly done" or "M1 pending polish" — M1 with a tag, a push, and a table of evidence.

## The rule that shaped the milestone

Before any of this existed, the project baseline fixed one rule: every milestone gate must be provable by something that runs. Not a checklist of intentions. Not a screenshot of a scene that might be a mockup. A build you can launch, a test you can execute, a run you can watch.

M1's gates were written that way:

- Seven stations exist at the positions the layout document specifies, built by kit-bashing, each with its accent colour, and the station catalogue matches the documented ids.
- Three workers are visible and can navigate to every station with `NavigationAgent3D` without getting stuck — proven by a run that walks each worker to each station.
- The assignment flow works end to end: select a worker, hover a station, see its status, assign, and watch the queue accept the task.
- Station status is queryable and surfaces in tooltips and the HUD.
- Every player-facing string goes through a translation key, Indonesian first, verified by an audit for hardcoded text.
- The headless suite is green.

That last one is where milestones usually rot. A gate that says "tests pass" is easy to write and easy to quietly skip. A gate that says "the suite runs headless and is green at the tagged commit" is a different animal, because someone can check it later.

## What M1 actually built

The visible result is a low-poly kitchen with seven working stations and three workers who walk between them. The invisible result is a task lifecycle: something that can be created, queued, started, and finished, and that a station can report on.

The worker navigation was not the hard part. Neither was the kit-bashed geometry, though matching a documented layout with modular pieces takes longer than it looks. The hard part was ownership: during M1 the worker, its task, and the station's queue each held a piece of the same truth. It worked — the gates passed — but the state lived in three places that had to agree.

## The rewrite that happened before the rewrite

The original plan for M2 assumed that structure would hold. It didn't. On 19–20 November, before any M2 feature code existed, the simulation architecture was re-decided in six ADRs (017 through 022).

The simulation core became the single owner of worker, station, task, and queue state: pure GDScript, no Nodes, no physics, no rendering, commands in and events out. Time became a first-class input — a fixed 10 Hz logical tick, integer ticks everywhere, with `advance(n_ticks)` as the one determinism seam that tests drive directly and the runtime feeds from accumulated frame time. Speed multipliers change how many ticks get scheduled, never the length of a tick, so a 120-second cook finishes after 1200 ticks at 30, 60, or 144 fps.

Static data moved into immutable `.tres` catalogues — ingredients, recipes, day parameters — loaded once and never mutated at runtime. Inventory became integer stock with typed transactions instead of loose dictionaries. The ledger got seeded price drift. Batch production became an explicit stage machine with seeded quality checks.

Seeded is the word to notice. A management sim is only debuggable if the same inputs produce the same day twice. That means every random decision — quality rolls, price drift — has to come from a seed you can replay, not from the ambient randomness of the engine.

Rewriting an architecture before writing the code it would have governed is cheap. Discovering the same flaw after M2's systems exist is not. M1's gates did their job by surfacing the problem while the cost was still a week of thinking instead of a month of untangling.

## What the next gates need to prove

M2 is now a sequence of six steps, and each one lands with its own test suite while the M0 and M1 suites stay green: immutable catalogues, inventory, ledger with purchasing, the batch stage machine, then day-scale determinism with a save/load round trip.

The exit criteria are written as measurable claims rather than features. The clock must complete a recipe stage of N ticks after exactly N advances, identical at three frame rates and three speeds. Stock must never go negative, and a consume beyond stock must be rejected with no partial change. Every ingredient's transactions must sum to its current stock after a scripted day. Balance must equal the start plus the sum of ledger entries after every command. A save at any tick, reloaded, must produce the same event log and state hash as an uninterrupted run.

None of those can be satisfied by describing them. That is the point of writing them this way. The milestone is not the moment the feature looks finished. It is the moment the proof runs.
