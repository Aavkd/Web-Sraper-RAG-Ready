/**
 * Output formatting utilities
 * Generates JSON and Markdown outputs from crawl results
 */

import type { CrawlOutput, PageResult, CrawlSummary, Chunk } from '../types/index.js';

/**
 * Output format options
 */
export type OutputFormat = 'json' | 'markdown' | 'both';

/**
 * Formatted output container
 */
export interface FormattedOutput {
  /** JSON output (if format is 'json' or 'both') */
  json?: CrawlOutput;
  /** Combined Markdown file content (if format is 'markdown' or 'both') */
  markdown?: string;
}

/**
 * Options for formatting output
 */
export interface FormatOptions {
  /** The starting URL that was crawled */
  source: string;
  /** Crawl summary statistics */
  summary: CrawlSummary;
  /** Extracted pages with chunks */
  pages: PageResult[];
  /** Desired output format */
  format: OutputFormat;
}

/**
 * Formats crawl results into the requested output format(s)
 * 
 * @param options - Formatting options including pages and format type
 * @returns Formatted output in JSON and/or Markdown
 */
export function formatOutput(options: FormatOptions): FormattedOutput {
  const { source, summary, pages, format } = options;
  const result: FormattedOutput = {};

  if (format === 'json' || format === 'both') {
    result.json = formatAsJson(source, summary, pages);
  }

  if (format === 'markdown' || format === 'both') {
    result.markdown = formatAsMarkdown(source, summary, pages);
  }

  return result;
}

/**
 * Formats crawl results as structured JSON
 * 
 * @param source - The starting URL
 * @param summary - Crawl summary statistics
 * @param pages - Extracted pages
 * @returns CrawlOutput object matching SPECS.md schema
 */
export function formatAsJson(
  source: string,
  summary: CrawlSummary,
  pages: PageResult[],
): CrawlOutput {
  return {
    source,
    crawledAt: new Date().toISOString(),
    summary,
    pages: pages.map(page => ({
      url: page.url,
      title: page.title,
      markdown: page.markdown,
      chunks: page.chunks,
      metadata: page.metadata,
    })),
  };
}

/**
 * Formats crawl results as a combined Markdown file
 * Includes a summary header and all page content
 * 
 * @param source - The starting URL
 * @param summary - Crawl summary statistics
 * @param pages - Extracted pages
 * @returns Combined Markdown string
 */
export function formatAsMarkdown(
  source: string,
  summary: CrawlSummary,
  pages: PageResult[],
): string {
  const sections: string[] = [];

  // Header with metadata
  sections.push(formatMarkdownHeader(source, summary));

  // Table of contents
  if (pages.length > 1) {
    sections.push(formatTableOfContents(pages));
  }

  // Page content
  for (const page of pages) {
    sections.push(formatPageAsMarkdown(page));
  }

  return sections.join('\n\n---\n\n');
}

/**
 * Formats the Markdown file header with crawl metadata
 */
function formatMarkdownHeader(source: string, summary: CrawlSummary): string {
  const duration = summary.endTime.getTime() - summary.startTime.getTime();
  const durationSeconds = Math.round(duration / 1000);

  return `# Extracted Content from ${new URL(source).hostname}

**Source:** ${source}
**Crawled:** ${summary.endTime.toISOString()}
**Pages:** ${summary.pagesExtracted} extracted, ${summary.pagesSkipped} skipped
**Tokens:** ~${summary.totalTokensEstimate.toLocaleString()} estimated
**Duration:** ${durationSeconds}s`;
}

/**
 * Formats a table of contents for multiple pages
 */
function formatTableOfContents(pages: PageResult[]): string {
  const lines = ['## Table of Contents', ''];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const anchor = generateAnchor(page.title || page.url);
    lines.push(`${i + 1}. [${page.title || page.url}](#${anchor})`);
  }

  return lines.join('\n');
}

/**
 * Formats a single page as Markdown section
 */
function formatPageAsMarkdown(page: PageResult): string {
  const lines: string[] = [];

  // Page title as heading
  const title = page.title || 'Untitled Page';
  lines.push(`## ${title}`);
  lines.push('');

  // Page metadata
  lines.push(`> Source: ${page.url}`);
  lines.push(`> Tokens: ~${page.metadata.tokensEstimate.toLocaleString()}`);
  lines.push('');

  // Page content
  lines.push(page.markdown);

  return lines.join('\n');
}

/**
 * Generates a URL-safe anchor from a heading
 */
function generateAnchor(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

/**
 * Formats chunks for individual dataset entries
 * Useful when pushing chunks as separate dataset items
 * 
 * @param chunks - Array of chunks from one or more pages
 * @returns Array of chunk objects ready for dataset
 */
export function formatChunksForDataset(chunks: Chunk[]): Array<{
  id: string;
  content: string;
  tokensEstimate: number;
  sourceUrl: string;
  pageTitle: string;
}> {
  return chunks.map(chunk => ({
    id: chunk.id,
    content: chunk.content,
    tokensEstimate: chunk.tokensEstimate,
    sourceUrl: chunk.sourceUrl,
    pageTitle: chunk.pageTitle,
  }));
}

/**
 * Creates a minimal JSON output without full markdown content
 * Useful for summary views or when full content is stored separately
 * 
 * @param source - The starting URL
 * @param summary - Crawl summary statistics
 * @param pages - Extracted pages
 * @returns Minimal output with chunk counts instead of full content
 */
export function formatMinimalJson(
  source: string,
  summary: CrawlSummary,
  pages: PageResult[],
): {
  source: string;
  crawledAt: string;
  summary: CrawlSummary;
  pages: Array<{
    url: string;
    title: string;
    chunkCount: number;
    tokensEstimate: number;
  }>;
} {
  return {
    source,
    crawledAt: new Date().toISOString(),
    summary,
    pages: pages.map(page => ({
      url: page.url,
      title: page.title,
      chunkCount: page.chunks.length,
      tokensEstimate: page.metadata.tokensEstimate,
    })),
  };
}

/**
 * Validates that output is within acceptable size limits
 * 
 * @param output - The formatted output to validate
 * @param maxBytes - Maximum allowed size in bytes (default: 10MB)
 * @returns Validation result with size info
 */
export function validateOutputSize(
  output: FormattedOutput,
  maxBytes: number = 10 * 1024 * 1024,
): {
  valid: boolean;
  jsonBytes?: number;
  markdownBytes?: number;
  message?: string;
} {
  const jsonBytes = output.json
    ? Buffer.byteLength(JSON.stringify(output.json), 'utf8')
    : undefined;

  const markdownBytes = output.markdown
    ? Buffer.byteLength(output.markdown, 'utf8')
    : undefined;

  const totalBytes = (jsonBytes ?? 0) + (markdownBytes ?? 0);

  if (totalBytes > maxBytes) {
    return {
      valid: false,
      jsonBytes,
      markdownBytes,
      message: `Output size (${(totalBytes / 1024 / 1024).toFixed(2)}MB) exceeds limit (${(maxBytes / 1024 / 1024).toFixed(2)}MB)`,
    };
  }

  return {
    valid: true,
    jsonBytes,
    markdownBytes,
  };
}
