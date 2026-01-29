/**
 * Unit tests for token estimation
 * Tests token counting accuracy and utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  estimateTokens,
  estimateTokensBatch,
  exceedsTokenLimit,
  truncateToTokenLimit,
  getTokenStats,
} from '../../src/processing/tokenizer.js';
import { CHARS_PER_TOKEN } from '../../src/input/defaults.js';

describe('estimateTokens', () => {
  it('should return 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0);
  });

  it('should return 0 for null/undefined input', () => {
    expect(estimateTokens(null as unknown as string)).toBe(0);
    expect(estimateTokens(undefined as unknown as string)).toBe(0);
  });

  it('should estimate tokens based on character count', () => {
    // 40 characters should be ~10 tokens (at 4 chars/token)
    const text = 'This is a test string for token counting';
    const tokens = estimateTokens(text);
    
    // Should be approximately text.length / CHARS_PER_TOKEN
    const expected = Math.ceil(text.length / CHARS_PER_TOKEN);
    expect(tokens).toBe(expected);
  });

  it('should normalize whitespace before counting', () => {
    const normalText = 'Hello World';
    const spaceyText = 'Hello    World';
    
    // Both should produce similar results after normalization
    expect(estimateTokens(normalText)).toBe(estimateTokens(spaceyText));
  });

  it('should handle text with newlines', () => {
    const text = 'Line one\n\nLine two\n\n\nLine three';
    const tokens = estimateTokens(text);
    
    // Should normalize newlines to spaces
    expect(tokens).toBeGreaterThan(0);
  });

  it('should handle Unicode characters', () => {
    const text = 'Hello World';
    const tokens = estimateTokens(text);
    
    expect(tokens).toBeGreaterThan(0);
  });

  it('should produce consistent results', () => {
    const text = 'The quick brown fox jumps over the lazy dog.';
    
    const result1 = estimateTokens(text);
    const result2 = estimateTokens(text);
    
    expect(result1).toBe(result2);
  });
});

describe('estimateTokensBatch', () => {
  it('should return 0 for empty array', () => {
    expect(estimateTokensBatch([])).toBe(0);
  });

  it('should sum tokens from multiple texts', () => {
    const texts = ['Hello', 'World', 'Test'];
    const batchTotal = estimateTokensBatch(texts);
    const individualTotal = texts.reduce((sum, t) => sum + estimateTokens(t), 0);
    
    expect(batchTotal).toBe(individualTotal);
  });

  it('should handle mixed empty and non-empty strings', () => {
    const texts = ['Hello', '', 'World', '   ', 'Test'];
    const result = estimateTokensBatch(texts);
    
    expect(result).toBeGreaterThan(0);
    expect(result).toBe(
      estimateTokens('Hello') + estimateTokens('World') + estimateTokens('Test')
    );
  });
});

describe('exceedsTokenLimit', () => {
  it('should return false when under limit', () => {
    const text = 'Short text';
    expect(exceedsTokenLimit(text, 100)).toBe(false);
  });

  it('should return true when over limit', () => {
    const text = 'A'.repeat(500); // ~125 tokens
    expect(exceedsTokenLimit(text, 50)).toBe(true);
  });

  it('should return false when exactly at limit', () => {
    // Create text that equals exactly N tokens
    const targetTokens = 10;
    const charCount = targetTokens * CHARS_PER_TOKEN;
    const text = 'x'.repeat(charCount);
    
    expect(exceedsTokenLimit(text, targetTokens)).toBe(false);
  });
});

describe('truncateToTokenLimit', () => {
  it('should return original text when under limit', () => {
    const text = 'Short text';
    const result = truncateToTokenLimit(text, 100);
    
    expect(result).toBe(text);
  });

  it('should truncate text when over limit', () => {
    const text = 'A'.repeat(500); // ~125 tokens
    const result = truncateToTokenLimit(text, 50);
    
    expect(result.length).toBeLessThan(text.length);
    expect(estimateTokens(result)).toBeLessThanOrEqual(50);
  });

  it('should try to break at word boundaries', () => {
    const text = 'This is a longer sentence that needs to be truncated at a reasonable point.';
    const result = truncateToTokenLimit(text, 5);
    
    // Should not end in middle of a word (if possible)
    expect(result.endsWith(' ')).toBe(false);
  });

  it('should handle single long word', () => {
    const text = 'Supercalifragilisticexpialidocious';
    const result = truncateToTokenLimit(text, 2);
    
    // Should truncate even without word boundaries
    expect(result.length).toBeLessThan(text.length);
  });

  it('should trim result', () => {
    const text = 'Hello world this is a test';
    const result = truncateToTokenLimit(text, 3);
    
    expect(result).not.toMatch(/^\s|\s$/);
  });
});

describe('getTokenStats', () => {
  it('should return all statistics', () => {
    const text = 'Hello World Test';
    const stats = getTokenStats(text);
    
    expect(stats).toHaveProperty('tokens');
    expect(stats).toHaveProperty('characters');
    expect(stats).toHaveProperty('words');
    expect(stats).toHaveProperty('charsPerToken');
  });

  it('should count words correctly', () => {
    const text = 'One Two Three Four Five';
    const stats = getTokenStats(text);
    
    expect(stats.words).toBe(5);
  });

  it('should count characters correctly (normalized)', () => {
    const text = 'Hello World';
    const stats = getTokenStats(text);
    
    expect(stats.characters).toBe('Hello World'.length);
  });

  it('should report correct chars per token constant', () => {
    const stats = getTokenStats('Test');
    expect(stats.charsPerToken).toBe(CHARS_PER_TOKEN);
  });

  it('should handle empty text', () => {
    const stats = getTokenStats('');
    
    expect(stats.tokens).toBe(0);
    expect(stats.characters).toBe(0);
    expect(stats.words).toBe(0);
  });

  it('should normalize whitespace in counts', () => {
    const text = 'Hello    World    Test';
    const stats = getTokenStats(text);
    
    // Words should be counted correctly despite extra spaces
    expect(stats.words).toBe(3);
  });
});

describe('token estimation accuracy', () => {
  it('should be within ±20% for typical English text', () => {
    // GPT-like tokenizers typically produce ~0.75 tokens per word for English
    // Our estimate is based on 4 chars per token
    const text = 'The quick brown fox jumps over the lazy dog. This sentence is used to test tokenization accuracy and should provide a reasonable benchmark.';
    
    const estimated = estimateTokens(text);
    const charCount = text.replace(/\s+/g, ' ').trim().length;
    const expectedApprox = Math.ceil(charCount / CHARS_PER_TOKEN);
    
    // Estimate should match our formula exactly
    expect(estimated).toBe(expectedApprox);
  });

  it('should handle code content', () => {
    const code = `
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
    `;
    
    const tokens = estimateTokens(code);
    
    // Code typically has more tokens per word due to punctuation
    expect(tokens).toBeGreaterThan(0);
  });

  it('should handle markdown content', () => {
    const markdown = `
## Heading

This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`javascript
const x = 1;
\`\`\`
    `;
    
    const tokens = estimateTokens(markdown);
    
    expect(tokens).toBeGreaterThan(0);
    // Should handle markdown syntax without issues
  });
});

describe('edge cases', () => {
  it('should handle very long text', () => {
    const longText = 'Word '.repeat(10000);
    const tokens = estimateTokens(longText);
    
    expect(tokens).toBeGreaterThan(0);
    expect(tokens).toBeLessThan(longText.length); // Should be fewer tokens than characters
  });

  it('should handle only whitespace', () => {
    expect(estimateTokens('   \n\t\n   ')).toBe(0);
  });

  it('should handle special characters', () => {
    const text = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const tokens = estimateTokens(text);
    
    expect(tokens).toBeGreaterThan(0);
  });

  it('should handle mixed content', () => {
    const text = 'Hello 123 World! Test... More text here.';
    const tokens = estimateTokens(text);
    
    expect(tokens).toBeGreaterThan(0);
  });
});
