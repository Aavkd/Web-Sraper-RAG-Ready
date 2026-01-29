/**
 * Content chunking for RAG pipelines
 * Splits markdown content into LLM-friendly chunks with metadata
 */

import type { Chunk } from '../types/index.js';
import { estimateTokens } from './tokenizer.js';

/**
 * Options for chunking content
 */
export interface ChunkOptions {
  /** Target chunk size in tokens (default: 600) */
  targetSize: number;
  /** Minimum chunk size in tokens - avoid tiny chunks (default: 100) */
  minSize: number;
  /** Maximum chunk size in tokens - hard limit (default: targetSize * 1.5) */
  maxSize: number;
  /** Page identifier for generating chunk IDs */
  pageId: string;
  /** Source URL for chunk metadata */
  sourceUrl: string;
  /** Page title for chunk metadata */
  pageTitle: string;
}

/**
 * Default chunking options
 */
const DEFAULT_CHUNK_OPTIONS: Omit<ChunkOptions, 'pageId' | 'sourceUrl' | 'pageTitle'> = {
  targetSize: 600,
  minSize: 100,
  maxSize: 900,
};

/**
 * Represents a section of content with its heading
 */
interface ContentSection {
  heading: string | null;
  content: string;
  level: number;
}

/**
 * Splits markdown content into RAG-ready chunks
 * 
 * Split priority:
 * 1. Section headings (##, ###)
 * 2. Paragraph breaks
 * 3. Sentence boundaries (last resort)
 * 
 * @param markdown - The markdown content to chunk
 * @param options - Chunking options including metadata
 * @returns Array of chunks with metadata
 */
export function chunkContent(
  markdown: string,
  options: Partial<ChunkOptions> & Pick<ChunkOptions, 'pageId' | 'sourceUrl' | 'pageTitle'>,
): Chunk[] {
  const opts: ChunkOptions = {
    ...DEFAULT_CHUNK_OPTIONS,
    ...options,
    maxSize: options.maxSize ?? Math.ceil((options.targetSize ?? DEFAULT_CHUNK_OPTIONS.targetSize) * 1.5),
  };

  if (!markdown || markdown.trim().length === 0) {
    return [];
  }

  // Step 1: Split by sections (headings)
  const sections = splitByHeadings(markdown);

  // Step 2: Process each section into chunks
  const chunks: Chunk[] = [];
  let chunkIndex = 1;

  for (const section of sections) {
    const sectionChunks = chunkSection(section, opts, chunkIndex);
    chunks.push(...sectionChunks);
    chunkIndex += sectionChunks.length;
  }

  // Step 3: Merge small trailing chunks if possible
  return mergeSmallChunks(chunks, opts);
}

/**
 * Splits markdown content by heading boundaries
 * Preserves heading hierarchy for context
 * 
 * @param markdown - The markdown to split
 * @returns Array of content sections
 */
function splitByHeadings(markdown: string): ContentSection[] {
  const sections: ContentSection[] = [];
  
  // Match markdown headings (## or ### etc.)
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  
  let match: RegExpExecArray | null;
  
  // Collect all heading positions
  const headings: Array<{ index: number; level: number; text: string; fullMatch: string }> = [];
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push({
      index: match.index,
      level: match[1].length,
      text: match[2].trim(),
      fullMatch: match[0],
    });
  }

  // If no headings, treat entire content as one section
  if (headings.length === 0) {
    return [{
      heading: null,
      content: markdown.trim(),
      level: 0,
    }];
  }

  // Extract content before first heading (if any)
  if (headings[0].index > 0) {
    const preContent = markdown.slice(0, headings[0].index).trim();
    if (preContent.length > 0) {
      sections.push({
        heading: null,
        content: preContent,
        level: 0,
      });
    }
  }

  // Process each heading and its content
  for (let i = 0; i < headings.length; i++) {
    const current = headings[i];
    const next = headings[i + 1];
    
    const contentStart = current.index + current.fullMatch.length;
    const contentEnd = next ? next.index : markdown.length;
    
    const content = markdown.slice(contentStart, contentEnd).trim();
    
    sections.push({
      heading: current.text,
      content: content,
      level: current.level,
    });
  }

  return sections;
}

/**
 * Chunks a single section into appropriately sized pieces
 * 
 * @param section - The section to chunk
 * @param options - Chunking options
 * @param startIndex - Starting chunk index
 * @returns Array of chunks
 */
function chunkSection(
  section: ContentSection,
  options: ChunkOptions,
  startIndex: number,
): Chunk[] {
  const chunks: Chunk[] = [];
  
  // Build the full section content with heading if present
  const headingPrefix = section.heading 
    ? `${'#'.repeat(section.level)} ${section.heading}\n\n` 
    : '';
  
  const fullContent = headingPrefix + section.content;
  const tokens = estimateTokens(fullContent);

  // If section fits in one chunk, return as-is
  if (tokens <= options.maxSize) {
    if (tokens >= options.minSize || fullContent.trim().length > 0) {
      chunks.push(createChunk(fullContent.trim(), options, startIndex));
    }
    return chunks;
  }

  // Section too large - split by paragraphs
  const paragraphs = splitByParagraphs(section.content);
  
  let currentChunk = headingPrefix;
  let chunkIndex = startIndex;

  for (const paragraph of paragraphs) {
    const paragraphTokens = estimateTokens(paragraph);
    const currentTokens = estimateTokens(currentChunk);

    // Check if adding this paragraph exceeds target
    if (currentTokens + paragraphTokens > options.targetSize && currentChunk.trim().length > 0) {
      // Save current chunk if it meets minimum size
      if (currentTokens >= options.minSize) {
        chunks.push(createChunk(currentChunk.trim(), options, chunkIndex));
        chunkIndex++;
        currentChunk = '';
      }
    }

    // Handle paragraphs that are individually too large
    if (paragraphTokens > options.maxSize) {
      // First, save any accumulated content
      if (currentChunk.trim().length > 0 && estimateTokens(currentChunk) >= options.minSize) {
        chunks.push(createChunk(currentChunk.trim(), options, chunkIndex));
        chunkIndex++;
        currentChunk = '';
      }
      
      // Split the large paragraph by sentences
      const sentenceChunks = splitLargeParagraph(paragraph, options, chunkIndex);
      chunks.push(...sentenceChunks);
      chunkIndex += sentenceChunks.length;
    } else {
      // Add paragraph to current chunk
      currentChunk += (currentChunk.trim().length > 0 ? '\n\n' : '') + paragraph;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim().length > 0) {
    const finalTokens = estimateTokens(currentChunk);
    if (finalTokens >= options.minSize) {
      chunks.push(createChunk(currentChunk.trim(), options, chunkIndex));
    } else if (chunks.length > 0) {
      // Append to previous chunk if too small
      const lastChunk = chunks[chunks.length - 1];
      const combined = lastChunk.content + '\n\n' + currentChunk.trim();
      if (estimateTokens(combined) <= options.maxSize) {
        lastChunk.content = combined;
        lastChunk.tokensEstimate = estimateTokens(combined);
      } else {
        // Can't merge, keep as separate small chunk
        chunks.push(createChunk(currentChunk.trim(), options, chunkIndex));
      }
    } else {
      // No previous chunks, keep this one even if small
      chunks.push(createChunk(currentChunk.trim(), options, chunkIndex));
    }
  }

  return chunks;
}

/**
 * Splits content by paragraph boundaries
 * Preserves code blocks and lists as units
 * 
 * @param content - Content to split
 * @returns Array of paragraphs
 */
function splitByParagraphs(content: string): string[] {
  const paragraphs: string[] = [];
  
  // Split by double newlines, but preserve code blocks
  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks: string[] = [];
  
  // Replace code blocks with placeholders
  const processedContent = content.replace(codeBlockRegex, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Split by paragraph breaks
  const rawParagraphs = processedContent.split(/\n\n+/);

  for (const para of rawParagraphs) {
    // Restore code blocks
    let restored = para;
    for (let i = 0; i < codeBlocks.length; i++) {
      restored = restored.replace(`__CODE_BLOCK_${i}__`, codeBlocks[i]);
    }
    
    const trimmed = restored.trim();
    if (trimmed.length > 0) {
      paragraphs.push(trimmed);
    }
  }

  return paragraphs;
}

/**
 * Splits a large paragraph by sentence boundaries
 * Used as last resort when paragraphs exceed max size
 * 
 * @param paragraph - The paragraph to split
 * @param options - Chunking options
 * @param startIndex - Starting chunk index
 * @returns Array of chunks
 */
function splitLargeParagraph(
  paragraph: string,
  options: ChunkOptions,
  startIndex: number,
): Chunk[] {
  const chunks: Chunk[] = [];
  
  // Check if it's a code block - don't split code blocks by sentences
  if (paragraph.startsWith('```')) {
    // For very large code blocks, split by lines
    return splitCodeBlock(paragraph, options, startIndex);
  }

  // Check if it's a table - don't split tables
  if (paragraph.includes('|') && paragraph.includes('\n')) {
    // Tables should stay together if possible, or be split by rows
    return splitTable(paragraph, options, startIndex);
  }

  // Split by sentence boundaries
  // Match sentences ending with . ! ? followed by space and capital letter or end of string
  const sentences = splitBySentences(paragraph);
  
  let currentChunk = '';
  let chunkIndex = startIndex;

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence);
    const currentTokens = estimateTokens(currentChunk);

    if (currentTokens + sentenceTokens > options.targetSize && currentChunk.length > 0) {
      chunks.push(createChunk(currentChunk.trim(), options, chunkIndex));
      chunkIndex++;
      currentChunk = '';
    }

    // If a single sentence exceeds max size, we have to hard-split it
    if (sentenceTokens > options.maxSize) {
      if (currentChunk.length > 0) {
        chunks.push(createChunk(currentChunk.trim(), options, chunkIndex));
        chunkIndex++;
        currentChunk = '';
      }
      
      const hardSplitChunks = hardSplitText(sentence, options, chunkIndex);
      chunks.push(...hardSplitChunks);
      chunkIndex += hardSplitChunks.length;
    } else {
      currentChunk += (currentChunk.length > 0 ? ' ' : '') + sentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(createChunk(currentChunk.trim(), options, chunkIndex));
  }

  return chunks;
}

/**
 * Splits text into sentences
 * 
 * @param text - Text to split
 * @returns Array of sentences
 */
function splitBySentences(text: string): string[] {
  // Match sentence-ending punctuation followed by space or end of string
  // Be careful with abbreviations and decimals
  const sentenceRegex = /[^.!?]*[.!?]+(?:\s|$)/g;
  const sentences: string[] = [];
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = sentenceRegex.exec(text)) !== null) {
    sentences.push(match[0].trim());
    lastIndex = match.index + match[0].length;
  }

  // Capture any remaining text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).trim();
    if (remaining.length > 0) {
      sentences.push(remaining);
    }
  }

  // If no sentences found, return the whole text
  if (sentences.length === 0 && text.trim().length > 0) {
    return [text.trim()];
  }

  return sentences;
}

/**
 * Splits a code block by lines when it's too large
 * 
 * @param codeBlock - The code block to split
 * @param options - Chunking options
 * @param startIndex - Starting chunk index
 * @returns Array of chunks
 */
function splitCodeBlock(
  codeBlock: string,
  options: ChunkOptions,
  startIndex: number,
): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = codeBlock.split('\n');
  
  // Extract language identifier from first line
  const firstLine = lines[0];
  const langMatch = firstLine.match(/^```(\w*)/);
  const lang = langMatch ? langMatch[1] : '';
  
  let currentChunk = `\`\`\`${lang}\n`;
  let chunkIndex = startIndex;

  // Skip first and last lines (``` markers)
  for (let i = 1; i < lines.length - 1; i++) {
    const line = lines[i];
    const testChunk = currentChunk + line + '\n';
    
    if (estimateTokens(testChunk + '```') > options.targetSize && currentChunk !== `\`\`\`${lang}\n`) {
      // Close current chunk and start new one
      chunks.push(createChunk(currentChunk + '```', options, chunkIndex));
      chunkIndex++;
      currentChunk = `\`\`\`${lang}\n`;
    }
    
    currentChunk += line + '\n';
  }

  // Close final chunk
  if (currentChunk !== `\`\`\`${lang}\n`) {
    chunks.push(createChunk(currentChunk + '```', options, chunkIndex));
  }

  return chunks;
}

/**
 * Splits a markdown table by rows when it's too large
 * 
 * @param table - The table to split
 * @param options - Chunking options
 * @param startIndex - Starting chunk index
 * @returns Array of chunks
 */
function splitTable(
  table: string,
  options: ChunkOptions,
  startIndex: number,
): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = table.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length < 3) {
    // Too small to be a proper table, treat as regular text
    return [createChunk(table, options, startIndex)];
  }

  // First two lines are header and separator
  const header = lines[0];
  const separator = lines[1];
  const headerBlock = `${header}\n${separator}`;
  
  let currentChunk = headerBlock;
  let chunkIndex = startIndex;

  for (let i = 2; i < lines.length; i++) {
    const row = lines[i];
    const testChunk = currentChunk + '\n' + row;
    
    if (estimateTokens(testChunk) > options.targetSize && currentChunk !== headerBlock) {
      chunks.push(createChunk(currentChunk, options, chunkIndex));
      chunkIndex++;
      currentChunk = headerBlock;
    }
    
    currentChunk += '\n' + row;
  }

  if (currentChunk !== headerBlock) {
    chunks.push(createChunk(currentChunk, options, chunkIndex));
  }

  return chunks;
}

/**
 * Hard splits text at word boundaries when all else fails
 * 
 * @param text - Text to split
 * @param options - Chunking options
 * @param startIndex - Starting chunk index
 * @returns Array of chunks
 */
function hardSplitText(
  text: string,
  options: ChunkOptions,
  startIndex: number,
): Chunk[] {
  const chunks: Chunk[] = [];
  const words = text.split(/\s+/);
  
  let currentChunk = '';
  let chunkIndex = startIndex;

  for (const word of words) {
    const testChunk = currentChunk + (currentChunk.length > 0 ? ' ' : '') + word;
    
    if (estimateTokens(testChunk) > options.targetSize && currentChunk.length > 0) {
      chunks.push(createChunk(currentChunk, options, chunkIndex));
      chunkIndex++;
      currentChunk = word;
    } else {
      currentChunk = testChunk;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(createChunk(currentChunk, options, chunkIndex));
  }

  return chunks;
}

/**
 * Creates a chunk with proper ID and metadata
 * 
 * @param content - Chunk content
 * @param options - Chunking options with metadata
 * @param index - Chunk index for ID generation
 * @returns Complete chunk object
 */
function createChunk(
  content: string,
  options: ChunkOptions,
  index: number,
): Chunk {
  return {
    id: generateChunkId(options.pageId, index),
    content,
    tokensEstimate: estimateTokens(content),
    sourceUrl: options.sourceUrl,
    pageTitle: options.pageTitle,
  };
}

/**
 * Generates a unique chunk ID
 * 
 * @param pageId - The page identifier
 * @param chunkIndex - The chunk index (1-based)
 * @returns Chunk ID string
 */
export function generateChunkId(pageId: string, chunkIndex: number): string {
  // Sanitize pageId to be URL-safe
  const sanitizedPageId = pageId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50); // Limit length
  
  return `${sanitizedPageId}_chunk_${chunkIndex}`;
}

/**
 * Generates a page ID from a URL
 * 
 * @param url - The page URL
 * @returns A sanitized page ID
 */
export function generatePageId(url: string): string {
  try {
    const parsed = new URL(url);
    // Use pathname, removing leading slash and file extensions
    let path = parsed.pathname
      .replace(/^\//, '')
      .replace(/\.[a-z]+$/i, '')
      .replace(/\/+$/, '');
    
    // If path is empty (homepage), use 'home'
    if (!path) {
      path = 'home';
    }
    
    // Sanitize and limit length
    return path
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 50);
  } catch {
    // Fallback for invalid URLs
    return 'page';
  }
}

/**
 * Merges small trailing chunks with previous chunks when possible
 * 
 * @param chunks - Array of chunks to process
 * @param options - Chunking options
 * @returns Optimized array of chunks
 */
function mergeSmallChunks(chunks: Chunk[], options: ChunkOptions): Chunk[] {
  if (chunks.length <= 1) {
    return chunks;
  }

  const result: Chunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const current = chunks[i];
    
    if (result.length === 0) {
      result.push({ ...current });
      continue;
    }

    const previous = result[result.length - 1];
    
    // If current chunk is below minimum and can merge with previous
    if (current.tokensEstimate < options.minSize) {
      const combinedTokens = previous.tokensEstimate + current.tokensEstimate;
      
      if (combinedTokens <= options.maxSize) {
        // Merge with previous
        previous.content = previous.content + '\n\n' + current.content;
        previous.tokensEstimate = estimateTokens(previous.content);
        continue;
      }
    }
    
    result.push({ ...current });
  }

  // Re-index chunks after merging
  return result.map((chunk, index) => ({
    ...chunk,
    id: generateChunkId(
      chunk.id.replace(/_chunk_\d+$/, ''),
      index + 1,
    ),
  }));
}

/**
 * Chunks multiple pages of content
 * 
 * @param pages - Array of pages with markdown content
 * @param targetSize - Target chunk size in tokens
 * @returns Array of all chunks from all pages
 */
export function chunkMultiplePages(
  pages: Array<{ url: string; title: string; markdown: string }>,
  targetSize: number = 600,
): Chunk[] {
  const allChunks: Chunk[] = [];

  for (const page of pages) {
    const pageId = generatePageId(page.url);
    const chunks = chunkContent(page.markdown, {
      targetSize,
      pageId,
      sourceUrl: page.url,
      pageTitle: page.title,
    });
    allChunks.push(...chunks);
  }

  return allChunks;
}
