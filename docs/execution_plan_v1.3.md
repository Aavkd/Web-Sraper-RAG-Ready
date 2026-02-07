# Execution Plan v1.3: Three Issue Fixes

## Executive Summary

This document provides a step-by-step execution plan to address three issues identified in the test results report:

1. **Code Block Language Detection** - Improve language tag detection from HTML classes
2. **Base64/Data URI Image Noise** - Filter out long data URIs that waste tokens
3. **News Site Expectation** - Update README to set proper user expectations

**Estimated Total Effort:** 4-6 hours  
**Risk Level:** Low (all changes are additive/polish, no core architecture changes)

---

## Issue #1: Code Block Language Detection

### Problem Statement

Code blocks often default to ` ```text ` even when the source HTML contains explicit language class names like `class="language-js"` or `class="brush: python"`.

**Current Behavior:**
- The `interactiveCodeBlocks` Turndown rule in [markdown.ts](../src/processing/markdown.ts) only matches limited patterns
- The `detectLanguageFromClasses()` function in [language-detector.ts](../src/processing/language-detector.ts) is not being called during HTML→Markdown conversion
- Fallback `detectLanguageFromContent()` is used but is heuristic-based and less accurate

**User Impact:**
- Developers feeding docs to coding assistants lose language context
- LLMs may misinterpret code snippets without proper language tags
- Quality perception of the extraction is reduced

### Solution Approach

Enhance the language detection flow to:
1. Extract language from HTML `class` attributes at conversion time
2. Check both `<pre>` and `<code>` elements for language classes
3. Support additional syntax highlighter patterns beyond Prism.js/Shiki

---

### Task 1.1: Extend Language Class Patterns

**File to Modify:** [src/processing/language-detector.ts](../src/processing/language-detector.ts)

**Purpose:** Add more language class patterns commonly found in documentation sites.

**Changes Required:**

Add the following patterns to `LANGUAGE_CLASS_PATTERNS`:

```typescript
// Add to LANGUAGE_CLASS_PATTERNS array:
[/brush:\s*(\w+)/i, '$1'],           // SyntaxHighlighter: brush: python
[/crayon-(\w+)/i, '$1'],              // Crayon syntax highlighter
[/code-(\w+)/i, '$1'],                // Generic code-{lang}
[/language_(\w+)/i, '$1'],            // Underscore variant: language_python
[/^(\w+)$/i, '$1'],                   // Standalone language name as class
[/\b(dockerfile|makefile|nginx|apache|vim|markdown|md)\b/i, '$1'], // Config languages
[/\b(terraform|hcl|toml)\b/i, '$1'],  // DevOps languages
[/\b(graphql|gql)\b/i, 'graphql'],    // GraphQL
[/\b(powershell|pwsh|ps1)\b/i, 'powershell'], // PowerShell variants
[/\b(plaintext|plain|text)\b/i, 'text'], // Explicit text markers
```

**Acceptance Criteria:**
- Patterns match SyntaxHighlighter `brush:` format
- Patterns match config file languages (Dockerfile, Makefile, etc.)
- Patterns preserve explicit `text`/`plaintext` markers

---

### Task 1.2: Improve Turndown Code Block Rule

**File to Modify:** [src/processing/markdown.ts](../src/processing/markdown.ts)

**Purpose:** Update the `interactiveCodeBlocks` Turndown rule to perform comprehensive language detection.

**Current Code Location:** Lines ~185-230 (the `interactiveCodeBlocks` rule)

**Changes Required:**

1. Import `detectLanguageFromClasses` from language-detector:
   ```typescript
   import { improveCodeBlocks, detectLanguageFromClasses } from './language-detector.js';
   ```

2. Update the replacement function in `interactiveCodeBlocks` rule to:
   - Check `class` attribute on `<pre>`, `<code>`, and parent elements
   - Call `detectLanguageFromClasses()` for comprehensive pattern matching
   - Fallback to content-based detection only if class-based fails

**Updated Replacement Logic (pseudocode):**
```typescript
replacement: (_content, node) => {
  const element = node as HTMLElement;
  const text = element.textContent?.trim() || '';
  if (!text) return '';

  // 1. Try element's own class
  let lang = detectLanguageFromClasses(element.getAttribute('class') || '');
  
  // 2. Try child <code> element class
  if (!lang) {
    const codeEl = element.querySelector('code');
    if (codeEl) {
      lang = detectLanguageFromClasses(codeEl.getAttribute('class') || '');
    }
  }
  
  // 3. Try parent element class (for nested structures)
  if (!lang && element.parentElement) {
    lang = detectLanguageFromClasses(element.parentElement.getAttribute('class') || '');
  }
  
  // 4. Fallback to content detection
  if (!lang || lang === 'text') {
    lang = detectLanguageFromContent(text);
  }
  
  return `\n\`\`\`${lang}\n${text}\n\`\`\`\n`;
}
```

**Acceptance Criteria:**
- Language is detected from `<pre class="language-python">` 
- Language is detected from `<code class="language-js">`
- Language is detected from `<pre class="brush: ruby">`
- Fallback to content detection when no class found

---

### Task 1.3: Handle Standard `<pre><code>` Blocks

**File to Modify:** [src/processing/markdown.ts](../src/processing/markdown.ts)

**Purpose:** Add or update a dedicated Turndown rule for standard `<pre><code>` elements that don't match the interactive pattern.

**Rationale:** The `interactiveCodeBlocks` rule filters for tokenized/highlighted code. Plain `<pre><code class="language-python">` blocks may bypass it.

**Changes Required:**

Add a new Turndown rule (or modify existing) specifically for standard code blocks:

```typescript
// Add after interactiveCodeBlocks rule:
turndown.addRule('fencedCodeBlockWithLanguage', {
  filter: (node) => {
    return node.nodeName === 'PRE' && 
           node.firstChild?.nodeName === 'CODE' &&
           !hasTokenizedSpans(node); // Skip if already handled
  },
  replacement: (_content, node) => {
    const pre = node as HTMLElement;
    const code = pre.querySelector('code');
    const text = code?.textContent?.trim() || pre.textContent?.trim() || '';
    if (!text) return '';
    
    // Try to get language from either element
    let lang = detectLanguageFromClasses(code?.getAttribute('class') || '') ||
               detectLanguageFromClasses(pre.getAttribute('class') || '') ||
               detectLanguageFromContent(text);
    
    return `\n\`\`\`${lang}\n${text}\n\`\`\`\n`;
  }
});
```

**Helper Function to Add:**
```typescript
function hasTokenizedSpans(node: Node): boolean {
  const element = node as HTMLElement;
  const spans = element.querySelectorAll('span');
  return spans.length > 3; // Threshold for "tokenized"
}
```

**Acceptance Criteria:**
- Standard `<pre><code class="language-sql">` gets proper language tag
- Rule doesn't conflict with `interactiveCodeBlocks`

---

### Task 1.4: Add Unit Tests for Language Detection

**File to Create:** Update [tests/unit/codeblock.test.ts](../tests/unit/codeblock.test.ts)

**Purpose:** Add comprehensive test cases for the improved language detection.

**Test Cases to Add:**

```typescript
describe('Language Detection from Classes', () => {
  it('should detect language from brush: syntax', () => {
    const html = '<pre class="brush: python"><code>print("hello")</code></pre>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('```python');
  });

  it('should detect language from nested code element', () => {
    const html = '<pre><code class="language-ruby">puts "hello"</code></pre>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('```ruby');
  });

  it('should detect language from parent pre element', () => {
    const html = '<pre class="language-go"><code>fmt.Println("hello")</code></pre>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('```go');
  });

  it('should fallback to content detection when no class', () => {
    const html = '<pre><code>SELECT * FROM users;</code></pre>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('```sql');
  });

  it('should handle DevOps/config languages', () => {
    const html = '<pre class="language-dockerfile"><code>FROM node:18</code></pre>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('```dockerfile');
  });

  it('should handle GraphQL', () => {
    const html = '<pre class="lang-graphql"><code>query { user { name } }</code></pre>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('```graphql');
  });
});
```

**Run Command:** `npm run test:unit -- -t "Language Detection"`

---

### Task 1.5: Integration Validation

**Purpose:** Manually verify the fix works on real documentation sites.

**Validation Steps:**

1. Build the project: `npm run build`
2. Run against Stripe docs (known to have language-specific code):
   ```json
   {
     "startUrl": "https://docs.stripe.com/api/charges",
     "maxPages": 1,
     "usePlaywright": true
   }
   ```
3. Verify output code blocks have proper language tags (not `text`)
4. Repeat for a Python documentation site (e.g., FastAPI docs)

**Expected Outcome:**
- `curl` examples tagged as `bash`
- JSON responses tagged as `json`
- Language-specific examples properly tagged

---

## Issue #2: Base64/Data URI Image Noise

### Problem Statement

The GitHub test output showed long base64 image strings (data URIs) cluttering the markdown output.

**Current Behavior (from [markdown.ts](../src/processing/markdown.ts#L320)):**
```typescript
if (src.startsWith('data:') || src.includes('pixel') || src.includes('tracking')) {
  return '';
}
```

**Issue:** This removes ALL data URIs, but:
1. Short data URIs (small icons) might be useful
2. The check isn't distinguishing length - even if it passes, long URLs still appear

**User Impact:**
- Token waste on unusable image data
- LLM confusion from long base64 strings
- Output clutter in markdown files

### Solution Approach

Modify the image handling rule to:
1. Filter data URIs by length (>100 chars = remove)
2. Optionally remove excessively long regular URLs (>500 chars)

---

### Task 2.1: Update Image Filtering Logic

**File to Modify:** [src/processing/markdown.ts](../src/processing/markdown.ts)

**Location:** The `images` Turndown rule (lines ~307-325)

**Current Code:**
```typescript
turndown.addRule('images', {
  filter: 'img',
  replacement: (_content, node) => {
    const element = node as HTMLElement;
    const alt = element.getAttribute('alt')?.trim() || '';
    const src = element.getAttribute('src') || '';

    // Skip tracking pixels and decorative images
    if (!alt || alt.length < 3) {
      return '';
    }

    // Skip data URLs and tracking pixels
    if (src.startsWith('data:') || src.includes('pixel') || src.includes('tracking')) {
      return '';
    }

    return `![${alt}](${src})`;
  },
});
```

**Changes Required:**

Replace with enhanced logic:

```typescript
// Constants for image filtering
const MAX_DATA_URI_LENGTH = 100;    // ~100 chars for small inline SVG icons
const MAX_IMAGE_URL_LENGTH = 500;   // Reasonable max for CDN URLs

turndown.addRule('images', {
  filter: 'img',
  replacement: (_content, node) => {
    const element = node as HTMLElement;
    const alt = element.getAttribute('alt')?.trim() || '';
    const src = element.getAttribute('src') || '';

    // Skip tracking pixels and decorative images (no alt text)
    if (!alt || alt.length < 3) {
      return '';
    }

    // Skip tracking pixels by URL pattern
    if (src.includes('pixel') || src.includes('tracking') || src.includes('beacon')) {
      return '';
    }

    // Skip long data URIs (base64 encoded images waste tokens)
    if (src.startsWith('data:') && src.length > MAX_DATA_URI_LENGTH) {
      return ''; // Remove entirely - alt text alone isn't useful for data URIs
    }

    // Skip excessively long URLs (CDN URLs with many params)
    if (src.length > MAX_IMAGE_URL_LENGTH) {
      // For long URLs, keep just the alt text as a reference
      return `[Image: ${alt}]`;
    }

    return `![${alt}](${src})`;
  },
});
```

**Acceptance Criteria:**
- Data URIs > 100 chars are stripped completely
- Regular URLs > 500 chars are converted to `[Image: alt text]`
- Short data URIs (small SVG icons) are preserved
- Normal-length image URLs are preserved with markdown syntax

---

### Task 2.2: Add Unit Tests for Image Filtering

**File to Modify:** [tests/unit/extraction.test.ts](../tests/unit/extraction.test.ts) or create new file

**Purpose:** Test the updated image filtering logic.

**Test Cases to Add:**

```typescript
describe('Image Filtering', () => {
  it('should remove long base64 data URIs', () => {
    const longBase64 = 'data:image/png;base64,' + 'A'.repeat(200);
    const html = `<p><img alt="Badge Image" src="${longBase64}"></p>`;
    const result = htmlToMarkdown(html);
    expect(result).not.toContain('data:image');
    expect(result).not.toContain('AAAA');
  });

  it('should preserve short data URIs (small SVG icons)', () => {
    const shortDataUri = 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='; // ~40 chars
    const html = `<p><img alt="Icon" src="${shortDataUri}"></p>`;
    const result = htmlToMarkdown(html);
    expect(result).toContain('![Icon]');
  });

  it('should handle excessively long CDN URLs', () => {
    const longUrl = 'https://cdn.example.com/image.png?' + 'param=value&'.repeat(50);
    const html = `<p><img alt="Product Photo" src="${longUrl}"></p>`;
    const result = htmlToMarkdown(html);
    // Should convert to text reference instead of keeping long URL
    expect(result).toContain('[Image: Product Photo]');
    expect(result).not.toContain(longUrl);
  });

  it('should preserve normal image URLs', () => {
    const html = '<p><img alt="Logo" src="https://example.com/logo.png"></p>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('![Logo](https://example.com/logo.png)');
  });

  it('should remove tracking pixels', () => {
    const html = '<p><img alt="Pixel" src="https://track.example.com/pixel.gif"></p>';
    const result = htmlToMarkdown(html);
    expect(result).not.toContain('track.example.com');
  });
});
```

**Run Command:** `npm run test:unit -- -t "Image Filtering"`

---

### Task 2.3: Integration Validation

**Purpose:** Verify fix on GitHub repo pages with badge images.

**Validation Steps:**

1. Build: `npm run build`
2. Run against GitHub repo with badges:
   ```json
   {
     "startUrl": "https://github.com/apify/crawlee",
     "maxPages": 1
   }
   ```
3. Inspect output for:
   - No long base64 strings
   - Badge images either removed or converted to text references
   - README content preserved

**Expected Outcome:**
- Output is clean with no data URI noise
- Token count is reduced compared to before

---

## Issue #3: News Site Expectation (README Update)

### Problem Statement

The TechCrunch test failed due to bot protection. Users may have unrealistic expectations about what sites can be crawled.

**Current README Section (lines 334-342):**
```markdown
## Important Limitations

- Designed for **content-rich websites** (docs, blogs, marketing sites)
- Does NOT attempt aggressive Cloudflare bypass
- Fails fast on blocked or unsuitable pages (to save credits)
- JavaScript-heavy SPAs are auto-detected and handled with Playwright
```

**User Impact:**
- Users may try to crawl nytimes.com, wsj.com, etc. and leave bad reviews
- Unclear guidance on what proxy configuration would help

### Solution Approach

Expand the limitations section to:
1. Explicitly call out news/social media sites
2. Suggest proxy configuration as an option
3. Provide examples of unsuitable sites

---

### Task 3.1: Update README Limitations Section

**File to Modify:** [README.md](../README.md)

**Location:** Lines 334-342 (Important Limitations section)

**Changes Required:**

Replace the current section with an expanded version:

```markdown
## Important Limitations

This tool is optimized for **content-rich, text-heavy websites** that don't employ aggressive anti-bot measures.

### Best Results With
- ✅ Documentation sites (Stripe, MDN, ReadTheDocs)
- ✅ Technical blogs and articles
- ✅ Wikipedia and wiki-style sites
- ✅ Q&A platforms (Stack Overflow, Discourse forums)
- ✅ Marketing sites and landing pages
- ✅ GitHub README pages

### Not Recommended For
- ❌ **Major news outlets** (NYTimes, TechCrunch, WSJ, BBC) — heavy anti-bot protection
- ❌ **Social media platforms** (Twitter/X, Facebook, LinkedIn) — authentication required
- ❌ **Sites behind paywalls** — content not accessible without login
- ❌ **E-commerce product listings** — minimal text content, mostly images/prices
- ❌ **Dynamic feeds/index pages** — content changes frequently, minimal article content

### Anti-Bot Protection

This actor does **NOT** attempt aggressive Cloudflare bypass or CAPTCHA solving. If a site blocks the request:
- The actor fails fast to save your credits
- You'll see 0 pages extracted in the summary

**For sites with moderate protection**, you may try:
- Setting `"usePlaywright": true` to use a real browser
- Using the Apify proxy configuration (requires Apify subscription)

### Design Philosophy

These limitations are intentional. The goal is **predictable, high-quality extraction** for content-rich sites rather than universal coverage. If your target site is heavily protected, consider:
- Apify's specialized news scrapers
- Custom proxy rotation solutions
- Sites that offer official APIs or RSS feeds
```

**Acceptance Criteria:**
- Users clearly understand which sites work well
- Explicit callout for news sites and social media
- Suggestions for alternatives
- No false promises about Cloudflare bypass

---

### Task 3.2: Update Test Results Documentation

**File to Modify:** [docs/test_results_report.md](../docs/test_results_report.md)

**Purpose:** Add a note to the TechCrunch failure explaining this is expected behavior.

**Location:** The "❌ 06. News Site (TechCrunch)" section

**Changes Required:**

Add an informational callout after the "Root Cause" paragraph:

```markdown
> ℹ️ **Expected Behavior:** This failure is by design. The actor prioritizes predictable 
> results over universal coverage. For news sites with heavy bot protection, users should 
> consider Apify's specialized news scrapers or custom proxy configurations.
```

**Acceptance Criteria:**
- Test report clearly marks this as expected, not a bug

---

### Task 3.3: Add INPUT_SCHEMA Tooltip (Optional Enhancement)

**File to Modify:** [INPUT_SCHEMA.json](../INPUT_SCHEMA.json)

**Purpose:** Add a tooltip/description that warns about site compatibility.

**Location:** Near the `startUrl` field description

**Changes Required:**

Update the `startUrl` description to include:

```json
{
  "title": "Start URL",
  "type": "string",
  "description": "The URL to start crawling from. Works best with documentation sites, blogs, and wikis. Note: Major news outlets and social media sites with anti-bot protection may not work without custom proxy configuration.",
  "editor": "textfield"
}
```

**Acceptance Criteria:**
- Users see the warning in Apify UI before running
- Sets expectations before they spend credits

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                        Issue #1: Language Detection             │
├─────────────────────────────────────────────────────────────────┤
│  Task 1.1 ──► Task 1.2 ──► Task 1.3 ──► Task 1.4 ──► Task 1.5  │
│  (patterns)   (turndown)   (standard)   (tests)      (validate) │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Issue #2: Image Filtering                │
├─────────────────────────────────────────────────────────────────┤
│  Task 2.1 ────────────────► Task 2.2 ────────────► Task 2.3     │
│  (update rule)              (unit tests)            (validate)  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Issue #3: README Update                  │
├─────────────────────────────────────────────────────────────────┤
│  Task 3.1 (README) ──► Task 3.2 (test report) ──► Task 3.3      │
│                                                    (optional)    │
└─────────────────────────────────────────────────────────────────┘
```

**Parallel Execution:**
- Issues #1, #2, and #3 can be worked on in parallel (no dependencies)
- Within each issue, tasks must be sequential

---

## Validation Checklist

### Pre-Merge Checklist

- [x] All existing tests pass: `npm test`
- [x] New tests for language detection pass
- [x] New tests for image filtering pass
- [x] Lint passes: `npm run lint`
- [x] Build succeeds: `npm run build`
- [x] Manual validation on Stripe docs (language detection)
- [x] Manual validation on GitHub repo (image filtering)
- [ ] README changes reviewed for clarity

### Post-Merge Validation

- [ ] Deploy to Apify staging
- [ ] Run test suite against 10 test scenarios
- [ ] Verify token counts are reasonable (no base64 bloat)
- [ ] Verify code blocks have proper language tags
- [ ] Confirm TechCrunch still fails fast (expected behavior)

---

## Summary of Files to Modify

| File | Change Type | Issue |
|------|-------------|-------|
| `src/processing/language-detector.ts` | Modify | #1 |
| `src/processing/markdown.ts` | Modify | #1, #2 |
| `tests/unit/codeblock.test.ts` | Modify | #1 |
| `tests/unit/extraction.test.ts` | Modify | #2 |
| `README.md` | Modify | #3 |
| `docs/test_results_report.md` | Modify | #3 |
| `INPUT_SCHEMA.json` | Modify (optional) | #3 |

---

## Estimated Effort

| Issue | Effort | Complexity |
|-------|--------|------------|
| #1 Language Detection | 2-3 hours | Medium |
| #2 Image Filtering | 1-2 hours | Low |
| #3 README Update | 30 mins | Low |
| **Total** | **4-6 hours** | **Low-Medium** |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Language detection regex too greedy | Low | Medium | Comprehensive test cases |
| Image filtering removes wanted images | Low | Low | Conservative length thresholds |
| README changes don't reduce support tickets | Medium | Low | Clear, specific examples |
| Existing tests break | Low | Medium | Run full test suite before merge |

All changes are additive polish items with no core architecture modifications, making this a low-risk enhancement release.
