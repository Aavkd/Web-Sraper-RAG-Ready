/**
 * Crawler factory and orchestration
 * Creates and configures the appropriate crawler based on input
 */

import { PlaywrightCrawler, CheerioCrawler, Configuration, RequestQueue } from 'crawlee';
import { Actor } from 'apify';
import type { ActorInput, PageResult, SkippedPage } from '../types/index.js';
import { createCrawlState, createDefaultHandler, createErrorHandler, type CrawlState } from './handlers.js';
import { normalizeUrl } from './utils.js';

/**
 * Crawler type selection
 * - 'cheerio': Fast, lightweight, for static HTML pages
 * - 'playwright': Full browser, for JS-rendered content
 */
export type CrawlerType = 'cheerio' | 'playwright';

/**
 * Result returned from a crawl run
 */
export interface CrawlResult {
  /** Successfully extracted pages */
  pages: PageResult[];
  /** Pages that were skipped */
  skippedPages: SkippedPage[];
  /** Total pages attempted */
  pagesAttempted: number;
  /** Total pages processed successfully */
  pagesProcessed: number;
}

/**
 * Configuration options for the crawler
 */
export interface CrawlerConfig {
  /** The actor input configuration */
  input: ActorInput;
  /** Type of crawler to use */
  crawlerType?: CrawlerType;
  /** Optional request handler override (for testing) */
  requestHandler?: (context: unknown) => Promise<void>;
  /** Enable state persistence for crash recovery */
  persistState?: boolean;
}

/**
 * Creates a configured crawler instance
 * By default uses Cheerio for performance, but can switch to Playwright
 * for JavaScript-rendered sites
 */
export async function createCrawler(config: CrawlerConfig): Promise<{
  crawler: PlaywrightCrawler | CheerioCrawler;
  state: CrawlState;
}> {
  const { input, crawlerType = 'cheerio', persistState = true } = config;
  const startUrl = normalizeUrl(input.startUrl);
  
  // Create shared state for tracking progress
  const state = createCrawlState(startUrl, input);
  
  // Create handlers
  const requestHandler = config.requestHandler ?? createDefaultHandler(state);
  const failedRequestHandler = createErrorHandler(state);

  // Use Apify's request queue when running on platform for persistence
  const requestQueue = persistState
    ? await Actor.openRequestQueue()
    : await RequestQueue.open();

  // Common crawler options
  const commonOptions = {
    requestQueue,
    maxRequestsPerCrawl: input.maxPages * 2, // Allow some buffer for skipped pages
    maxConcurrency: 5, // Reasonable concurrency to avoid rate limiting
    requestHandlerTimeoutSecs: 60,
    navigationTimeoutSecs: 30,
    maxRequestRetries: 2,
    requestHandler,
    failedRequestHandler,
  };
  
  // Configure Crawlee to use local storage with persistence enabled
  const configuration = new Configuration({
    persistStorage: persistState, // Enable persistence for crash recovery
  });
  
  let crawler: PlaywrightCrawler | CheerioCrawler;
  
  if (crawlerType === 'playwright') {
    crawler = new PlaywrightCrawler(
      {
        ...commonOptions,
        headless: true,
        // Use a lightweight browser context
        launchContext: {
          launchOptions: {
            args: ['--disable-gpu', '--no-sandbox'],
          },
        },
      },
      configuration,
    );
  } else {
    crawler = new CheerioCrawler(
      {
        ...commonOptions,
        // Additional headers to appear more like a real browser
        additionalMimeTypes: ['application/json', 'application/xml'],
      },
      configuration,
    );
  }
  
  return { crawler, state };
}

/**
 * Runs the crawler and returns the results
 */
export async function runCrawler(config: CrawlerConfig): Promise<CrawlResult> {
  const { crawler, state } = await createCrawler(config);
  const startUrl = normalizeUrl(config.input.startUrl);
  
  // Run the crawler with the start URL
  await crawler.run([{
    url: startUrl,
    userData: { depth: 0 },
  }]);
  
  // Return the extracted pages from state
  return {
    pages: state.extractedPages,
    skippedPages: state.skippedPages,
    pagesAttempted: state.pagesAttempted,
    pagesProcessed: state.pagesProcessed,
  };
}

/**
 * Detects whether a site likely requires JavaScript rendering
 * This is a simple heuristic that can be expanded
 */
export function shouldUsePlaywright(url: string): boolean {
  const dynamicSitePatterns = [
    'react',
    'angular',
    'vue',
    'next',
    'nuxt',
    'gatsby',
  ];
  
  // Check if URL contains any dynamic site pattern hints
  const urlLower = url.toLowerCase();
  const matchesPattern = dynamicSitePatterns.some(pattern => urlLower.includes(pattern));
  
  // For now, default to Cheerio unless we detect framework hints
  // Future: could do a quick fetch and check for JS framework indicators
  return matchesPattern;
}
