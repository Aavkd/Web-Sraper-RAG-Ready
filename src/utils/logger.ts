/**
 * Logging utilities for the Web Content Scraper Actor
 * Provides structured, consistent logging with progress tracking
 */

import { log as crawleeLog } from 'crawlee';

/**
 * Log levels for the logger
 */
export type LogLevel = 'debug' | 'info' | 'warning' | 'error';

/**
 * Progress information for crawl status
 */
export interface CrawlProgress {
  pagesProcessed: number;
  maxPages: number;
  currentUrl?: string;
  depth?: number;
}

/**
 * Logger instance with contextual information
 */
export interface Logger {
  debug: (message: string, data?: Record<string, unknown>) => void;
  info: (message: string, data?: Record<string, unknown>) => void;
  warning: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, error?: Error | unknown, data?: Record<string, unknown>) => void;
  progress: (progress: CrawlProgress) => void;
  section: (title: string) => void;
}

/**
 * Creates a logger instance
 * Uses Crawlee's built-in logger when available, falls back to console
 * 
 * @returns Logger instance
 */
export function createLogger(): Logger {
  return {
    debug(message: string, data?: Record<string, unknown>) {
      if (data) {
        crawleeLog.debug(message, data);
      } else {
        crawleeLog.debug(message);
      }
    },

    info(message: string, data?: Record<string, unknown>) {
      if (data) {
        crawleeLog.info(message, data);
      } else {
        crawleeLog.info(message);
      }
    },

    warning(message: string, data?: Record<string, unknown>) {
      if (data) {
        crawleeLog.warning(message, data);
      } else {
        crawleeLog.warning(message);
      }
    },

    error(message: string, error?: Error | unknown, data?: Record<string, unknown>) {
      const errorMessage = error instanceof Error ? error.message : String(error ?? '');
      const errorData = {
        ...data,
        ...(errorMessage ? { error: errorMessage } : {}),
      };
      
      if (Object.keys(errorData).length > 0) {
        crawleeLog.error(message, errorData);
      } else {
        crawleeLog.error(message);
      }
    },

    progress(progress: CrawlProgress) {
      const { pagesProcessed, maxPages, currentUrl, depth } = progress;
      const percentage = Math.round((pagesProcessed / maxPages) * 100);
      
      let message = `Progress: ${pagesProcessed}/${maxPages} pages (${percentage}%)`;
      
      if (currentUrl) {
        message += ` | Current: ${truncateUrl(currentUrl)}`;
      }
      
      if (depth !== undefined) {
        message += ` | Depth: ${depth}`;
      }
      
      crawleeLog.info(message);
    },

    section(title: string) {
      const separator = '='.repeat(50);
      crawleeLog.info('');
      crawleeLog.info(separator);
      crawleeLog.info(title.toUpperCase());
      crawleeLog.info(separator);
    },
  };
}

/**
 * Truncates a URL for display
 * 
 * @param url - The URL to truncate
 * @param maxLength - Maximum length (default: 60)
 * @returns Truncated URL
 */
function truncateUrl(url: string, maxLength: number = 60): string {
  if (url.length <= maxLength) {
    return url;
  }
  
  try {
    const parsed = new URL(url);
    const path = parsed.pathname + parsed.search;
    
    if (path.length > maxLength - 10) {
      return parsed.origin + '/...' + path.slice(-(maxLength - parsed.origin.length - 4));
    }
    
    return url.slice(0, maxLength - 3) + '...';
  } catch {
    return url.slice(0, maxLength - 3) + '...';
  }
}

/**
 * Logs a startup banner with input configuration
 * 
 * @param input - Actor input configuration
 */
export function logStartupBanner(input: {
  startUrl: string;
  maxPages: number;
  maxDepth: number;
  includePaths: string[];
  excludePaths: string[];
  outputFormat: string;
  chunkSize: number;
}): void {
  const logger = createLogger();
  
  logger.section('Web Content Scraper');
  logger.info(`Start URL: ${input.startUrl}`);
  logger.info(`Max pages: ${input.maxPages}`);
  logger.info(`Max depth: ${input.maxDepth}`);
  logger.info(`Chunk size: ${input.chunkSize} tokens`);
  logger.info(`Output format: ${input.outputFormat}`);
  
  if (input.includePaths.length > 0) {
    logger.info(`Include paths: ${input.includePaths.join(', ')}`);
  }
  
  if (input.excludePaths.length > 0) {
    logger.info(`Exclude paths: ${input.excludePaths.join(', ')}`);
  }
  
  logger.info('');
}

/**
 * Logs extraction progress for a single page
 * 
 * @param url - Page URL
 * @param success - Whether extraction succeeded
 * @param tokens - Token count (if successful)
 * @param chunks - Chunk count (if successful)
 */
export function logExtractionResult(
  url: string,
  success: boolean,
  tokens?: number,
  chunks?: number,
): void {
  const logger = createLogger();
  
  if (success) {
    logger.info(`Extracted: ${truncateUrl(url)}`, {
      tokens: tokens ?? 0,
      chunks: chunks ?? 0,
    });
  } else {
    logger.warning(`Extraction failed: ${truncateUrl(url)}`);
  }
}

/**
 * Logs a final summary of the crawl
 * 
 * @param summary - Summary statistics
 */
export function logFinalSummary(summary: {
  pagesExtracted: number;
  pagesSkipped: number;
  totalTokens: number;
  totalChunks: number;
  durationSeconds: number;
}): void {
  const logger = createLogger();
  
  logger.section('Crawl Complete');
  logger.info(`Pages extracted: ${summary.pagesExtracted}`);
  logger.info(`Pages skipped: ${summary.pagesSkipped}`);
  logger.info(`Total tokens: ~${summary.totalTokens.toLocaleString()}`);
  logger.info(`Total chunks: ${summary.totalChunks}`);
  logger.info(`Duration: ${summary.durationSeconds}s`);
  logger.info('');
}

/**
 * Logs skipped pages summary
 * 
 * @param skippedPages - Array of skipped pages
 * @param maxToShow - Maximum number to display (default: 10)
 */
export function logSkippedPages(
  skippedPages: Array<{ url: string; reason: string; message?: string }>,
  maxToShow: number = 10,
): void {
  if (skippedPages.length === 0) {
    return;
  }
  
  const logger = createLogger();
  
  logger.info('');
  logger.info(`Skipped pages (${skippedPages.length} total):`);
  
  const toShow = skippedPages.slice(0, maxToShow);
  for (const page of toShow) {
    logger.info(`  - ${truncateUrl(page.url, 40)} (${page.reason})`);
  }
  
  if (skippedPages.length > maxToShow) {
    logger.info(`  ... and ${skippedPages.length - maxToShow} more`);
  }
}
