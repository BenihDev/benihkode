---
title: jsonask
description: "Query JSON with natural language instead of jq syntax. Stop memorizing jq — just ask."
emoji: "❓"
techStack: ["TypeScript", "Node.js", "CLI"]
category: "tool"
npmPackage: "@fanioz/jsonask"
githubUrl: "https://github.com/BenihDev/jsonask"
installCommand: "npm install -g @fanioz/jsonask"
order: 10
---

Query JSON with natural language instead of jq syntax. Stop memorizing jq — just ask.

## Usage

```bash
# Pipe JSON and ask a question
cat data.json | jsonask "show names"

# Pass file path + query
jsonask data.json "count by status"

# Extract specific fields
jsonask users.json "extract all emails"

# Filter data
jsonask users.json "where role is admin"
jsonask products.json "price greater than 100"

# Sort
jsonask products.json "sort by price"
jsonask products.json "sort by price desc"

# Aggregation
jsonask data.json "count by status"
jsonask data.json "unique categories"

# Limit results
jsonask data.json "top 5 by score"
jsonask data.json "first 3"

# Explore structure
jsonask data.json "keys"
```

## Output Formats

```bash
# Table (default)
jsonask data.json "show names"

# JSON
jsonask data.json "show names" -o json

# List (values only)
jsonask data.json "show names" -o list
```

## How It Works

`jsonask` parses natural language queries into structured operations using pattern matching. It handles:

| Operation | Example Queries |
|-----------|----------------|
| **Extract** | "show names", "get emails", "extract all ids" |
| **Filter** | "where status is active", "price greater than 100" |
| **Count** | "count by role", "how many items" |
| **Unique** | "unique values", "distinct categories" |
| **Sort** | "sort by name", "top 5 by score" |
| **Explore** | "keys", "what fields" |

## Features

- Zero config — works immediately, no API key needed
- Offline — local query engine handles common patterns
- Pipe-friendly — reads from stdin or file
- Smart parsing — fuzzy key matching, dot notation support
- Multiple outputs — table, JSON, or raw list format
