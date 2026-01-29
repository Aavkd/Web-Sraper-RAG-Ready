/**
 * Integration tests for crawler utilities and URL handling
 * Tests the full URL filtering pipeline and link extraction
 */

import { describe, it, expect } from 'vitest';
import {
  normalizeUrl,
  isInternalUrl,
  isBinaryUrl,
  shouldCrawlUrl,
  extractLinks,
  matchesPathPattern,
  shouldIncludePath,
  shouldExcludePath,
} from '../../src/crawler/utils.js';
import {
  createCrawlState,
  hasReachedPageLimit,
  exceedsDepthLimit,
} from '../../src/crawler/handlers.js';
import type { ActorInput } from '../../src/types/index.js';

describe('normalizeUrl', () => {
  it('should remove hash fragments', () => {
    const url = 'https://example.com/page#section';
    expect(normalizeUrl(url)).toBe('https://example.com/page');
  });

  it('should remove trailing slashes (except for root)', () => {
    expect(normalizeUrl('https://example.com/page/')).toBe('https://example.com/page');
    expect(normalizeUrl('https://example.com/')).toBe('https://example.com/');
  });

  it('should preserve query parameters', () => {
    const url = 'https://example.com/page?foo=bar';
    expect(normalizeUrl(url)).toBe('https://example.com/page?foo=bar');
  });

  it('should return original for invalid URLs', () => {
    const invalid = 'not-a-url';
    expect(normalizeUrl(invalid)).toBe(invalid);
  });

  it('should handle URLs with both hash and trailing slash', () => {
    const url = 'https://example.com/page/#section';
    expect(normalizeUrl(url)).toBe('https://example.com/page');
  });
});

describe('isInternalUrl', () => {
  const startUrl = 'https://example.com/docs';

  it('should return true for same origin URLs', () => {
    expect(isInternalUrl('https://example.com/other', startUrl)).toBe(true);
    expect(isInternalUrl('https://example.com/docs/page', startUrl)).toBe(true);
  });

  it('should return false for different origins', () => {
    expect(isInternalUrl('https://other.com/page', startUrl)).toBe(false);
    expect(isInternalUrl('https://sub.example.com/page', startUrl)).toBe(false);
  });

  it('should return false for different protocols', () => {
    expect(isInternalUrl('http://example.com/page', startUrl)).toBe(false);
  });

  it('should handle invalid URLs gracefully', () => {
    expect(isInternalUrl('not-a-url', startUrl)).toBe(false);
  });
});

describe('isBinaryUrl', () => {
  it('should return true for PDF files', () => {
    expect(isBinaryUrl('https://example.com/doc.pdf')).toBe(true);
  });

  it('should return true for image files', () => {
    expect(isBinaryUrl('https://example.com/image.jpg')).toBe(true);
    expect(isBinaryUrl('https://example.com/image.png')).toBe(true);
    expect(isBinaryUrl('https://example.com/image.gif')).toBe(true);
    expect(isBinaryUrl('https://example.com/image.webp')).toBe(true);
  });

  it('should return true for CSS and JS files', () => {
    expect(isBinaryUrl('https://example.com/styles.css')).toBe(true);
    expect(isBinaryUrl('https://example.com/script.js')).toBe(true);
  });

  it('should return true for font files', () => {
    expect(isBinaryUrl('https://example.com/font.woff')).toBe(true);
    expect(isBinaryUrl('https://example.com/font.woff2')).toBe(true);
  });

  it('should return false for HTML pages', () => {
    expect(isBinaryUrl('https://example.com/page.html')).toBe(false);
    expect(isBinaryUrl('https://example.com/page')).toBe(false);
    expect(isBinaryUrl('https://example.com/docs/')).toBe(false);
  });

  it('should be case insensitive', () => {
    expect(isBinaryUrl('https://example.com/doc.PDF')).toBe(true);
    expect(isBinaryUrl('https://example.com/image.JPG')).toBe(true);
  });
});

describe('matchesPathPattern', () => {
  it('should match exact paths', () => {
    expect(matchesPathPattern('/docs', '/docs')).toBe(true);
    expect(matchesPathPattern('/docs', '/other')).toBe(false);
  });

  it('should match wildcard patterns', () => {
    expect(matchesPathPattern('/docs/intro', '/docs/*')).toBe(true);
    expect(matchesPathPattern('/docs/api/v1', '/docs/*')).toBe(true);
    expect(matchesPathPattern('/other/page', '/docs/*')).toBe(false);
  });

  it('should match prefix patterns', () => {
    expect(matchesPathPattern('/blog/post-1', '/blog*')).toBe(true);
    expect(matchesPathPattern('/blog', '/blog*')).toBe(true);
  });

  it('should normalize paths without leading slash', () => {
    expect(matchesPathPattern('docs', 'docs')).toBe(true);
    expect(matchesPathPattern('/docs', 'docs')).toBe(true);
  });
});

describe('shouldIncludePath', () => {
  it('should include all paths when includePaths is empty', () => {
    expect(shouldIncludePath('https://example.com/any/path', [])).toBe(true);
  });

  it('should only include paths matching patterns', () => {
    const includePaths = ['/docs/*', '/api/*'];
    
    expect(shouldIncludePath('https://example.com/docs/intro', includePaths)).toBe(true);
    expect(shouldIncludePath('https://example.com/api/v1', includePaths)).toBe(true);
    expect(shouldIncludePath('https://example.com/blog/post', includePaths)).toBe(false);
  });
});

describe('shouldExcludePath', () => {
  it('should exclude nothing when excludePaths is empty', () => {
    expect(shouldExcludePath('https://example.com/any/path', [])).toBe(false);
  });

  it('should exclude paths matching patterns', () => {
    const excludePaths = ['/admin/*', '/login*'];
    
    expect(shouldExcludePath('https://example.com/admin/settings', excludePaths)).toBe(true);
    expect(shouldExcludePath('https://example.com/login', excludePaths)).toBe(true);
    expect(shouldExcludePath('https://example.com/docs/intro', excludePaths)).toBe(false);
  });
});

describe('shouldCrawlUrl', () => {
  const startUrl = 'https://example.com';

  it('should allow valid internal URLs', () => {
    const result = shouldCrawlUrl(
      'https://example.com/docs/intro',
      startUrl,
      [],
      [],
    );
    expect(result).toEqual({ shouldCrawl: true });
  });

  it('should reject external URLs', () => {
    const result = shouldCrawlUrl(
      'https://other.com/page',
      startUrl,
      [],
      [],
    );
    expect(result).toEqual({ shouldCrawl: false, reason: 'external_link' });
  });

  it('should reject binary URLs', () => {
    const result = shouldCrawlUrl(
      'https://example.com/file.pdf',
      startUrl,
      [],
      [],
    );
    expect(result).toEqual({ shouldCrawl: false, reason: 'binary_file' });
  });

  it('should reject URLs not in includePaths', () => {
    const result = shouldCrawlUrl(
      'https://example.com/blog/post',
      startUrl,
      ['/docs/*'],
      [],
    );
    expect(result).toEqual({ shouldCrawl: false, reason: 'not_in_include_paths' });
  });

  it('should reject URLs in excludePaths', () => {
    const result = shouldCrawlUrl(
      'https://example.com/admin/settings',
      startUrl,
      [],
      ['/admin/*'],
    );
    expect(result).toEqual({ shouldCrawl: false, reason: 'excluded_path' });
  });

  it('should reject invalid URLs', () => {
    const result = shouldCrawlUrl(
      'not-a-valid-url',
      startUrl,
      [],
      [],
    );
    expect(result).toEqual({ shouldCrawl: false, reason: 'invalid_url' });
  });
});

describe('extractLinks', () => {
  const pageUrl = 'https://example.com/docs/intro';
  const startUrl = 'https://example.com';

  it('should extract valid internal links', () => {
    const hrefs = [
      '/docs/api',
      '/docs/guide',
      'https://example.com/about',
    ];
    
    const links = extractLinks(pageUrl, hrefs, startUrl, [], []);
    
    expect(links).toContain('https://example.com/docs/api');
    expect(links).toContain('https://example.com/docs/guide');
    expect(links).toContain('https://example.com/about');
  });

  it('should filter out external links', () => {
    const hrefs = [
      '/docs/api',
      'https://other.com/page',
    ];
    
    const links = extractLinks(pageUrl, hrefs, startUrl, [], []);
    
    expect(links).toContain('https://example.com/docs/api');
    expect(links).not.toContain('https://other.com/page');
  });

  it('should filter out binary files', () => {
    const hrefs = [
      '/docs/api',
      '/files/doc.pdf',
      '/images/logo.png',
    ];
    
    const links = extractLinks(pageUrl, hrefs, startUrl, [], []);
    
    expect(links).toContain('https://example.com/docs/api');
    expect(links).not.toContain('https://example.com/files/doc.pdf');
    expect(links).not.toContain('https://example.com/images/logo.png');
  });

  it('should deduplicate links', () => {
    const hrefs = [
      '/docs/api',
      '/docs/api',
      '/docs/api#section',
    ];
    
    const links = extractLinks(pageUrl, hrefs, startUrl, [], []);
    
    expect(links).toHaveLength(1);
  });

  it('should skip fragment-only links', () => {
    const hrefs = ['#section', '#top'];
    const links = extractLinks(pageUrl, hrefs, startUrl, [], []);
    expect(links).toHaveLength(0);
  });

  it('should skip javascript: and mailto: links', () => {
    const hrefs = [
      'javascript:void(0)',
      'mailto:test@example.com',
      'tel:+1234567890',
    ];
    const links = extractLinks(pageUrl, hrefs, startUrl, [], []);
    expect(links).toHaveLength(0);
  });

  it('should resolve relative URLs correctly', () => {
    const hrefs = [
      '../getting-started',  // Relative to /docs/intro -> /docs/getting-started (but this goes up one level)
      './api',
      'advanced',
    ];
    
    const links = extractLinks(pageUrl, hrefs, startUrl, [], []);
    
    // '../getting-started' from /docs/intro resolves to /getting-started (up one level from /docs)
    expect(links).toContain('https://example.com/getting-started');
    expect(links).toContain('https://example.com/docs/api');
    expect(links).toContain('https://example.com/docs/advanced');
  });

  it('should respect includePaths filter', () => {
    const hrefs = [
      '/docs/api',
      '/blog/post-1',
    ];
    
    const links = extractLinks(pageUrl, hrefs, startUrl, ['/docs/*'], []);
    
    expect(links).toContain('https://example.com/docs/api');
    expect(links).not.toContain('https://example.com/blog/post-1');
  });

  it('should respect excludePaths filter', () => {
    const hrefs = [
      '/docs/api',
      '/admin/settings',
    ];
    
    const links = extractLinks(pageUrl, hrefs, startUrl, [], ['/admin/*']);
    
    expect(links).toContain('https://example.com/docs/api');
    expect(links).not.toContain('https://example.com/admin/settings');
  });
});

describe('CrawlState', () => {
  const createTestInput = (): ActorInput => ({
    startUrl: 'https://example.com',
    maxPages: 10,
    maxDepth: 3,
    includePaths: [],
    excludePaths: [],
    chunkSize: 600,
    outputFormat: 'json',
  });

  describe('createCrawlState', () => {
    it('should initialize with correct values', () => {
      const input = createTestInput();
      const state = createCrawlState('https://example.com', input);
      
      expect(state.pagesProcessed).toBe(0);
      expect(state.pagesAttempted).toBe(0);
      expect(state.startUrl).toBe('https://example.com');
      expect(state.input).toBe(input);
      expect(state.skippedPages).toHaveLength(0);
      expect(state.enqueuedUrls.size).toBe(1);
      expect(state.extractedPages).toHaveLength(0);
      expect(state.startTime).toBeInstanceOf(Date);
    });

    it('should include start URL in enqueued set', () => {
      const state = createCrawlState('https://example.com', createTestInput());
      expect(state.enqueuedUrls.has('https://example.com')).toBe(true);
    });
  });

  describe('hasReachedPageLimit', () => {
    it('should return false when under limit', () => {
      const state = createCrawlState('https://example.com', createTestInput());
      state.pagesProcessed = 5;
      
      expect(hasReachedPageLimit(state)).toBe(false);
    });

    it('should return true when at limit', () => {
      const state = createCrawlState('https://example.com', createTestInput());
      state.pagesProcessed = 10;
      
      expect(hasReachedPageLimit(state)).toBe(true);
    });

    it('should return true when over limit', () => {
      const state = createCrawlState('https://example.com', createTestInput());
      state.pagesProcessed = 15;
      
      expect(hasReachedPageLimit(state)).toBe(true);
    });
  });

  describe('exceedsDepthLimit', () => {
    it('should return false when within limit', () => {
      expect(exceedsDepthLimit(2, 3)).toBe(false);
      expect(exceedsDepthLimit(3, 3)).toBe(false);
    });

    it('should return true when exceeding limit', () => {
      expect(exceedsDepthLimit(4, 3)).toBe(true);
      expect(exceedsDepthLimit(10, 3)).toBe(true);
    });
  });
});

describe('input validation integration', () => {
  it('should validate complete workflow from input to URL filtering', async () => {
    const { parseAndValidateInput } = await import('../../src/input/schema.js');
    
    const rawInput = {
      startUrl: 'https://docs.example.com/guide',
      maxPages: 5,
      includePaths: ['/guide/*'],
      excludePaths: ['/guide/internal/*'],
    };
    
    const input = parseAndValidateInput(rawInput);
    
    // Verify input was validated correctly
    expect(input.startUrl).toBe('https://docs.example.com/guide');
    expect(input.maxPages).toBe(5);
    
    // Use the validated input in URL filtering
    const startUrl = input.startUrl;
    
    const testUrls = [
      { url: 'https://docs.example.com/guide/intro', expected: true },
      { url: 'https://docs.example.com/guide/internal/secret', expected: false },
      { url: 'https://docs.example.com/api/v1', expected: false },
      { url: 'https://other.com/guide', expected: false },
    ];
    
    for (const { url, expected } of testUrls) {
      const result = shouldCrawlUrl(url, startUrl, input.includePaths, input.excludePaths);
      expect(result.shouldCrawl).toBe(expected);
    }
  });
});

describe('markdown and extraction integration', () => {
  it('should process HTML through full extraction and chunking pipeline', async () => {
    const { extractContent } = await import('../../src/extraction/index.js');
    const { htmlToMarkdown } = await import('../../src/processing/markdown.js');
    const { chunkContent, generatePageId } = await import('../../src/processing/chunker.js');
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Test Documentation</title></head>
        <body>
          <nav><a href="/">Home</a></nav>
          <article>
            <h1>Getting Started Guide</h1>
            <p>Welcome to our documentation. This guide will help you get started
            with our platform quickly and efficiently.</p>
            <h2>Prerequisites</h2>
            <p>Before you begin, make sure you have the following installed:</p>
            <ul>
              <li>Node.js version 18 or higher</li>
              <li>npm or yarn package manager</li>
            </ul>
            <h2>Installation</h2>
            <p>To install the package, run the following command:</p>
            <pre><code>npm install our-package</code></pre>
            <h2>Basic Usage</h2>
            <p>Import the package and start using it:</p>
            <pre><code>import { something } from 'our-package';</code></pre>
          </article>
          <footer>Copyright 2024</footer>
        </body>
      </html>
    `;
    
    const url = 'https://docs.example.com/getting-started';
    
    // Step 1: Extract content
    const extraction = extractContent(html, url);
    expect(extraction.success).toBe(true);
    expect(extraction.title).toBeTruthy();
    
    // Step 2: Convert to Markdown
    const markdown = htmlToMarkdown(extraction.contentHtml);
    expect(markdown).toBeTruthy();
    expect(markdown.length).toBeGreaterThan(0);
    
    // Step 3: Chunk content
    const pageId = generatePageId(url);
    const chunks = chunkContent(markdown, {
      pageId,
      sourceUrl: url,
      pageTitle: extraction.title,
      targetSize: 600,
    });
    
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    expect(chunks[0].sourceUrl).toBe(url);
    expect(chunks[0].pageTitle).toBe(extraction.title);
    
    // Verify chunk IDs are properly formatted
    for (const chunk of chunks) {
      expect(chunk.id).toMatch(/_chunk_\d+$/);
    }
  });
});
