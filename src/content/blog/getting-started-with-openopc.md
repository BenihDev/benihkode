---
title: "Getting Started with OpenOPC: Build an AI-Native One-Person Company"
description: "OpenOPC is an open-source Python framework that assembles a self-organizing team of AI agents around your goal. Covers install, Task Mode, Company Mode, and the Office UI."
pubDate: 2026-07-06
tags: ["openopc", "ai-agents", "one-person-company", "multi-agent-systems", "python"]
---

![OpenOPC Banner](/openopc-banner.png)

**TL;DR:** OpenOPC is an open-source Python framework that assembles a team of AI agents around a goal, they self-organize, hand off work, and learn from each run. This post walks through installation with `uv`, your first task, Company Mode, and the Office UI.

## What OpenOPC Actually Is

I came across OpenOPC a few weeks ago and figured it was just another agent wrapper, something that glues an LLM to a terminal and calls it an "AI developer." It isn't.

OpenOPC, built by the [HKUDS](https://github.com/HKUDS) research group, is a coordination runtime. You give it a goal. It builds an organization, which have roles, reporting lines, the whole thing. And then staffs those roles with AI employees, decomposes the work into items, and runs the company until the job is done.

Three mechanisms drive it (these are the project's own words, not mine):

-   **Self-Built** — Given a goal, OpenOPC drafts an org chart and fills each role. A recruiter agent chooses between reusing an experienced employee (one shaped by prior runs) and onboarding a fresh hire from the talent pool.

-   **Self-Run** — A work-item state machine handles task decomposition, dependency resolution, parallel execution, reviews, and handoffs. Blockers escalate automatically — within the team first, then to you if they exceed the team's authority.

-   **Self-Grown** — After each run, outcomes get attributed to specific roles. Lessons get distilled into per-role experience profiles. Recurring lessons get promoted into shared playbooks that new hires inherit.


The "one-person company" framing is literal. You're the owner. The AI is the staff.

## What You Need Before You Start

The prerequisites are minimal:

-   **Python 3.10+** — the install snippets use 3.12, but anything ≥3.10 works

-   `uv` — Astral's fast Python package manager (technically optional, but the project is built around it)

-   **An LLM API key** — OpenRouter, OpenAI, or any LiteLLM-compatible provider

-   **Node.js 18+** — only needed when the Office UI frontend has to be built (it auto-builds on first launch)

-   **Git** — to clone the repo


Optional: `playwright` for browser tools (page navigation, screenshots, form filling).

## Installing OpenOPC Step by Step

Clone the repo and set up the environment. I'm on macOS, but Linux is nearly identical.

```bash
# Clone
git clone https://github.com/HKUDS/OpenOPC.git
cd OpenOPC

# Install uv if you don't have it
brew install uv
# Linux: curl -LsSf https://astral.sh/uv/install.sh | sh

# Create a Python 3.12 virtualenv
uv python install 3.12
uv venv --python 3.12
source .venv/bin/activate

# Install OpenOPC
uv pip install -e .

# Initialize the config, memory, skills, and project folders
uv run opc init

```

`opc init` creates a `.opc/` directory in the repo root, that contains template config, memory and skills folders, log dirs, and an optional first project. The file you care about first is `.opc/config/llm_config.yaml`. Open it and add your API key:

```yaml
llm:
  default_model: "openai/gpt-4o"
  api_base: "https://openrouter.ai/api/v1"
  api_key: "sk-or-v1-your-key-here"
  max_tokens: 32768

```

Set `default_model` to whatever your provider routes — the template ships with a sensible default; swap it for a model you actually have access to. If you'd rather keep the key out of the file, leave `api_key` empty and set `api_key_env` to the name of an environment variable that holds it (e.g. `OPENROUTER_API_KEY`).

Verify everything wires up:

```bash
uv run opc status

```

If you want browser tools for your agents:

```bash
uv run python -m playwright install chromium

```

## Your First Task: Using Task Mode

Task Mode is the simplest way to use OpenOPC. It's a single-agent workspace — think of it as a direct conversation with one AI employee who has access to your project's tools.

```bash
uv run opc chat -p demo --mode task --agent native

```

This drops you into an interactive chat. The `native` agent is OpenOPC's built-in runtime, so it needs no extra CLIs. You can also use `codex`, `claude_code`, `cursor`, or `opencode` if you have those installed.

Type a task:

```
Inspect the project structure and summarize what each top-level directory does

```

The agent will use shell, file, and search tools to explore and respond. For one-shot scripting with no interactive chat, use `opc exec`:

```bash
uv run opc exec -p demo --mode task --agent native --json "Summarize the current repo status"

```

The `--json` flag gives you structured output you can pipe into other tools — useful for CI or automation. (There's also `--stream-json` if you want results as they're produced.)

Inside an interactive `opc chat` session, slash commands give you quick controls:

```
/status          # current project/session state
/mode task       # switch to task mode
/agent codex     # switch execution agent
/session list    # list all sessions

```

## Going Bigger: Company Mode

This is where OpenOPC gets interesting. Company Mode doesn't just run one agent — it builds an entire team.

```bash
uv run opc chat -p demo --mode company --company-profile corporate \
  "Plan, implement, review, and document a REST API for user management"

```

What happens next:

1.  OpenOPC reads the built-in `corporate` architecture (defined in `.opc/config/company_corporate_config.yaml`).

2.  It drafts an org chart for the task — maybe a project manager, a backend developer, a code reviewer, and a technical writer.

3.  Each role gets staffed. Experienced employees from past runs get priority; fresh hires fill the gaps.

4.  The work gets decomposed into items with dependencies. Independent items run in parallel; dependent items wait.

5.  Roles hand off work, review each other's output, and escalate blockers.


You can watch this unfold in real time through the Office UI (more below), or track it from the CLI:

```bash
uv run opc runtime status -p demo
uv run opc work-item list -p demo

```

The key config for Company Mode is the autonomy setting in `.opc/config/system_config.yaml`:

```yaml
autonomy:
  max_auto_approve_risk: medium   # low | medium | high | critical
  allow_native_tool_auto_approval: true
  tool_first_use_approval: true

```

At `medium` (the default), ordinary commands run without asking. Dangerous operations — `rm -rf`, force pushes, credential access — are risk-classified as `high`/`critical` and always escalate to you. Set it to `low` on shared or production machines, where you want to approve anything that isn't on the safe allowlist (`ls`, `git status`, and friends).

## The Office UI — Your AI Company's Dashboard

The CLI is functional, but the Office UI is where you actually see what's happening.

```bash
uv run opc ui

```

Open `http://localhost:8765` (the default port; override with `opc ui --port 9000`). Three pages:

**Workspace** — the main surface. A session list on the left, a kanban board in the center showing work items as they move through the workflow, and a context panel on the right with chat, agent status, comms, and team info.

**Office** — an animated pixel-art office (the frontend is React + Phaser) where each agent appears as a character at a desk. You can see who's working, who's idle, what tool they're running, and what task they own. It's not just decoration — clicking an agent opens their execution details.

**Org** — the company architecture editor. Switch between corporate and custom org templates, add or remove roles, adjust reporting lines, hire from the talent market, and inspect runtime policy per role.

To start work from the UI: create a project, click "New Chat", pick Task or Company mode, choose your agent or org architecture, and send the brief. Once you send the first message, the mode locks for that session.

If the UI ever looks stale:

```bash
uv run opc ui --rebuild

```

## Where to Go From Here

Once you're comfortable with Task Mode and Company Mode, a few directions open up:

**External agents.** OpenOPC can delegate to Codex, Claude Code, Cursor, and OpenCode. Configure their command paths and timeouts in `.opc/config/agent_config.yaml`. In Company Mode, individual roles can prefer specific external agents.

```bash
uv run opc chat -p demo --mode task --agent codex "Refactor this module"

```

**Channels.** Connect OpenOPC to Slack, Telegram, Discord, Feishu, Email, Matrix, WhatsApp, and others — each channel is an install extra:

```bash
uv run pip install -e .[channels-slack]
uv run opc channels login slack
uv run opc channels start -p demo

```

Inbound messages come in, get routed to the right project, and trigger agent work. Sender lists are deny-by-default, so nothing runs until you allow it.

**Talent and the marketplace.** Import community talent libraries, hire specific templates into roles, and export your entire org as a shareable `.opcpkg`:

```bash
uv run opc talent import /path/to/agency-agents
uv run opc market export --id my_company --name "My Company" --output-dir packages

```

**Browser tools.** With Playwright installed, agents get native browser tools : `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_take_screenshot`, and more. Configure headless/headed mode in `system_config.yaml`.

**MCP servers.** OpenOPC also speaks MCP: register local (stdio) or remote (HTTP/SSE) servers under `mcp_servers` in `system_config.yaml`, and their tools show up with a server prefix to avoid collisions. If you'd rather build a server than configure one, [mcpkit](https://benihkode.web.id/tools/mcpkit/) generates MCP servers from OpenAPI specs, databases, or YAML.

The project is MIT-licensed and actively developed; the [GitHub repo](https://github.com/HKUDS/OpenOPC) has the full docs. I'm still working out how much autonomy I'd hand a Company Mode run against my own repos, but Task Mode already feels like a useful step up from a bare chat session, and the autonomy dial lets you start strict and loosen it as trust builds. For more on how I think about tooling and shipping, the [journal](https://benihkode.web.id/blog/) covers the rest.
