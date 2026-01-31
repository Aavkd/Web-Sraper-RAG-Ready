# Remediation Plan: Wikipedia Footer Noise (Citation Artifacts)

**Status:** 🟡 Pending Execution  
**Target Date:** January 29, 2026  
**Objective:** Eliminate remaining footnote artifacts (specifically `**^**` citation back-links) from scraped content.

## Context
Previous fixes successfully handled Reference/Bibliography headers, but specific citation lines remain. These lines often start with `**^**` (bold caret) and include citation text, consuming token budget without adding value.

**Example Noise:**
> **^** See, for example, the Feynman Lectures....

## Execution Steps

### Step 1: Create Reproduction Test Case
**Goal:** Confirm the issue and verify the fix with a targeted unit test.

1.  **Create File:** `tests/unit/noise_repro.test.ts`
2.  **Content:**
    *   Import `removeNoiseSections` or `htmlToMarkdown` from `../../src/processing/markdown.js`.
    *   Test case: "Should remove Wikipedia citation back-links".
    *   Input: A markdown string containing the noisy line.
    *   Expected Output: The noisy line should be stripped.

```typescript
// tests/unit/noise_repro.test.ts
import { describe, it, expect } from 'vitest';
import { removeNoiseSections } from '../../src/processing/markdown.js';

describe('Noise Removal Remediation', () => {
  it('should remove Wikipedia citation back-link lines starting with **^**', () => {
    const input = `
# Valid Content
This is valid text.

**^** See, for example, the Feynman Lectures on Physics.
^ Another citation style.

More valid text.
    `.trim();

    const result = removeNoiseSections(input);
    
    expect(result).not.toContain('**^**');
    expect(result).not.toContain('Feynman Lectures');
    expect(result).not.toContain('^ Another citation');
    expect(result).toContain('Valid Content');
  });
});
```

### Step 2: Implement Fix in Noise Processor
**Goal:** Add specific patterns to catch these citation formats.

1.  **Modify File:** `src/processing/markdown.ts`
2.  **Locate:** `LINE_NOISE_PATTERNS` array (around line 66).
3.  **Action:** Add regex patterns to match the specific artifacts identified.

**Add these patterns:**
```typescript
  // Citation back-links (Wikipedia style) - Task 4
  /^\*\*\^\*\*/,       // Starts with bold caret (**^**)
  /^\^\s+/,            // Starts with caret and space (^ ...)
```

4.  **Verify Context:** Ensure these are added to `LINE_NOISE_PATTERNS` so they apply to individual lines even if the section header wasn't caught.

### Step 3: Verify and Validate
**Goal:** Ensure the fix works and doesn't introduce regressions.

1.  **Run Reproduction Test:**
    ```bash
    npx vitest tests/unit/noise_repro.test.ts
    ```
    *   **Success:** Test passes.

2.  **Run Full Suite (Regression Check):**
    ```bash
    npm test
    ```
    *   **Success:** All existing 129 tests pass.

## Dependencies
*   None. This is a standalone patch to the text processing logic.

## Expected Outcome
*   Lines starting with `**^**` will be completely removed.
*   Token count for Wikipedia-like pages will decrease further.
*   Clean "Partial Fix" status to "Resolved".
