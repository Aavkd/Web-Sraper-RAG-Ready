/**
 * Q&A Site Detection Module
 * Detects if a page is a Q&A/forum page and returns appropriate content selectors.
 * 
 * Uses tiered detection:
 * - Tier 1 (Fast): Domain pattern matching for known platforms
 * - Tier 2 (CSS): HTML structure patterns
 * - Tier 3 (Schema.org): Microdata fallback for long-tail forums
 */

/**
 * Information about a detected Q&A page
 */
export interface QAPageInfo {
    /** Whether this page was detected as Q&A */
    isQAPage: boolean;
    /** CSS selector for the question content */
    questionSelector: string;
    /** CSS selector for answer content(s) */
    answerSelector: string;
    /** Detected platform type */
    platform: 'stackoverflow' | 'discourse' | 'phpbb' | 'schema-org' | 'generic';
    /** How the page was detected */
    detectionMethod: 'domain' | 'css' | 'schema-org';
}

/**
 * Domain pattern configuration for known Q&A platforms
 */
interface DomainPattern {
    pattern: RegExp;
    platform: QAPageInfo['platform'];
    questionSelector: string;
    answerSelector: string;
}

/**
 * CSS pattern configuration for unknown domains
 */
interface CSSPattern {
    questionSelector: string;
    answerSelector: string;
}

// Tier 1: Known domain patterns (fastest)
const QA_DOMAIN_PATTERNS: DomainPattern[] = [
    // Stack Exchange Network
    {
        pattern: /stackoverflow\.com/,
        platform: 'stackoverflow',
        questionSelector: '.question .s-prose',
        answerSelector: '.answer .s-prose',
    },
    {
        pattern: /superuser\.com/,
        platform: 'stackoverflow',
        questionSelector: '.question .s-prose',
        answerSelector: '.answer .s-prose',
    },
    {
        pattern: /askubuntu\.com/,
        platform: 'stackoverflow',
        questionSelector: '.question .s-prose',
        answerSelector: '.answer .s-prose',
    },
    {
        pattern: /stackexchange\.com/,
        platform: 'stackoverflow',
        questionSelector: '.question .s-prose',
        answerSelector: '.answer .s-prose',
    },
    {
        pattern: /serverfault\.com/,
        platform: 'stackoverflow',
        questionSelector: '.question .s-prose',
        answerSelector: '.answer .s-prose',
    },
    {
        pattern: /mathoverflow\.net/,
        platform: 'stackoverflow',
        questionSelector: '.question .s-prose',
        answerSelector: '.answer .s-prose',
    },
    // Discourse forums
    {
        pattern: /discourse\./,
        platform: 'discourse',
        questionSelector: '.topic-post:first-child .cooked',
        answerSelector: '.topic-post:not(:first-child) .cooked',
    },
    {
        pattern: /\.discourse\.org/,
        platform: 'discourse',
        questionSelector: '.topic-post:first-child .cooked',
        answerSelector: '.topic-post:not(:first-child) .cooked',
    },
    // Reddit-style (treat first post as question, rest as answers)
    {
        pattern: /reddit\.com/,
        platform: 'generic',
        questionSelector: '.Post .RichTextJSON-root, [data-testid="post-container"]',
        answerSelector: '.Comment .RichTextJSON-root',
    },
];

// Tier 2: CSS class patterns (fallback for unknown domains)
const QA_CSS_PATTERNS: CSSPattern[] = [
    // Generic Q&A patterns
    { questionSelector: '.question-content', answerSelector: '.answer-content' },
    { questionSelector: '.post-question', answerSelector: '.post-answer' },
    { questionSelector: '#question', answerSelector: '.answer' },
    { questionSelector: '.question-body', answerSelector: '.answer-body' },
    { questionSelector: '[itemprop="text"]', answerSelector: '[itemprop="suggestedAnswer"]' },
    // Forum-style patterns
    { questionSelector: '.topic-body:first-child', answerSelector: '.topic-body:not(:first-child)' },
    { questionSelector: '.first-post', answerSelector: '.reply' },
];

/**
 * Detects Schema.org Q&A microdata in the HTML
 * 
 * @param html - Raw HTML content to check
 * @returns QAPageInfo if Schema.org Q&A markup found, null otherwise
 */
function detectSchemaOrgQA(html: string): QAPageInfo | null {
    // Check for both http and https variants of Schema.org
    const hasQuestionSchema = html.includes('itemtype="http://schema.org/Question"') ||
        html.includes('itemtype="https://schema.org/Question"') ||
        html.includes("itemtype='http://schema.org/Question'") ||
        html.includes("itemtype='https://schema.org/Question'");
    const hasAnswerSchema = html.includes('itemtype="http://schema.org/Answer"') ||
        html.includes('itemtype="https://schema.org/Answer"') ||
        html.includes("itemtype='http://schema.org/Answer'") ||
        html.includes("itemtype='https://schema.org/Answer'");

    if (hasQuestionSchema && hasAnswerSchema) {
        return {
            isQAPage: true,
            questionSelector: '[itemtype*="schema.org/Question"]',
            answerSelector: '[itemtype*="schema.org/Answer"]',
            platform: 'schema-org',
            detectionMethod: 'schema-org',
        };
    }

    // Also check for JSON-LD structured data
    const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatch) {
        for (const match of jsonLdMatch) {
            if (match.includes('"@type"') &&
                (match.includes('"QAPage"') || match.includes('"Question"'))) {
                return {
                    isQAPage: true,
                    // For JSON-LD, we fall back to generic CSS patterns
                    questionSelector: '.question, #question, [itemprop="text"]',
                    answerSelector: '.answer, .answers, [itemprop="suggestedAnswer"]',
                    platform: 'schema-org',
                    detectionMethod: 'schema-org',
                };
            }
        }
    }

    return null;
}

/**
 * Checks if CSS patterns exist in the HTML
 * 
 * @param html - Raw HTML content to check
 * @param pattern - CSS pattern to look for
 * @returns Whether both question and answer selectors are found
 */
function checkCSSPattern(html: string, pattern: CSSPattern): boolean {
    // Simple string matching for class/id patterns
    // This is a fast heuristic; actual selector matching happens in extraction
    const questionMatch = pattern.questionSelector.startsWith('.')
        ? html.includes(`class="${pattern.questionSelector.slice(1)}`) ||
        html.includes(`class='${pattern.questionSelector.slice(1)}`)
        : pattern.questionSelector.startsWith('#')
            ? html.includes(`id="${pattern.questionSelector.slice(1)}`) ||
            html.includes(`id='${pattern.questionSelector.slice(1)}`)
            : html.includes(pattern.questionSelector);

    const answerMatch = pattern.answerSelector.startsWith('.')
        ? html.includes(`class="${pattern.answerSelector.slice(1)}`) ||
        html.includes(`class='${pattern.answerSelector.slice(1)}`)
        : pattern.answerSelector.startsWith('#')
            ? html.includes(`id="${pattern.answerSelector.slice(1)}`) ||
            html.includes(`id='${pattern.answerSelector.slice(1)}`)
            : html.includes(pattern.answerSelector);

    return questionMatch && answerMatch;
}

/**
 * Detects if a page is a Q&A/forum page and returns extraction selectors
 * 
 * Uses tiered detection:
 * 1. Domain pattern matching for known platforms (fastest)
 * 2. CSS class pattern matching for unknown domains
 * 3. Schema.org microdata fallback for broad forum support
 * 
 * @param html - Raw HTML content of the page
 * @param url - URL of the page
 * @returns QAPageInfo if Q&A page detected, null otherwise
 */
export function detectQAPage(html: string, url: string): QAPageInfo | null {
    // Tier 1: Check domain patterns first (fastest)
    for (const domainPattern of QA_DOMAIN_PATTERNS) {
        if (domainPattern.pattern.test(url)) {
            return {
                isQAPage: true,
                questionSelector: domainPattern.questionSelector,
                answerSelector: domainPattern.answerSelector,
                platform: domainPattern.platform,
                detectionMethod: 'domain',
            };
        }
    }

    // Tier 2: Check CSS class patterns
    for (const cssPattern of QA_CSS_PATTERNS) {
        if (checkCSSPattern(html, cssPattern)) {
            return {
                isQAPage: true,
                questionSelector: cssPattern.questionSelector,
                answerSelector: cssPattern.answerSelector,
                platform: 'generic',
                detectionMethod: 'css',
            };
        }
    }

    // Tier 3: Schema.org microdata fallback
    return detectSchemaOrgQA(html);
}

/**
 * Checks if URL is from a known Q&A platform (fast check, no HTML needed)
 * 
 * @param url - URL to check
 * @returns Whether URL matches a known Q&A domain
 */
export function isKnownQADomain(url: string): boolean {
    return QA_DOMAIN_PATTERNS.some(pattern => pattern.pattern.test(url));
}
