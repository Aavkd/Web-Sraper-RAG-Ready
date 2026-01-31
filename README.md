# Website → LLM‑Ready Knowledge Extractor

Turn any website into clean, token-efficient Markdown ready for RAG and LLM pipelines.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Tests](https://img.shields.io/badge/tests-173%20passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)]()
[![License](https://img.shields.io/badge/license-ISC-green)]()

Most web scrapers return raw HTML or noisy text — LLMs don't need that. This project extracts only the meaningful content, removes boilerplate, and outputs LLM-ready Markdown plus structured JSON you can plug directly into your AI workflows.

---

## Problem

If you've tried using websites as knowledge sources for LLMs, you already know the pain:

- Too much noise (menus, footers, cookie banners)
- Token waste → higher costs
- Manual cleaning before RAG ingestion
- Generic crawlers that extract everything instead of what matters

This tool fixes those problems by producing clean, predictable knowledge suitable for LLM pipelines.

## What it does

- **Crawls** a website (internal links only, respects depth limits)
- **Extracts** the main content using Readability algorithms
- **Cleans** and normalizes into token-optimized Markdown
- **Chunks** content for RAG / vector databases (configurable size)
- **Outputs** structured JSON + Markdown ready for your AI workflows

You get **knowledge**, not HTML.

## Built for

- AI / LLM developers
- RAG pipelines (LangChain, LlamaIndex, custom)
- Indie SaaS founders
- Automation builders (n8n, Make, custom backends)

If your next step is an LLM, this fits well.

---

## Quick Start

### Input Configuration

Provide a simple JSON input:

```json
{
  "startUrl": "https://docs.example.com",
  "maxPages": 20
}
```

### All Input Options

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `startUrl` | string | *required* | The URL of the website to crawl |
| `maxPages` | integer | 20 | Maximum pages to crawl (1-500) |
| `maxDepth` | integer | 2 | Maximum link depth from start URL (1-10) |
| `includePaths` | string[] | [] | Only crawl URLs matching these patterns |
| `excludePaths` | string[] | [] | Skip URLs matching these patterns |
| `chunkSize` | integer | 600 | Target chunk size in tokens (100-2000) |
| `outputFormat` | string | "json" | Output format: "json", "markdown", or "both" |
| `enableChunking` | boolean | true | Enable RAG chunking. Set to false for full markdown only |
| `stripReferences` | boolean | true | Remove academic footer sections (References, Bibliography, etc.) |
| `usePlaywright` | boolean | false | Force Playwright browser for JavaScript-heavy sites (auto-detected by default) |

### Example: Crawl Documentation Site

```json
{
  "startUrl": "https://crawlee.dev/docs",
  "maxPages": 50,
  "maxDepth": 3,
  "includePaths": ["/docs/*"],
  "excludePaths": ["/docs/api/*"],
  "chunkSize": 800,
  "outputFormat": "both"
}
```

No proxy setup. No RAM tuning. Sensible defaults included.

---

## Output

### 1. Clean Markdown

Noise-free, normalized, token-efficient content:

```markdown
# Getting Started with Crawlee

## Installation

Install Crawlee using npm:

npm install crawlee

## Basic Usage

Create a simple crawler in just a few lines of code...
```

### 2. Structured JSON (RAG-ready)

```json
{
  "source": "https://docs.example.com",
  "crawledAt": "2026-01-24T20:00:00Z",
  "summary": {
    "pagesAttempted": 25,
    "pagesExtracted": 22,
    "pagesSkipped": 3,
    "totalTokensEstimate": 45000
  },
  "pages": [
    {
      "url": "https://docs.example.com/intro",
      "title": "Introduction",
      "markdown": "Clean content...",
      "chunks": [
        {
          "id": "intro_chunk_1",
          "content": "First chunk of content...",
          "tokensEstimate": 580,
          "sourceUrl": "https://docs.example.com/intro",
          "pageTitle": "Introduction"
        }
      ],
      "metadata": {
        "depth": 0,
        "crawledAt": "2026-01-24T20:00:00Z",
        "tokensEstimate": 1240
      }
    }
  ]
}
```

### 3. Crawl Summary

Every run includes visibility into what happened:

- Pages attempted vs. extracted vs. skipped
- Total token estimate across all content
- Duration and performance metrics

---

## Why This is Different

| Generic Web Crawlers | This Project |
|---|---|
| Raw HTML / noisy text | Clean, LLM‑ready Markdown |
| Token-heavy output | Token‑optimized |
| Crawls everything | Extracts only what matters |
| Requires manual post-processing | Ready for RAG |

This is not a general-purpose crawler — it's a **knowledge extractor** designed for content-rich sites.

---

## Technical Details

### Architecture

```
src/
├── main.ts                 # Actor entry point
├── types/                  # TypeScript interfaces
├── input/                  # Input validation (Zod)
├── crawler/                # Crawlee-based crawler
├── extraction/             # Readability + HTML cleaning
├── processing/             # Markdown conversion & chunking
├── output/                 # JSON/Markdown formatting
└── utils/                  # Logging utilities
```

### Core Technologies

- **[Crawlee](https://crawlee.dev/)** — Robust, scalable web crawling
- **[@mozilla/readability](https://github.com/mozilla/readability)** — Content extraction (same as Firefox Reader View)
- **[Turndown](https://github.com/mixmark-io/turndown)** — HTML-to-Markdown conversion
- **[Zod](https://zod.dev/)** — Runtime input validation
- **[JSDOM](https://github.com/jsdom/jsdom)** — DOM parsing for Node.js

### Boilerplate Removal

The extraction pipeline removes 70+ categories of noise:

- Navigation (nav, header, menus)
- Footers and sidebars
- Cookie consent banners
- Advertisements
- Social share buttons
- Related posts sections
- Comment sections
- Popups and modals
- **References/Bibliography sections** (Wikipedia-style, configurable)
- **Position-aware "Notes" removal** (only in footer region)

### Q&A Page Support

Automatic detection and extraction for Q&A sites:

- **Stack Overflow / Stack Exchange**: Full question + answer extraction
- **Discourse forums**: Topic extraction with replies
- **Generic Q&A sites**: CSS pattern and Schema.org microdata detection

When a Q&A page is detected, the extractor:
1. Preserves both question AND answer content (fixes Readability's longest-section bias)
2. Removes Q&A-specific noise (votes, comments, user cards)
3. Outputs semantic markers (`## Question`, `## Answer`) for downstream processing

### SPA & JavaScript Site Detection

Automatic detection and handling for JavaScript-heavy documentation sites:

**Auto-detected domains:**
- Stripe Docs (`docs.stripe.com`)
- GitHub Docs (`docs.github.com`)
- Vercel Docs (`docs.vercel.com`)
- React (`react.dev`), Angular (`angular.dev`), Vue (`vuejs.org`)
- MDN Web Docs (`developer.mozilla.org`)

**HTML-based detection:**
- Next.js (`__NEXT_DATA__`)
- Gatsby, Nuxt, React, Angular, Vue indicators

When detected, the crawler automatically uses Playwright for proper JavaScript rendering. You can also force Playwright with `"usePlaywright": true`.

### Two-Phase Crawling

The crawler implements intelligent fallback:
1. Start with fast Cheerio extraction
2. Detect if extraction failed (< 200 tokens or fragmented code)
3. Automatically retry with Playwright if needed

### Interactive Code Block Handling

Properly extracts tokenized/highlighted code from documentation sites:

- Handles Prism.js, highlight.js, Shiki syntax highlighting
- Converts tokenized spans back to clean fenced code blocks
- Preserves language information from class names
- Prevents fragmentation into inline code

### Content Quality Validation

Every extraction includes quality checks:

- **Token count validation**: Flags pages with too few tokens
- **Fragmented code detection**: Identifies SPA extraction failures
- **Navigation detection**: Flags nav-like content
- **Quality score**: 0-100 rating for extraction quality

### Nested List Handling

Improved extraction for complex Table of Contents and nested lists:

- Preserves parent text before nested sublists
- Maintains proper indentation (2-space nesting)
- Correctly formats links within list items
- Handles arbitrary nesting depth

---

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup (Local Development)

```bash
# Install dependencies
npm install

# Install Playwright browsers (required for SPA sites - local dev only)
npx playwright install chromium

# Build TypeScript
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

> **Note:** When deployed to Apify, Chromium is included in the Docker image (`apify/actor-node-playwright-chrome:20`) - no manual browser installation needed.

### Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode
npm run test:watch
```

**Test Coverage:**
- 173 tests across 7 test files
- Unit tests for extraction, chunking, tokenization, and code blocks
- Integration tests for SPA detection and end-to-end crawls

### Local Testing

```bash
# Run the actor locally
npx apify run --input '{"startUrl": "https://crawlee.dev/docs", "maxPages": 5}'
```

---

## Important Limitations

- Designed for **content-rich websites** (docs, blogs, marketing sites)
- Does NOT attempt aggressive Cloudflare bypass
- Fails fast on blocked or unsuitable pages (to save credits)
- JavaScript-heavy SPAs are auto-detected and handled with Playwright

These choices keep results **predictable** and costs **under control**.

---

## Pricing

| Tier | Pages | Price |
|------|-------|-------|
| Free | Up to 3 | $0 |
| Basic | Up to 20 | $3 |
| Pro | Up to 50 | $7 |

You pay for **usable knowledge**, not crawl time.

---

## Use Cases

- 📚 Build a RAG knowledge base from a SaaS website
- 🔗 Feed clean docs into LangChain / LlamaIndex
- 🧠 Prepare website content for embeddings
- 🤖 Power AI agents with real company knowledge
- 📊 Create structured datasets from documentation

---

## Roadmap

Planned extensions:

- [ ] Embedding generation (OpenAI, Cohere)
- [ ] AI summaries per page
- [ ] Notion / Airtable export
- [ ] Monitoring & scheduled re-crawls
- [ ] Custom extraction rules

---

## Project Status

| Phase | Status |
|-------|--------|
| Setup & Scaffolding | ✅ Complete |
| Input Handling | ✅ Complete |
| Crawler Implementation | ✅ Complete |
| Content Extraction | ✅ Complete |
| Markdown Conversion | ✅ Complete |
| RAG Chunking | ✅ Complete |
| Output Formatting | ✅ Complete |
| Actor Integration | ✅ Complete |
| Testing & QA | ✅ Complete |
| Deployment | ⏳ Pending |

**Current:** 9/10 phases complete (90%)

### Recent Fixes (v1.2.0)

| Feature | Description |
|---------|-------------|
| SPA Auto-Detection | Automatic Playwright mode for Stripe, GitHub, Vercel, MDN docs |
| `usePlaywright` Option | Explicit control over browser mode |
| Two-Phase Crawling | Cheerio first, Playwright fallback on poor extraction |
| Code Block Handling | Proper extraction of tokenized/highlighted code |
| Content Quality Validation | Token count, fragmentation, and navigation detection |
| Documentation Site Support | Platform-specific selectors for Stripe, GitHub, Vercel, MDN |

### v1.1.0

| Issue | Fix |
|-------|-----|
| Nested list data loss (75%) | Custom Turndown rule for recursive list handling |
| Q&A context loss | Multi-selector strategy with Q&A page detection |
| Footer noise (References) | Position-aware noise removal patterns |

---

## Feedback

This project is built to solve real AI workflows. Feedback and feature requests from developers are welcome!

---

## License

ISC