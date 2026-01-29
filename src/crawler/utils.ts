/**
 * Crawling utility functions
 * Handles URL filtering, validation, and path matching
 */

import { SKIP_EXTENSIONS } from '../input/defaults.js';

/**
 * Extracts the origin (protocol + host) from a URL
 */
export function getOrigin(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return '';
  }
}

/**
 * Checks if a URL is internal (same origin as the start URL)
 */
export function isInternalUrl(url: string, startUrl: string): boolean {
  try {
    const urlOrigin = getOrigin(url);
    const startOrigin = getOrigin(startUrl);
    return urlOrigin === startOrigin && urlOrigin !== '';
  } catch {
    return false;
  }
}

/**
 * Checks if a URL points to a binary/asset file that should be skipped
 */
export function isBinaryUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    
    // Check against known binary extensions
    return SKIP_EXTENSIONS.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Matches a URL path against a pattern
 * Supports simple glob patterns with * wildcard
 * @param pathname - The URL pathname to check
 * @param pattern - The pattern to match against (e.g., "/docs/*", "/blog*")
 */
export function matchesPathPattern(pathname: string, pattern: string): boolean {
  // Normalize paths to always start with /
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const normalizedPattern = pattern.startsWith('/') ? pattern : `/${pattern}`;
  
  // Convert glob pattern to regex
  // Escape special regex chars except *
  const escapedPattern = normalizedPattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  
  const regex = new RegExp(`^${escapedPattern}$`);
  return regex.test(normalizedPath);
}

/**
 * Checks if a URL should be included based on includePaths patterns
 * If includePaths is empty, all paths are included
 */
export function shouldIncludePath(url: string, includePaths: string[]): boolean {
  if (includePaths.length === 0) {
    return true; // Include all if no patterns specified
  }
  
  try {
    const parsed = new URL(url);
    return includePaths.some(pattern => matchesPathPattern(parsed.pathname, pattern));
  } catch {
    return false;
  }
}

/**
 * Checks if a URL should be excluded based on excludePaths patterns
 */
export function shouldExcludePath(url: string, excludePaths: string[]): boolean {
  if (excludePaths.length === 0) {
    return false; // Exclude nothing if no patterns specified
  }
  
  try {
    const parsed = new URL(url);
    return excludePaths.some(pattern => matchesPathPattern(parsed.pathname, pattern));
  } catch {
    return false;
  }
}

/**
 * Comprehensive URL filter that checks all conditions
 * Returns null if URL should be crawled, or a skip reason if it should be skipped
 */
export function shouldCrawlUrl(
  url: string,
  startUrl: string,
  includePaths: string[],
  excludePaths: string[],
): { shouldCrawl: true } | { shouldCrawl: false; reason: string } {
  // Check if URL is valid
  try {
    new URL(url);
  } catch {
    return { shouldCrawl: false, reason: 'invalid_url' };
  }
  
  // Check if internal link
  if (!isInternalUrl(url, startUrl)) {
    return { shouldCrawl: false, reason: 'external_link' };
  }
  
  // Check if binary file
  if (isBinaryUrl(url)) {
    return { shouldCrawl: false, reason: 'binary_file' };
  }
  
  // Check include patterns
  if (!shouldIncludePath(url, includePaths)) {
    return { shouldCrawl: false, reason: 'not_in_include_paths' };
  }
  
  // Check exclude patterns
  if (shouldExcludePath(url, excludePaths)) {
    return { shouldCrawl: false, reason: 'excluded_path' };
  }
  
  return { shouldCrawl: true };
}

/**
 * Normalizes a URL by removing hash fragments and trailing slashes
 * This helps deduplicate URLs that point to the same content
 */
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove hash fragment
    parsed.hash = '';
    // Remove trailing slash (except for root path)
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Extracts all valid internal links from a page
 */
export function extractLinks(
  pageUrl: string,
  hrefs: string[],
  startUrl: string,
  includePaths: string[],
  excludePaths: string[],
): string[] {
  const validLinks: string[] = [];
  const seen = new Set<string>();
  
  for (const href of hrefs) {
    // Skip empty or fragment-only links
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }
    
    // Resolve relative URLs
    let absoluteUrl: string;
    try {
      absoluteUrl = new URL(href, pageUrl).toString();
    } catch {
      continue; // Skip invalid URLs
    }
    
    // Normalize to deduplicate
    const normalized = normalizeUrl(absoluteUrl);
    
    // Skip if already seen
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    
    // Check if we should crawl this URL
    const result = shouldCrawlUrl(normalized, startUrl, includePaths, excludePaths);
    if (result.shouldCrawl) {
      validLinks.push(normalized);
    }
  }
  
  return validLinks;
}
