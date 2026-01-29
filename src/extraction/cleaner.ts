/**
 * HTML cleaning and sanitization utilities
 * Removes boilerplate elements before content extraction
 */

import { JSDOM } from 'jsdom';
import {
  BOILERPLATE_SELECTOR_STRING,
  ALWAYS_REMOVE_SELECTORS,
  createSelectorString,
} from './selectors.js';

/**
 * Options for the HTML cleaner
 */
export interface CleanerOptions {
  /** Remove all boilerplate elements (nav, footer, ads, etc.) */
  removeBoilerplate?: boolean;
  /** Additional custom selectors to remove */
  additionalSelectors?: string[];
  /** Preserve these selectors even if matched by boilerplate rules */
  preserveSelectors?: string[];
}

const DEFAULT_OPTIONS: Required<CleanerOptions> = {
  removeBoilerplate: true,
  additionalSelectors: [],
  preserveSelectors: [],
};

/**
 * Removes elements matching the given selector from the document
 * @param document - The DOM document to clean
 * @param selector - CSS selector string
 */
function removeElements(document: Document, selector: string): void {
  try {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  } catch {
    // Invalid selector, skip silently
  }
}

/**
 * Removes empty elements that add no value to the content
 * @param document - The DOM document to clean
 */
function removeEmptyElements(document: Document): void {
  const emptySelectors = ['p', 'div', 'span', 'section', 'article'];
  
  for (const selector of emptySelectors) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      // Check if element has no text content and no meaningful children
      const text = el.textContent?.trim() || '';
      const hasImages = el.querySelector('img') !== null;
      
      if (text === '' && !hasImages) {
        el.remove();
      }
    });
  }
}

/**
 * Removes HTML comments from the document
 * @param document - The DOM document to clean
 */
function removeComments(document: Document): void {
  const iterator = document.createNodeIterator(
    document.body || document.documentElement,
    // NodeFilter.SHOW_COMMENT = 128
    128,
  );
  
  const comments: Node[] = [];
  let node: Node | null;
  
  while ((node = iterator.nextNode())) {
    comments.push(node);
  }
  
  comments.forEach(comment => comment.parentNode?.removeChild(comment));
}

/**
 * Removes data attributes and event handlers from elements
 * @param document - The DOM document to clean
 */
function removeDataAttributes(document: Document): void {
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach(el => {
    // Get all attributes
    const attrs = Array.from(el.attributes);
    
    for (const attr of attrs) {
      // Remove data-* attributes (except data-testid which might be useful)
      if (attr.name.startsWith('data-') && attr.name !== 'data-testid') {
        el.removeAttribute(attr.name);
      }
      // Remove event handlers
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    }
  });
}

/**
 * Cleans HTML by removing boilerplate and non-content elements
 * @param html - Raw HTML string to clean
 * @param options - Cleaning options
 * @returns Cleaned HTML string
 */
export function cleanHtml(html: string, options: CleanerOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Parse HTML into DOM
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Always remove script, style, etc.
  removeElements(document, createSelectorString(ALWAYS_REMOVE_SELECTORS));
  
  // Remove boilerplate if enabled
  if (opts.removeBoilerplate) {
    removeElements(document, BOILERPLATE_SELECTOR_STRING);
  }
  
  // Remove additional custom selectors
  if (opts.additionalSelectors.length > 0) {
    removeElements(document, createSelectorString(opts.additionalSelectors));
  }
  
  // Remove HTML comments
  removeComments(document);
  
  // Remove data attributes
  removeDataAttributes(document);
  
  // Remove empty elements
  removeEmptyElements(document);
  
  // Return the cleaned body HTML
  return document.body?.innerHTML || '';
}

/**
 * Cleans HTML and returns a JSDOM Document for further processing
 * @param html - Raw HTML string to clean
 * @param options - Cleaning options
 * @returns JSDOM Document object
 */
export function cleanHtmlToDocument(html: string, options: CleanerOptions = {}): Document {
  const cleanedHtml = cleanHtml(html, options);
  const dom = new JSDOM(cleanedHtml);
  return dom.window.document;
}

/**
 * Extracts just the body content from an HTML string
 * @param html - Full HTML document
 * @returns Body inner HTML
 */
export function extractBodyContent(html: string): string {
  const dom = new JSDOM(html);
  return dom.window.document.body?.innerHTML || html;
}
