---
title: mcpkit
description: "Generate ready-to-use MCP servers from OpenAPI specs, databases, or YAML descriptions."
emoji: "🛠️"
techStack: ["TypeScript", "Node.js", "CLI"]
category: "tool"
npmPackage: "@fanioz/mcpkit"
githubUrl: "https://github.com/BenihDev/mcpkit"
installCommand: "npx @fanioz/mcpkit"
order: 8
---

Generate ready-to-use MCP servers from OpenAPI specs, databases, or YAML descriptions. Go from zero to a working MCP server in seconds.

## Usage

### Create a blank MCP server

```bash
npx @fanioz/mcpkit init
npx @fanioz/mcpkit init --name my-server --description "My custom MCP server"
```

### Generate from an OpenAPI spec

Turns every endpoint into an MCP tool. Supports OpenAPI 3.x and Swagger 2.x.

```bash
npx @fanioz/mcpkit from openapi.yaml
npx @fanioz/mcpkit from openapi.yaml --name petstore-mcp
npx @fanioz/mcpkit from https://api.example.com/openapi.yaml --name example-mcp
```

### Generate from a SQLite database

Creates read-only query tools for every table in your database.

```bash
npx @fanioz/mcpkit from sqlite:///path/to/your.db
npx @fanioz/mcpkit from sqlite:///path/to/your.db --name my-db-mcp
```

### Generate from a YAML description

Define your MCP tools in a simple YAML file:

```yaml
name: my-tools
version: "1.0.0"
description: My custom MCP server
tools:
  - name: search
    description: Search for items
    parameters:
      - name: query
        type: string
        description: Search query
        required: true
```

```bash
npx @fanioz/mcpkit from mcp.yml
```

## Generated Project Structure

Every command outputs a ready-to-run TypeScript project:

```
my-mcp-server/
  package.json
  tsconfig.json
  src/
    index.ts        # MCP server with your tools
  .gitignore
```

```bash
cd my-mcp-server
npm install
npm run dev
```

## Use with AI Assistants

Add your generated MCP server to your AI assistant's config:

**Claude Code** (`~/.claude/settings.json`):
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/src/index.ts"]
    }
  }
}
```

## Features

- Three input sources: OpenAPI specs, SQLite databases, YAML descriptions
- Generates ready-to-run TypeScript projects
- Supports OpenAPI 3.x and Swagger 2.x
- Works with Claude Code, Cursor, Windsurf, and other MCP-compatible assistants
- No boilerplate — just generate and run
