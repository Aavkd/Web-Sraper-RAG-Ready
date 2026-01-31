/**
 * Page request handlers for the crawler
 * Handles page processing, link extraction, and limit enforcement
 * Includes content quality validation (Phase 4)
 */

import type { PlaywrightCrawlingContext, CheerioCrawlingContext } from 'crawlee';
import type { ActorInput, SkippedPage, PageResult } from '../types/index.js';
import { extractLinks } from './utils.js';
import { extractContent } from '../extraction/index.js';
import { htmlToMarkdown } from '../processing/markdown.js';
import { chunkContent, generatePageId } from '../processing/chunker.js';
import { estimateTokens } from '../processing/tokenizer.js';
import { validateContent } from '../processing/validator.js';

/**
 * Shared state for tracking crawl progress across requests
 */
export interface CrawlState {
  /** Number of pages successfully processed */
  pagesProcessed: number;
  /** Number of pages attempted (including failures) */
  pagesAttempted: number;
  /** Start URL for the crawl */
  startUrl: string;
  /** Actor input configuration */
  input: ActorInput;
  /** Tracks skipped pages and reasons */
  skippedPages: SkippedPage[];
  /** Set of URLs already enqueued to avoid duplicates */
  enqueuedUrls: Set<string>;
  /** Extracted page results */
  extractedPages: PageResult[];
  /** Crawl start time */
  startTime: Date;
}

/**
 * Creates a new crawl state object
 */
export function createCrawlState(startUrl: string, input: ActorInput): CrawlState {
  return {
    pagesProcessed: 0,
    pagesAttempted: 0,
    startUrl,
    input,
    skippedPages: [],
    enqueuedUrls: new Set([startUrl]),
    extractedPages: [],
    startTime: new Date(),
  };
}

/**
 * Checks if we've reached the maximum page limit
 */
export function hasReachedPageLimit(state: CrawlState): boolean {
  return state.pagesProcessed >= state.input.maxPages;
}

/**
 * Checks if a request exceeds the maximum depth limit
 */
export function exceedsDepthLimit(depth: number, maxDepth: number): boolean {
  return depth > maxDepth;
}

/**
 * Handler context type that works with both Playwright and Cheerio crawlers
 */
export type CrawlerContext = PlaywrightCrawlingContext | CheerioCrawlingContext;

/**
 * Creates the default request handler for processing pages
 * This handler:
 * 1. Checks page limits
 * 2. Extracts page content using the extraction pipeline
 * 3. Converts to Markdown and chunks for RAG
 * 4. Extracts and enqueues internal links
 */
export function createDefaultHandler(state: CrawlState) {
  return async (context: CrawlerContext) => {
    const { request, log, enqueueLinks } = context;
    const { url } = request;
    const depth = (request.userData?.depth as number) ?? 0;

    // Increment attempted count
    state.pagesAttempted++;

    // Check page limit
    if (hasReachedPageLimit(state)) {
      log.info(`Page limit reached (${state.input.maxPages}), skipping: ${url}`);
      state.skippedPages.push({ url, reason: 'max_pages_reached' });
      return;
    }

    // Check depth limit
    if (exceedsDepthLimit(depth, state.input.maxDepth)) {
      log.info(`Depth limit exceeded (${state.input.maxDepth}), skipping: ${url}`);
      state.skippedPages.push({ url, reason: 'max_depth_exceeded' });
      return;
    }

    log.info(`Processing page [${state.pagesProcessed + 1}/${state.input.maxPages}]: ${url} (depth: ${depth})`);

    // Extract HTML content from the page
    let html: string;
    if ('page' in context) {
      // Playwright crawler - get content from page
      const playwrightContext = context as PlaywrightCrawlingContext;
      html = await playwrightContext.page.content();
    } else {
      // Cheerio crawler - get content from body
      html = context.body as string;
    }

    // Run the content extraction pipeline
    const extractionResult = extractContent(html, url);

    if (!extractionResult.success) {
      log.warning(`Extraction failed for ${url}: ${extractionResult.error}`);
      state.skippedPages.push({
        url,
        reason: 'extraction_failed',
        message: extractionResult.error,
      });
      // Still increment processed count but don't add to extracted pages
      state.pagesProcessed++;
    } else {
      // Convert extracted HTML to Markdown
      const markdown = htmlToMarkdown(extractionResult.contentHtml);
      const tokensEstimate = estimateTokens(markdown);

      // Phase 4: Validate content quality
      const qualityReport = validateContent(markdown);
      if (!qualityReport.isValid) {
        const issueTypes = qualityReport.issues.map(i => i.type).join(', ');
        log.warning(`Quality issues detected for ${url}: ${issueTypes} (score: ${qualityReport.qualityScore})`);
      }

      // Generate page ID and optionally chunk the content
      const pageId = generatePageId(url);
      const chunks = state.input.enableChunking
        ? chunkContent(markdown, {
          targetSize: state.input.chunkSize,
          pageId,
          sourceUrl: url,
          pageTitle: extractionResult.title,
        })
        : [];

      // Create the page result with quality info
      const pageResult: PageResult = {
        url,
        title: extractionResult.title,
        markdown,
        chunks,
        metadata: {
          url,
          title: extractionResult.title,
          depth,
          crawledAt: new Date().toISOString(),
          tokensEstimate,
        },
      };

      // Add to extracted pages
      state.extractedPages.push(pageResult);
      state.pagesProcessed++;

      const chunkInfo = state.input.enableChunking ? `, ${chunks.length} chunks` : '';
      const qualityInfo = qualityReport.isValid ? '' : ` [quality: ${qualityReport.qualityScore}]`;
      log.info(`Extracted: ${extractionResult.title} (${tokensEstimate} tokens${chunkInfo})${qualityInfo}`);
    }

    // Don't enqueue more links if we've hit the page limit
    if (hasReachedPageLimit(state)) {
      log.info(`Page limit reached after processing ${url}`);
      return;
    }

    // Extract and enqueue internal links
    // Get all hrefs from the page
    let hrefs: string[] = [];
    if ('page' in context) {
      // Playwright - use page.evaluate
      const playwrightContext = context as PlaywrightCrawlingContext;
      hrefs = await playwrightContext.page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.getAttribute('href'))
          .filter((href): href is string => href !== null);
      });
    } else {
      // Cheerio - use $ selector
      const $ = context.$;
      hrefs = $('a[href]')
        .map((_, el) => $(el).attr('href'))
        .get()
        .filter((href): href is string => typeof href === 'string');
    }

    // Filter links using our utility
    const validLinks = extractLinks(
      url,
      hrefs,
      state.startUrl,
      state.input.includePaths,
      state.input.excludePaths,
    );

    // Filter out already-enqueued URLs and enqueue new ones
    const newLinks = validLinks.filter(link => !state.enqueuedUrls.has(link));

    // Limit how many we enqueue to avoid explosion
    const maxToEnqueue = Math.min(newLinks.length, state.input.maxPages - state.pagesProcessed);
    const linksToEnqueue = newLinks.slice(0, maxToEnqueue);

    for (const link of linksToEnqueue) {
      state.enqueuedUrls.add(link);
    }

    if (linksToEnqueue.length > 0) {
      log.info(`Enqueueing ${linksToEnqueue.length} new links from ${url}`);

      // Use Crawlee's enqueueLinks with our filtered URLs
      await enqueueLinks({
        urls: linksToEnqueue,
        userData: { depth: depth + 1 },
      });
    }
  };
}

/**
 * Creates an error handler for failed requests
 */
export function createErrorHandler(state: CrawlState) {
  return async ({ request, log }: { request: { url: string }; log: { error: (msg: string) => void } }, error: Error) => {
    const { url } = request;

    log.error(`Failed to process ${url}: ${error.message}`);

    state.skippedPages.push({
      url,
      reason: 'error',
      message: error.message,
    });
  };
}
