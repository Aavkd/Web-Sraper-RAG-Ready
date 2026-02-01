/**
 * Documentation site detection and extraction strategy
 * Detects documentation platforms and returns optimized extraction strategies
 */

/**
 * Information about a detected documentation page
 */
export interface DocsPageInfo {
    /** Whether this is a documentation page */
    isDocsPage: boolean;
    /** Detected platform if known */
    platform: 'stripe' | 'github' | 'vercel' | 'mdn' | 'generic' | 'unknown';
    /** Main content selector for this platform */
    mainContentSelector?: string;
    /** Additional selectors to remove for this platform */
    additionalRemoveSelectors?: string[];
}

/**
 * Domain pattern configuration for documentation platforms
 */
interface DocsDomainConfig {
    pattern: RegExp;
    platform: DocsPageInfo['platform'];
    mainSelector: string;
    removeSelectors?: string[];
}

/**
 * Known documentation domain patterns with platform-specific configurations
 */
const DOCS_DOMAIN_PATTERNS: DocsDomainConfig[] = [
    {
        pattern: /docs\.stripe\.com/i,
        platform: 'stripe',
        mainSelector: '#main-content, main, article, [data-docs-content]',
        removeSelectors: [
            '.CodeTabs__tab-bar',
            '.CodeTabs__copy-button',
            '.terminal-prompt',
            '.api-ref-sidebar',
            '.sidebar-nav',
            // Phase 2: Additional Stripe selectors
            '[data-sidebar]',
            '.DocSearch-content',
            '.DocSearch',
            '[data-algolia-id]',
            '.stripe-nav',
            '.docs-sidebar',
        ],
    },
    {
        pattern: /docs\.github\.com/i,
        platform: 'github',
        mainSelector: '.markdown-body, article, main',
        removeSelectors: [
            '.platform-switch',
            '.tool-picker',
            '.ghd-spotlight-input',
        ],
    },
    {
        pattern: /docs\.vercel\.com/i,
        platform: 'vercel',
        mainSelector: 'main article, article, main',
        removeSelectors: [
            '.DocSearch',
            '[data-algolia-id]',
        ],
    },
    {
        pattern: /developer\.mozilla\.org/i,
        platform: 'mdn',
        mainSelector: 'article.main-page-content, article, main',
        removeSelectors: [
            '.section-content > .code-example',
            '.prev-next',
            '.bc-github-link',
            '.metadata',
        ],
    },
    {
        pattern: /developer\./i,
        platform: 'generic',
        mainSelector: 'main, article, .content, .doc-content',
    },
    {
        pattern: /\.dev\/docs/i,
        platform: 'generic',
        mainSelector: 'article, main, [role="main"]',
    },
    {
        pattern: /\/docs\//i,
        platform: 'generic',
        mainSelector: 'main, article, .content, .documentation',
    },
];

/**
 * HTML indicators that suggest a documentation page
 */
const DOCS_HTML_INDICATORS = [
    'class="api-reference"',
    'class="docs-content"',
    'class="documentation"',
    'data-docs-page',
    'role="doc-',
    'itemtype="http://schema.org/TechArticle"',
    'itemtype="http://schema.org/APIReference"',
];

/**
 * Detects if a page is a documentation page and returns extraction strategy
 * 
 * @param url - The page URL
 * @param html - Optional HTML content for deeper analysis
 * @returns Documentation page info with extraction strategy
 */
export function detectDocsPage(url: string, html?: string): DocsPageInfo {
    // Check domain patterns first
    for (const config of DOCS_DOMAIN_PATTERNS) {
        if (config.pattern.test(url)) {
            return {
                isDocsPage: true,
                platform: config.platform,
                mainContentSelector: config.mainSelector,
                additionalRemoveSelectors: config.removeSelectors,
            };
        }
    }

    // Check HTML content for documentation indicators
    if (html) {
        const hasDocsIndicator = DOCS_HTML_INDICATORS.some(indicator =>
            html.includes(indicator),
        );

        if (hasDocsIndicator) {
            return {
                isDocsPage: true,
                platform: 'generic',
                mainContentSelector: 'main, article, .content, [role="main"]',
            };
        }
    }

    // Not a detected documentation page
    return {
        isDocsPage: false,
        platform: 'unknown',
    };
}

/**
 * Checks if a domain is a known documentation platform
 * 
 * @param url - The URL to check
 * @returns True if the domain is a known documentation platform
 */
export function isKnownDocsDomain(url: string): boolean {
    return DOCS_DOMAIN_PATTERNS.some(config =>
        config.pattern.test(url) && config.platform !== 'generic',
    );
}

/**
 * Gets the main content selector for a documentation page
 * 
 * @param docsInfo - Documentation page info from detectDocsPage
 * @returns CSS selector string for main content
 */
export function getDocsMainContentSelector(docsInfo: DocsPageInfo): string {
    return docsInfo.mainContentSelector || 'main, article, .content, [role="main"]';
}

/**
 * Gets additional selectors to remove for a documentation page
 * 
 * @param docsInfo - Documentation page info from detectDocsPage
 * @returns Array of CSS selectors to remove
 */
export function getDocsRemoveSelectors(docsInfo: DocsPageInfo): string[] {
    const baseRemoveSelectors = [
        // Interactive demo components
        '.playground',
        '.sandbox',
        '.live-editor',
        '[data-playground]',

        // Terminal/CLI decorators
        '.terminal-window-header',
        '.terminal-controls',
        '.terminal-title',
        '.copy-button',
        '[aria-label="Copy code"]',

        // Navigation remnants
        '.breadcrumb',
        '.pagination',
        '.on-this-page',
        '.toc-sidebar',
        '.table-of-contents',

        // Language/theme switchers
        '.language-switcher',
        '.theme-toggle',
        '[data-theme]',

        // Feedback widgets
        '.feedback-widget',
        '.was-this-helpful',
        '.rate-this-page',
    ];

    // Add platform-specific selectors
    if (docsInfo.additionalRemoveSelectors) {
        return [...baseRemoveSelectors, ...docsInfo.additionalRemoveSelectors];
    }

    return baseRemoveSelectors;
}
