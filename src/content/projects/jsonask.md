---
title: jsonask
description: "Query JSON with natural language instead of jq syntax. Stop memorizing jq — just ask."
summary: "jsonask is a free CLI that lets you query JSON in plain English instead of memorizing jq syntax."
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

## Practical JSON Query Examples

These are the queries that come up most often. Every one runs locally with no API
key.

**Explore an unknown payload.** The first thing to do with unfamiliar JSON is
learn its shape:

```bash
jsonask api-response.json "keys"
jsonask api-response.json "what fields"
```

**Extract one field across an array.** Instead of remembering
`.[] | .name`, ask:

```bash
jsonask users.json "show names"
jsonask users.json "extract all emails"
jsonask orders.json "get ids"
```

**Filter by value.** Equality and numeric comparison both work:

```bash
jsonask users.json "where role is admin"
jsonask users.json "where status is active"
jsonask products.json "price greater than 100"
```

**Aggregate.** Counts and distinct values are one query:

```bash
jsonask events.json "count by type"
jsonask events.json "how many items"
jsonask catalog.json "unique categories"
```

**Sort and limit.** Ordering combined with a top-N is common in reports:

```bash
jsonask products.json "sort by price desc"
jsonask players.json "top 5 by score"
jsonask results.json "first 3"
```

**Use dot notation for nested keys.** Fuzzy matching means close spellings still
resolve:

```bash
jsonask config.json "show server.port"
jsonask data.json "extract user.email"
```

**Chain with other tools.** Because `jsonask` reads stdin and writes JSON with
`-o json`, it composes:

```bash
curl -s https://api.example.com/items \
  | jsonask "where status is active" -o json \
  | jq '.[0]'
```

## jsonask vs. Alternatives

| Tool | Query input | Needs learning | Offline | Best for |
|------|-------------|----------------|---------|----------|
| **jsonask** | Natural language | No | Yes | Quick, ad-hoc queries without `jq` syntax |
| **jq** | A dedicated DSL | Yes, steep | Yes | Complex, reproducible transformations |
| **fx** | JavaScript expressions | Some JS | Yes | Interactive exploration with full JS |
| **jless** | Interactive viewer | Minimal | Yes | Browsing large JSON by hand |

The honest recommendation: keep `jq` for scripts and pipelines you commit,
because its syntax is precise and reproducible. Use `jsonask` for the exploratory
80% — when you just want the answer now and the query will not be saved.

## FAQ

**Does jsonask call an LLM?**
No. It uses local pattern matching to translate common phrasings into operations.
That is why it needs no API key and works offline.

**What happens with a query it does not understand?**
It reports that it could not parse the query. Try the `keys` or `what fields`
query first to confirm the field names. Paraphrase using the operations in the
table above.

**Can it modify JSON or write files?**
No. `jsonask` is read-only: it extracts, filters, aggregates, sorts, and prints.

**Which output format should I use?**
Table for reading, `-o json` for piping into another tool, `-o list` for a clean
list of scalar values.

**Is it a full jq replacement?**
No. It covers common extract/filter/aggregate/sort queries. For arbitrary
transformation logic in a committed script, use `jq`.

## Related Tools

- [DomainForge](/tools/domainforge) — produces the RAG datasets you then query
  with `jsonask`.
- [secretsweep](/tools/secretsweep) — inspect JSON configs before they are
  committed.
- [gitcommitgen](/tools/gitcommitgen) — commit the query changes you settle on.
- Browse the rest of the [developer tools collection](/tools/) and the
  [collection announcement](/blog/introducing-benihkode-dev-tools).
