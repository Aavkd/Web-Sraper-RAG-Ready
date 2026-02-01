/**
 * Multi-Selector Content Extraction Module
 * Extracts content from multiple CSS selectors and combines them semantically.
 * Used for Q&A pages where both question and answer(s) need to be extracted.
 */

import { JSDOM } from 'jsdom';
import type { QAPageInfo } from './qa-detector.js';

/**
 * Extracted Q&A content structure
 */
export interface QAContent {
    /** The question content as HTML */
    question: string;
    /** Title of the question (if found) */
    questionTitle: string;
    /** Array of answer HTML strings */
    answers: string[];
    /** Whether extraction was successful */
    success: boolean;
    /** Combined HTML with semantic markers for further processing */
    combinedHtml: string;
}

/**
 * Extracts text content from an HTML element, cleaning up extra whitespace
 * 
 * @param element - DOM element to extract text from
 * @returns Cleaned text content
 */
function getCleanTextContent(element: Element): string {
    return (element.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Finds the question title from the page
 * 
 * @param document - DOM document
 * @returns Question title or empty string
 */
function findQuestionTitle(document: Document): string {
    // Try common title selectors for Q&A pages
    const titleSelectors = [
        'h1[itemprop="name"]',
        '.question-title',
        '#question-header h1',
        '.question h1',
        'h1.title',
        'h1',
    ];

    for (const selector of titleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            const title = getCleanTextContent(element);
            if (title.length > 0) {
                return title;
            }
        }
    }

    return '';
}

/**
 * Removes Q&A-specific noise elements from content
 * 
 * @param document - DOM document to clean
 */
function removeQANoise(document: Document): void {
    // Q&A-specific noise selectors
    const noiseSelectors = [
        '.comments',           // Comment sections
        '.post-menu',          // Action menus (share, edit, etc.)
        '.vote',               // Vote buttons
        '.js-vote-count',      // Vote counts
        '.user-info',          // User cards/avatars
        '.user-action-time',   // "asked 2 hours ago"
        '.post-signature',     // User signatures
        '.post-taglist',       // Tag lists
        '.share-link',         // Share buttons
        '.edit-post',          // Edit links
        '.flag-post',          // Flag links
        '.post-actions',       // Action buttons
        '.js-post-menu',       // Menu buttons
        '.s-anchors',          // Stack Overflow anchor lists
        '[data-controller="share"]', // Share dialogs
    ];

    for (const selector of noiseSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    }
}

/**
 * Extracts content from a single CSS selector
 * 
 * @param document - DOM document
 * @param selector - CSS selector to match
 * @returns Array of HTML strings for matched elements
 */
function extractBySelector(document: Document, selector: string): string[] {
    const elements = document.querySelectorAll(selector);
    const results: string[] = [];

    elements.forEach(el => {
        const html = el.innerHTML?.trim();
        if (html && html.length > 0) {
            results.push(html);
        }
    });

    return results;
}

/**
 * Extracts Q&A content from a page using the detected selectors
 * 
 * @param html - Raw HTML content of the page
 * @param url - URL of the page (for context)
 * @param qaInfo - Q&A page detection info with selectors
 * @returns Extracted Q&A content structure
 */
export function extractQAContent(
    html: string,
    url: string,
    qaInfo: QAPageInfo,
): QAContent {
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    // Remove Q&A-specific noise first
    removeQANoise(document);

    // Extract question title
    const questionTitle = findQuestionTitle(document);

    // Extract question content
    const questions = extractBySelector(document, qaInfo.questionSelector);
    const question = questions.length > 0 ? questions[0] : '';

    // Extract answer content(s)
    const answers = extractBySelector(document, qaInfo.answerSelector);

    // Check if extraction was successful
    const success = question.length > 0 || answers.length > 0;

    // Build combined HTML with semantic markers
    let combinedHtml = '';

    if (questionTitle || question) {
        combinedHtml += '<section class="qa-question">\n';
        if (questionTitle) {
            combinedHtml += '<h2>Question</h2>\n';
            combinedHtml += `<h3>${escapeHtml(questionTitle)}</h3>\n`;
        }
        if (question) {
            combinedHtml += `<div class="question-content">${question}</div>\n`;
        }
        combinedHtml += '</section>\n\n';
    }

    if (answers.length > 0) {
        combinedHtml += '<section class="qa-answers">\n';
        combinedHtml += `<h2>Answer${answers.length > 1 ? 's' : ''}</h2>\n`;

        answers.forEach((answer, index) => {
            if (answers.length > 1) {
                combinedHtml += `<div class="answer" data-answer-index="${index + 1}">\n`;
                combinedHtml += `<h3>Answer ${index + 1}</h3>\n`;
            } else {
                combinedHtml += '<div class="answer">\n';
            }
            combinedHtml += `${answer}\n`;
            combinedHtml += '</div>\n';
        });

        combinedHtml += '</section>\n';
    }

    return {
        question,
        questionTitle,
        answers,
        success,
        combinedHtml,
    };
}

/**
 * Simple HTML escaping for title text
 */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Extracts content from multiple CSS selectors and combines them
 * Generic function for non-Q&A multi-section extraction
 * 
 * @param html - Raw HTML content
 * @param selectors - Array of CSS selectors to extract
 * @returns Combined HTML string with content from all selectors
 */
export function extractMultipleSections(
    html: string,
    selectors: string[],
): string {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const sections: string[] = [];

    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const content = el.innerHTML?.trim();
            if (content && content.length > 0) {
                sections.push(content);
            }
        });
    }

    return sections.join('\n\n');
}
