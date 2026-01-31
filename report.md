# 📊 Evaluation Report

**Actor:** Website → LLM-Ready Knowledge Extractor
**Version tested:** v1.1.0 (as implied by README)
**Test date:** 2026-01-29
**Evaluator:** Independent QA / Product Review
**Objective:** Validate whether the actor’s real outputs match its advertised positioning, claims, and commercial promise.

---

## 1. Executive Summary

The actor demonstrates **solid crawling and basic content extraction**, but **fails to meet several critical promises** made in its README—particularly around:

* Token efficiency
* LLM-ready formatting (especially code blocks)
* Q&A page handling
* Fail-fast logic for unsuitable pages

In its current state, the actor is **not production-ready for serious RAG or embedding pipelines**, despite strong architectural foundations.

**Overall Grade:** **C- / D+**
**Commercial Readiness:** **Low–Medium (with high upside if fixed)**

---

## 2. Test Scope & Methodology

### Tests Executed

| Test   | Target Site                | Purpose                        |
| ------ | -------------------------- | ------------------------------ |
| Test 2 | Notion SaaS Marketing Page | Boilerplate & token efficiency |
| Test 4 | Discourse Q&A Forum        | Claimed Q&A extraction         |
| Test 5 | Stripe Documentation       | Code + docs formatting         |

(Test 3 skipped due to invalid URL.)

### Evaluation Criteria

Each test was judged against five dimensions:

1. Extraction Quality
2. Token Efficiency
3. Structural Integrity (Markdown correctness)
4. README Claim Accuracy
5. Commercial Usability (would users pay?)

---

## 3. Detailed Findings by Test

---

## 🔎 Test 2 — SaaS Marketing Page (Notion)

### Goal

Validate boilerplate removal and usefulness of extracted content for RAG.

### Observed Behavior

**What Worked**

* Main hero and feature sections extracted
* Navigation mostly removed
* Reasonable chunk sizes
* No cookie banners or legal footers

**What Failed**

1. **Image-heavy output**

   * Large image markdown blocks preserved
   * Image alt text adds noise and token waste
   * Contradicts “token-optimized” claim

2. **Marketing fluff preserved**

   * G2 badges, testimonials, vanity metrics
   * Not meaningful knowledge for LLMs

3. **404 child page extracted**

   * `/product/ai-meeting-notes` returned a soft 404
   * Still crawled, chunked, and returned
   * Contains navigation, CTAs, and error text

### Impact

* Increases embedding cost
* Pollutes vector databases
* Breaks trust in “fails fast on unsuitable pages”

### Score

| Dimension            | Score   |
| -------------------- | ------- |
| Extraction Quality   | 3 / 5   |
| Token Efficiency     | 2 / 5   |
| README Accuracy      | 2 / 5   |
| Commercial Usability | 2.5 / 5 |

**Verdict:** ⚠️ **Partial Fail**

---

## 🔎 Test 4 — Q&A Forum (Discourse)

### Goal

Validate explicit README claim:

> “Automatic detection and extraction for Q&A sites”

### Observed Behavior

* Page resolved to a login/redirect/soft-404 variant
* Actor extracted:

  * “Popular topics”
  * Zero question content
  * Zero answers
* No semantic markers (`## Question`, `## Answer`)
* Page still counted as successfully extracted

### Critical Issues

1. **No Q&A validation**

   * No detection of missing question/answer containers
   * No fallback logic

2. **README claim not met**

   * No evidence of Q&A-specific logic functioning in real conditions

### Impact

* Direct contradiction of README
* High risk of negative reviews if users test forums
* Damages credibility of “advanced extraction” positioning

### Score

| Dimension        | Score |
| ---------------- | ----- |
| Q&A Handling     | 0 / 5 |
| README Accuracy  | 0 / 5 |
| Commercial Trust | 1 / 5 |

**Verdict:** ❌ **Fail**

---

## 🔎 Test 5 — Documentation Site (Stripe)

### Goal

Validate core use case: documentation → RAG-ready Markdown.

### Observed Behavior

**Severe formatting corruption**

* JSON response exploded into hundreds of micro code blocks
* Keys, values, punctuation split into separate fenced blocks
* Markdown is unreadable and unusable

### Root Cause (Likely)

* Turndown + Readability interaction with:

  * `<pre>`
  * `<code>`
  * Inline monospace
* No post-processing normalization for code blocks

### Impact

* Completely unusable for embeddings
* Breaks the **primary value proposition**
* Stripe-like docs are a top ICP use case

### Score

| Dimension            | Score |
| -------------------- | ----- |
| Extraction Quality   | 1 / 5 |
| Structural Integrity | 0 / 5 |
| Token Efficiency     | 1 / 5 |
| Commercial Usability | 0 / 5 |

**Verdict:** ❌ **Fail**

---

## 4. README vs Reality Gap Analysis

| README Claim                     | Reality                         |
| -------------------------------- | ------------------------------- |
| “Token-optimized”                | ❌ Images + fluff inflate tokens |
| “LLM-ready Markdown”             | ❌ Code blocks broken            |
| “Fails fast on unsuitable pages” | ❌ 404s extracted                |
| “Q&A page support”               | ❌ Not demonstrated              |
| “Ready for RAG pipelines”        | ⚠️ Only partially true          |

---

## 5. Commercial Readiness Assessment

### Current State

* ❌ Not safe for paid RAG workflows
* ❌ High churn risk for technical users
* ⚠️ Acceptable for internal tooling or experiments

### Would users pay today?

* Docs ingestion → **No**
* SaaS knowledge scraping → **Maybe**
* Pro developers → **No**

---

## 6. High-Impact Fixes (Prioritized)

### 🔴 Critical (Must Fix)

1. **Code block normalization**

   * Merge fragmented `<code>` and `<pre>` into single fenced blocks
   * Detect JSON/YAML automatically

2. **Fail-fast logic**

   * Skip pages when:

     * Soft 404 detected
     * Title contains “Oops”, “Not found”, “Sorry”
     * Content < minimum token threshold

3. **Strict Q&A validation**

   * Only extract if both question + ≥1 answer detected
   * Otherwise skip and log

---

### 🟡 High ROI Improvements

4. **Image handling**

   * Default: strip images
   * Optional: replace with short textual summaries

5. **Marketing noise filter**

   * Remove badges, testimonials, vanity metrics
   * Improves RAG relevance drastically

---

## 7. Final Verdict

This actor has:

* ✅ Good architecture
* ✅ Sensible crawl controls
* ❌ Overstated marketing
* ❌ Critical formatting flaws

With **2–3 focused iterations**, it could become a **top-tier Apify actor**.
In its current form, it should **not be sold as “RAG-ready” without caveats**.