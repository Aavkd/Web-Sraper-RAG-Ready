/**
 * Language detection and code block quality utilities - Phase 4
 * Provides language detection, code block splitting, and JSON formatting
 */

/**
 * Common language class patterns found in code blocks
 */
const LANGUAGE_CLASS_PATTERNS: [RegExp, string][] = [
    [/language-(\w+)/i, '$1'],
    [/lang-(\w+)/i, '$1'],
    [/highlight-(\w+)/i, '$1'],
    [/\b(javascript|js)\b/i, 'javascript'],
    [/\b(typescript|ts)\b/i, 'typescript'],
    [/\b(python|py)\b/i, 'python'],
    [/\b(ruby|rb)\b/i, 'ruby'],
    [/\b(java)\b/i, 'java'],
    [/\b(go|golang)\b/i, 'go'],
    [/\b(rust)\b/i, 'rust'],
    [/\b(json)\b/i, 'json'],
    [/\b(yaml|yml)\b/i, 'yaml'],
    [/\b(xml)\b/i, 'xml'],
    [/\b(html)\b/i, 'html'],
    [/\b(css)\b/i, 'css'],
    [/\b(bash|shell|sh)\b/i, 'bash'],
    [/\b(sql)\b/i, 'sql'],
    [/\b(php)\b/i, 'php'],
    [/\b(csharp|cs|c#)\b/i, 'csharp'],
    [/\b(cpp|c\+\+)\b/i, 'cpp'],
    [/\b(swift)\b/i, 'swift'],
    [/\b(kotlin)\b/i, 'kotlin'],
    [/brush:\s*(\w+)/i, '$1'],           // SyntaxHighlighter: brush: python
    [/crayon-(\w+)/i, '$1'],              // Crayon syntax highlighter
    [/code-(\w+)/i, '$1'],                // Generic code-{lang}
    [/language_(\w+)/i, '$1'],            // Underscore variant: language_python
    [/^(\w+)$/i, '$1'],                   // Standalone language name as class
    [/\b(dockerfile|makefile|nginx|apache|vim|markdown|md)\b/i, '$1'], // Config languages
    [/\b(terraform|hcl|toml)\b/i, '$1'],  // DevOps languages
    [/\b(graphql|gql)\b/i, 'graphql'],    // GraphQL
    [/\b(powershell|pwsh|ps1)\b/i, 'powershell'], // PowerShell variants
    [/\b(plaintext|plain|text)\b/i, 'text'], // Explicit text markers
];

/**
 * Detects programming language from CSS class names
 * @param className - CSS class string from code block element
 * @returns Detected language or null if not found
 */
export function detectLanguageFromClasses(className: string): string | null {
    if (!className) return null;

    for (const [pattern, replacement] of LANGUAGE_CLASS_PATTERNS) {
        const match = className.match(pattern);
        if (match) {
            // Handle capture group replacement
            if (replacement.includes('$1') && match[1]) {
                return match[1].toLowerCase();
            }
            return replacement;
        }
    }

    return null;
}

/**
 * Detects programming language from code content using heuristics
 * @param content - Code content string
 * @returns Detected language (defaults to 'text' if unknown)
 */
export function detectLanguageFromContent(content: string): string {
    const trimmed = content.trim();

    // JSON detection - starts with { or [ and looks like JSON
    if (/^[[{]/.test(trimmed) && /[}\]]$/.test(trimmed)) {
        try {
            JSON.parse(trimmed);
            return 'json';
        } catch {
            // Not valid JSON, might be JS object
            if (trimmed.includes(':') && !trimmed.includes('=>')) {
                return 'json';
            }
        }
    }

    // CLI/Shell detection
    if (
        trimmed.startsWith('$') ||
        trimmed.startsWith('#') ||
        /^(curl|wget|npm|yarn|pip|apt|brew|git|docker)\s/m.test(trimmed)
    ) {
        return 'bash';
    }

    // Python detection
    if (
        /^(import|from)\s+\w+/m.test(trimmed) ||
        /def\s+\w+\s*\(/.test(trimmed) ||
        /:\s*$/m.test(trimmed)
    ) {
        // Check it's not JS import
        if (!/require\(|import\s+{/.test(trimmed)) {
            return 'python';
        }
    }

    // JavaScript/TypeScript detection
    if (
        /^(const|let|var|function|import|export)\s/m.test(trimmed) ||
        /=>\s*{/.test(trimmed) ||
        /require\(['"]/.test(trimmed)
    ) {
        // TypeScript indicators
        if (/:\s*(string|number|boolean|any|void)\b/.test(trimmed) ||
            /interface\s+\w+/.test(trimmed) ||
            /type\s+\w+\s*=/.test(trimmed)) {
            return 'typescript';
        }
        return 'javascript';
    }

    // HTML detection
    if (/^<(!DOCTYPE|html|head|body|div|span|p|a)\b/i.test(trimmed)) {
        return 'html';
    }

    // CSS detection
    if (/^[.#@]?\w+\s*{/m.test(trimmed) && /:\s*[^;]+;/m.test(trimmed)) {
        return 'css';
    }

    // Ruby detection
    if (/^(require|def|class|module|end)\s/m.test(trimmed) || /do\s*\|/.test(trimmed)) {
        return 'ruby';
    }

    // Go detection
    if (/^(package|func|import)\s/m.test(trimmed) || /func\s*\(/.test(trimmed)) {
        return 'go';
    }

    // SQL detection
    if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/im.test(trimmed)) {
        return 'sql';
    }

    return 'text';
}

/**
 * Splits merged code blocks (e.g., CLI command + JSON response)
 * @param markdown - Markdown content with code blocks
 * @returns Markdown with split code blocks
 */
export function splitMergedCodeBlocks(markdown: string): string {
    // Pattern: Find code blocks that contain both CLI commands and JSON responses
    const codeBlockPattern = /```(\w*)\n([\s\S]*?)```/g;

    return markdown.replace(codeBlockPattern, (match, lang, content) => {
        // Look for patterns suggesting merged CLI + response
        // Pattern: curl/http command followed by JSON response
        const cliJsonPattern = /^((?:curl|http|wget|fetch)[\s\S]*?)\n(\s*[[{][\s\S]*[}\]]\s*)$/;
        const cliMatch = content.match(cliJsonPattern);

        if (cliMatch) {
            const [, cliPart, jsonPart] = cliMatch;
            const cliLang = lang || 'bash';
            const jsonLang = 'json';

            // Format the JSON if valid
            let formattedJson = jsonPart.trim();
            try {
                const parsed = JSON.parse(formattedJson);
                formattedJson = JSON.stringify(parsed, null, 2);
            } catch {
                // Keep as-is if not valid JSON
            }

            return `\`\`\`${cliLang}\n${cliPart.trim()}\n\`\`\`\n\n\`\`\`${jsonLang}\n${formattedJson}\n\`\`\``;
        }

        // Look for $ prompt followed by output
        const promptOutputPattern = /^(\$\s+.+?)\n([\s\S]+)$/;
        const promptMatch = content.match(promptOutputPattern);

        if (promptMatch && !content.includes('```')) {
            const [, command, output] = promptMatch;
            const outputTrimmed = output.trim();

            // Check if output looks like JSON
            if (/^[[{]/.test(outputTrimmed) && /[}\]]$/.test(outputTrimmed)) {
                let formattedOutput = outputTrimmed;
                try {
                    const parsed = JSON.parse(outputTrimmed);
                    formattedOutput = JSON.stringify(parsed, null, 2);
                } catch {
                    // Keep as-is
                }
                return `\`\`\`bash\n${command}\n\`\`\`\n\n\`\`\`json\n${formattedOutput}\n\`\`\``;
            }
        }

        // If no splitting needed, ensure language tag exists
        if (!lang) {
            const detectedLang = detectLanguageFromContent(content);
            return `\`\`\`${detectedLang}\n${content}\`\`\``;
        }

        return match;
    });
}

/**
 * Formats JSON within code blocks for better readability
 * @param markdown - Markdown content
 * @returns Markdown with formatted JSON blocks
 */
export function formatJsonBlocks(markdown: string): string {
    // Find JSON code blocks and format them
    const jsonBlockPattern = /```json\n([\s\S]*?)```/g;

    return markdown.replace(jsonBlockPattern, (match, content) => {
        const trimmed = content.trim();

        try {
            const parsed = JSON.parse(trimmed);
            const formatted = JSON.stringify(parsed, null, 2);
            return `\`\`\`json\n${formatted}\n\`\`\``;
        } catch {
            // Not valid JSON, return as-is
            return match;
        }
    });
}

/**
 * Applies all code block quality improvements to markdown
 * @param markdown - Input markdown
 * @returns Markdown with improved code blocks
 */
export function improveCodeBlocks(markdown: string): string {
    let result = markdown;

    // First split merged blocks
    result = splitMergedCodeBlocks(result);

    // Then format JSON blocks
    result = formatJsonBlocks(result);

    return result;
}
