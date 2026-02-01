/**
 * HTML to Markdown conversion with token optimization
 * Uses Turndown with custom rules for clean, LLM-ready output
 */

import TurndownService from 'turndown';
import { estimateTokens } from './tokenizer.js';
import { improveCodeBlocks } from './language-detector.js';

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

  // Academic/reference sections (Wikipedia-style) - Task 3.1
  /^#+\s*references?\s*$/im,
  /^#+\s*bibliography\s*$/im,
  /^#+\s*external\s*links?\s*$/im,
  /^#+\s*further\s*reading\s*$/im,
  /^#+\s*citations?\s*$/im,
  /^#+\s*sources?\s*$/im,
  /^#+\s*footnotes?\s*$/im,
];

/**
 * Position-sensitive patterns that only match in footer region - Task 3.4
 */
const POSITION_SENSITIVE_PATTERNS: { pattern: RegExp; minPositionPercent: number }[] = [
  { pattern: /^#+\s*notes?\s*$/im, minPositionPercent: 0.8 },
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

  // Reference markers and footnote indicators - Task 3.3
  /^\[\d+\]$/,
  /^↑$/,
  /^\(\d+\)$/,
  /^\*\*\[\d+\]\*\*$/,

  // Citation back-links (Wikipedia style) - Task 4
  /^\*\*\^\*\*/,       // Starts with bold caret (**^**)
  /^\^\s+/,            // Starts with caret and space (^ ...)

  // "Jump to" navigation (Wikipedia)
  /^Jump to navigation$/i,
  /^Jump to search$/i,

  // Skip to content (common header noise)
  /^Skip to content$/i,
  /^Skip to main content$/i,

  // Footer noise - newsletter/signup
  /^Sign up for.*updates?:?$/i,
  /^Sign up$/i,
  /^Subscribe$/i,
  /^You can unsubscribe at any time/i,

  // Footer noise - cookie consent
  /^We use cookies/i,
  /^manage cookies$/i,
  /^cookie settings$/i,

  // Footer noise - search placeholders
  /^Search$/i,
  /^\/$/,  // Just a slash (search placeholder)

  // Phase 3: CTA noise patterns
  /^(Sign in|Sign up|Log in|Create account|Get started free)\s*$/im,
  /^(Start now|Try free|Request demo|Get started)\s*$/im,
  /^\[(Sign in|Log in|Create account|Sign up)\]\(.*\)$/im,
  /^(Learn more|Read more|View all|See all)\s*$/im,
  /^(Contact us|Contact sales|Talk to sales)\s*$/im,
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
  /** Whether to strip References/Bibliography sections */
  stripReferences?: boolean;
}

const DEFAULT_OPTIONS: Required<MarkdownOptions> = {
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  normalizeHeadings: true,
  normalizeWhitespace: true,
  removeNoise: true,
  stripReferences: true,
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

  // Phase 2: Handle interactive code blocks from documentation sites
  // These often use tokenized spans that break into fragmented inline code
  turndown.addRule('interactiveCodeBlocks', {
    filter: (node) => {
      // Match common code block containers by class patterns
      const classPatterns = ['CodeBlock', 'code-block', 'highlight', 'prism', 'shiki', 'hljs'];
      const className = node.getAttribute?.('class') || '';
      const classNameLower = className.toLowerCase();

      // Check if this is a code block container
      const isCodeBlockContainer = classPatterns.some(p =>
        classNameLower.includes(p.toLowerCase()),
      );

      // Also match pre > code structures that might have complex children
      const isPreWithCode = node.nodeName === 'PRE' &&
        node.querySelector?.('code') !== null &&
        (node.querySelectorAll?.('span')?.length ?? 0) > 3;

      // Match divs that contain only code-related elements
      const isCodeWrapper = node.nodeName === 'DIV' &&
        classNameLower.includes('code') &&
        node.querySelector?.('pre, code') !== null;

      return isCodeBlockContainer || isPreWithCode || isCodeWrapper;
    },
    replacement: (_content, node) => {
      const element = node as HTMLElement;

      // Extract raw text, ignoring all child element structure
      // This prevents the fragmentation issue with tokenized spans
      const text = element.textContent?.trim() || '';

      if (!text) {
        return '';
      }

      // Try to detect language from class
      const className = element.getAttribute('class') || '';
      const langMatch = className.match(/language-(\w+)/i) ||
        className.match(/lang-(\w+)/i) ||
        className.match(/\b(javascript|typescript|python|java|ruby|go|rust|json|html|css|bash|shell|sql)\b/i);
      const lang = langMatch?.[1]?.toLowerCase() || 'text';

      // Return as single fenced code block
      return `\n\`\`\`${lang}\n${text}\n\`\`\`\n`;
    },
  });

  // Task 1.1: Custom rule for nested list items - fixes 75% data loss issue
  // Handles <li> elements containing nested <ul>/<ol> with proper recursion
  turndown.addRule('nestedListItems', {
    filter: (node) => {
      return node.nodeName === 'LI' &&
        (node.querySelector('ul') !== null || node.querySelector('ol') !== null);
    },
    replacement: (_content, node, options) => {
      // CRITICAL: Handle mixed content properly (Task 1.1 warning)
      // 1. Extract direct text/link children BEFORE the nested <ul>/<ol>
      // 2. Process nested list separately with proper indentation
      // 3. Combine: "- Parent Label\n  - Child 1\n  - Child 2"

      const element = node as HTMLElement;
      let parentText = '';
      let nestedContent = '';

      // Iterate through childNodes to separate text from nested lists
      for (const child of Array.from(element.childNodes)) {
        if (child.nodeType === 3) { // Node.TEXT_NODE
          parentText += child.textContent?.trim() || '';
        } else if (child.nodeName === 'A') {
          // Task 1.2: Preserve links in parent context
          const anchor = child as HTMLAnchorElement;
          const href = anchor.getAttribute('href') || '';
          const linkText = anchor.textContent?.trim() || '';

          if (linkText && href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            // Add space before link if we already have text
            if (parentText && !parentText.endsWith(' ')) {
              parentText += ' ';
            }
            parentText += `[${linkText}](${href})`;
          } else if (linkText) {
            if (parentText && !parentText.endsWith(' ')) {
              parentText += ' ';
            }
            parentText += linkText;
          }
        } else if (child.nodeName === 'UL' || child.nodeName === 'OL') {
          // Recursively convert nested list with indentation
          const nestedListHtml = (child as Element).outerHTML;
          const nestedMarkdown = turndown.turndown(nestedListHtml);

          // Indent nested items by 2 spaces
          nestedContent += nestedMarkdown
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => '  ' + line)
            .join('\n');
        } else if ((child as Element).tagName) {
          // Other inline elements (span, strong, em, etc.)
          const inlineHtml = (child as Element).outerHTML;
          const inlineMarkdown = turndown.turndown(inlineHtml);
          if (parentText && !parentText.endsWith(' ') && inlineMarkdown) {
            parentText += ' ';
          }
          parentText += inlineMarkdown;
        }
      }

      // Combine parent label with nested content
      const bullet = options.bulletListMarker || '-';
      const parentLine = parentText.trim();

      if (nestedContent) {
        return `${bullet} ${parentLine}\n${nestedContent}`;
      }
      return `${bullet} ${parentLine}`;
    },
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
    // Fix list items that run together without newlines
    // Pattern: "- [text](link)- [text2](link2)" -> "- [text](link)\n- [text2](link2)"
    .replace(/(\]\([^)]+\))(-\s*\[)/g, '$1\n$2')
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
 * Includes position-aware handling for ambiguous sections like "Notes" - Task 3.4
 * 
 * @param markdown - The markdown to clean
 * @param options - Optional settings for noise removal
 * @returns Markdown with noise sections removed
 */
export function removeNoiseSections(
  markdown: string,
  options: { stripReferences?: boolean } = {},
): string {
  const { stripReferences = true } = options;

  // If stripReferences is disabled, only apply basic noise patterns
  const activeNoisePatterns = stripReferences
    ? NOISE_PATTERNS
    : NOISE_PATTERNS.slice(0, -7); // Exclude academic/reference patterns

  // Remove lines matching noise patterns
  const lines = markdown.split('\n');
  const totalLines = lines.length;
  const cleanedLines: string[] = [];
  let skipUntilNextHeading = false;
  let inFooterZone = false; // Track if we've hit a known footer section

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const positionPercent = totalLines > 0 ? i / totalLines : 0;

    // Check if this line is a noise section heading
    const isNoiseHeading = activeNoisePatterns.some(pattern => pattern.test(line));

    // Check position-sensitive patterns - Task 3.4
    const isPositionSensitiveNoise = stripReferences && POSITION_SENSITIVE_PATTERNS.some(
      ({ pattern, minPositionPercent }) => {
        return pattern.test(line) && (positionPercent >= minPositionPercent || inFooterZone);
      },
    );

    if (isNoiseHeading) {
      skipUntilNextHeading = true;
      inFooterZone = true; // Mark that we've entered footer zone
      continue;
    }

    if (isPositionSensitiveNoise) {
      skipUntilNextHeading = true;
      continue;
    }

    // If we hit a new heading that's not noise, stop skipping
    if (skipUntilNextHeading && /^#{1,6}\s/.test(line)) {
      // Check if the new heading is also noise before stopping skip
      const newHeadingIsNoise = activeNoisePatterns.some(pattern => pattern.test(line));
      const newHeadingIsPositionNoise = stripReferences && POSITION_SENSITIVE_PATTERNS.some(
        ({ pattern, minPositionPercent }) => {
          return pattern.test(line) && (positionPercent >= minPositionPercent || inFooterZone);
        },
      );

      if (!newHeadingIsNoise && !newHeadingIsPositionNoise) {
        skipUntilNextHeading = false;
        inFooterZone = false; // Reset footer zone when we hit valid content
      } else {
        continue; // Skip this noise heading too
      }
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
    markdown = removeNoiseSections(markdown, { stripReferences: opts.stripReferences });
  }

  if (opts.normalizeHeadings) {
    markdown = normalizeHeadingLevels(markdown);
  }

  if (opts.normalizeWhitespace) {
    markdown = normalizeWhitespace(markdown);
  }

  // Phase 4: Improve code block quality (language tags, split merged blocks, format JSON)
  markdown = improveCodeBlocks(markdown);

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
