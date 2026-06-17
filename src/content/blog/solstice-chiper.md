---
title: "Building an Unobtrusive Tutorial UI in Godot 4 for a Game Jam Puzzle"
description: "How we used dynamic Godot tweens and signals to teach players Solstice Cipher's optical mechanics without breaking immersion."
date: "2026-06-17"
tags: [gamejam, solstice, cipher, indiegame]
---

**TL;DR**: I built a context-aware tutorial system for Solstice Cipher that gently pulses text and uses signals to reposition instructions based on exactly where the player drops their items on the board.

When you're building a puzzle game for a game jam, the last thing you want is a massive wall of text getting between the player and their "aha!" moment.

For Solstice Cipher—our puzzle entry built for the June Solstice Game Jam—players use optical tools like mirrors and prisms to direct a light beam and crack a cipher. The mechanics are highly visual, so a static text tutorial felt entirely wrong. I needed a way to guide the player that felt as dynamic as the light beams themselves. 

## The Problem: Teaching Mechanics Without Interrupting Flow

Level 1 acts as the sandbox for learning how mirrors work. We initially had simple `Label` nodes on the screen telling the player what to do. But it felt flat. Staring at static cyan text while dragging a cool optical tool from a briefcase inventory broke the immersion.

Worse, players would drop a mirror onto the board and not immediately realize they could rotate it. The instruction was just sitting at the bottom of the screen, completely disconnected from where their eyes were focused.

## Tweens and Pulses: Making Text Feel Alive

To solve the flat text problem, I added a subtle pulse to all the tutorial labels. It’s a tiny visual cue that says, "Hey, look here," without aggressively demanding attention.

In Godot 4, making this happen is incredibly clean using `create_tween()`. Here is what the setup looks like inside `tutorial_ui.gd`:

```gdscript
func _ready():
    if instruction_3:
        instruction_3.hide()
        
    for child in get_children():
        if child is CanvasItem:
            child.modulate.a = 0.3
            var tween = create_tween().set_loops()
            tween.tween_property(child, "modulate:a", 1.0, 1.5).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
            tween.tween_property(child, "modulate:a", 0.3, 1.5).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
```

By setting the initial alpha to `0.3` and then oscillating up to `1.0` over 1.5 seconds, the text breathes. The `TRANS_SINE` transition gives it a perfectly smooth, organic rhythm. It’s a two-line solution that immediately elevated the polish of the entire scene.

## Context-Aware Instructions: Listening to the Board

The bigger issue was getting the player's attention exactly when and where they needed it. 

When the player drags a mirror from their briefcase and drops it onto the board, I wanted the "drag" instruction to disappear, and the "rotate" instruction to appear right next to where they placed the mirror.

I connected the `item_dropped_on_board` signal from the `BoardDropZone` directly into the tutorial UI:

```gdscript
func _on_item_dropped(tool_type: String, drop_position: Vector2, _slot_ref: Node) -> void:
    if instruction_1:
        instruction_1.hide()
        
    if tool_type == "mirror" and instruction_3 and not instruction_3.visible:
        instruction_3.show()
        # Position the rotation instruction directly above the drop position
        instruction_3.position = drop_position + Vector2(-300, -80)
```

The magic here is the dynamic positioning. I know the label is 600 pixels wide, so `drop_position + Vector2(-300, -80)` centers the pulsing text just above the newly placed mirror. 

Instead of searching the screen for what to do next, the player's eyes are already exactly where the text pops up. Later on in Level 6, when we introduce the prism splitter, the same lightweight UI logic effortlessly scales to teach the new mechanics.

## The Solstice Cipher Game Jam Takeaway

Small, responsive UI touches like these take very little code but massively impact how an indie game feels to a first-time player. 

Getting this merged in and pushing the v1.0.3 build to GitHub Pages just in time for the game jam was an absolute thrill. It's wildly satisfying watching players figure out the mechanics organically, completely unaware of the tweens and signals firing off behind the scenes to guide them there.
