/**
 * HTML to Markdown conversion with token optimization
 * Uses Turndown with custom rules for clean, LLM-ready output
 */

import TurndownService from 'turndown';
import { estimateTokens } from './tokenizer.js';

/**
 * Noise patterns to remove from markdown output
 * These are common "junk" sections that don't add value for LLMs
 */
const NOISE_PATTERNS: RegExp[] = [
  // Related content sections
  /^#+\s*related\s*(posts?|articles?|content|reading)\s*$/im,
  /^#+\s*you\s*(may|might)\s*(also\s*)?(like|enjoy)\s*$/im,
  /^#+\s*see\s*also\s*$/im,
  /^#+\s*more\s*(from|like\s*this)\s*$/im,
  /^#+\s*recommended\s*(for\s*you)?\s*$/im,
  
  // Social sharing
  /^#+\s*share\s*(this)?\s*(article|post|page)?\s*$/im,
  /^share\s*(on|via)?\s*(facebook|twitter|linkedin|email)/im,
  /^(follow|connect\s*with)\s*us\s*(on)?\s*$/im,
  
  // Comments section headers
  /^#+\s*comments?\s*(\(\d+\))?\s*$/im,
  /^#+\s*leave\s*a\s*(comment|reply)\s*$/im,
  /^#+\s*join\s*the\s*(discussion|conversation)\s*$/im,
  
  // Newsletter/subscription prompts
  /^#+\s*subscribe\s*(to\s*(our|the))?\s*(newsletter)?\s*$/im,
  /^#+\s*sign\s*up\s*(for)?\s*$/im,
  /^#+\s*get\s*(our)?\s*(latest|updates)\s*$/im,
  
  // Navigation elements that might slip through
  /^#+\s*navigation\s*$/im,
  /^#+\s*(main\s*)?menu\s*$/im,
  /^#+\s*skip\s*to\s*(main\s*)?(content)?\s*$/im,
  
  // Author/about sections (often boilerplate)
  /^#+\s*about\s*the\s*author\s*$/im,
  /^#+\s*author\s*(bio)?\s*$/im,
  /^#+\s*written\s*by\s*$/im,
];

/**
 * Patterns for lines to completely remove
 */
const LINE_NOISE_PATTERNS: RegExp[] = [
  // Social share buttons
  /^(share|tweet|pin|post)\s*$/i,
  /^(facebook|twitter|linkedin|pinterest|whatsapp|email)\s*$/i,
  
  // Empty link placeholders
  /^\[\s*\]\(\s*\)\s*$/,
  
  // Standalone icons/emojis that aren't content
  /^[\u{1F300}-\u{1F9FF}]\s*$/u,
  
  // "Read more" links
  /^read\s*more\s*\.{0,3}\s*$/i,
  /^continue\s*reading\s*\.{0,3}\s*$/i,
  /^see\s*more\s*\.{0,3}\s*$/i,
  
  // Time to read indicators
  /^\d+\s*min(ute)?s?\s*read\s*$/i,
  
  // Cookie consent remnants
  /^(accept|reject)\s*(all\s*)?(cookies?)?\s*$/i,
];

/**
 * Options for markdown conversion
 */
export interface MarkdownOptions {
  /** Heading style: 'atx' uses #, 'setext' uses underlines */
  headingStyle?: 'atx' | 'setext';
  /** Code block style: 'fenced' uses ```, 'indented' uses 4 spaces */
  codeBlockStyle?: 'fenced' | 'indented';
  /** Bullet list marker character */
  bulletListMarker?: '-' | '+' | '*';
  /** Whether to normalize heading hierarchy (start from ##) */
  normalizeHeadings?: boolean;
  /** Whether to collapse excessive whitespace */
  normalizeWhitespace?: boolean;
  /** Whether to remove noise sections */
  removeNoise?: boolean;
}

const DEFAULT_OPTIONS: Required<MarkdownOptions> = {
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  normalizeHeadings: true,
  normalizeWhitespace: true,
  removeNoise: true,
};

/**
 * Creates a configured Turndown service with custom rules
 */
function createTurndownService(options: Required<MarkdownOptions>): TurndownService {
  const turndown = new TurndownService({
    headingStyle: options.headingStyle,
    codeBlockStyle: options.codeBlockStyle,
    bulletListMarker: options.bulletListMarker,
    emDelimiter: '*',
    strongDelimiter: '**',
  });

  // Remove empty elements
  turndown.addRule('removeEmpty', {
    filter: (node) => {
      // Keep certain elements even if they appear empty
      if (['BR', 'HR', 'IMG'].includes(node.nodeName)) {
        return false;
      }
      const text = node.textContent?.trim() || '';
      return text === '' && node.childNodes.length === 0;
    },
    replacement: () => '',
  });

  // Handle images - preserve alt text, skip decorative images
  turndown.addRule('images', {
    filter: 'img',
    replacement: (_content, node) => {
      const element = node as HTMLElement;
      const alt = element.getAttribute('alt')?.trim() || '';
      const src = element.getAttribute('src') || '';
      
      // Skip tracking pixels and decorative images
      if (!alt || alt.length < 3) {
        return '';
      }
      
      // Skip data URLs and tracking pixels
      if (src.startsWith('data:') || src.includes('pixel') || src.includes('tracking')) {
        return '';
      }
      
      return `![${alt}](${src})`;
    },
  });

  // Clean up links - remove empty links and normalize
  turndown.addRule('links', {
    filter: 'a',
    replacement: (content, node) => {
      const element = node as HTMLElement;
      const href = element.getAttribute('href') || '';
      const text = content.trim();
      
      // Skip empty links, anchor links, and javascript links
      if (!text || !href || href.startsWith('#') || href.startsWith('javascript:')) {
        return text || '';
      }
      
      // If link text matches URL, just show the URL
      if (text === href) {
        return href;
      }
      
      return `[${text}](${href})`;
    },
  });

  // Remove script and style tags completely
  turndown.remove(['script', 'style', 'noscript', 'iframe', 'form', 'input', 'button', 'select', 'textarea']);

  return turndown;
}

/**
 * Normalizes heading levels so they start from ## (H2)
 * This leaves room for a document title at H1 level
 * 
 * @param markdown - The markdown to normalize
 * @returns Markdown with normalized heading levels
 */
export function normalizeHeadingLevels(markdown: string): string {
  const lines = markdown.split('\n');
  
  // Find the minimum heading level used (excluding ###### which is H6)
  let minLevel = 6;
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s/);
    if (match) {
      minLevel = Math.min(minLevel, match[1].length);
    }
  }
  
  // If already starting at H2 or higher, or no headings found, return as-is
  if (minLevel >= 2 || minLevel === 6) {
    return markdown;
  }
  
  // Calculate the shift needed to make minimum level H2
  const shift = 2 - minLevel;
  
  return lines.map(line => {
    const match = line.match(/^(#{1,6})(\s+.*)$/);
    if (!match) {
      return line;
    }
    
    const currentLevel = match[1].length;
    const newLevel = Math.min(currentLevel + shift, 6); // Cap at H6
    return '#'.repeat(newLevel) + match[2];
  }).join('\n');
}

/**
 * Collapses excessive whitespace while preserving markdown structure
 * 
 * @param markdown - The markdown to normalize
 * @returns Markdown with normalized whitespace
 */
export function normalizeWhitespace(markdown: string): string {
  return markdown
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Collapse multiple blank lines to maximum of 2
    .replace(/\n{3,}/g, '\n\n')
    // Remove trailing whitespace from lines
    .replace(/[ \t]+$/gm, '')
    // Remove leading whitespace from lines (except in code blocks)
    .replace(/^[ \t]+(?![ \t]*[-*+]|\d+\.|```| {4})/gm, '')
    // Collapse multiple spaces to single space
    .replace(/[ \t]{2,}/g, ' ')
    // Ensure headings have blank line before them (unless at start)
    .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
    // Ensure single blank line after headings
    .replace(/(^#{1,6}\s+[^\n]+)\n{3,}/gm, '$1\n\n')
    // Remove blank lines at start and end
    .trim();
}

/**
 * Removes noise sections from markdown (related posts, share buttons, etc.)
 * 
 * @param markdown - The markdown to clean
 * @returns Markdown with noise sections removed
 */
export function removeNoiseSections(markdown: string): string {
  // Remove lines matching noise patterns
  const lines = markdown.split('\n');
  const cleanedLines: string[] = [];
  let skipUntilNextHeading = false;
  
  for (const line of lines) {
    // Check if this line is a noise section heading
    const isNoiseHeading = NOISE_PATTERNS.some(pattern => pattern.test(line));
    
    if (isNoiseHeading) {
      skipUntilNextHeading = true;
      continue;
    }
    
    // If we hit a new heading that's not noise, stop skipping
    if (skipUntilNextHeading && /^#{1,6}\s/.test(line)) {
      skipUntilNextHeading = false;
    }
    
    if (skipUntilNextHeading) {
      continue;
    }
    
    // Check if individual line is noise
    const trimmedLine = line.trim();
    const isNoiseLine = LINE_NOISE_PATTERNS.some(pattern => pattern.test(trimmedLine));
    
    if (!isNoiseLine) {
      cleanedLines.push(line);
    }
  }
  
  return cleanedLines.join('\n');
}

/**
 * Converts HTML to clean, token-optimized Markdown
 * 
 * @param html - The HTML content to convert
 * @param options - Conversion options
 * @returns Clean markdown string
 */
export function htmlToMarkdown(html: string, options: MarkdownOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (!html || html.trim().length === 0) {
    return '';
  }
  
  // Create turndown service and convert
  const turndown = createTurndownService(opts);
  let markdown = turndown.turndown(html);
  
  // Apply post-processing
  if (opts.removeNoise) {
    markdown = removeNoiseSections(markdown);
  }
  
  if (opts.normalizeHeadings) {
    markdown = normalizeHeadingLevels(markdown);
  }
  
  if (opts.normalizeWhitespace) {
    markdown = normalizeWhitespace(markdown);
  }
  
  return markdown;
}

/**
 * Converts HTML to markdown and returns with token statistics
 * 
 * @param html - The HTML content to convert
 * @param options - Conversion options
 * @returns Object with markdown and token estimate
 */
export function htmlToMarkdownWithStats(
  html: string,
  options: MarkdownOptions = {},
): { markdown: string; tokensEstimate: number; compressionRatio: number } {
  const markdown = htmlToMarkdown(html, options);
  const htmlTokens = estimateTokens(html);
  const markdownTokens = estimateTokens(markdown);
  
  return {
    markdown,
    tokensEstimate: markdownTokens,
    compressionRatio: htmlTokens > 0 ? markdownTokens / htmlTokens : 1,
  };
}
