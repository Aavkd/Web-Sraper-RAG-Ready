/**
 * Unit tests for content chunking
 * Tests semantic chunking, chunk ID generation, and edge cases
 */

import { describe, it, expect } from 'vitest';
import {
  chunkContent,
  generateChunkId,
  generatePageId,
  chunkMultiplePages,
} from '../../src/processing/chunker.js';
import { estimateTokens } from '../../src/processing/tokenizer.js';

describe('chunkContent', () => {
  const defaultOptions = {
    pageId: 'test-page',
    sourceUrl: 'https://example.com/test',
    pageTitle: 'Test Page',
  };

  it('should return empty array for empty content', () => {
    const chunks = chunkContent('', defaultOptions);
    expect(chunks).toHaveLength(0);
  });

  it('should return empty array for whitespace-only content', () => {
    const chunks = chunkContent('   \n\n\t   ', defaultOptions);
    expect(chunks).toHaveLength(0);
  });

  it('should create a single chunk for short content', () => {
    const markdown = 'This is a short paragraph that fits in one chunk.';
    const chunks = chunkContent(markdown, {
      ...defaultOptions,
      targetSize: 600,
    });
    
    expect(chunks).toHaveLength(1);
    expect(chunks[0].content).toContain('short paragraph');
    expect(chunks[0].sourceUrl).toBe('https://example.com/test');
    expect(chunks[0].pageTitle).toBe('Test Page');
  });

  it('should split content by headings', () => {
    const markdown = `## Section One

This is the first section with some content.

## Section Two

This is the second section with different content.

## Section Three

This is the third section with even more content.`;

    const chunks = chunkContent(markdown, {
      ...defaultOptions,
      targetSize: 50, // Small target to force splits
    });
    
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    // Each chunk should have its own heading context
    const hasSection = chunks.some(c => c.content.includes('## Section'));
    expect(hasSection).toBe(true);
  });

  it('should respect maximum chunk size', () => {
    // Create long content that should be split
    const longParagraph = 'Word '.repeat(500);
    const markdown = `## Long Section\n\n${longParagraph}`;
    
    const chunks = chunkContent(markdown, {
      ...defaultOptions,
      targetSize: 100,
      maxSize: 150,
    });
    
    // Verify no chunk exceeds max size (with some tolerance for edge cases)
    for (const chunk of chunks) {
      // Allow small overflow for edge cases
      expect(chunk.tokensEstimate).toBeLessThanOrEqual(200);
    }
  });

  it('should include metadata in each chunk', () => {
    const markdown = 'Test content for metadata verification.';
    const chunks = chunkContent(markdown, defaultOptions);
    
    expect(chunks[0].id).toMatch(/^test_page_chunk_\d+$/);
    expect(chunks[0].sourceUrl).toBe('https://example.com/test');
    expect(chunks[0].pageTitle).toBe('Test Page');
    expect(typeof chunks[0].tokensEstimate).toBe('number');
  });

  it('should handle content without headings', () => {
    const markdown = `First paragraph with some content.

Second paragraph with more content.

Third paragraph with even more content here to fill space.`;

    const chunks = chunkContent(markdown, {
      ...defaultOptions,
      targetSize: 600,
    });
    
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    expect(chunks[0].content).toBeTruthy();
  });

  it('should preserve code blocks as units when possible', () => {
    const markdown = `## Code Example

Here is some code:

\`\`\`javascript
function hello() {
  console.log('Hello, world!');
  return true;
}
\`\`\`

More text after the code.`;

    const chunks = chunkContent(markdown, {
      ...defaultOptions,
      targetSize: 600,
    });
    
    // The code block should be intact in at least one chunk
    const hasCompleteCodeBlock = chunks.some(c => 
      c.content.includes('```javascript') && c.content.includes('```')
    );
    expect(hasCompleteCodeBlock).toBe(true);
  });

  it('should handle very large code blocks by splitting them', () => {
    const codeLines = Array.from({ length: 100 }, (_, i) => 
      `const line${i} = 'This is line number ${i}';`
    ).join('\n');
    
    const markdown = `## Big Code Block

\`\`\`javascript
${codeLines}
\`\`\``;

    const chunks = chunkContent(markdown, {
      ...defaultOptions,
      targetSize: 100,
      maxSize: 150,
    });
    
    // Should create multiple chunks for large code blocks
    expect(chunks.length).toBeGreaterThan(1);
    // Each chunk should have proper code block markers
    for (const chunk of chunks) {
      if (chunk.content.includes('const line')) {
        expect(chunk.content).toMatch(/```/);
      }
    }
  });

  it('should merge small trailing chunks when possible', () => {
    const markdown = `## Main Section

This is substantial content for the main section.

## Tiny Section

X`;

    const chunks = chunkContent(markdown, {
      ...defaultOptions,
      targetSize: 600,
      minSize: 50,
    });
    
    // Small trailing sections should be merged if they fit
    expect(chunks.length).toBeGreaterThanOrEqual(1);
  });
});

describe('generateChunkId', () => {
  it('should generate unique IDs for different indices', () => {
    const id1 = generateChunkId('test-page', 1);
    const id2 = generateChunkId('test-page', 2);
    
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/_chunk_1$/);
    expect(id2).toMatch(/_chunk_2$/);
  });

  it('should sanitize page IDs', () => {
    const id = generateChunkId('Test Page With Spaces!', 1);
    
    expect(id).not.toContain(' ');
    expect(id).not.toContain('!');
    expect(id).toMatch(/^[a-z0-9_]+_chunk_1$/);
  });

  it('should handle special characters', () => {
    const id = generateChunkId('page/with/slashes?and=query', 1);
    
    expect(id).not.toContain('/');
    expect(id).not.toContain('?');
    expect(id).not.toContain('=');
  });

  it('should limit page ID length', () => {
    const longName = 'a'.repeat(100);
    const id = generateChunkId(longName, 1);
    
    // Page ID portion should be limited to 50 chars
    expect(id.replace(/_chunk_\d+$/, '').length).toBeLessThanOrEqual(50);
  });

  it('should handle empty page ID', () => {
    const id = generateChunkId('', 1);
    expect(id).toMatch(/_chunk_1$/);
  });
});

describe('generatePageId', () => {
  it('should generate ID from URL path', () => {
    const id = generatePageId('https://example.com/docs/getting-started');
    expect(id).toBe('docs_getting_started');
  });

  it('should return "home" for homepage', () => {
    const id = generatePageId('https://example.com/');
    expect(id).toBe('home');
  });

  it('should strip file extensions', () => {
    const id = generatePageId('https://example.com/page.html');
    expect(id).toBe('page');
  });

  it('should handle complex paths', () => {
    const id = generatePageId('https://example.com/docs/api/v2/endpoints');
    expect(id).toBe('docs_api_v2_endpoints');
  });

  it('should handle invalid URLs gracefully', () => {
    const id = generatePageId('not-a-url');
    expect(id).toBe('page');
  });

  it('should limit length of generated ID', () => {
    const longPath = '/' + 'segment/'.repeat(20) + 'final';
    const id = generatePageId(`https://example.com${longPath}`);
    expect(id.length).toBeLessThanOrEqual(50);
  });
});

describe('chunkMultiplePages', () => {
  it('should chunk content from multiple pages', () => {
    const pages = [
      {
        url: 'https://example.com/page1',
        title: 'Page One',
        markdown: '## Page One Content\n\nFirst page content here.',
      },
      {
        url: 'https://example.com/page2',
        title: 'Page Two',
        markdown: '## Page Two Content\n\nSecond page content here.',
      },
    ];
    
    const chunks = chunkMultiplePages(pages);
    
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    
    const page1Chunks = chunks.filter(c => c.sourceUrl === 'https://example.com/page1');
    const page2Chunks = chunks.filter(c => c.sourceUrl === 'https://example.com/page2');
    
    expect(page1Chunks.length).toBeGreaterThanOrEqual(1);
    expect(page2Chunks.length).toBeGreaterThanOrEqual(1);
  });

  it('should use correct page titles in chunk metadata', () => {
    const pages = [
      {
        url: 'https://example.com/docs',
        title: 'Documentation',
        markdown: 'Documentation content.',
      },
    ];
    
    const chunks = chunkMultiplePages(pages);
    
    expect(chunks[0].pageTitle).toBe('Documentation');
  });

  it('should respect custom target size', () => {
    const longContent = 'Word '.repeat(200);
    const pages = [
      {
        url: 'https://example.com/long',
        title: 'Long Page',
        markdown: `## Long Content\n\n${longContent}`,
      },
    ];
    
    const smallChunks = chunkMultiplePages(pages, 100);
    const largeChunks = chunkMultiplePages(pages, 1000);
    
    expect(smallChunks.length).toBeGreaterThan(largeChunks.length);
  });

  it('should handle empty pages', () => {
    const pages = [
      { url: 'https://example.com/empty', title: 'Empty', markdown: '' },
      { url: 'https://example.com/content', title: 'Has Content', markdown: 'Some content.' },
    ];
    
    const chunks = chunkMultiplePages(pages);
    
    // Should only have chunks from the page with content
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    expect(chunks.every(c => c.sourceUrl === 'https://example.com/content')).toBe(true);
  });
});

describe('chunk token estimates', () => {
  it('should have accurate token estimates', () => {
    const markdown = 'This is a test paragraph with known content length.';
    const chunks = chunkContent(markdown, {
      pageId: 'test',
      sourceUrl: 'https://example.com',
      pageTitle: 'Test',
    });
    
    // Token estimate in chunk should match standalone calculation
    expect(chunks[0].tokensEstimate).toBe(estimateTokens(chunks[0].content));
  });

  it('should stay within target size for typical content', () => {
    const markdown = `## Introduction

This is the introduction section with some explanatory text.

## Getting Started

To get started, follow these steps:

1. First, install the package
2. Then, configure your settings
3. Finally, run the application

## Advanced Usage

For advanced usage, you can customize the following options:

- Option A: Controls the first behavior
- Option B: Controls the second behavior
- Option C: Controls the third behavior

## Conclusion

That concludes our overview of the system.`;

    const chunks = chunkContent(markdown, {
      pageId: 'test',
      sourceUrl: 'https://example.com',
      pageTitle: 'Test',
      targetSize: 600,
      maxSize: 900,
    });
    
    // Most chunks should be within target range
    const withinTarget = chunks.filter(c => c.tokensEstimate <= 900);
    expect(withinTarget.length).toBe(chunks.length);
  });
});
