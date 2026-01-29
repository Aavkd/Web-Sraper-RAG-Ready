/**
 * Token estimation utilities for LLM-optimized content
 * Uses character-based estimation (~4 chars = 1 token)
 */

import { CHARS_PER_TOKEN } from '../input/defaults.js';

/**
 * Estimates token count for a given text string
 * Uses the approximation of ~4 characters per token
 * 
 * @param text - The text to estimate tokens for
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }
  
  // Remove excessive whitespace for more accurate estimation
  const normalized = text.replace(/\s+/g, ' ').trim();
  
  return Math.ceil(normalized.length / CHARS_PER_TOKEN);
}

/**
 * Estimates tokens for multiple text strings
 * 
 * @param texts - Array of text strings
 * @returns Total estimated token count
 */
export function estimateTokensBatch(texts: string[]): number {
  return texts.reduce((total, text) => total + estimateTokens(text), 0);
}

/**
 * Checks if text exceeds a token limit
 * 
 * @param text - The text to check
 * @param limit - Maximum allowed tokens
 * @returns True if text exceeds the limit
 */
export function exceedsTokenLimit(text: string, limit: number): boolean {
  return estimateTokens(text) > limit;
}

/**
 * Truncates text to approximately fit within a token limit
 * Tries to break at word boundaries when possible
 * 
 * @param text - The text to truncate
 * @param maxTokens - Maximum tokens allowed
 * @returns Truncated text
 */
export function truncateToTokenLimit(text: string, maxTokens: number): string {
  const currentTokens = estimateTokens(text);
  
  if (currentTokens <= maxTokens) {
    return text;
  }
  
  // Calculate approximate character limit
  const charLimit = maxTokens * CHARS_PER_TOKEN;
  
  // Find a good break point (word boundary)
  let truncated = text.slice(0, charLimit);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > charLimit * 0.8) {
    // Break at word boundary if it's reasonably close to the limit
    truncated = truncated.slice(0, lastSpace);
  }
  
  return truncated.trim();
}

/**
 * Returns token statistics for a piece of content
 * 
 * @param text - The text to analyze
 * @returns Token statistics object
 */
export function getTokenStats(text: string): {
  tokens: number;
  characters: number;
  words: number;
  charsPerToken: number;
} {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const words = normalized.split(' ').filter(w => w.length > 0).length;
  const tokens = estimateTokens(text);
  
  return {
    tokens,
    characters: normalized.length,
    words,
    charsPerToken: CHARS_PER_TOKEN,
  };
}
