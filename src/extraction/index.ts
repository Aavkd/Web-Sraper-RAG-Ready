/**
 * Content extraction orchestrator
 * Combines cleaning and readability extraction into a unified pipeline
 * Now includes Q&A page detection for better forum/Q&A extraction (Task 2.3)
 */

import { cleanHtml, type CleanerOptions } from './cleaner.js';
import {
  extractWithReadability,
  extractTitle,
  isValidReadabilityResult,
  type ReadabilityResult,
  type ReadabilityOptions,
} from './readability.js';
import { detectQAPage, type QAPageInfo } from './qa-detector.js';
import { extractQAContent } from './multi-selector.js';

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
  /** Q&A page detection info (if detected) */
  qaInfo?: QAPageInfo;
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
 * 1. Detect Q&A page and use multi-selector strategy if found (Task 2.3)
 * 2. Clean HTML (remove boilerplate)
 * 3. Extract with Readability
 * 4. Validate and fall back if needed
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

  // Task 2.3: Check if this is a Q&A page first
  const qaDetectionResult = detectQAPage(html, url);
  const qaInfo = qaDetectionResult ?? undefined;

  if (qaInfo && qaInfo.isQAPage) {
    // Use multi-selector extraction for Q&A pages
    const qaContent = extractQAContent(html, url, qaInfo);

    if (qaContent.success && qaContent.combinedHtml.length > opts.minContentLength) {
      return {
        success: true,
        title: qaContent.questionTitle || title || 'Untitled',
        contentHtml: qaContent.combinedHtml,
        textContent: extractTextFromHtml(qaContent.combinedHtml),
        contentLength: qaContent.combinedHtml.length,
        excerpt: qaContent.question.slice(0, 200),
        qaInfo,
      };
    }
    // If Q&A extraction didn't yield good results, fall through to Readability
  }

  // Try Readability first on the original HTML
  // Readability works better on complete HTML in many cases
  let readabilityResult = extractWithReadability(html, url, opts.readabilityOptions);

  // If Readability succeeded and result is valid, use it
  if (isValidReadabilityResult(readabilityResult, opts.minContentLength)) {
    return createSuccessResult(readabilityResult, title, qaInfo);
  }

  // Try again with cleaned HTML (with Q&A mode if detected)
  const cleanerOptions = {
    ...opts.cleanerOptions,
    isQAPage: qaInfo?.isQAPage || false,
  };
  const cleanedHtml = cleanHtml(html, cleanerOptions);
  readabilityResult = extractWithReadability(cleanedHtml, url, opts.readabilityOptions);

  if (isValidReadabilityResult(readabilityResult, opts.minContentLength)) {
    return createSuccessResult(readabilityResult, title, qaInfo);
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
      qaInfo,
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
    qaInfo,
  };
}

/**
 * Creates a successful extraction result from Readability output
 */
function createSuccessResult(
  result: ReadabilityResult,
  fallbackTitle: string,
  qaInfo?: QAPageInfo,
): ExtractionResult {
  return {
    success: true,
    title: result.title || fallbackTitle || 'Untitled',
    contentHtml: result.content,
    textContent: result.textContent,
    contentLength: result.length,
    excerpt: result.excerpt,
    qaInfo,
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
export { ALL_BOILERPLATE_SELECTORS, createSelectorString, QA_PRESERVE_SELECTORS, QA_REMOVE_SELECTORS } from './selectors.js';
export { detectQAPage, isKnownQADomain, type QAPageInfo } from './qa-detector.js';
export { extractQAContent, extractMultipleSections, type QAContent } from './multi-selector.js';
