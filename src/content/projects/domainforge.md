---
title: DomainForge
description: "Crawl websites directly into RAG-ready datasets with Mozilla Readability cleaning, SHA-256 deduplication, and smart chunking."
emoji: "🔥"
techStack: ["TypeScript", "Crawlee", "Apify", "Cheerio"]
category: "tool"
url: "https://apify.com/actorify/domainforge-llm-dataset-builder"
order: 0
---

Crawl websites directly into clean, RAG-ready, and fine-tuning-ready LLM datasets. DomainForge runs on the Apify platform and automates content cleaning, deduplication, and chunking at the crawl stage.

## Features

- **Mozilla Readability Content Cleaning:** Automatically isolates the main article body, stripping out navigation bars, headers, footers, cookie consent banners, ads, and sidebars.
- **SHA-256 Deduplication:** Computes hash signatures of extracted page content to identify and exclude duplicate pages on the fly.
- **RAG-Optimized Chunking:** Smart sentence-aware chunking with customizable `chunkSize` and `chunkOverlap` settings to prevent sentences from being cut in half.
- **Approximate Token Accounting:** Computes token count estimates (words * 1.3) per chunk to help plan embedding and LLM API budgets.
- **High Efficiency:** Built on Crawlee's `CheerioCrawler` to run without headless browser overhead, keeping run footprints tiny and highly cost-efficient ($0.00001 per crawled page).

## Usage

You can run DomainForge directly on the Apify Platform, programmatically via the Apify API, or using the Apify CLI:

```bash
# Run DomainForge using the Apify CLI
apify call actorify/domainforge-llm-dataset-builder -i '{
  "startUrls": [{"url": "https://example.com"}],
  "maxCrawlPages": 100,
  "chunkSize": 1000,
  "chunkOverlap": 150
}'
```

## Output Structure

The actor outputs a clean JSON dataset containing the following fields:

```json
{
  "url": "https://example.com/article",
  "title": "Example Article Title",
  "markdown": "# Example Article Title\n\nArticle body here...",
  "chunks": [
    "Example Article Title. Article body here...",
    "Continuing text in second chunk..."
  ],
  "tokenEstimate": 150
}
```
