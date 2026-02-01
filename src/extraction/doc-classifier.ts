/**
 * Document type classification for extracted pages
 * Phase 8 of the implementation plan
 * 
 * Classifies documentation pages by their type (guide, API reference, example, etc.)
 * based on URL patterns, title patterns, and content analysis.
 */

/**
 * Possible document types for classification
 */
export type DocType = 'guide' | 'api-reference' | 'example' | 'concept' | 'changelog' | 'unknown';

/**
 * URL patterns for document type classification
 */
const URL_PATTERNS: { type: DocType; patterns: RegExp[] }[] = [
    {
        type: 'api-reference',
        patterns: [
            /\/api\//i,
            /\/api-reference\//i,
            /\/reference\//i,
            /\/ref\//i,
            /\/sdk\//i,
            /\/library\//i,
            /\/class\//i,
            /\/method\//i,
            /\/function\//i,
            /\/interface\//i,
            /\/type\//i,
            /\/endpoint\//i,
        ],
    },
    {
        type: 'guide',
        patterns: [
            /\/guides?\//i,
            /\/docs?\//i,
            /\/documentation\//i,
            /\/learn\//i,
            /\/getting-started\//i,
            /\/quickstart\//i,
            /\/how-to\//i,
            /\/introduction\//i,
            /\/overview\//i,
            /\/setup\//i,
            /\/install/i,
        ],
    },
    {
        type: 'example',
        patterns: [
            /\/examples?\//i,
            /\/tutorials?\//i,
            /\/samples?\//i,
            /\/demos?\//i,
            /\/cookbook\//i,
            /\/recipes?\//i,
            /\/use-cases?\//i,
            /\/walkthroughs?\//i,
        ],
    },
    {
        type: 'concept',
        patterns: [
            /\/concepts?\//i,
            /\/fundamentals?\//i,
            /\/principles?\//i,
            /\/architecture\//i,
            /\/design\//i,
            /\/theory\//i,
            /\/understanding\//i,
            /\/about\//i,
        ],
    },
    {
        type: 'changelog',
        patterns: [
            /\/changelog/i,
            /\/releases?\//i,
            /\/release-notes?\//i,
            /\/whats-new/i,
            /\/version/i,
            /\/history/i,
            /\/updates?\//i,
            /\/news\//i,
        ],
    },
];

/**
 * Title patterns for document type classification
 */
const TITLE_PATTERNS: { type: DocType; patterns: RegExp[] }[] = [
    {
        type: 'api-reference',
        patterns: [
            /^api\s+reference/i,
            /^api\s+documentation/i,
            /^reference:/i,
            /^class\s+/i,
            /^interface\s+/i,
            /^method\s+/i,
            /^function\s+/i,
            /endpoint/i,
            /\bapi\b.*\breference\b/i,
        ],
    },
    {
        type: 'guide',
        patterns: [
            /^getting\s+started/i,
            /^quick\s*start/i,
            /^introduction/i,
            /^overview/i,
            /^how\s+to/i,
            /^guide:\s*/i,
            /^setup\s*/i,
            /^installation/i,
            /^configuration/i,
        ],
    },
    {
        type: 'example',
        patterns: [
            /^example:/i,
            /^tutorial:/i,
            /^sample:/i,
            /^demo:/i,
            /^walkthrough/i,
            /^step[- ]by[- ]step/i,
            /^building\s+a/i,
            /^creating\s+a/i,
        ],
    },
    {
        type: 'concept',
        patterns: [
            /^concepts?:/i,
            /^understanding/i,
            /^what\s+is/i,
            /^fundamentals?/i,
            /^architecture/i,
            /^design\s+pattern/i,
            /^principles?/i,
        ],
    },
    {
        type: 'changelog',
        patterns: [
            /^changelog/i,
            /^release\s+notes?/i,
            /^what'?s\s+new/i,
            /^version\s+\d/i,
            /^v\d+\.\d+/i,
            /^updates?$/i,
        ],
    },
];

/**
 * Content patterns for document type classification
 */
const CONTENT_PATTERNS: { type: DocType; patterns: RegExp[]; minMatches: number }[] = [
    {
        type: 'api-reference',
        patterns: [
            /\bHTTP\s+(GET|POST|PUT|DELETE|PATCH)\b/i,
            /\bRequest\s+Parameters?\b/i,
            /\bResponse\s+(Body|Schema|Format)\b/i,
            /\bReturns?\s*:/i,
            /\bParameters?\s*:/i,
            /\bArguments?\s*:/i,
            /\bEndpoint\b/i,
            /`[A-Z][a-z]+\([^)]*\)`/, // Function signatures like `FunctionName(params)`
            /\bRequired\b.*\bOptional\b/i,
        ],
        minMatches: 3,
    },
    {
        type: 'example',
        patterns: [
            /```\w+\n/g, // Code blocks with language
            /\bstep\s+\d+/i,
            /\bfirst,?\s/i,
            /\bnext,?\s/i,
            /\bthen,?\s/i,
            /\bfinally,?\s/i,
            /let's\s+(create|build|make)/i,
            /we\s+(will|can|should)\s/i,
        ],
        minMatches: 3,
    },
    {
        type: 'changelog',
        patterns: [
            /\b\d+\.\d+\.\d+\b/, // Version numbers like 1.2.3
            /\b(added|fixed|removed|changed|updated|improved)\b/i,
            /\b(bug\s*fix|feature|enhancement|breaking\s*change)\b/i,
            /\b(deprecated?|removed?)\b/i,
            /\brelease\s+date\b/i,
        ],
        minMatches: 3,
    },
];

/**
 * Classifies a documentation page based on URL, title, and content
 * 
 * @param url - The page URL
 * @param title - The page title
 * @param content - The page content (markdown)
 * @returns The classified document type
 */
export function classifyDocPage(url: string, title: string, content: string): DocType {
    // Priority 1: Check URL patterns (most reliable)
    for (const { type, patterns } of URL_PATTERNS) {
        if (patterns.some(pattern => pattern.test(url))) {
            return type;
        }
    }

    // Priority 2: Check title patterns
    for (const { type, patterns } of TITLE_PATTERNS) {
        if (patterns.some(pattern => pattern.test(title))) {
            return type;
        }
    }

    // Priority 3: Check content patterns (least reliable, needs multiple matches)
    for (const { type, patterns, minMatches } of CONTENT_PATTERNS) {
        let matches = 0;
        for (const pattern of patterns) {
            if (pattern.test(content)) {
                matches++;
            }
        }
        if (matches >= minMatches) {
            return type;
        }
    }

    // Default to unknown if no patterns match
    return 'unknown';
}

/**
 * Returns a human-readable label for a DocType
 * 
 * @param type - The document type
 * @returns Human-readable label
 */
export function getDocTypeLabel(type: DocType): string {
    const labels: Record<DocType, string> = {
        'guide': 'Guide',
        'api-reference': 'API Reference',
        'example': 'Example/Tutorial',
        'concept': 'Conceptual',
        'changelog': 'Changelog',
        'unknown': 'Unknown',
    };
    return labels[type] || 'Unknown';
}
