/**
 * Crawl summary generation
 * Calculates and formats statistics about the crawl
 */

import type { CrawlSummary, PageResult, SkippedPage } from '../types/index.js';
import { estimateTokens } from '../processing/tokenizer.js';

/**
 * Options for generating a crawl summary
 */
export interface SummaryOptions {
  /** Successfully extracted pages */
  pages: PageResult[];
  /** Pages that were skipped */
  skippedPages: SkippedPage[];
  /** Number of pages attempted */
  pagesAttempted: number;
  /** Crawl start time */
  startTime: Date;
  /** Crawl end time (defaults to now) */
  endTime?: Date;
}

/**
 * Generates a summary of the crawl results
 * 
 * @param options - Summary generation options
 * @returns CrawlSummary with statistics
 */
export function generateSummary(options: SummaryOptions): CrawlSummary {
  const { pages, skippedPages, pagesAttempted, startTime, endTime = new Date() } = options;

  // Calculate total tokens across all pages
  const totalTokensEstimate = pages.reduce((total, page) => {
    return total + page.metadata.tokensEstimate;
  }, 0);

  return {
    pagesAttempted,
    pagesExtracted: pages.length,
    pagesSkipped: skippedPages.length,
    totalTokensEstimate,
    startTime,
    endTime,
  };
}

/**
 * Detailed summary with additional breakdowns
 */
export interface DetailedSummary extends CrawlSummary {
  /** Duration in milliseconds */
  durationMs: number;
  /** Average tokens per page */
  avgTokensPerPage: number;
  /** Total chunks generated */
  totalChunks: number;
  /** Average chunks per page */
  avgChunksPerPage: number;
  /** Breakdown of skip reasons */
  skipReasons: Record<string, number>;
}

/**
 * Generates a detailed summary with additional analytics
 * 
 * @param options - Summary generation options
 * @returns Detailed summary with breakdowns
 */
export function generateDetailedSummary(options: SummaryOptions): DetailedSummary {
  const baseSummary = generateSummary(options);
  const { pages, skippedPages } = options;

  // Calculate duration
  const durationMs = baseSummary.endTime.getTime() - baseSummary.startTime.getTime();

  // Calculate chunk statistics
  const totalChunks = pages.reduce((total, page) => total + page.chunks.length, 0);
  const avgChunksPerPage = pages.length > 0 ? totalChunks / pages.length : 0;

  // Calculate average tokens per page
  const avgTokensPerPage = pages.length > 0 
    ? baseSummary.totalTokensEstimate / pages.length 
    : 0;

  // Count skip reasons
  const skipReasons: Record<string, number> = {};
  for (const skipped of skippedPages) {
    skipReasons[skipped.reason] = (skipReasons[skipped.reason] ?? 0) + 1;
  }

  return {
    ...baseSummary,
    durationMs,
    avgTokensPerPage: Math.round(avgTokensPerPage),
    totalChunks,
    avgChunksPerPage: Math.round(avgChunksPerPage * 10) / 10,
    skipReasons,
  };
}

/**
 * Formats summary for console logging
 * 
 * @param summary - The crawl summary (basic or detailed)
 * @returns Formatted string for console output
 */
export function formatSummaryForLog(summary: CrawlSummary | DetailedSummary): string {
  const lines: string[] = [];
  const isDetailed = 'durationMs' in summary;

  lines.push('='.repeat(50));
  lines.push('CRAWL SUMMARY');
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(`Pages attempted:    ${summary.pagesAttempted}`);
  lines.push(`Pages extracted:    ${summary.pagesExtracted}`);
  lines.push(`Pages skipped:      ${summary.pagesSkipped}`);
  lines.push(`Total tokens:       ~${summary.totalTokensEstimate.toLocaleString()}`);

  if (isDetailed) {
    const detailed = summary as DetailedSummary;
    const durationSeconds = Math.round(detailed.durationMs / 1000);
    
    lines.push('');
    lines.push(`Duration:           ${durationSeconds}s`);
    lines.push(`Avg tokens/page:    ~${detailed.avgTokensPerPage.toLocaleString()}`);
    lines.push(`Total chunks:       ${detailed.totalChunks}`);
    lines.push(`Avg chunks/page:    ${detailed.avgChunksPerPage}`);

    if (Object.keys(detailed.skipReasons).length > 0) {
      lines.push('');
      lines.push('Skip reasons:');
      for (const [reason, count] of Object.entries(detailed.skipReasons)) {
        lines.push(`  - ${reason}: ${count}`);
      }
    }
  }

  lines.push('');
  lines.push('='.repeat(50));

  return lines.join('\n');
}

/**
 * Creates a summary object suitable for JSON serialization
 * Converts Date objects to ISO strings
 * 
 * @param summary - The crawl summary
 * @returns Serializable summary object
 */
export function serializeSummary(summary: CrawlSummary): {
  pagesAttempted: number;
  pagesExtracted: number;
  pagesSkipped: number;
  totalTokensEstimate: number;
  startTime: string;
  endTime: string;
  durationSeconds: number;
} {
  const durationMs = summary.endTime.getTime() - summary.startTime.getTime();

  return {
    pagesAttempted: summary.pagesAttempted,
    pagesExtracted: summary.pagesExtracted,
    pagesSkipped: summary.pagesSkipped,
    totalTokensEstimate: summary.totalTokensEstimate,
    startTime: summary.startTime.toISOString(),
    endTime: summary.endTime.toISOString(),
    durationSeconds: Math.round(durationMs / 1000),
  };
}

/**
 * Validates that the summary statistics are consistent
 * 
 * @param summary - The summary to validate
 * @returns Validation result
 */
export function validateSummary(summary: CrawlSummary): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check that pages add up
  if (summary.pagesExtracted + summary.pagesSkipped > summary.pagesAttempted) {
    errors.push(
      `Extracted (${summary.pagesExtracted}) + Skipped (${summary.pagesSkipped}) > Attempted (${summary.pagesAttempted})`,
    );
  }

  // Check that dates are valid
  if (summary.endTime < summary.startTime) {
    errors.push('End time is before start time');
  }

  // Check that token count is non-negative
  if (summary.totalTokensEstimate < 0) {
    errors.push('Total tokens is negative');
  }

  // Check for unrealistic token counts
  if (summary.pagesExtracted > 0 && summary.totalTokensEstimate === 0) {
    errors.push('Extracted pages but zero tokens');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates token statistics from raw content
 * Useful when PageResult metadata isn't yet populated
 * 
 * @param contents - Array of markdown content strings
 * @returns Token statistics
 */
export function calculateTokenStats(contents: string[]): {
  total: number;
  min: number;
  max: number;
  avg: number;
} {
  if (contents.length === 0) {
    return { total: 0, min: 0, max: 0, avg: 0 };
  }

  const tokenCounts = contents.map(estimateTokens);
  const total = tokenCounts.reduce((a, b) => a + b, 0);

  return {
    total,
    min: Math.min(...tokenCounts),
    max: Math.max(...tokenCounts),
    avg: Math.round(total / tokenCounts.length),
  };
}
