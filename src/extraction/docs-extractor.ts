/**
 * Documentation site content extractor
 * Specialized extraction for documentation sites that bypasses Readability
 * Preserves full semantic structure (headings, sections, lists, code blocks)
 */

import { JSDOM } from 'jsdom';
import {
    type DocsPageInfo,
    getDocsRemoveSelectors,
    getDocsMainContentSelector,
} from './docs-detector.js';
import { ALWAYS_REMOVE_SELECTORS, createSelectorString } from './selectors.js';

/**
 * Result of documentation content extraction
 */
export interface DocsExtractionResult {
    /** Whether extraction was successful */
    success: boolean;
    /** Page title */
    title: string;
    /** Extracted HTML content */
    contentHtml: string;
    /** Plain text content */
    textContent: string;
    /** Length of content HTML */
    contentLength: number;
    /** Short excerpt */
    excerpt: string;
    /** Error message if extraction failed */
    error?: string;
    /** Documentation page info */
    docsInfo?: DocsPageInfo;
}

/**
 * Elements to always remove from documentation content
 * These are non-content elements specific to doc sites
 */
const DOCS_ALWAYS_REMOVE = [
    // Copy buttons and controls
    '[aria-label="Copy"]',
    '[aria-label="Copy code"]',
    '.copy-button',
    '.copy-to-clipboard',
    'button[data-copy]',

    // Code block controls
    '.code-controls',
    '.code-toolbar',
    '.code-actions',

    // Language tabs/switchers
    '.language-tabs',
    '.code-language-selector',
    '.code-tabs-header',

    // Expand/collapse controls
    '.expand-button',
    '.collapse-button',
    '[aria-expanded]',

    // Search components
    '.search-box',
    '.search-input',
    '[role="search"]',

    // Feedback widgets
    '.feedback',
    '.was-helpful',
    '.thumbs-up-down',

    // Edit links
    '.edit-page',
    '.edit-on-github',
    'a[href*="github.com/edit"]',
];

/**
 * Extracts content from documentation sites using direct DOM extraction
 * This bypasses Readability which doesn't work well for structured docs
 *
 * @param html - Raw HTML content
 * @param url - Page URL
 * @param docsInfo - Documentation page detection info
 * @returns Extraction result with full semantic content
 */
export function extractDocsContent(
    html: string,
    _url: string,
    docsInfo: DocsPageInfo,
): DocsExtractionResult {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // First, remove always-remove elements from entire document
    removeElements(document, createSelectorString(ALWAYS_REMOVE_SELECTORS));
    removeElements(document, createSelectorString(DOCS_ALWAYS_REMOVE));

    // Get main content area using the docs selector
    const mainSelector = getDocsMainContentSelector(docsInfo);
    const mainContent = findMainContent(document, mainSelector);

    if (!mainContent) {
        return {
            success: false,
            title: extractTitle(document),
            contentHtml: '',
            textContent: '',
            contentLength: 0,
            excerpt: '',
            error: `Main content selector not found: ${mainSelector}`,
            docsInfo,
        };
    }

    // Remove platform-specific non-content elements from main content
    const removeSelectors = getDocsRemoveSelectors(docsInfo);
    for (const selector of removeSelectors) {
        try {
            mainContent.querySelectorAll(selector).forEach((el) => el.remove());
        } catch {
            // Invalid selector, skip
        }
    }

    // Clean up empty elements
    cleanEmptyElements(mainContent);

    // Extract title
    const title = extractTitle(document) ||
        mainContent.querySelector('h1')?.textContent?.trim() ||
        'Documentation';

    // Get the cleaned HTML content
    const contentHtml = mainContent.innerHTML.trim();
    const textContent = mainContent.textContent?.trim() || '';

    // Generate excerpt from first meaningful paragraph
    const excerpt = extractExcerpt(mainContent);

    // Validate we got meaningful content
    if (contentHtml.length < 100) {
        return {
            success: false,
            title,
            contentHtml,
            textContent,
            contentLength: contentHtml.length,
            excerpt,
            error: 'Extracted content too short',
            docsInfo,
        };
    }

    return {
        success: true,
        title,
        contentHtml,
        textContent,
        contentLength: contentHtml.length,
        excerpt,
        docsInfo,
    };
}

/**
 * Finds the main content element using a selector or fallback strategy
 */
function findMainContent(document: Document, selector: string): Element | null {
    // Try each selector in the comma-separated list
    const selectors = selector.split(',').map((s) => s.trim());

    for (const sel of selectors) {
        try {
            const element = document.querySelector(sel);
            if (element && hasSubstantialContent(element)) {
                return element;
            }
        } catch {
            // Invalid selector, try next
        }
    }

    // Fallback: find the element with most text content
    const candidates = ['main', 'article', '[role="main"]', '.content', '#content'];
    for (const candidate of candidates) {
        try {
            const element = document.querySelector(candidate);
            if (element && hasSubstantialContent(element)) {
                return element;
            }
        } catch {
            // Skip invalid selectors
        }
    }

    // Last resort: use body
    return document.body;
}

/**
 * Checks if an element has substantial text content
 */
function hasSubstantialContent(element: Element): boolean {
    const text = element.textContent?.trim() || '';
    // Require at least 200 characters of text
    return text.length >= 200;
}

/**
 * Removes elements matching the selector
 */
function removeElements(document: Document, selector: string): void {
    try {
        document.querySelectorAll(selector).forEach((el) => el.remove());
    } catch {
        // Invalid selector, skip
    }
}

/**
 * Removes empty elements that add no value
 */
function cleanEmptyElements(container: Element): void {
    const emptyTags = ['p', 'div', 'span', 'section', 'li', 'ul', 'ol'];

    for (const tag of emptyTags) {
        const elements = container.querySelectorAll(tag);
        elements.forEach((el) => {
            const text = el.textContent?.trim() || '';
            const hasImages = el.querySelector('img, svg') !== null;
            const hasLinks = el.querySelector('a') !== null;

            if (text === '' && !hasImages && !hasLinks) {
                el.remove();
            }
        });
    }
}

/**
 * Extracts the page title from the document
 */
function extractTitle(document: Document): string {
    // Try title tag first
    const titleTag = document.querySelector('title');
    if (titleTag?.textContent) {
        // Clean up common title patterns like "Page | Site Name"
        const title = titleTag.textContent.trim();
        const parts = title.split(/\s*[|–—]\s*/);
        return parts[0].trim();
    }

    // Try h1
    const h1 = document.querySelector('h1');
    if (h1?.textContent) {
        return h1.textContent.trim();
    }

    // Try og:title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle?.getAttribute('content')) {
        return ogTitle.getAttribute('content')!.trim();
    }

    return 'Documentation';
}

/**
 * Extracts a short excerpt from the content
 */
function extractExcerpt(container: Element, maxLength: number = 200): string {
    // Try to find a meta description or first meaningful paragraph
    const firstP = container.querySelector('p');
    if (firstP?.textContent) {
        const text = firstP.textContent.trim();
        if (text.length > 20) {
            return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
        }
    }

    // Fall back to first text content
    const text = container.textContent?.trim() || '';
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}
