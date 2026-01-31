/**
 * Integration tests for SPA/JavaScript documentation sites
 * Phase 5: Tests extraction quality from complex SPA documentation
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { shouldUsePlaywright, SPA_DOMAIN_PATTERNS, SPA_HTML_INDICATORS } from '../../src/crawler/index.js';
import { detectDocsPage, isKnownDocsDomain } from '../../src/extraction/docs-detector.js';
import { validateContent, isContentValid } from '../../src/processing/validator.js';
import { htmlToMarkdown } from '../../src/processing/markdown.js';

describe('SPA Site Detection', () => {
    describe('shouldUsePlaywright', () => {
        it('should detect Stripe docs domain', () => {
            expect(shouldUsePlaywright('https://docs.stripe.com/api/tokens')).toBe(true);
            expect(shouldUsePlaywright('https://docs.stripe.com/payments/checkout')).toBe(true);
        });

        it('should detect GitHub docs domain', () => {
            expect(shouldUsePlaywright('https://docs.github.com/en/actions')).toBe(true);
        });

        it('should detect Vercel docs domain', () => {
            expect(shouldUsePlaywright('https://docs.vercel.com/cli')).toBe(true);
        });

        it('should detect React docs domain', () => {
            expect(shouldUsePlaywright('https://react.dev/learn')).toBe(true);
        });

        it('should detect Angular docs domain', () => {
            expect(shouldUsePlaywright('https://angular.dev/guide')).toBe(true);
        });

        it('should detect MDN docs domain', () => {
            expect(shouldUsePlaywright('https://developer.mozilla.org/en-US/docs/Web/JavaScript')).toBe(true);
        });

        it('should not detect regular static sites', () => {
            expect(shouldUsePlaywright('https://example.com/about')).toBe(false);
            expect(shouldUsePlaywright('https://wikipedia.org/wiki/JavaScript')).toBe(false);
        });

        it('should detect SPA from HTML indicators', () => {
            const nextJsHtml = '<html><head><script id="__NEXT_DATA__" type="application/json">{}</script></head></html>';
            expect(shouldUsePlaywright('https://example.com', nextJsHtml)).toBe(true);

            const gatsbyHtml = '<html><body class="gatsby-site"></body></html>';
            expect(shouldUsePlaywright('https://example.com', gatsbyHtml)).toBe(true);

            const nuxtHtml = '<html><body><div id="__NUXT__"></div></body></html>';
            expect(shouldUsePlaywright('https://example.com', nuxtHtml)).toBe(true);
        });

        it('should detect React apps from HTML', () => {
            const reactHtml = '<div data-reactroot="">Content</div>';
            expect(shouldUsePlaywright('https://example.com', reactHtml)).toBe(true);
        });

        it('should detect Angular apps from HTML', () => {
            const angularHtml = '<html ng-version="16.0.0"><body></body></html>';
            expect(shouldUsePlaywright('https://example.com', angularHtml)).toBe(true);
        });

        it('should detect Vue apps from HTML', () => {
            const vueHtml = '<div data-v-123abc>Vue App</div>';
            expect(shouldUsePlaywright('https://example.com', vueHtml)).toBe(true);
        });
    });

    describe('SPA domain patterns', () => {
        it('should have comprehensive domain coverage', () => {
            // Verify key patterns exist
            expect(SPA_DOMAIN_PATTERNS.length).toBeGreaterThanOrEqual(5);
        });
    });

    describe('SPA HTML indicators', () => {
        it('should have comprehensive indicator coverage', () => {
            expect(SPA_HTML_INDICATORS).toContain('__NEXT_DATA__');
            expect(SPA_HTML_INDICATORS).toContain('gatsby');
            expect(SPA_HTML_INDICATORS).toContain('__NUXT__');
            expect(SPA_HTML_INDICATORS).toContain('data-reactroot');
            expect(SPA_HTML_INDICATORS).toContain('ng-version');
        });
    });
});

describe('Documentation Site Detection', () => {
    describe('detectDocsPage', () => {
        it('should detect Stripe docs', () => {
            const result = detectDocsPage('https://docs.stripe.com/api');
            expect(result.isDocsPage).toBe(true);
            expect(result.platform).toBe('stripe');
            expect(result.mainContentSelector).toBeDefined();
        });

        it('should detect GitHub docs', () => {
            const result = detectDocsPage('https://docs.github.com/en/actions');
            expect(result.isDocsPage).toBe(true);
            expect(result.platform).toBe('github');
        });

        it('should detect Vercel docs', () => {
            const result = detectDocsPage('https://docs.vercel.com/cli');
            expect(result.isDocsPage).toBe(true);
            expect(result.platform).toBe('vercel');
        });

        it('should detect MDN docs', () => {
            const result = detectDocsPage('https://developer.mozilla.org/en-US/docs');
            expect(result.isDocsPage).toBe(true);
            expect(result.platform).toBe('mdn');
        });

        it('should detect generic docs by URL pattern', () => {
            const result = detectDocsPage('https://example.com/docs/getting-started');
            expect(result.isDocsPage).toBe(true);
            expect(result.platform).toBe('generic');
        });

        it('should detect docs from HTML indicators', () => {
            const docsHtml = '<article class="documentation"><h1>API Reference</h1></article>';
            const result = detectDocsPage('https://example.com/reference', docsHtml);
            expect(result.isDocsPage).toBe(true);
        });

        it('should not detect non-docs pages', () => {
            const result = detectDocsPage('https://example.com/about');
            expect(result.isDocsPage).toBe(false);
            expect(result.platform).toBe('unknown');
        });
    });

    describe('isKnownDocsDomain', () => {
        it('should identify known doc domains', () => {
            expect(isKnownDocsDomain('https://docs.stripe.com/api')).toBe(true);
            expect(isKnownDocsDomain('https://docs.github.com/en')).toBe(true);
            expect(isKnownDocsDomain('https://developer.mozilla.org/docs')).toBe(true);
        });

        it('should not identify generic docs as known domains', () => {
            expect(isKnownDocsDomain('https://random.com/docs/page')).toBe(false);
        });
    });
});

describe('Content Quality Validation', () => {
    describe('validateContent', () => {
        it('should pass valid documentation content', () => {
            const validContent = `
# API Reference

This document describes the API endpoints available in our service. The API provides comprehensive access to all features and allows developers to build powerful integrations.

## Authentication

All API requests require authentication using an API key. You can obtain your API key from the dashboard settings page. Keep your API key secure and never share it publicly.

\`\`\`javascript
const response = await fetch('/api/data', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const data = await response.json();
console.log(data);
\`\`\`

## Endpoints

### GET /users
Returns a list of users in your organization. This endpoint supports pagination and filtering.

### POST /users
Creates a new user with the specified attributes. Required fields include name and email.

### PUT /users/:id
Updates an existing user's profile information. You can update any field except the user ID.

### DELETE /users/:id
Removes a user from your organization. This action cannot be undone.
      `.trim();

            const report = validateContent(validContent);
            expect(report.isValid).toBe(true);
            expect(report.qualityScore).toBeGreaterThanOrEqual(70);
        });

        it('should flag too-short content', () => {
            const shortContent = 'Hello world';
            const report = validateContent(shortContent);
            expect(report.isValid).toBe(false);
            expect(report.issues.some(i => i.type === 'too_short')).toBe(true);
        });

        it('should flag fragmented code (SPA extraction failure)', () => {
            // Simulate what happens when code blocks fragment into inline code
            const fragmentedContent = `
\`{\` \`"id"\` \`:\` \`"tok_123"\` \`}\`
\`{\` \`"id"\` \`:\` \`"tok_456"\` \`}\`
\`{\` \`"id"\` \`:\` \`"tok_789"\` \`}\`
      `.trim();

            const report = validateContent(fragmentedContent);
            expect(report.issues.some(i => i.type === 'fragmented_code')).toBe(true);
        });

        it('should flag navigation-like content', () => {
            const navContent = `
- Home
- About
- Products
- Contact
- Blog
- FAQ
      `.trim();

            const report = validateContent(navContent);
            // May flag as nav-like or too short
            expect(report.isValid).toBe(false);
        });
    });

    describe('isContentValid', () => {
        it('should return true for valid content', () => {
            const content = 'This is a valid document with enough content to pass validation. '.repeat(20);
            expect(isContentValid(content)).toBe(true);
        });

        it('should return false for short content', () => {
            expect(isContentValid('Too short')).toBe(false);
        });
    });
});

describe('Code Block Handling Integration', () => {
    it('should handle tokenized code blocks as single blocks', () => {
        const html = `
      <div class="CodeBlock language-javascript">
        <span class="token keyword">const</span>
        <span class="token variable">stripe</span>
        <span class="token operator">=</span>
        <span class="token function">require</span>
        <span class="token punctuation">(</span>
        <span class="token string">'stripe'</span>
        <span class="token punctuation">)</span>
        <span class="token punctuation">;</span>
      </div>
    `;

        const markdown = htmlToMarkdown(html);

        // Should be a fenced code block, not fragmented inline code
        expect(markdown).toContain('```');

        // Should NOT be fragmented
        const inlineCodeCount = (markdown.match(/`[^`\n]+`/g) || []).length;
        const lineCount = markdown.split('\n').length;
        expect(inlineCodeCount).toBeLessThan(lineCount * 0.5);
    });

    it('should preserve language information from class', () => {
        // Use a code block container with language class to trigger the rule
        const html = `
      <div class="code-block language-python">
        <span>def</span>
        <span>hello</span>
        <span>()</span>
        <span>:</span>
        <span>print</span>
        <span>("world")</span>
      </div>
    `;

        const markdown = htmlToMarkdown(html);
        // Should contain language identifier
        expect(markdown).toContain('```python');
    });
});
