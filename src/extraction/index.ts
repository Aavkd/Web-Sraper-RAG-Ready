/**
 * Content extraction orchestrator
 * Combines cleaning and readability extraction into a unified pipeline
 */

import { cleanHtml, type CleanerOptions } from './cleaner.js';
import {
  extractWithReadability,
  extractTitle,
  isValidReadabilityResult,
  type ReadabilityResult,
  type ReadabilityOptions,
} from './readability.js';

/**
 * Result of the extraction pipeline
 */
export interface ExtractionResult {
  /** Whether extraction was successful */
  success: boolean;
  /** Page title */
  title: string;
  /** Extracted content as HTML */
  contentHtml: string;
  /** Plain text content */
  textContent: string;
  /** Content length in characters */
  contentLength: number;
  /** Excerpt/summary if available */
  excerpt: string;
  /** Error message if extraction failed */
  error?: string;
}

/**
 * Options for the extraction pipeline
 */
export interface ExtractionOptions {
  /** Options for the HTML cleaner */
  cleanerOptions?: CleanerOptions;
  /** Options for Readability */
  readabilityOptions?: ReadabilityOptions;
  /** Minimum content length to consider extraction successful */
  minContentLength?: number;
  /** Whether to fall back to cleaned body if Readability fails */
  fallbackToBody?: boolean;
}

const DEFAULT_OPTIONS: Required<ExtractionOptions> = {
  cleanerOptions: {},
  readabilityOptions: {},
  minContentLength: 100,
  fallbackToBody: true,
};

/**
 * Extracts content from HTML using the full pipeline:
 * 1. Clean HTML (remove boilerplate)
 * 2. Extract with Readability
 * 3. Validate and fall back if needed
 * 
 * @param html - Raw HTML to extract from
 * @param url - Original page URL
 * @param options - Extraction options
 * @returns Extraction result
 */
export function extractContent(
  html: string,
  url: string,
  options: ExtractionOptions = {},
): ExtractionResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Extract title first (before cleaning might remove it)
  const title = extractTitle(html);
  
  // Try Readability first on the original HTML
  // Readability works better on complete HTML in many cases
  let readabilityResult = extractWithReadability(html, url, opts.readabilityOptions);
  
  // If Readability succeeded and result is valid, use it
  if (isValidReadabilityResult(readabilityResult, opts.minContentLength)) {
    return createSuccessResult(readabilityResult, title);
  }
  
  // Try again with cleaned HTML
  const cleanedHtml = cleanHtml(html, opts.cleanerOptions);
  readabilityResult = extractWithReadability(cleanedHtml, url, opts.readabilityOptions);
  
  if (isValidReadabilityResult(readabilityResult, opts.minContentLength)) {
    return createSuccessResult(readabilityResult, title);
  }
  
  // Fall back to cleaned body if enabled
  if (opts.fallbackToBody && cleanedHtml.trim().length > 0) {
    return {
      success: true,
      title: title || 'Untitled',
      contentHtml: cleanedHtml,
      textContent: extractTextFromHtml(cleanedHtml),
      contentLength: cleanedHtml.length,
      excerpt: '',
    };
  }
  
  // Extraction failed
  return {
    success: false,
    title: title || 'Untitled',
    contentHtml: '',
    textContent: '',
    contentLength: 0,
    excerpt: '',
    error: 'Failed to extract meaningful content from page',
  };
}

/**
 * Creates a successful extraction result from Readability output
 */
function createSuccessResult(
  result: ReadabilityResult,
  fallbackTitle: string,
): ExtractionResult {
  return {
    success: true,
    title: result.title || fallbackTitle || 'Untitled',
    contentHtml: result.content,
    textContent: result.textContent,
    contentLength: result.length,
    excerpt: result.excerpt,
  };
}

/**
 * Extracts plain text from HTML string
 * Simple implementation for fallback scenarios
 */
function extractTextFromHtml(html: string): string {
  // Remove all tags and decode entities
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Batch extracts content from multiple HTML pages
 * @param pages - Array of {html, url} objects
 * @param options - Extraction options
 * @returns Array of extraction results
 */
export function extractContentBatch(
  pages: Array<{ html: string; url: string }>,
  options: ExtractionOptions = {},
): ExtractionResult[] {
  return pages.map(page => extractContent(page.html, page.url, options));
}

// Re-export types and utilities from sub-modules
export { type CleanerOptions } from './cleaner.js';
export { type ReadabilityOptions, type ReadabilityResult } from './readability.js';
export { cleanHtml, cleanHtmlToDocument } from './cleaner.js';
export { extractWithReadability, extractTitle, isValidReadabilityResult } from './readability.js';
export { ALL_BOILERPLATE_SELECTORS, createSelectorString } from './selectors.js';
