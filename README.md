# RAG Web Scraper: Website to Markdown

**Turn any website into clean, token-efficient Markdown ready for RAG and LLM pipelines.**

![Clean Markdown vs Raw HTML](https://raw.githubusercontent.com/apify/actor-scraper/master/docs/img/before-after.png)

Most web scrapers return raw HTML soup or noisy text — LLMs don't need that. This project acts as a specialized filter that extracts only the meaningful content, removes boilerplate, and outputs LLM-ready Markdown plus structured JSON you can plug directly into your AI workflows (LangChain, LlamaIndex, Pinecone, etc.).

---

## ⚡ Key Features

| Feature | Description |
| :--- | :--- |
| **🧼 Clean Markdown** | Removes navs, footers, ads, and cookie banners automatically. |
| **🧠 RAG Chunking** | Splits content into token-sized chunks (default: 600) for Vector DBs. |
| **🐢/⚡ Hybrid Mode** | Starts fast (Cheerio). Auto-switches to Playwright if it detects a React/Next.js SPA. |
| **💡 Q&A Optimized** | Preserves context on StackOverflow/Discourse style pages (Question + Answer). |
| **💰 Predictable Cost** | Fixed price per page ($2.00/1k). No complex Compute Unit math. |

---

## 📉 The "Before & After" Test

Don't feed garbage to your AI. See the difference:

### 🔴 Standard Crawl (Raw HTML)
*Contains ~50% noise: menus, scripts, footers.*
```html
<nav>Home > Docs > API</nav>
<div class="cookie-banner">We use cookies! [Accept]</div>
<main>
  <h1>React Hooks Guide</h1>
  <div class="sidebar">Join our Discord!</div>
  <p>Hooks are a new addition in React 16.8.</p>
  <div class="ad-container">BUY COFFEE NOW</div>
</main>
<footer>© 2026 Meta Platforms, Inc.</footer>
```
**Result:** High token costs, potential hallucinations.

### 🟢 RAG Web Scraper (Markdown)
*Contains 100% signal.*

```markdown
# Getting Started with Crawlee

## Installation

Install Crawlee using npm:

npm install crawlee

## Basic Usage

Create a simple crawler in just a few lines of code...
```

**Result:** Cheap embedding, accurate answers.

---

## 💰 Pricing: Pay for Value, Not Time
**$2.00 per 1,000 pages** (Pay per usage)

Unlike other scrapers that charge by "Compute Units" (RAM x Time), we charge a fixed rate per page.
*   **Slow website?** You pay the same.
*   **Heavy JavaScript?** You pay the same.
*   **No monthly commitment.**

---

## 🚀 Usage

### 1. Simple Run
Perfect for testing or small docs.
```json
{
  "startUrl": "https://docs.python.org/3/",
  "maxPages": 20
}
```

### 2. Advanced Run (RAG Pipeline)
Optimized for Vector Databases.
```json
{
  "startUrl": "https://react.dev",
  "maxPages": 100,
  "includePaths": ["/learn/*"],
  "excludePaths": ["/community/*"],
  "chunkSize": 500,
  "outputFormat": "json",
  "enableChunking": true
}
```

---

## 🛠️ Technical Details

### Smart Hybrid Crawling
We don't waste resources. The scraper starts in **Fast Mode** (Cheerio). If it detects a Single Page Application (React, Vue, Next.js), it automatically upgrades to **Browser Mode** (Playwright) to render the content correctly. You get the best of both worlds: speed when possible, power when needed.

### Q&A Intelligence
Most scrapers flatten forums into a wall of text. We detect Q&A structures (StackOverflow, Discourse) and preserve the relationship between the Question and the Accepted Answer, ensuring your RAG system understands the context.

### Noise Removal
We aggressively strip:
*   Navigation bars & Mega-menus
*   Footers & Legal disclaimers
*   Cookie consent banners & Popups
*   "Related Posts" widgets
*   Academic References/Bibliographies

---

## 📤 Output Formats

### JSON (Recommended for RAG)
Returns an array of objects with metadata and chunks.
```json
{
  "url": "https://example.com",
  "title": "Page Title",
  "markdown": "# Page Title\n\nContent...",
  "chunks": [
    { "content": "Chunk 1...", "tokens": 450 },
    { "content": "Chunk 2...", "tokens": 300 }
  ]
}
```

### Markdown
Returns a single Markdown file per page (or combined), perfect for archiving or direct LLM context.

---

## 🙋 FAQ

**Q: Does it work on sites behind login?**
A: Currently designed for public documentation and content sites.

**Q: How do you count pages?**
A: Only successfully scraped pages count. If a page fails or is skipped, you aren't charged.

**Q: Can I use this with LangChain?**
A: Yes! The JSON output is designed to be directly loaded into LangChain's `ApifyDatasetLoader`.
