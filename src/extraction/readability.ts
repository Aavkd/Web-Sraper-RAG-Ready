/**
 * Readability-based content extraction wrapper
 * Uses Mozilla's Readability library (same as Firefox Reader View)
 */

import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

/**
 * Result from Readability extraction
 */
export interface ReadabilityResult {
  /** Article title */
  title: string;
  /** Author name if found */
  byline: string | null;
  /** Article content as HTML */
  content: string;
  /** Plain text content */
  textContent: string;
  /** Content length in characters */
  length: number;
  /** Excerpt/summary */
  excerpt: string;
  /** Site name if found */
  siteName: string | null;
}

/**
 * Options for Readability extraction
 */
export interface ReadabilityOptions {
  /** Maximum number of elements to parse (performance limit) */
  maxElemsToParse?: number;
  /** Number of top candidates to consider */
  nbTopCandidates?: number;
  /** Minimum characters for content to be valid */
  charThreshold?: number;
}

const DEFAULT_OPTIONS: ReadabilityOptions = {
  maxElemsToParse: 0, // 0 = no limit
  nbTopCandidates: 5,
  charThreshold: 500,
};

/**
 * Extracts article content from HTML using Readability
 * @param html - HTML string to extract from
 * @param url - Original URL (used for resolving relative links)
 * @param options - Readability options
 * @returns Extracted content or null if extraction failed
 */
export function extractWithReadability(
  html: string,
  url: string,
  options: ReadabilityOptions = {},
): ReadabilityResult | null {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Create a JSDOM instance with the URL for proper link resolution
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;
    
    // Create Readability instance
    const reader = new Readability(document, {
      maxElemsToParse: opts.maxElemsToParse,
      nbTopCandidates: opts.nbTopCandidates,
      charThreshold: opts.charThreshold,
    });
    
    // Parse and extract article
    const article = reader.parse();
    
    if (!article) {
      return null;
    }
    
    return {
      title: article.title || '',
      byline: article.byline,
      content: article.content || '',
      textContent: article.textContent || '',
      length: article.length || 0,
      excerpt: article.excerpt || '',
      siteName: article.siteName,
    };
  } catch (error) {
    // Readability failed, return null
    console.error('Readability extraction failed:', error);
    return null;
  }
}

/**
 * Checks if Readability extraction result is valid
 * @param result - The extraction result to validate
 * @param minLength - Minimum content length to be considered valid
 * @returns true if the result is valid
 */
export function isValidReadabilityResult(
  result: ReadabilityResult | null,
  minLength: number = 100,
): result is ReadabilityResult {
  if (!result) {
    return false;
  }
  
  // Check minimum content length
  if (result.length < minLength) {
    return false;
  }
  
  // Check that content is not empty
  if (!result.content || result.content.trim() === '') {
    return false;
  }
  
  return true;
}

/**
 * Extracts just the title from HTML without full Readability processing
 * @param html - HTML string
 * @returns Page title or empty string
 */
export function extractTitle(html: string): string {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Try various title sources in order of preference
    // 1. og:title meta tag
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    if (ogTitle) return ogTitle.trim();
    
    // 2. Twitter title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
    if (twitterTitle) return twitterTitle.trim();
    
    // 3. H1 tag
    const h1 = document.querySelector('h1');
    if (h1?.textContent) return h1.textContent.trim();
    
    // 4. Title tag
    const titleTag = document.querySelector('title');
    if (titleTag?.textContent) {
      // Clean up title (often contains site name like "Page Title | Site Name")
      let title = titleTag.textContent.trim();
      // Remove common separators and site names
      const separators = [' | ', ' - ', ' — ', ' :: ', ' » '];
      for (const sep of separators) {
        if (title.includes(sep)) {
          title = title.split(sep)[0].trim();
          break;
        }
      }
      return title;
    }
    
    return '';
  } catch {
    return '';
  }
}
