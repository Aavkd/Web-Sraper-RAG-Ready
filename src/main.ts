import { Actor } from 'apify';
import { parseAndValidateInput } from './input/schema.js';
import { runCrawler } from './crawler/index.js';
import { formatOutput, validateOutputSize } from './output/formatter.js';
import { generateSummary, formatSummaryForLog, generateDetailedSummary } from './output/summary.js';
import { logStartupBanner, logSkippedPages, logFinalSummary, createLogger } from './utils/logger.js';
import type { PageResult, SkippedPage, CrawlSummary } from './types/index.js';
import type { OutputFormat } from './output/formatter.js';

const logger = createLogger();

/**
 * Stores crawl results to Apify Dataset and Key-Value Store
 * 
 * @param pages - Extracted pages with chunks
 * @param summary - Crawl summary statistics
 * @param source - The starting URL
 * @param outputFormat - Desired output format(s)
 */
async function storeResults(
  pages: PageResult[],
  summary: CrawlSummary,
  source: string,
  outputFormat: OutputFormat,
): Promise<void> {
  // Format output in requested format(s)
  const formattedOutput = formatOutput({
    source,
    summary,
    pages,
    format: outputFormat,
  });

  // Validate output size before storing
  const sizeValidation = validateOutputSize(formattedOutput);
  if (!sizeValidation.valid) {
    logger.warning(`Output size warning: ${sizeValidation.message}`);
  }

  // Store JSON to default dataset (if JSON output requested)
  if (formattedOutput.json) {
    await Actor.pushData(formattedOutput.json);
    logger.info('JSON output pushed to default dataset');
  }

  // Store Markdown to Key-Value Store (if Markdown output requested)
  if (formattedOutput.markdown) {
    const kvStore = await Actor.openKeyValueStore();
    await kvStore.setValue('content.md', formattedOutput.markdown, {
      contentType: 'text/markdown',
    });
    logger.info('Markdown output saved to Key-Value Store as "content.md"');
  }

  // Also store summary separately for easy access
  const kvStore = await Actor.openKeyValueStore();
  await kvStore.setValue('summary.json', {
    source,
    crawledAt: new Date().toISOString(),
    pagesExtracted: summary.pagesExtracted,
    pagesSkipped: summary.pagesSkipped,
    totalTokensEstimate: summary.totalTokensEstimate,
    durationSeconds: Math.round(
      (summary.endTime.getTime() - summary.startTime.getTime()) / 1000,
    ),
  });
  logger.info('Summary saved to Key-Value Store as "summary.json"');
}

/**
 * Logs a detailed crawl summary to console
 * 
 * @param pages - Extracted pages
 * @param skippedPages - Pages that were skipped
 * @param pagesAttempted - Total pages attempted
 * @param startTime - Crawl start time
 */
function logCrawlSummary(
  pages: PageResult[],
  skippedPages: SkippedPage[],
  pagesAttempted: number,
  startTime: Date,
): CrawlSummary {
  const summary = generateSummary({
    pages,
    skippedPages,
    pagesAttempted,
    startTime,
  });

  console.log('\n' + formatSummaryForLog(summary));
  return summary;
}

/**
 * Saves partial results in case of failure
 * Allows recovery of whatever was extracted before the error
 */
async function savePartialResults(
  pages: PageResult[],
  skippedPages: SkippedPage[],
  pagesAttempted: number,
  startTime: Date,
  source: string,
  error: Error | unknown,
): Promise<void> {
  if (pages.length === 0) {
    logger.warning('No pages extracted before failure, nothing to save');
    return;
  }

  logger.info(`Saving ${pages.length} partial results before exit...`);

  const summary = generateSummary({
    pages,
    skippedPages,
    pagesAttempted,
    startTime,
  });

  const kvStore = await Actor.openKeyValueStore();

  // Save partial results
  await kvStore.setValue('partial_results.json', {
    source,
    crawledAt: new Date().toISOString(),
    error: error instanceof Error ? error.message : String(error),
    summary: {
      pagesExtracted: summary.pagesExtracted,
      pagesSkipped: summary.pagesSkipped,
      totalTokensEstimate: summary.totalTokensEstimate,
    },
    pages: pages.map(page => ({
      url: page.url,
      title: page.title,
      chunks: page.chunks,
      metadata: page.metadata,
    })),
  });

  logger.info('Partial results saved to Key-Value Store as "partial_results.json"');
}

/**
 * Main Actor execution
 */
async function main(): Promise<void> {
  const startTime = new Date();
  let extractedPages: PageResult[] = [];
  let skippedPages: SkippedPage[] = [];
  let pagesAttempted = 0;
  let source = '';

  try {
    // 1. Parse and validate input
    const rawInput = await Actor.getInput();
    const input = parseAndValidateInput(rawInput);
    source = input.startUrl;

    // Log startup banner
    logStartupBanner(input);

    // 2. Run the crawler with integrated extraction pipeline
    logger.section('Starting Crawl');
    const result = await runCrawler({ input });

    // Store results from crawler
    extractedPages = result.pages;
    skippedPages = result.skippedPages;
    pagesAttempted = result.pagesAttempted;

    // 3. Generate and log summary
    const summary = logCrawlSummary(
      extractedPages,
      skippedPages,
      pagesAttempted,
      startTime,
    );

    // Log detailed summary with chunk statistics
    const detailedSummary = generateDetailedSummary({
      pages: extractedPages,
      skippedPages,
      pagesAttempted,
      startTime,
    });

    const totalChunks = extractedPages.reduce(
      (sum, page) => sum + page.chunks.length,
      0,
    );

    logFinalSummary({
      pagesExtracted: detailedSummary.pagesExtracted,
      pagesSkipped: detailedSummary.pagesSkipped,
      totalTokens: detailedSummary.totalTokensEstimate,
      totalChunks,
      durationSeconds: Math.round(detailedSummary.durationMs / 1000),
    });

    // Log skipped pages
    logSkippedPages(skippedPages);

    // 4. Store results to Apify Dataset and Key-Value Store
    if (extractedPages.length > 0) {
      logger.section('Storing Results');
      await storeResults(extractedPages, summary, input.startUrl, input.outputFormat);
    } else {
      logger.warning('No pages were extracted. Check if the target site is accessible.');
    }

    logger.info('Actor completed successfully');
  } catch (error) {
    logger.error('Actor failed', error);

    // Try to save partial results
    try {
      await savePartialResults(
        extractedPages,
        skippedPages,
        pagesAttempted,
        startTime,
        source,
        error,
      );
    } catch (saveError) {
      logger.error('Failed to save partial results', saveError);
    }

    throw error;
  }
}

// Initialize and run the Actor
await Actor.init();

try {
  await main();
} finally {
  // Gracefully close the Actor
  await Actor.exit();
}
