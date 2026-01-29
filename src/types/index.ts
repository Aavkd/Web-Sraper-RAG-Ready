/**
 * Core type definitions for the Web Content Scraper Actor
 */

/**
 * Actor input configuration - validated at runtime by Zod schema
 */
export interface ActorInput {
  /** The starting URL to crawl */
  startUrl: string;
  /** Maximum number of pages to crawl (default: 20) */
  maxPages: number;
  /** Maximum link depth from start URL (default: 2) */
  maxDepth: number;
  /** Only crawl URLs matching these path patterns */
  includePaths: string[];
  /** Skip URLs matching these path patterns */
  excludePaths: string[];
  /** Target chunk size in tokens (default: 600) */
  chunkSize: number;
  /** Output format selection */
  outputFormat: 'json' | 'markdown' | 'both';
  /** Enable content chunking for RAG (default: true) */
  enableChunking: boolean;
  /** Strip References/Bibliography sections (default: true) */
  stripReferences: boolean;
}

/**
 * Metadata associated with an extracted page
 */
export interface PageMetadata {
  /** Original URL of the page */
  url: string;
  /** Page title from document */
  title: string;
  /** Crawl depth from start URL */
  depth: number;
  /** ISO timestamp when page was crawled */
  crawledAt: string;
  /** Estimated token count for full page content */
  tokensEstimate: number;
}

/**
 * A chunk of content optimized for RAG/LLM consumption
 */
export interface Chunk {
  /** Unique identifier (e.g., "page1_chunk3") */
  id: string;
  /** The clean markdown content */
  content: string;
  /** Estimated token count for this chunk */
  tokensEstimate: number;
  /** Source URL this chunk was extracted from */
  sourceUrl: string;
  /** Title of the source page */
  pageTitle: string;
}

/**
 * Result of extracting content from a single page
 */
export interface PageResult {
  /** Original URL of the page */
  url: string;
  /** Page title */
  title: string;
  /** Full page content as clean markdown */
  markdown: string;
  /** Content split into RAG-ready chunks */
  chunks: Chunk[];
  /** Additional page metadata */
  metadata: PageMetadata;
}

/**
 * Summary statistics for the entire crawl
 */
export interface CrawlSummary {
  /** Number of pages the crawler attempted to load */
  pagesAttempted: number;
  /** Number of pages successfully extracted */
  pagesExtracted: number;
  /** Number of pages skipped (errors, blocked, etc.) */
  pagesSkipped: number;
  /** Total estimated tokens across all extracted content */
  totalTokensEstimate: number;
  /** Crawl start time */
  startTime: Date;
  /** Crawl end time */
  endTime: Date;
}

/**
 * Final output structure pushed to Apify dataset
 */
export interface CrawlOutput {
  /** The starting URL that was crawled */
  source: string;
  /** ISO timestamp when crawl completed */
  crawledAt: string;
  /** Summary statistics */
  summary: CrawlSummary;
  /** All extracted pages with their chunks */
  pages: PageResult[];
}

/**
 * Reasons a page might be skipped during crawl
 */
export type SkipReason =
  | 'external_link'
  | 'binary_file'
  | 'excluded_path'
  | 'max_depth_exceeded'
  | 'max_pages_reached'
  | 'extraction_failed'
  | 'blocked'
  | 'error';

/**
 * Record of a skipped page for reporting
 */
export interface SkippedPage {
  url: string;
  reason: SkipReason;
  message?: string;
}
