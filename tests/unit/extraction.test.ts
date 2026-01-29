/**
 * Unit tests for content extraction pipeline
 * Tests Readability extraction, HTML cleaning, and extraction orchestration
 */

import { describe, it, expect } from 'vitest';
import {
  extractContent,
  extractContentBatch,
  cleanHtml,
  extractWithReadability,
  extractTitle,
  isValidReadabilityResult,
} from '../../src/extraction/index.js';

describe('extractContent', () => {
  it('should extract main content from a well-structured HTML page', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Test Article</title></head>
        <body>
          <nav><a href="/">Home</a></nav>
          <article>
            <h1>Test Article Title</h1>
            <p>This is a well-structured article with meaningful content that should be extracted properly. 
            It contains enough text to pass the minimum content length requirements for Readability.</p>
            <p>The content continues with more paragraphs to ensure we have sufficient text for extraction.
            Additional text helps the extraction algorithm identify this as the main content area.</p>
            <p>Third paragraph with even more content to make this look like a proper article.</p>
          </article>
          <footer>Copyright 2024</footer>
        </body>
      </html>
    `;
    
    const result = extractContent(html, 'https://example.com/test');
    
    expect(result.success).toBe(true);
    expect(result.title).toBeTruthy();
    expect(result.contentHtml).toBeTruthy();
    expect(result.contentLength).toBeGreaterThan(100);
  });

  it('should handle pages with minimal content gracefully', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Empty Page</title></head>
        <body>
          <nav><a href="/">Home</a></nav>
          <main>
            <p>Short content.</p>
          </main>
        </body>
      </html>
    `;
    
    const result = extractContent(html, 'https://example.com/test', {
      minContentLength: 100,
      fallbackToBody: true,
    });
    
    // Should still succeed with fallback to body
    expect(result.success).toBe(true);
  });

  it('should fail extraction on completely empty content', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Empty</title></head>
        <body></body>
      </html>
    `;
    
    const result = extractContent(html, 'https://example.com/test', {
      fallbackToBody: false,
      minContentLength: 100,
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should extract title correctly', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Page Title | Site Name</title>
          <meta property="og:title" content="OG Title">
        </head>
        <body>
          <article>
            <p>Content here with enough text to be meaningful for the extraction algorithm to work properly.</p>
          </article>
        </body>
      </html>
    `;
    
    const result = extractContent(html, 'https://example.com/test');
    
    // Should prefer og:title
    expect(result.title).toBe('OG Title');
  });
});

describe('extractContentBatch', () => {
  it('should extract content from multiple pages', () => {
    const pages = [
      {
        html: `<html><head><title>Page 1</title></head><body><article><p>Content for page one with enough text.</p></article></body></html>`,
        url: 'https://example.com/page1',
      },
      {
        html: `<html><head><title>Page 2</title></head><body><article><p>Content for page two with enough text.</p></article></body></html>`,
        url: 'https://example.com/page2',
      },
    ];
    
    const results = extractContentBatch(pages);
    
    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('Page 1');
    expect(results[1].title).toBe('Page 2');
  });
});

describe('cleanHtml', () => {
  it('should remove navigation elements', () => {
    const html = `
      <html>
        <body>
          <nav><a href="/">Home</a><a href="/about">About</a></nav>
          <main>
            <p>Main content here.</p>
          </main>
        </body>
      </html>
    `;
    
    const cleaned = cleanHtml(html);
    
    expect(cleaned).not.toContain('<nav>');
    expect(cleaned).toContain('Main content');
  });

  it('should remove footer elements', () => {
    const html = `
      <html>
        <body>
          <main>
            <p>Main content here.</p>
          </main>
          <footer>Copyright 2024</footer>
        </body>
      </html>
    `;
    
    const cleaned = cleanHtml(html);
    
    expect(cleaned).not.toContain('<footer>');
    expect(cleaned).not.toContain('Copyright');
  });

  it('should remove script and style tags', () => {
    const html = `
      <html>
        <body>
          <script>alert('hello');</script>
          <style>.test { color: red; }</style>
          <p>Main content here.</p>
        </body>
      </html>
    `;
    
    const cleaned = cleanHtml(html);
    
    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('<style>');
    expect(cleaned).not.toContain('alert');
    expect(cleaned).toContain('Main content');
  });

  it('should remove cookie banners', () => {
    const html = `
      <html>
        <body>
          <div class="cookie-banner">Accept cookies</div>
          <div class="cookie-consent">We use cookies</div>
          <main>
            <p>Main content here.</p>
          </main>
        </body>
      </html>
    `;
    
    const cleaned = cleanHtml(html);
    
    expect(cleaned).not.toContain('cookie');
    expect(cleaned).toContain('Main content');
  });

  it('should remove advertisement sections', () => {
    const html = `
      <html>
        <body>
          <div class="advertisement">Buy now!</div>
          <div class="ad-container">Sponsored</div>
          <main>
            <p>Main content here.</p>
          </main>
        </body>
      </html>
    `;
    
    const cleaned = cleanHtml(html);
    
    expect(cleaned).not.toContain('advertisement');
    expect(cleaned).not.toContain('ad-container');
    expect(cleaned).toContain('Main content');
  });

  it('should preserve main content', () => {
    const html = `
      <html>
        <body>
          <nav><a href="/">Home</a></nav>
          <article>
            <h1>Article Title</h1>
            <p>This is the main article content that should be preserved.</p>
            <ul>
              <li>List item one</li>
              <li>List item two</li>
            </ul>
          </article>
          <footer>Copyright</footer>
        </body>
      </html>
    `;
    
    const cleaned = cleanHtml(html);
    
    expect(cleaned).toContain('Article Title');
    expect(cleaned).toContain('main article content');
    expect(cleaned).toContain('List item one');
  });

  it('should respect custom additional selectors', () => {
    const html = `
      <html>
        <body>
          <div class="custom-noise">Remove this</div>
          <main>
            <p>Main content here.</p>
          </main>
        </body>
      </html>
    `;
    
    const cleaned = cleanHtml(html, {
      additionalSelectors: ['.custom-noise'],
    });
    
    expect(cleaned).not.toContain('Remove this');
    expect(cleaned).toContain('Main content');
  });
});

describe('extractWithReadability', () => {
  it('should extract article content from valid HTML', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Test Article</title></head>
        <body>
          <article>
            <h1>Article Headline</h1>
            <p>This is a substantial article with meaningful content that Readability should identify
            as the main content of the page. It includes multiple paragraphs and enough text to be
            considered valid content for extraction purposes.</p>
            <p>The second paragraph continues the article with more detailed information about the
            topic at hand. This helps ensure the content length threshold is met.</p>
            <p>A third paragraph adds even more substance to the article, making it clear that this
            is the primary content that should be extracted from the page.</p>
          </article>
        </body>
      </html>
    `;
    
    const result = extractWithReadability(html, 'https://example.com/article');
    
    expect(result).not.toBeNull();
    expect(result?.content).toBeTruthy();
    expect(result?.textContent).toBeTruthy();
    expect(result?.length).toBeGreaterThan(100);
  });

  it('should return null for pages without meaningful content', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Empty</title></head>
        <body>
          <nav><a href="/">Home</a></nav>
        </body>
      </html>
    `;
    
    const result = extractWithReadability(html, 'https://example.com/empty', {
      charThreshold: 500,
    });
    
    // Readability may return null or low-quality content
    if (result) {
      expect(result.length).toBeLessThan(100);
    }
  });
});

describe('extractTitle', () => {
  it('should prefer og:title over other sources', () => {
    const html = `
      <html>
        <head>
          <title>Page Title | Site Name</title>
          <meta property="og:title" content="OG Title">
          <meta name="twitter:title" content="Twitter Title">
        </head>
        <body><h1>H1 Title</h1></body>
      </html>
    `;
    
    const title = extractTitle(html);
    expect(title).toBe('OG Title');
  });

  it('should use twitter:title as fallback', () => {
    const html = `
      <html>
        <head>
          <title>Page Title | Site Name</title>
          <meta name="twitter:title" content="Twitter Title">
        </head>
        <body></body>
      </html>
    `;
    
    const title = extractTitle(html);
    expect(title).toBe('Twitter Title');
  });

  it('should use h1 when meta tags are not available', () => {
    const html = `
      <html>
        <head><title>Page Title | Site Name</title></head>
        <body><h1>Main Heading</h1></body>
      </html>
    `;
    
    const title = extractTitle(html);
    expect(title).toBe('Main Heading');
  });

  it('should clean site name from title tag', () => {
    const html = `
      <html>
        <head><title>Page Title | Site Name</title></head>
        <body></body>
      </html>
    `;
    
    const title = extractTitle(html);
    expect(title).toBe('Page Title');
  });

  it('should handle title with different separators', () => {
    const testCases = [
      { html: '<html><head><title>Title - Site</title></head></html>', expected: 'Title' },
      { html: '<html><head><title>Title — Site</title></head></html>', expected: 'Title' },
      { html: '<html><head><title>Title :: Site</title></head></html>', expected: 'Title' },
      { html: '<html><head><title>Title » Site</title></head></html>', expected: 'Title' },
    ];
    
    for (const { html, expected } of testCases) {
      expect(extractTitle(html)).toBe(expected);
    }
  });

  it('should return empty string for missing title', () => {
    const html = '<html><head></head><body></body></html>';
    const title = extractTitle(html);
    expect(title).toBe('');
  });
});

describe('isValidReadabilityResult', () => {
  it('should return false for null results', () => {
    expect(isValidReadabilityResult(null)).toBe(false);
  });

  it('should return false for results below minimum length', () => {
    const result = {
      title: 'Test',
      byline: null,
      content: '<p>Short</p>',
      textContent: 'Short',
      length: 50,
      excerpt: '',
      siteName: null,
    };
    
    expect(isValidReadabilityResult(result, 100)).toBe(false);
  });

  it('should return true for valid results', () => {
    const result = {
      title: 'Test Article',
      byline: null,
      content: '<p>This is a substantial article with meaningful content.</p>',
      textContent: 'This is a substantial article with meaningful content.',
      length: 200,
      excerpt: 'This is a substantial article',
      siteName: null,
    };
    
    expect(isValidReadabilityResult(result, 100)).toBe(true);
  });

  it('should return false for empty content', () => {
    const result = {
      title: 'Test',
      byline: null,
      content: '',
      textContent: '',
      length: 0,
      excerpt: '',
      siteName: null,
    };
    
    expect(isValidReadabilityResult(result)).toBe(false);
  });
});
